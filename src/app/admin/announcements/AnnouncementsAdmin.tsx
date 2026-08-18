"use client";

import { useState, type FormEvent } from "react";
import MarkdownField from "./MarkdownField";

type Severity =
  | "info"
  | "warning"
  | "success"
  | "whatsNew"
  // Preset rather than a look: the app has no case for it and renders it as
  // info (exactly what update messages used before), but picking it here fills
  // in the "Update!" button and the right store link. Safe on every install.
  | "updateAvailable";

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
const UPDATE_ACTION_LABEL = "Update!";
// Default title + body the updateAvailable preset drops in when those fields
// are still empty, so a whole update prompt is one dropdown + one platform tick.
const UPDATE_TITLE = "A new version is available";
const UPDATE_BODY =
  "There's a new version available. Tap Update! below to go to the store and " +
  "update to the latest version.";

// Apply the updateAvailable preset: pin the button label and point it at the
// store for the targeted platform. Only fires for a SINGLE platform, because
// one actionUrl cannot serve two stores — with none or several ticked the URL
// is left alone and the editor shows a warning instead of guessing.
//
// Called from the severity dropdown and the platform checkboxes only, not on
// every edit, so both fields stay hand-editable afterwards.
function withUpdatePreset(it: Item): Item {
  if (it.severity !== "updateAvailable") return it;
  const only = it.platforms?.length === 1 ? it.platforms[0] : null;
  const url = only ? STORE_URLS[only] : null;
  return {
    ...it,
    actionLabel: UPDATE_ACTION_LABEL,
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
      setItems(
        list.map((it) => ({
          ...it,
          _uid: nextUid(),
          severity: it.severity ?? "info",
        })),
      );
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
  function setSeverity(index: number, severity: Severity) {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const next = withUpdatePreset({ ...it, severity });
        if (severity !== "updateAvailable") return next;
        // Fill an empty title/body with the update defaults. The body editor
        // (MDXEditor) ignores value changes after mount, so when we actually
        // change the body we re-key the row (`_uid`) to remount it and show
        // the prefilled text. A body the user already typed is left alone.
        const title = next.title.trim() ? next.title : UPDATE_TITLE;
        const body = next.body.trim() ? next.body : UPDATE_BODY;
        return {
          ...next,
          title,
          body,
          _uid: body !== next.body ? nextUid() : next._uid,
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
        return withUpdatePreset({
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

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <button
          onClick={() => setItems((p) => [...p, blankItem()])}
          className="rounded-md border border-brand-teal/50 px-3 py-1.5 text-sm text-brand-teal hover:bg-brand-teal/10"
        >
          + Add message
        </button>
      </div>

      {banner && <div className="mb-6">{banner}</div>}

      {items.length === 0 && (
        <p className="rounded-md border border-white/10 bg-surface px-4 py-8 text-center text-sm text-muted">
          No messages. Click “Add message”, then Publish. Publishing an empty
          list clears whatever is currently showing.
        </p>
      )}

      <div className="space-y-5">
        {items.map((it, i) => (
          <div
            key={it._uid}
            className="rounded-lg border border-white/10 bg-surface p-4"
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
                  setItems((p) => p.filter((x) => x._uid !== it._uid))
                }
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
                password={password}
              />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Starts (local, optional)</label>
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
                <label className={labelCls}>Ends (local, optional)</label>
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
                <label className={labelCls}>Min app version (optional)</label>
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
                <label className={labelCls}>Max app version (optional)</label>
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

            {it.severity === "updateAvailable" &&
              (it.platforms?.length === 1 ? (
                <p className="mt-2 text-xs text-muted">
                  Button and store link filled in for{" "}
                  <span className="font-mono">{it.platforms[0]}</span>. Both
                  fields are still editable.
                </p>
              ) : (
                <p className="mt-2 text-xs text-amber-300">
                  Tick exactly one platform to fill the store link in — a single
                  action URL can only point at one store, so an update prompt
                  needs one message per platform.
                </p>
              ))}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 -mx-6 border-t border-white/10 bg-background/90 px-6 py-4 backdrop-blur">
        <button
          onClick={publish}
          disabled={busy}
          className="w-full rounded-md bg-brand-teal px-4 py-2.5 font-medium text-background disabled:opacity-50"
        >
          {busy ? "Publishing…" : "Publish (replaces the live list)"}
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
