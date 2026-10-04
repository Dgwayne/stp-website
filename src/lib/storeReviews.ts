import { cache } from "react";
import { APPLE_APP_ID, PLAY_PACKAGE, STORE_LINKS } from "@/lib/stores";

/**
 * Live store ratings and reviews for the homepage.
 *
 * The review text is never copied into this repo. It is read from the stores
 * when the page is built and again every few hours afterwards (the page is
 * ISR, see `revalidate` in app/page.tsx), so the page always shows what the
 * reviewer actually wrote, a review the author deletes disappears from the
 * site on its own, and new reviews can surface without a deploy.
 *
 * Sources:
 * - App Store: Apple's public lookup API for the average and count, and the
 *   iTunes customer-reviews RSS feed (JSON flavour) for the written reviews.
 * - Google Play: the listing page's JSON-LD for the average and count, and
 *   the same `UsvDTd` batchexecute call the Play web page makes when you open
 *   "See all reviews". It is undocumented, so every field read below is
 *   checked before it is trusted.
 *
 * Failure policy (the important part):
 * - During `next build`, a failing source is logged and skipped, so a slow
 *   or changed store can never block a deploy. The page just ships without
 *   that store's reviews.
 * - During a background revalidation in production, a failing source THROWS.
 *   Next.js then keeps serving the last page it generated successfully, so a
 *   store hiccup can never replace good reviews with an empty section.
 */

export type StoreId = "google-play" | "app-store";

export type StoreReview = {
  store: StoreId;
  id: string;
  author: string;
  rating: number;
  /** App Store reviews carry a title; Google Play reviews do not. */
  title?: string;
  body: string;
  /** ISO timestamp. */
  date: string;
  /** Google Play "found this helpful" count. */
  helpful: number;
};

export type StoreSummary = {
  store: StoreId;
  label: string;
  /** Average star rating, or null when the store has none yet. */
  rating: number | null;
  count: number | null;
  /** What the count counts: Play shows reviews, Apple shows ratings. */
  countNoun: string;
  url: string;
};

export type StoreReviewsData = {
  summaries: StoreSummary[];
  reviews: StoreReview[];
};

const TIMEOUT_MS = 12_000;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

/**
 * Hand-picked reviews, shown first and in this order, when the store still
 * has them. IDs only: the words always come from the store itself.
 */
const FEATURED: ReadonlyArray<readonly [StoreId, string]> = [
  ["google-play", "de25e122-10ab-41f6-90d6-b1b2f2522a73"], // Racine County Weather Watch
  ["app-store", "14491984014"], // "Spot on!"
  ["google-play", "875081d6-5b97-4be3-819e-70e286d5875b"], // Arizona Weather Network
  ["google-play", "0f991195-9e6f-4520-b5a5-c7abac7fda5a"], // Jason Hammer
  ["app-store", "14234317278"], // "Worth it!"
  ["google-play", "35998e87-5538-4190-b183-53dad4cc90cf"], // Jason Parker
];

/** Reviews never to feature (bug reports are for the inbox, not the homepage). */
const HIDDEN = new Set<string>(["app-store:14330473944"]);

/** Beyond the featured list, only substantial five-star reviews fill in. */
const AUTO_MIN_LENGTH = 80;

export const MAX_REVIEWS = 6;

function key(store: StoreId, id: string) {
  return `${store}:${id}`;
}

type Init = {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
};

async function getText(url: string, init: Init = {}): Promise<string> {
  const res = await fetch(url, {
    method: init.method ?? "GET",
    body: init.body,
    headers: { "User-Agent": UA, ...init.headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

function clean(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// App Store

type AppleLabel = { label?: string };
type AppleEntry = {
  id?: AppleLabel;
  author?: { name?: AppleLabel };
  "im:rating"?: AppleLabel;
  title?: AppleLabel;
  content?: AppleLabel;
  updated?: AppleLabel;
};

async function appleSummary(): Promise<StoreSummary> {
  const json = JSON.parse(
    await getText(
      `https://itunes.apple.com/lookup?id=${APPLE_APP_ID}&country=us`,
    ),
  );
  const app = json?.results?.[0];
  if (!app) throw new Error("App Store lookup returned no app");
  const count = num(app.userRatingCount);
  return {
    store: "app-store",
    label: "App Store",
    rating: count ? num(app.averageUserRating) : null,
    count,
    countNoun: count === 1 ? "rating" : "ratings",
    url: STORE_LINKS.appStore,
  };
}

async function appleReviews(): Promise<StoreReview[]> {
  const json = JSON.parse(
    await getText(
      `https://itunes.apple.com/us/rss/customerreviews/page=1/id=${APPLE_APP_ID}/sortby=mostrecent/json`,
    ),
  );
  const feed = json?.feed;
  if (!feed) throw new Error("App Store review feed has no feed object");
  const raw: AppleEntry[] = Array.isArray(feed.entry)
    ? feed.entry
    : feed.entry
      ? [feed.entry]
      : [];
  const out: StoreReview[] = [];
  for (const e of raw) {
    const id = e.id?.label;
    const rating = num(e["im:rating"]?.label);
    const body = clean(e.content?.label ?? "");
    // The legacy feed format led with an app-metadata entry that has no
    // rating; skipping anything without one keeps that from ever rendering.
    if (!id || rating === null || !body) continue;
    out.push({
      store: "app-store",
      id,
      author: clean(e.author?.name?.label ?? "App Store reviewer"),
      rating,
      title: clean(e.title?.label ?? "") || undefined,
      body,
      date: e.updated?.label ?? "",
      helpful: 0,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Google Play

async function playSummary(): Promise<StoreSummary> {
  const html = await getText(
    `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}&hl=en_US&gl=US`,
  );
  const blocks = html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  );
  for (const m of blocks) {
    try {
      const ld = JSON.parse(m[1]);
      const agg = ld?.aggregateRating;
      if (agg) {
        const count = num(agg.ratingCount);
        return {
          store: "google-play",
          label: "Google Play",
          rating: count ? num(agg.ratingValue) : null,
          count,
          countNoun: count === 1 ? "review" : "reviews",
          url: STORE_LINKS.googlePlay,
        };
      }
    } catch {
      // Not every ld+json block is ours to parse; keep looking.
    }
  }
  // A listing with no ratings yet has no aggregateRating at all.
  return {
    store: "google-play",
    label: "Google Play",
    rating: null,
    count: 0,
    countNoun: "reviews",
    url: STORE_LINKS.googlePlay,
  };
}

async function playReviews(): Promise<StoreReview[]> {
  // [null,null,[2, sort, [count,null,null], null, []], [package, 7]]
  // sort 1 = most relevant, the order Play itself shows.
  const req = JSON.stringify([
    [
      [
        "UsvDTd",
        JSON.stringify([
          null,
          null,
          [2, 1, [40, null, null], null, []],
          [PLAY_PACKAGE, 7],
        ]),
        null,
        "generic",
      ],
    ],
  ]);
  const text = await getText(
    "https://play.google.com/_/PlayStoreUi/data/batchexecute?hl=en&gl=us",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `f.req=${encodeURIComponent(req)}`,
    },
  );

  let payload: unknown = null;
  for (const line of text.replace(/^\)\]\}'/, "").split("\n")) {
    const t = line.trim();
    if (!t.startsWith("[")) continue;
    try {
      for (const part of JSON.parse(t) as unknown[]) {
        if (
          Array.isArray(part) &&
          part[0] === "wrb.fr" &&
          part[1] === "UsvDTd" &&
          typeof part[2] === "string"
        ) {
          payload = JSON.parse(part[2]);
        }
      }
    } catch {
      // Length-prefix lines and the like; the payload line parses.
    }
  }
  if (!Array.isArray(payload)) {
    throw new Error("Google Play reviews: response shape changed");
  }
  const list = Array.isArray(payload[0]) ? (payload[0] as unknown[]) : [];

  const out: StoreReview[] = [];
  for (const r of list) {
    if (!Array.isArray(r)) continue;
    const id = typeof r[0] === "string" ? r[0] : null;
    const author =
      Array.isArray(r[1]) && typeof r[1][0] === "string" ? r[1][0] : null;
    const rating = num(r[2]);
    const body = typeof r[4] === "string" ? clean(r[4]) : "";
    const seconds = Array.isArray(r[5]) ? num(r[5][0]) : null;
    if (!id || !author || rating === null || !body) continue;
    out.push({
      store: "google-play",
      id,
      author: clean(author),
      rating,
      body,
      date: seconds ? new Date(seconds * 1000).toISOString() : "",
      helpful: num(r[6]) ?? 0,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------

function pick(all: StoreReview[], limit: number): StoreReview[] {
  const byKey = new Map(all.map((r) => [key(r.store, r.id), r]));
  const chosen: StoreReview[] = [];
  const used = new Set<string>();

  for (const [store, id] of FEATURED) {
    const r = byKey.get(key(store, id));
    // A featured review only stays featured while it is still a 4 or 5 star
    // review; if the author edits it down, it drops out on the next refresh.
    if (r && r.rating >= 4 && !HIDDEN.has(key(store, id))) {
      chosen.push(r);
      used.add(key(store, id));
    }
  }

  const rest = all
    .filter(
      (r) =>
        !used.has(key(r.store, r.id)) &&
        !HIDDEN.has(key(r.store, r.id)) &&
        r.rating === 5 &&
        r.body.length >= AUTO_MIN_LENGTH,
    )
    .sort((a, b) => b.helpful - a.helpful || b.date.localeCompare(a.date));

  return [...chosen, ...rest].slice(0, limit);
}

const isBuild = () => process.env.NEXT_PHASE === "phase-production-build";

async function load(): Promise<StoreReviewsData> {
  const [aSum, pSum, aRev, pRev] = await Promise.allSettled([
    appleSummary(),
    playSummary(),
    appleReviews(),
    playReviews(),
  ] as const);

  const failures = [aSum, pSum, aRev, pRev].filter(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );
  if (failures.length) {
    const why = failures.map((f) => String(f.reason)).join("; ");
    if (process.env.NODE_ENV === "production" && !isBuild()) {
      // Background revalidation: keep the last good page instead.
      throw new Error(`Store reviews refresh failed: ${why}`);
    }
    console.warn(`[store-reviews] skipping failed source(s): ${why}`);
  }

  const summaries: StoreSummary[] = [];
  if (pSum.status === "fulfilled") summaries.push(pSum.value);
  if (aSum.status === "fulfilled") summaries.push(aSum.value);

  const reviews: StoreReview[] = [
    ...(pRev.status === "fulfilled" ? pRev.value : []),
    ...(aRev.status === "fulfilled" ? aRev.value : []),
  ];

  return { summaries, reviews: pick(reviews, MAX_REVIEWS) };
}

/** Deduped per render, so the hero line and the section share one fetch. */
export const getStoreReviews = cache(load);

/**
 * Display name for a reviewer. Google Play shows full account names, so a
 * plain "First Last" is shortened to "First L." the way testimonials usually
 * are. Handles that are clearly not a person's name (a weather club, a
 * nickname) are left exactly as the reviewer chose them.
 */
export function displayName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ");
  const parts = name.split(" ");
  const nameLike = /^[A-Z][a-z'’-]+$/;
  const notAPerson =
    /(weather|storm|chas|radar|network|watch|wx|team|skywarn|county|news|alert)/i;
  if (
    parts.length === 2 &&
    parts.every((p) => nameLike.test(p)) &&
    !notAPerson.test(name)
  ) {
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return name;
}

/** "August 2026" */
export function reviewMonth(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Whole-store ratings worth putting in a headline: all of them 4.0 or up. */
export function headlineRatings(summaries: StoreSummary[]): StoreSummary[] {
  const rated = summaries.filter(
    (s) => s.rating !== null && (s.count ?? 0) > 0,
  );
  if (!rated.length || rated.some((s) => (s.rating ?? 0) < 4)) return [];
  return rated;
}
