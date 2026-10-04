import SectionHeader from "@/components/SectionHeader";
import Stars from "@/components/Stars";
import { STORE_LINKS } from "@/lib/stores";
import {
  displayName,
  getStoreReviews,
  headlineRatings,
  reviewMonth,
  type StoreReview,
} from "@/lib/storeReviews";

const STORE_LABEL = {
  "google-play": "Google Play",
  "app-store": "App Store",
} as const;

function ReviewCard({ review }: { review: StoreReview }) {
  const month = reviewMonth(review.date);
  return (
    <figure className="flex w-[85%] shrink-0 snap-center flex-col rounded-2xl border border-white/10 bg-surface p-6 sm:w-[60%] md:mb-6 md:w-auto md:break-inside-avoid">
      <Stars rating={review.rating} />
      {review.title ? (
        <p className="mt-4 font-semibold text-foreground">{review.title}</p>
      ) : null}
      <blockquote
        className={`${review.title ? "mt-2" : "mt-4"} text-[15px] leading-relaxed text-foreground/85`}
      >
        <p>&ldquo;{review.body}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/5 pt-4 text-sm">
        <span className="font-semibold text-foreground">
          {displayName(review.author)}
        </span>
        <span className="text-xs text-muted">
          {STORE_LABEL[review.store]}
          {month ? ` · ${month}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Store ratings and hand-picked reviews, read live from Google Play and the
 * App Store (see lib/storeReviews.ts). Renders nothing at all if neither
 * store answered at build time, rather than an empty frame.
 */
export default async function StoreReviews() {
  const { summaries, reviews } = await getStoreReviews();
  const rated = headlineRatings(summaries);
  if (!reviews.length && !rated.length) return null;

  return (
    <section id="reviews" className="scroll-mt-20 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Reviews"
          title="Straight From the Stores"
          description="What chasers, spotters and weather watchers wrote on Google Play and the App Store, word for word, pulled live from each store."
        />

        {rated.length ? (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {rated.map((s) => (
              <a
                key={s.store}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-surface px-5 py-2.5 transition-colors hover:border-brand-teal/40"
              >
                <span className="text-xl font-bold text-foreground">
                  {(s.rating ?? 0).toFixed(1)}
                </span>
                <Stars rating={s.rating ?? 0} size={15} />
                <span className="text-sm text-muted">
                  {s.label}
                  <span className="hidden sm:inline">
                    {" "}
                    &middot; {s.count} {s.countNoun}
                  </span>
                </span>
              </a>
            ))}
          </div>
        ) : null}

        {reviews.length ? (
          <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:thin] md:mx-0 md:block md:columns-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:columns-3">
            {reviews.map((r) => (
              <ReviewCard key={`${r.store}:${r.id}`} review={r} />
            ))}
          </div>
        ) : null}

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Already using it? A quick review helps other spotters find the app:{" "}
          <a
            href={STORE_LINKS.googlePlay}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-teal hover:underline"
          >
            Google Play
          </a>
          ,{" "}
          <a
            href={`${STORE_LINKS.appStore}?action=write-review`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-teal hover:underline"
          >
            App Store
          </a>{" "}
          or{" "}
          <a
            href={STORE_LINKS.microsoft}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-teal hover:underline"
          >
            Microsoft Store
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/**
 * One line of social proof for the hero: "Rated 5.0 on Google Play and the
 * App Store". Hidden entirely unless every store with ratings is at 4.0 or
 * better, so it can never cherry-pick one good store over a bad one.
 */
export async function StoreRatingLine() {
  const { summaries } = await getStoreReviews();
  const rated = headlineRatings(summaries);
  if (!rated.length) return null;

  const lowest = Math.min(...rated.map((s) => s.rating ?? 0));
  const allSame = rated.every((s) => s.rating === rated[0].rating);
  const text = allSame
    ? `Rated ${lowest.toFixed(1)} on ${rated
        .map((s) => (s.store === "app-store" ? "the App Store" : s.label))
        .join(" and ")}`
    : `Rated ${rated
        .map(
          (s) =>
            `${(s.rating ?? 0).toFixed(1)} on ${s.store === "app-store" ? "the App Store" : s.label}`,
        )
        .join(", ")}`;

  return (
    <a
      href="#reviews"
      className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted transition-colors hover:text-foreground"
    >
      <Stars rating={lowest} size={15} />
      <span>{text}</span>
    </a>
  );
}
