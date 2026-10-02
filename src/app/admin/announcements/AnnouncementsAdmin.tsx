"use client";

import { useEffect, useState, type FormEvent } from "react";
import MarkdownField from "./MarkdownField";
import CardPreview from "./CardPreview";

type Severity =
  | "info"
  | "warning"
  | "success"
  | "whatsNew"
  // Preset rather than a look: the app has no case for it and renders it as
  // info (exactly what update messages used before), but picking it here fills
  // in the "Update!" button and the right store link. Safe on every install.
  | "updateAvailable"
  // Same idea: prefills an "enjoying the app?" message plus the review link
  // for the ticked platform. Also renders as info on every install.
  | "reviewRequest";

type Item = {
  // Stable React key, internal only — never published. The user-facing `id` is
  // editable (and briefly duplicate/empty while typing), so it can't be the key.
  _uid: string;
  id: string;
  severity: Severity;
  title: string;
  body: string;
  startsAt?: string | null;
  endsAt?: string | null;
  reshowEachLaunch?: boolean;
  minAppVersion?: string | null;
  maxAppVersion?: string | null;
  platforms?: string[];
  actionLabel?: string | null;
  actionUrl?: string | null;
};

// What actually gets sent to the Worker — the internal key is stripped.
type PublishItem = Omit<Item, "_uid">;

type Status = { kind: "info" | "error" | "success"; msg: string } | null;

let uidSeq = 0;
const nextUid = () => `u${++uidSeq}`;

const SEVERITIES: Severity[] = [
  "info",
  "warning",
  "success",
  "whatsNew",
  "updateAvailable",
  "reviewRequest",
];
const PLATFORMS = ["android", "ios", "windows"];

// Where an "Update!" button sends people, per platform. Hardcoded so an update
// prompt can never ship pointing at the wrong store — a dead end for whoever
// taps it, and unfixable without a re-publish.
const STORE_URLS: Record<string, string> = {
  android:
    "https://play.google.com/store/apps/details?id=com.dustin.spottertools",
  ios: "https://apps.apple.com/us/app/spotter-tools-pro/id6775985245",
  // Deep link that opens the Microsoft Store APP (not a browser, where users
  // can't update) straight to the product page. https://apps.microsoft.com
  // links only open the browser on Windows.
  windows: "ms-windows-store://pdp/?ProductId=9NFQK1X16KZS",
};
// Where a "Leave a review" button sends people, per platform. iOS has a real
// write-review deep link and Windows a Store-app rating dialog; Google Play
// has no review URL param, so Android lands on the listing and users tap Rate.
const REVIEW_URLS: Record<string, string> = {
  android:
    "https://play.google.com/store/apps/details?id=com.dustin.spottertools",
  ios: "https://apps.apple.com/us/app/spotter-tools-pro/id6775985245?action=write-review",
  windows: "ms-windows-store://review/?ProductId=9NFQK1X16KZS",
};

// Severity values that are presets rather than looks: picking one pins the
// action button label, points its URL at the right store for the targeted
// platform, and drops a default title/body into empty fields — so a whole
// prompt is one dropdown + one platform tick.
const PRESETS: Partial<
  Record<
    Severity,
    { label: string; urls: Record<string, string>; title: string; body: string }
  >
> = {
  updateAvailable: {
    label: "Update!",
    urls: STORE_URLS,
    title: "A new version is available",
    body:
      "There's a new version available. Tap Update! below to go to the store " +
      "and update to the latest version.",
  },
  reviewRequest: {
    label: "Leave a review",
    urls: REVIEW_URLS,
    title: "Enjoying Spotter Tools Pro?",
    body:
      "We hope Spotter Tools Pro has been a great addition to your severe " +
      "weather toolkit! If you have a moment, we'd love for you to leave a " +
      "quick review in the store. It really helps other spotters and weather " +
      "enthusiasts discover the app. Thank you for your support!",
  },
};

// Apply the severity preset (if any): pin the button label and point it at the
// right URL for the targeted platform. Only fires for a SINGLE platform,
// because one actionUrl cannot serve two stores — with none or several ticked
// the URL is left alone and the editor shows a warning instead of guessing.
//
// Called from the severity dropdown and the platform checkboxes only, not on
// every edit, so both fields stay hand-editable afterwards.
function withSeverityPreset(it: Item): Item {
  const preset = PRESETS[it.severity];
  if (!preset) return it;
  const only = it.platforms?.length === 1 ? it.platforms[0] : null;
  const url = only ? preset.urls[only] : null;
  return {
    ...it,
    actionLabel: preset.label,
    actionUrl: url ?? it.actionUrl ?? null,
  };
}

const inputCls =
  "w-full rounded-md bg-surface-light border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-teal";
const labelCls = "block text-xs font-medium text-muted mb-1";

// ── datetime-local <-> ISO helpers ─────────────────────────────────────
function isoToLocal(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
function localToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// Where a message sits in its schedule window right now. Drives the chip on
// the collapsed header so the list can be scanned without opening anything.
type Schedule = "live" | "scheduled" | "expired";
function scheduleOf(it: Item, now = Date.now()): Schedule {
  const s = it.startsAt ? Date.parse(it.startsAt) : NaN;
  const e = it.endsAt ? Date.parse(it.endsAt) : NaN;
  if (!Number.isNaN(e) && e < now) return "expired";
  if (!Number.isNaN(s) && s > now) return "scheduled";
  return "live";
}
const SCHEDULE_CHIP: Record<Schedule, string> = {
  live: "border-brand-green/40 bg-brand-green/10 text-brand-green",
  scheduled: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  expired: "border-white/10 bg-white/5 text-muted",
};
const SEVERITY_CHIP: Record<Severity, string> = {
  info: "border-sky-400/40 text-sky-300",
  warning: "border-amber-400/40 text-amber-300",
  success: "border-brand-green/40 text-brand-green",
  whatsNew: "border-brand-teal/40 text-brand-teal",
  updateAvailable: "border-violet-400/40 text-violet-300",
  reviewRequest: "border-pink-400/40 text-pink-300",
};
function shortDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
// One-line schedule summary for the header: "Sep 3 → Sep 10", "from Sep 3",
// "until Sep 10", or "" when the message has no window.
function scheduleLabel(it: Item): string {
  const s = shortDate(it.startsAt);
  const e = shortDate(it.endsAt);
  if (s && e) return `${s} → ${e}`;
  if (s) return `from ${s}`;
  if (e) return `until ${e}`;
  return "";
}

function blankItem(): Item {
  return {
    _uid: nextUid(),
    id: `msg-${Date.now()}`,
    severity: "info",
    title: "",
    body: "",
  };
}

// Strip empty optionals so the published JSON stays clean (the Worker also
// sanitises, but this keeps the preview honest).
function cleanForPublish(items: Item[]): PublishItem[] {
  return items.map((it) => {
    const o: PublishItem = {
      id: it.id.trim(),
      severity: it.severity,
      title: it.title.trim(),
      body: it.body.trim(),
    };
    if (it.startsAt) o.startsAt = it.startsAt;
    if (it.endsAt) o.endsAt = it.endsAt;
    if (it.reshowEachLaunch) o.reshowEachLaunch = true;
    if (it.minAppVersion?.trim()) o.minAppVersion = it.minAppVersion.trim();
    if (it.maxAppVersion?.trim()) o.maxAppVersion = it.maxAppVersion.trim();
    if (it.platforms?.length) o.platforms = it.platforms;
    if (it.actionLabel?.trim() && it.actionUrl?.trim()) {
      o.actionLabel = it.actionLabel.trim();
      o.actionUrl = it.actionUrl.trim();
    }
    return o;
  });
}

export default function AnnouncementsAdmin() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  // Which cards are expanded. Loaded messages start collapsed so a long list
  // reads as a table of headers; a freshly added message opens for editing.
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Schedule | "all">("all");
  // Which cards show the rendered phone preview beside the editor.
  const [previewing, setPreviewing] = useState<Set<string>>(() => new Set());
  // The list as last loaded/published, keyed by id, so the page can tell
  // what is unsaved: badge the Publish button, warn before closing the tab,
  // and refuse to re-publish an unchanged list by accident.
  const [saved, setSaved] = useState<Map<string, string>>(() => new Map());

  // Insertion order of the Map is the list order, which is compared too.
  function snapshot(list: Item[]): Map<string, string> {
    return new Map(
      cleanForPublish(list).map((it) => [it.id, JSON.stringify(it)]),
    );
  }
  const current = snapshot(items);
  let changed = 0;
  for (const [id, json] of current) if (saved.get(id) !== json) changed++;
  for (const id of saved.keys()) if (!current.has(id)) changed++;
  // Order matters too: the app shows the first active message, so a pure
  // reorder is a real change even though every row is byte-identical.
  const orderChanged =
    changed === 0 &&
    [...current.keys()].join("|") !== [...saved.keys()].join("|");
  if (orderChanged) changed = 1;
  const dirty = changed > 0;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function setPreviewFor(uid: string, value: boolean) {
    setPreviewing((prev) => {
      const next = new Set(prev);
      if (value) next.add(uid);
      else next.delete(uid);
      return next;
    });
  }
  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const j = index + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }
  function duplicate(index: number) {
    const src = items[index];
    if (!src) return;
    const copy: Item = { ...src, _uid: nextUid(), id: `${src.id}-copy` };
    setItems((prev) => [
      ...prev.slice(0, index + 1),
      copy,
      ...prev.slice(index + 1),
    ]);
    setOpenFor(copy._uid, true);
  }
  function remove(uid: string) {
    const it = items.find((x) => x._uid === uid);
    const name = it?.title.trim() || it?.id || "this message";
    if (!window.confirm(`Remove “${name}”? It stays live until you Publish.`))
      return;
    setItems((p) => p.filter((x) => x._uid !== uid));
  }
  function removeExpired() {
    const gone = items.filter((it) => scheduleOf(it) === "expired");
    if (!gone.length) return;
    if (
      !window.confirm(
        `Remove ${gone.length} expired message${gone.length === 1 ? "" : "s"}? They stay live until you Publish.`,
      )
    )
      return;
    const ids = new Set(gone.map((it) => it._uid));
    setItems((p) => p.filter((x) => !ids.has(x._uid)));
  }

  function setOpenFor(uid: string, value: boolean) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (value) next.add(uid);
      else next.delete(uid);
      return next;
    });
  }
  function addMessage() {
    const it = blankItem();
    setItems((p) => [...p, it]);
    setOpenFor(it._uid, true);
  }

  async function call(
    action: "load" | "publish",
    announcements?: PublishItem[],
  ) {
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, password, announcements }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  async function unlock(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const { ok, status: code, data } = await call("load");
      if (!ok) {
        setStatus({
          kind: "error",
          msg:
            code === 401
              ? "Wrong password."
              : `Could not load (${code}): ${data?.error ?? "unknown error"}`,
        });
        return;
      }
      const list = Array.isArray(data?.announcements)
        ? (data.announcements as PublishItem[])
        : [];
      const loaded = list.map((it) => ({
        ...it,
        _uid: nextUid(),
        severity: it.severity ?? "info",
      }));
      setItems(loaded);
      setSaved(snapshot(loaded));
      setUnlocked(true);
      setStatus({
        kind: "info",
        msg: `Loaded ${list.length} message${list.length === 1 ? "" : "s"}.`,
      });
    } catch (err) {
      setStatus({ kind: "error", msg: `Network error: ${String(err)}` });
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    // Client-side guardrails before the Worker's own validation.
    for (const [i, it] of items.entries()) {
      if (!it.id.trim() || !it.title.trim() || !it.body.trim()) {
        setOpenFor(it._uid, true);
        setStatus({
          kind: "error",
          msg: `Message #${i + 1} needs an id, a title, and a body.`,
        });
        return;
      }
    }
    const ids = items.map((it) => it.id.trim());
    if (new Set(ids).size !== ids.length) {
      setStatus({ kind: "error", msg: "Two messages share the same id." });
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      const payload = cleanForPublish(items);
      const { ok, status: code, data } = await call("publish", payload);
      if (!ok) {
        setStatus({
          kind: "error",
          msg: `Publish failed (${code}): ${data?.error ?? "unknown error"}`,
        });
        return;
      }
      setSaved(snapshot(items));
      setStatus({
        kind: "success",
        msg: `Published ${data?.count ?? payload.length} message${
          (data?.count ?? payload.length) === 1 ? "" : "s"
        }. Live now.`,
      });
    } catch (err) {
      setStatus({ kind: "error", msg: `Network error: ${String(err)}` });
    } finally {
      setBusy(false);
    }
  }

  function update(index: number, patch: Partial<Item>) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  }
  // The body editor rewrote the markdown on mount without the user touching
  // it. Apply the rewrite, and if the message was otherwise identical to what
  // is saved, move the saved baseline with it so it does not read as an edit.
  function normalizeBody(uid: string, body: string) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it._uid === uid);
      if (idx < 0) return prev;
      const before = prev[idx];
      const after = { ...before, body };
      const [cleanBefore] = cleanForPublish([before]);
      const [cleanAfter] = cleanForPublish([after]);
      setSaved((s) => {
        if (s.get(cleanBefore.id) !== JSON.stringify(cleanBefore)) return s;
        const next = new Map(s);
        next.set(cleanAfter.id, JSON.stringify(cleanAfter));
        return next;
      });
      return prev.map((it, i) => (i === idx ? after : it));
    });
  }
  function setSeverity(index: number, severity: Severity) {
    // Re-keying the row (below) changes its uid, so keep it expanded under
    // the new one. A stray uid in the open-set when no re-key happens is
    // harmless.
    const fresh = nextUid();
    setOpenFor(fresh, true);
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const next = withSeverityPreset({ ...it, severity });
        const preset = PRESETS[severity];
        if (!preset) return next;
        // Fill an empty title/body with the preset defaults. The body editor
        // (MDXEditor) ignores value changes after mount, so when we actually
        // change the body we re-key the row (`_uid`) to remount it and show
        // the prefilled text. A body the user already typed is left alone.
        const title = next.title.trim() ? next.title : preset.title;
        const body = next.body.trim() ? next.body : preset.body;
        return {
          ...next,
          title,
          body,
          _uid: body !== next.body ? fresh : next._uid,
        };
      }),
    );
  }

  function togglePlatform(index: number, p: string) {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const set = new Set(it.platforms ?? []);
        if (set.has(p)) set.delete(p);
        else set.add(p);
        const arr = Array.from(set);
        return withSeverityPreset({
          ...it,
          platforms: arr.length ? arr : undefined,
        });
      }),
    );
  }

  const banner = status && (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        status.kind === "error"
          ? "border-red-500/40 bg-red-500/10 text-red-300"
          : status.kind === "success"
            ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
            : "border-white/10 bg-surface text-muted"
      }`}
    >
      {status.msg}
    </div>
  );

  if (!unlocked) {
    return (
      <main className="mx-auto max-w-md px-6 pt-28 pb-20">
        <h1 className="mb-2 text-3xl font-bold">Announcements</h1>
        <p className="mb-8 text-sm text-muted">
          Post a message that pops up in the app on launch. Enter the admin
          password to continue.
        </p>
        <form onSubmit={unlock} className="space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className={inputCls}
          />
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-md bg-brand-teal px-4 py-2 font-medium text-background disabled:opacity-50"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
          {banner}
        </form>
      </main>
    );
  }

  const preview = JSON.stringify(
    { announcements: cleanForPublish(items) },
    null,
    2,
  );

  const q = filter.trim().toLowerCase();
  const matches = (it: Item) =>
    (statusFilter === "all" || scheduleOf(it) === statusFilter) &&
    (!q ||
      it.id.toLowerCase().includes(q) ||
      it.title.toLowerCase().includes(q) ||
      it.severity.toLowerCase().includes(q) ||
      (it.platforms ?? []).some((p) => p.includes(q)));
  const visibleCount = items.filter(matches).length;
  const counts: Record<Schedule, number> = {
    live: 0,
    scheduled: 0,
    expired: 0,
  };
  for (const it of items) counts[scheduleOf(it)]++;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="mt-1 text-xs text-muted">
            {items.length} message{items.length === 1 ? "" : "s"}, {counts.live}{" "}
            live now
            {dirty && (
              <span className="ml-2 text-amber-300">
                · {changed} unsaved change{changed === 1 ? "" : "s"}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={addMessage}
          className="rounded-md border border-brand-teal/50 px-3 py-1.5 text-sm text-brand-teal hover:bg-brand-teal/10"
        >
          + Add message
        </button>
      </div>

      {items.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by id, title, severity, platform…"
            className={`${inputCls} min-w-[200px] flex-1`}
          />
          <button
            onClick={() => setOpen(new Set(items.map((it) => it._uid)))}
            className="rounded-md border border-white/10 px-3 py-2 text-xs text-muted hover:bg-white/5"
          >
            Expand all
          </button>
          <button
            onClick={() => setOpen(new Set())}
            className="rounded-md border border-white/10 px-3 py-2 text-xs text-muted hover:bg-white/5"
          >
            Collapse all
          </button>
          <div className="flex w-full flex-wrap items-center gap-2">
            {(["all", "live", "scheduled", "expired"] as const).map((s) => {
              const n = s === "all" ? items.length : counts[s];
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    active
                      ? "border-brand-teal bg-brand-teal/15 text-brand-teal"
                      : "border-white/10 text-muted hover:bg-white/5"
                  }`}
                >
                  {s} ({n})
                </button>
              );
            })}
            {counts.expired > 0 && (
              <button
                onClick={removeExpired}
                className="ml-auto rounded-md border border-red-500/40 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
              >
                Remove {counts.expired} expired
              </button>
            )}
          </div>
        </div>
      )}

      {banner && <div className="mb-6">{banner}</div>}

      {items.length === 0 && (
        <p className="rounded-md border border-white/10 bg-surface px-4 py-8 text-center text-sm text-muted">
          No messages. Click “Add message”, then Publish. Publishing an empty
          list clears whatever is currently showing.
        </p>
      )}
      {items.length > 0 && visibleCount === 0 && (
        <p className="rounded-md border border-white/10 bg-surface px-4 py-6 text-center text-sm text-muted">
          No {statusFilter === "all" ? "" : `${statusFilter} `}messages
          {filter.trim() ? ` match “${filter.trim()}”` : ""}.
        </p>
      )}

      <div className="space-y-3">
        {items.map((it, i) => {
          const isOpen = open.has(it._uid);
          const sched = scheduleOf(it);
          const when = scheduleLabel(it);
          // Hidden via CSS rather than unmounted so the body editor keeps its
          // undo history and cursor across collapse/expand, and the filter
          // never remounts anything either.
          const shown = matches(it);
          return (
            <div
              key={it._uid}
              className={`rounded-lg border bg-surface ${
                isOpen ? "border-white/20" : "border-white/10"
              } ${shown ? "" : "hidden"}`}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpenFor(it._uid, !isOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenFor(it._uid, !isOpen);
                  }
                }}
                className="flex cursor-pointer select-none items-center gap-3 px-4 py-3 hover:bg-white/[0.03]"
              >
                <span
                  className={`text-muted transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                  aria-hidden
                >
                  ▸
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${SCHEDULE_CHIP[sched]}`}
                >
                  {sched}
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${SEVERITY_CHIP[it.severity]}`}
                >
                  {it.severity}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {it.title.trim() || (
                    <span className="italic text-muted">Untitled</span>
                  )}
                  <span className="ml-2 font-mono text-xs text-muted">
                    {it.id}
                  </span>
                </span>
                <span className="hidden shrink-0 text-xs text-muted sm:inline">
                  {when}
                  {when && it.platforms?.length ? " · " : ""}
                  {it.platforms?.join(", ") ?? ""}
                  {!when && !it.platforms?.length ? "all platforms" : ""}
                </span>
                <span
                  className="flex shrink-0 items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <button
                    title="Move up"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="rounded px-1.5 py-0.5 text-xs text-muted hover:bg-white/10 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    title="Move down"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                    className="rounded px-1.5 py-0.5 text-xs text-muted hover:bg-white/10 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    title="Duplicate"
                    onClick={() => duplicate(i)}
                    className="rounded px-1.5 py-0.5 text-xs text-muted hover:bg-white/10"
                  >
                    ⧉
                  </button>
                </span>
              </div>

              <div
                className={isOpen ? "border-t border-white/10 p-4" : "hidden"}
              >
                <div className="mb-3 flex items-center gap-3">
                  <input
                    value={it.id}
                    onChange={(e) => update(i, { id: e.target.value })}
                    placeholder="unique-id"
                    className={`${inputCls} font-mono`}
                  />
                  <select
                    value={it.severity}
                    onChange={(e) => setSeverity(i, e.target.value as Severity)}
                    className={`${inputCls} max-w-[170px]`}
                  >
                    {SEVERITIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      setPreviewFor(it._uid, !previewing.has(it._uid))
                    }
                    className={`shrink-0 rounded-md border px-3 py-2 text-sm ${
                      previewing.has(it._uid)
                        ? "border-brand-teal bg-brand-teal/15 text-brand-teal"
                        : "border-white/10 text-muted hover:bg-white/5"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => remove(it._uid)}
                    className="shrink-0 rounded-md border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-3">
                  <label className={labelCls}>Title</label>
                  <input
                    value={it.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    placeholder="Short headline"
                    className={inputCls}
                  />
                </div>

                <div className="mb-3">
                  <label className={labelCls}>Body</label>
                  <MarkdownField
                    value={it.body}
                    onChange={(md) => update(i, { body: md })}
                    onNormalize={(md) => normalizeBody(it._uid, md)}
                    password={password}
                  />
                </div>

                {previewing.has(it._uid) && (
                  <div className="mb-3">
                    <label className={labelCls}>
                      How it looks in the app (approximate)
                    </label>
                    <CardPreview
                      severity={it.severity}
                      title={it.title}
                      body={it.body}
                      actionLabel={it.actionLabel}
                      actionUrl={it.actionUrl}
                    />
                  </div>
                )}

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Starts ({tz}, optional)</label>
                    <input
                      type="datetime-local"
                      value={isoToLocal(it.startsAt)}
                      onChange={(e) =>
                        update(i, { startsAt: localToIso(e.target.value) })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Ends ({tz}, optional)</label>
                    <input
                      type="datetime-local"
                      value={isoToLocal(it.endsAt)}
                      onChange={(e) =>
                        update(i, { endsAt: localToIso(e.target.value) })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={!!it.reshowEachLaunch}
                      onChange={(e) =>
                        update(i, { reshowEachLaunch: e.target.checked })
                      }
                    />
                    Re-show each launch (until it ends)
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">Platforms:</span>
                    {PLATFORMS.map((p) => (
                      <label
                        key={p}
                        className="flex items-center gap-1.5 text-sm text-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={it.platforms?.includes(p) ?? false}
                          onChange={() => togglePlatform(i, p)}
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      Min app version (optional)
                    </label>
                    <input
                      value={it.minAppVersion ?? ""}
                      onChange={(e) =>
                        update(i, { minAppVersion: e.target.value || null })
                      }
                      placeholder="1.0.36"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Max app version (optional)
                    </label>
                    <input
                      value={it.maxAppVersion ?? ""}
                      onChange={(e) =>
                        update(i, { maxAppVersion: e.target.value || null })
                      }
                      placeholder=""
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Action label (optional)</label>
                    <input
                      value={it.actionLabel ?? ""}
                      onChange={(e) =>
                        update(i, { actionLabel: e.target.value || null })
                      }
                      placeholder="Learn more"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Action URL (optional)</label>
                    <input
                      value={it.actionUrl ?? ""}
                      onChange={(e) =>
                        update(i, { actionUrl: e.target.value || null })
                      }
                      placeholder="https://…"
                      className={inputCls}
                    />
                  </div>
                </div>

                {PRESETS[it.severity] &&
                  (it.platforms?.length === 1 ? (
                    <p className="mt-2 text-xs text-muted">
                      Button and store link filled in for{" "}
                      <span className="font-mono">{it.platforms[0]}</span>. Both
                      fields are still editable.
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-amber-300">
                      Tick exactly one platform to fill the store link in — a
                      single action URL can only point at one store, so this
                      preset needs one message per platform.
                    </p>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-6 -mx-6 border-t border-white/10 bg-background/90 px-6 py-4 backdrop-blur">
        <button
          onClick={publish}
          disabled={busy || !dirty}
          className="w-full rounded-md bg-brand-teal px-4 py-2.5 font-medium text-background disabled:opacity-50"
        >
          {busy
            ? "Publishing…"
            : dirty
              ? `Publish ${changed} change${changed === 1 ? "" : "s"} (replaces the live list)`
              : "Nothing to publish — live list matches"}
        </button>
      </div>

      <details className="mt-8">
        <summary className="cursor-pointer text-sm text-muted">
          Preview published JSON
        </summary>
        <pre className="mt-3 overflow-x-auto rounded-md border border-white/10 bg-surface p-4 text-xs text-muted">
          {preview}
        </pre>
      </details>
    </main>
  );
}
