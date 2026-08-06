"use client";

import { useState, type FormEvent } from "react";

// ── Types (loose mirrors of the Worker's /admin/stats payload) ─────────

type Totals = {
  installs_total: number;
  sessions_total: number;
  first_row_at: number | null;
};
type Window_ = {
  installs: number;
  sessions: number;
  avg_secs: number | null;
  max_rss: number | null;
  died_sessions?: number | null;
};
type DailyRow = {
  day: string;
  sessions: number;
  installs: number;
  new_installs: number;
  android_sessions: number;
  ios_sessions: number;
};
type VersionRow = {
  platform: string;
  app_version: string;
  sessions: number;
  installs: number;
  last_seen?: number;
};
type FeatureRow = {
  key: string;
  total: number;
  installs: number;
  sessions: number;
};
type LayerRow = { layer: string; installs: number; sessions: number };
type DeviceRow = {
  device_model: string;
  device_marketing: string | null;
  manufacturer: string | null;
  platform: string;
  sessions: number;
  installs: number;
  ram_mb: number | null;
  avg_rss: number | null;
  max_rss: number | null;
  jank_ratio: number | null;
};
type PerfRow = {
  platform: string;
  app_version: string;
  sessions: number;
  avg_rss: number | null;
  max_rss: number | null;
  jank_ratio: number | null;
  severe_ratio: number | null;
  worst_frame_ms: number | null;
  mem_pressure: number | null;
  max_quads: number | null;
};
type ComboRow = {
  combo: string;
  sessions: number;
  avg_rss: number;
  max_rss: number;
};
type RetentionRow = {
  week_start: string;
  installs: number;
  d1: number;
  d7: number;
  d30: number;
};
type CountryRow = { country: string | null; installs: number; sessions: number };
type RegionRow = {
  country: string | null;
  region: string | null;
  installs: number;
  sessions: number;
};
type DiedRow = {
  received_at: number;
  platform: string | null;
  app_version: string | null;
  device_model: string | null;
  device_marketing: string | null;
  peak_rss_mb: number | null;
  session_seconds: number | null;
  layers_at_peak: string | null;
  rss_curve: string | null;
  memory_pressure_events: number | null;
};
type HourRow = { hour: number; sessions: number };
type GoDarkRow = {
  install_id: string;
  sessions: number;
  first_seen: number;
  last_seen: number;
  country: string | null;
  platform: string | null;
  last_version: string | null;
  device: string | null;
};
type RecentRow = {
  session_id: string;
  install_id: string;
  received_at: number;
  platform: string | null;
  app_version: string | null;
  device_marketing: string | null;
  device_model: string | null;
  country: string | null;
  session_seconds: number | null;
  cold_start: number | null;
  is_first_launch: number | null;
  peak_rss_mb: number | null;
  jank_frames: number | null;
  frames_total: number | null;
  worst_frame_ms: number | null;
  features: string | null;
  layers_used: string | null;
  rss_curve: string | null;
  connectivity: string | null;
  end_reason: string | null;
  startup_ms: number | null;
  region: string | null;
  beacon_on: number | null;
  alertwatch_on: number | null;
  signed_in: number | null;
};
type Stats = {
  generated_at: number;
  seed_rows: number;
  totals: Totals;
  w7: Window_;
  w7_prev: Window_ | null;
  w30: Window_;
  daily: DailyRow[];
  versions: VersionRow[];
  current_versions: VersionRow[];
  features: FeatureRow[];
  features_w7: FeatureRow[];
  layers: LayerRow[];
  devices: DeviceRow[];
  perf_by_version: PerfRow[];
  heavy_combos: ComboRow[];
  rss_percentiles: Record<
    string,
    { n: number; p50: number; p90: number; p95: number; max: number }
  >;
  retention: RetentionRow[];
  countries: CountryRow[];
  regions: RegionRow[];
  startup_percentiles: Record<string, { n: number; p50: number; p95: number; max: number }>;
  died_sessions: DiedRow[];
  hours: HourRow[];
  go_dark: GoDarkRow[];
  recent: RecentRow[];
};

// ── Small formatting helpers ───────────────────────────────────────────

const inputCls =
  "w-full rounded-md bg-surface-light border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-teal";

const fmtInt = (n: number | null | undefined) =>
  n == null ? "—" : Math.round(n).toLocaleString();
const fmtPct = (r: number | null | undefined) =>
  r == null ? "—" : `${(r * 100).toFixed(r >= 0.1 ? 0 : 1)}%`;
const fmtSecs = (s: number | null | undefined) => {
  if (s == null) return "—";
  const m = Math.round(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
};
const fmtWhen = (ms: number | null | undefined) =>
  ms == null
    ? "—"
    : new Date(ms).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
const fmtAgo = (ms: number) => {
  const d = Math.floor((Date.now() - ms) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "1 day ago";
  return `${d} days ago`;
};
const safeJson = <T,>(s: string | null | undefined, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

// Counter-key prefixes -> leaderboard groups.
const GROUPS: [string, string][] = [
  ["feature_", "Features"],
  ["radar_product_", "Radar products"],
  ["radar_site_", "Radar sites"],
  ["model_product_", "Model products"],
  ["model_", "Models"],
  ["sat_product_", "Satellite products"],
  ["mrms_", "MRMS products"],
  ["outlook_", "Outlooks"],
  ["cam_state_", "Camera states"],
];
function groupFeatures(rows: FeatureRow[]) {
  const grouped = new Map<string, { label: string; rows: FeatureRow[] }>();
  for (const row of rows) {
    const hit = GROUPS.find(([p]) => row.key.startsWith(p));
    const label = hit ? hit[1] : "Other counters";
    const short = hit ? row.key.slice(hit[0].length) : row.key;
    const g = grouped.get(label) ?? { label, rows: [] };
    g.rows.push({ ...row, key: short });
    grouped.set(label, g);
  }
  const order = [...GROUPS.map((g) => g[1]), "Other counters"];
  return order
    .filter((l) => grouped.has(l))
    .map((l) => grouped.get(l)!)
    .map((g) => ({ ...g, rows: g.rows.slice(0, 15) }));
}

function delta(now: number, prev: number | null | undefined): string {
  if (!prev) return now > 0 ? "new" : "flat";
  const d = ((now - prev) / prev) * 100;
  if (Math.abs(d) < 1) return "flat";
  return `${d > 0 ? "up" : "down"} ${Math.abs(d).toFixed(0)}% vs last week`;
}

function prettyKey(k: string): string {
  const hit = GROUPS.find(([p2]) => k.startsWith(p2));
  return (hit ? k.slice(hit[0].length) : k).replace(/_/g, " ");
}

/** Plain-English week-over-week summary computed from the payload. */
function SummaryCard({ s }: { s: Stats }) {
  const prev = s.w7_prev;
  const last7 = s.daily.slice(-8, -1);
  const newInstalls = last7.reduce((a, d) => a + d.new_installs, 0);
  const died = s.w7.died_sessions ?? 0;
  const startA = s.startup_percentiles?.["android"];
  const week = new Set(s.features_w7.map((f) => f.key));
  const top = s.features_w7.slice(0, 3).map((f) => prettyKey(f.key));
  const quiet = s.features
    .filter((f) => f.installs >= 2 && !week.has(f.key))
    .slice(0, 4)
    .map((f) => prettyKey(f.key));
  const line = "flex items-baseline gap-2 text-sm";
  const num = "font-bold text-foreground";
  return (
    <section className="mb-6 rounded-xl border border-brand-teal/30 bg-surface-light/50 p-5 md:col-span-2">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-teal">
        This week at a glance
      </h2>
      <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
        <div className={line}>
          <span className={num}>{fmtInt(s.w7.sessions)}</span>
          <span className="text-muted">
            sessions ({delta(s.w7.sessions, prev?.sessions)})
          </span>
        </div>
        <div className={line}>
          <span className={num}>{fmtInt(s.w7.installs)}</span>
          <span className="text-muted">
            active users ({delta(s.w7.installs, prev?.installs)})
          </span>
        </div>
        <div className={line}>
          <span className={num}>{fmtInt(newInstalls)}</span>
          <span className="text-muted">new installs this week</span>
        </div>
        <div className={line}>
          <span className={died > 0 ? "font-bold text-red-300" : num}>
            {fmtInt(died)}
          </span>
          <span className="text-muted">
            died sessions ({delta(died, prev?.died_sessions ?? 0)})
          </span>
        </div>
        <div className={line}>
          <span className={num}>{fmtSecs(s.w7.avg_secs)}</span>
          <span className="text-muted">
            avg session ({delta(s.w7.avg_secs ?? 0, prev?.avg_secs)})
          </span>
        </div>
        <div className={line}>
          <span className={num}>
            {startA ? `${(startA.p50 / 1000).toFixed(1)}s` : "—"}
          </span>
          <span className="text-muted">median cold start (Android)</span>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-xs text-muted">
        <p>
          <span className="font-semibold text-foreground">Top this week:</span>{" "}
          {top.length ? top.join(", ") : "no feature use recorded yet"}
        </p>
        {quiet.length ? (
          <p>
            <span className="font-semibold text-foreground">Went quiet</span>{" "}
            (used in the last 30d, not this week): {quiet.join(", ")}
          </p>
        ) : null}
      </div>
    </section>
  );
}

// ── Tiny presentational pieces ─────────────────────────────────────────

function Card({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-surface-light/50 p-5 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-light/50 p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-muted">{sub}</div> : null}
    </div>
  );
}

function BarList({
  rows,
  max,
}: {
  rows: { label: string; value: number; sub?: string }[];
  max?: number;
}) {
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 text-xs">
          <div className="w-40 shrink-0 truncate text-muted" title={r.label}>
            {r.label}
          </div>
          <div className="h-4 flex-1 overflow-hidden rounded bg-white/5">
            <div
              className="h-full rounded bg-brand-teal/70"
              style={{ width: `${Math.max(2, (r.value / m) * 100)}%` }}
            />
          </div>
          <div className="w-14 shrink-0 text-right font-medium text-foreground">
            {fmtInt(r.value)}
          </div>
          {r.sub ? (
            <div className="w-16 shrink-0 text-right text-muted">{r.sub}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Dual-line daily chart (sessions + unique installs) with new-install bars. */
function DailyChart({ daily }: { daily: DailyRow[] }) {
  const W = 640;
  const H = 180;
  const PAD = 24;
  if (daily.length === 0) return <p className="text-sm text-muted">No data yet.</p>;
  const maxSess = Math.max(1, ...daily.map((d) => d.sessions));
  const x = (i: number) =>
    PAD + (i * (W - PAD * 2)) / Math.max(1, daily.length - 1);
  const y = (v: number) => H - PAD - (v / maxSess) * (H - PAD * 2);
  const line = (pick: (d: DailyRow) => number) =>
    daily.map((d, i) => `${x(i).toFixed(1)},${y(pick(d)).toFixed(1)}`).join(" ");
  const barW = Math.max(2, ((W - PAD * 2) / daily.length) * 0.5);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[480px] w-full">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD}
              x2={W - PAD}
              y1={y(maxSess * f)}
              y2={y(maxSess * f)}
              stroke="currentColor"
              className="text-white/10"
              strokeWidth="1"
            />
            <text
              x={4}
              y={y(maxSess * f) + 3}
              className="fill-current text-muted"
              fontSize="9"
            >
              {Math.round(maxSess * f)}
            </text>
          </g>
        ))}
        {daily.map((d, i) => (
          <rect
            key={d.day}
            x={x(i) - barW / 2}
            y={y(d.new_installs)}
            width={barW}
            height={H - PAD - y(d.new_installs)}
            className="fill-current text-white/20"
          />
        ))}
        <polyline
          points={line((d) => d.sessions)}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="2"
        />
        <polyline
          points={line((d) => d.installs)}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
        />
        <text x={PAD} y={12} fontSize="10" className="fill-current text-muted">
          — sessions (teal) · unique users (purple) · new installs (bars) ·{" "}
          {daily[0].day} → {daily[daily.length - 1].day}
        </text>
      </svg>
    </div>
  );
}

function Spark({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const W = 120;
  const H = 28;
  const max = Math.max(...values, 1);
  const pts = values
    .map(
      (v, i) =>
        `${((i * W) / (values.length - 1)).toFixed(1)},${(
          H -
          (v / max) * (H - 4) -
          2
        ).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-[120px]">
      <polyline points={pts} fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
    </svg>
  );
}

const th = "py-2 pr-3 text-left text-xs font-semibold text-muted";
const td = "py-1.5 pr-3 text-xs text-foreground";

// ── The dashboard ──────────────────────────────────────────────────────

export default function TelemetryDashboard() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          res.status === 401
            ? "Wrong password."
            : `Could not load (${res.status}): ${data?.error ?? "unknown"}`,
        );
        return;
      }
      setStats(data as Stats);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (!stats) {
    return (
      <main className="mx-auto max-w-sm px-6 pt-32 pb-20">
        <h1 className="mb-2 text-2xl font-bold">Telemetry</h1>
        <p className="mb-6 text-sm text-muted">
          Enter the admin password to continue.
        </p>
        <form onSubmit={load} className="space-y-4">
          <input
            type="password"
            className={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
          />
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-md bg-brand-teal px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {busy ? "Loading…" : "Unlock"}
          </button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </main>
    );
  }

  const s = stats;
  const groups = groupFeatures(s.features);
  const avgSessPerUser7 =
    s.w7.installs > 0 ? (s.w7.sessions / s.w7.installs).toFixed(1) : "—";
  const rssA = s.rss_percentiles["android"];
  const rssI = s.rss_percentiles["ios"];
  const startA = s.startup_percentiles?.["android"];
  const startI = s.startup_percentiles?.["ios"];

  return (
    <main className="mx-auto max-w-6xl px-6 pt-28 pb-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Telemetry</h1>
          <p className="text-sm text-muted">
            Updated {fmtWhen(s.generated_at)} · physical devices only ·{" "}
            {fmtInt(s.totals.sessions_total)} rows since{" "}
            {s.totals.first_row_at
              ? new Date(s.totals.first_row_at).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {s.seed_rows > 0 ? (
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              {fmtInt(s.seed_rows)} seed rows in data
            </span>
          ) : null}
          <button
            onClick={() => load()}
            disabled={busy}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-foreground disabled:opacity-50"
          >
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <SummaryCard s={s} />

      {/* Stat tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <Tile label="Installs (all time)" value={fmtInt(s.totals.installs_total)} />
        <Tile label="Active users · 7d" value={fmtInt(s.w7.installs)} />
        <Tile label="Active users · 30d" value={fmtInt(s.w30.installs)} />
        <Tile
          label="Sessions · 7d"
          value={fmtInt(s.w7.sessions)}
          sub={`${avgSessPerUser7}/user`}
        />
        <Tile label="Avg session · 30d" value={fmtSecs(s.w30.avg_secs)} />
        <Tile
          label="p95 RSS · 30d"
          value={rssA ? `${fmtInt(rssA.p95)} MB` : "—"}
          sub={rssI ? `iOS ${fmtInt(rssI.p95)} MB` : undefined}
        />
        <Tile
          label="Died sessions · 30d"
          value={fmtInt(s.w30.died_sessions ?? 0)}
          sub="crash/OOM-killed"
        />
        <Tile
          label="Startup p50 · 30d"
          value={startA ? `${(startA.p50 / 1000).toFixed(1)}s` : "—"}
          sub={startI ? `iOS ${(startI.p50 / 1000).toFixed(1)}s` : undefined}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Daily activity (30d)" wide>
          <DailyChart daily={s.daily} />
        </Card>

        <Card title="Retention by weekly cohort">
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Cohort week</th>
                <th className={th}>Installs</th>
                <th className={th}>D1</th>
                <th className={th}>D7</th>
                <th className={th}>D30</th>
              </tr>
            </thead>
            <tbody>
              {s.retention.map((r) => (
                <tr key={r.week_start} className="border-t border-white/5">
                  <td className={td}>{r.week_start}</td>
                  <td className={td}>{fmtInt(r.installs)}</td>
                  <td className={td}>{fmtPct(r.installs ? r.d1 / r.installs : null)}</td>
                  <td className={td}>{fmtPct(r.installs ? r.d7 / r.installs : null)}</td>
                  <td className={td}>{fmtPct(r.installs ? r.d30 / r.installs : null)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-muted">
            Share of each cohort that came back the day after / within 7 / 30
            days of first launch.
          </p>
        </Card>

        <Card title="Version adoption (sessions, 14d)">
          <BarList
            rows={s.versions.map((v) => ({
              label: `${v.platform} ${v.app_version}`,
              value: v.sessions,
              sub: `${fmtInt(v.installs)} users`,
            }))}
          />
          <h3 className="mb-2 mt-4 text-xs font-semibold text-muted">
            Current version per install (60d)
          </h3>
          <BarList
            rows={s.current_versions.map((v) => ({
              label: `${v.platform} ${v.app_version}`,
              value: v.installs,
            }))}
          />
        </Card>

        <Card title="Map layers used (30d, by users)">
          <BarList
            rows={s.layers.map((l) => ({
              label: l.layer,
              value: l.installs,
              sub: `${fmtInt(l.sessions)} sess`,
            }))}
          />
        </Card>

        {groups.map((g) => (
          <Card key={g.label} title={`${g.label} (30d, by users)`}>
            <BarList
              rows={g.rows.map((r) => ({
                label: r.key,
                value: r.installs,
                sub: `×${fmtInt(r.total)}`,
              }))}
            />
          </Card>
        ))}

        <Card title="Devices (30d)" wide>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={th}>Device</th>
                  <th className={th}>Users</th>
                  <th className={th}>Sessions</th>
                  <th className={th}>RAM</th>
                  <th className={th}>Avg RSS</th>
                  <th className={th}>Max RSS</th>
                  <th className={th}>Jank</th>
                </tr>
              </thead>
              <tbody>
                {s.devices.map((d) => (
                  <tr key={d.device_model} className="border-t border-white/5">
                    <td className={td}>
                      {d.device_marketing ?? d.device_model}
                      <span className="ml-1 text-muted">({d.device_model})</span>
                    </td>
                    <td className={td}>{fmtInt(d.installs)}</td>
                    <td className={td}>{fmtInt(d.sessions)}</td>
                    <td className={td}>
                      {d.ram_mb ? `${(d.ram_mb / 1024).toFixed(1)} GB` : "—"}
                    </td>
                    <td className={td}>{fmtInt(d.avg_rss)} MB</td>
                    <td className={td}>{fmtInt(d.max_rss)} MB</td>
                    <td className={td}>{fmtPct(d.jank_ratio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Performance by version (30d)" wide>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={th}>Version</th>
                  <th className={th}>Sessions</th>
                  <th className={th}>Avg RSS</th>
                  <th className={th}>Max RSS</th>
                  <th className={th}>Jank</th>
                  <th className={th}>Severe</th>
                  <th className={th}>Worst frame</th>
                  <th className={th}>Mem pressure</th>
                  <th className={th}>Max quads</th>
                </tr>
              </thead>
              <tbody>
                {s.perf_by_version.map((p) => (
                  <tr
                    key={`${p.platform}-${p.app_version}`}
                    className="border-t border-white/5"
                  >
                    <td className={td}>
                      {p.platform} {p.app_version}
                    </td>
                    <td className={td}>{fmtInt(p.sessions)}</td>
                    <td className={td}>{fmtInt(p.avg_rss)} MB</td>
                    <td className={td}>{fmtInt(p.max_rss)} MB</td>
                    <td className={td}>{fmtPct(p.jank_ratio)}</td>
                    <td className={td}>{fmtPct(p.severe_ratio)}</td>
                    <td className={td}>{fmtInt(p.worst_frame_ms)} ms</td>
                    <td className={td}>{fmtInt(p.mem_pressure)}</td>
                    <td className={td}>{fmtInt(p.max_quads)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Layer combos at peak memory (≥500 MB, 30d)">
          {s.heavy_combos.length === 0 ? (
            <p className="text-sm text-muted">No heavy sessions yet.</p>
          ) : (
            <div className="space-y-2">
              {s.heavy_combos.map((c) => (
                <div key={c.combo} className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground">
                      {safeJson<string[]>(c.combo, []).join(" + ") || "(none)"}
                    </span>
                    <span className="text-muted">
                      {fmtInt(c.sessions)} sess · avg {fmtInt(c.avg_rss)} · max{" "}
                      {fmtInt(c.max_rss)} MB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Sessions by local hour (30d)">
          <BarList
            rows={s.hours.map((h) => ({
              label: `${String(h.hour).padStart(2, "0")}:00`,
              value: h.sessions,
            }))}
          />
        </Card>

        <Card title="US states (30d, edge geo)">
          <BarList
            rows={s.regions
              .filter((r) => r.country === "US")
              .map((r) => ({
                label: r.region ?? "?",
                value: r.installs,
                sub: `${fmtInt(r.sessions)} sess`,
              }))}
          />
          <p className="mt-2 text-[11px] text-muted">
            Derived from the network connection at the CDN edge — the app
            never sends location. Mobile-carrier geolocation can be off by
            a metro or two.
          </p>
        </Card>

        <Card title="Died sessions (30d)" wide>
          {s.died_sessions.length === 0 ? (
            <p className="text-sm text-muted">
              None — no session has ended in a crash or OOM kill.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className={th}>When</th>
                    <th className={th}>Device</th>
                    <th className={th}>Version</th>
                    <th className={th}>Peak RSS</th>
                    <th className={th}>Lasted</th>
                    <th className={th}>Layers at peak</th>
                    <th className={th}>RSS curve</th>
                  </tr>
                </thead>
                <tbody>
                  {s.died_sessions.map((d2) => (
                    <tr
                      key={`${d2.received_at}-${d2.device_model}`}
                      className="border-t border-white/5"
                    >
                      <td className={td}>{fmtWhen(d2.received_at)}</td>
                      <td className={td}>
                        {d2.device_marketing ?? d2.device_model ?? "—"}
                      </td>
                      <td className={td}>
                        {d2.platform} {d2.app_version}
                      </td>
                      <td className={td}>{fmtInt(d2.peak_rss_mb)} MB</td>
                      <td className={td}>{fmtSecs(d2.session_seconds)}</td>
                      <td className={td}>
                        {safeJson<string[]>(d2.layers_at_peak, []).join(" + ") || "—"}
                      </td>
                      <td className={td}>
                        <Spark values={safeJson<number[]>(d2.rss_curve, [])} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-2 text-[11px] text-muted">
            Sessions whose process was killed before a clean exit —
            recovered from the on-device checkpoint at next launch. These
            are the rows crash-survivorship used to hide.
          </p>
        </Card>

        <Card title="Countries (30d)">
          <BarList
            rows={s.countries.map((c) => ({
              label: c.country ?? "unknown",
              value: c.installs,
              sub: `${fmtInt(c.sessions)} sess`,
            }))}
          />
        </Card>

        <Card title="Gone quiet (≥2 sessions, silent 3–60d)">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr>
                  <th className={th}>Install</th>
                  <th className={th}>Device</th>
                  <th className={th}>Cty</th>
                  <th className={th}>Sessions</th>
                  <th className={th}>Last seen</th>
                  <th className={th}>Version</th>
                </tr>
              </thead>
              <tbody>
                {s.go_dark.map((g) => (
                  <tr key={g.install_id} className="border-t border-white/5">
                    <td className={td}>{g.install_id.slice(0, 8)}…</td>
                    <td className={td}>{g.device ?? "—"}</td>
                    <td className={td}>{g.country ?? "—"}</td>
                    <td className={td}>{fmtInt(g.sessions)}</td>
                    <td className={td}>{fmtAgo(g.last_seen)}</td>
                    <td className={td}>{g.last_version ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Candidates for refund correlation: match last-seen dates against
            store refund reports (self-service window is ~48 h).
          </p>
        </Card>

        <Card title="Recent sessions" wide>
          <div className="space-y-1">
            {s.recent.map((r) => {
              const feats = safeJson<Record<string, number>>(r.features, {});
              const layers = safeJson<string[]>(r.layers_used, []);
              const curve = safeJson<number[]>(r.rss_curve, []);
              const jank =
                r.frames_total && r.jank_frames != null
                  ? r.jank_frames / Math.max(1, r.frames_total)
                  : null;
              return (
                <details
                  key={r.session_id}
                  className="rounded-md border border-white/5 px-3 py-2"
                >
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="text-muted">{fmtWhen(r.received_at)}</span>
                    <span className="font-medium text-foreground">
                      {r.device_marketing ?? r.device_model ?? "unknown"}
                    </span>
                    <span className="text-muted">
                      {r.platform} {r.app_version} · {r.country ?? "—"} ·{" "}
                      {fmtSecs(r.session_seconds)} · {fmtInt(r.peak_rss_mb)} MB ·
                      jank {fmtPct(jank)}
                    </span>
                    {r.is_first_launch ? (
                      <span className="rounded bg-brand-teal/20 px-1.5 text-[10px] text-brand-teal">
                        first launch
                      </span>
                    ) : null}
                    {r.cold_start ? (
                      <span className="rounded bg-white/10 px-1.5 text-[10px] text-muted">
                        cold
                      </span>
                    ) : null}
                    {r.end_reason === "died" ? (
                      <span className="rounded bg-red-400/20 px-1.5 text-[10px] text-red-300">
                        died
                      </span>
                    ) : null}
                    {r.startup_ms ? (
                      <span className="text-muted">
                        boot {(r.startup_ms / 1000).toFixed(1)}s
                      </span>
                    ) : null}
                  </summary>
                  <div className="mt-2 flex flex-wrap items-start gap-4 text-[11px] text-muted">
                    <div>
                      <span className="font-semibold">layers:</span>{" "}
                      {layers.join(", ") || "—"}
                    </div>
                    <div className="max-w-md">
                      <span className="font-semibold">counters:</span>{" "}
                      {Object.entries(feats)
                        .map(([k, v]) => `${k}×${v}`)
                        .join(", ") || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">flags:</span>{" "}
                      {[
                        r.beacon_on ? "beacon" : null,
                        r.alertwatch_on ? "alertwatch" : null,
                        r.signed_in ? "signed-in" : null,
                        r.connectivity,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </div>
                    {curve.length > 1 ? (
                      <div>
                        <span className="font-semibold">RSS:</span>{" "}
                        <Spark values={curve} />
                      </div>
                    ) : null}
                  </div>
                </details>
              );
            })}
          </div>
        </Card>
      </div>
    </main>
  );
}
