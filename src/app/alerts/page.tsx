import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Alerts — Spotter Tools Pro",
  description:
    "Smart on-device NWS alert watcher with custom watch zones, outbreak mode, full-screen tornado-emergency takeover, custom sounds and flash colors, mesoscale discussions, and convective outlooks.",
  openGraph: {
    title: "Spotter Tools Pro — Alerts",
    description:
      "Smart push alerts, NWS warnings & watches, SPC mesoscale discussions, and convective outlooks.",
    type: "website",
    images: [{ url: "/images/stp-logo.png", width: 1024, height: 1024 }],
  },
};

type Block = {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  bullets?: string[];
  screenshot?: { src: string; alt: string; caption: string };
  flip?: boolean;
};

const blocks: Block[] = [
  {
    id: "watcher",
    eyebrow: "Background Watcher",
    title: "Alerts that fire even when the app is closed",
    body: [
      "A foreground service runs an on-device NWS alert watcher — independent of the beacon — so warnings still post to your notification tray and lock screen even when Spotter Tools Pro isn't on screen.",
      "There's no cloud account, no backend pushing alerts to your phone. The app polls the NWS feed directly and matches alerts against your zones locally.",
    ],
    bullets: [
      "On-device polling — no server account, no middleman",
      "Independent of the GPS beacon — run either or both",
      "Diagnostics card so you can confirm it's actually running",
    ],
  },
  {
    id: "zones",
    eyebrow: "Watch Zones",
    title: "Watch the places that matter",
    body: [
      "Configure as many watch zones as you need — your moving GPS location, a fixed home zone, or any number of NWS counties / forecast zones.",
      "When you toggle alerts on for the first time, the app seeds your zones with your current location so the feature is useful immediately.",
    ],
    bullets: [
      "Current Location — moves with you while the beacon is active",
      "Fixed point or radius — perfect for home, family, or chase op-center",
      "County / forecast zone picker — pull-to-refresh list of NWS zones",
      "Combine zones — alerts fire when any of them is hit",
    ],
    flip: true,
  },
  {
    id: "filter-modes",
    eyebrow: "Filter Modes",
    title: "Standard, Outbreak, or PDS-only",
    body: [
      "Three filter modes, switchable from a single card:",
    ],
    bullets: [
      "Standard mode — fires for every event type you've enabled, scoped to your zones",
      "Outbreak mode — active-event focus on Tornado and Severe Thunderstorm warnings with graded confidence and damage thresholds",
      "PDS / Emergency only — quietest mode, fires only for Particularly Dangerous Situation warnings and Tornado Emergencies",
      "Per-event toggles for watches, mesoscale discussions, and more",
    ],
    screenshot: {
      src: "/images/screenshots/alert-filter-modes.jpg",
      alt: "Filter mode picker — Standard, Outbreak, PDS / Emergency only",
      caption: "Three filter modes — pick the noise level you can live with",
    },
  },
  {
    id: "sound-flash",
    eyebrow: "Sound & Flash",
    title: "Sounds and colors you'll actually notice",
    body: [
      "A tornado warning shouldn't feel like a hail-size advisory. Customize the audio and visual cues so the most dangerous tier is unmistakable.",
    ],
    bullets: [
      "Bundled severe-alert tone, plus stock system sound options",
      "Optional Do Not Disturb override for the highest tiers",
      "Per-tier flash colors so a tornado warning never looks like a flood advisory",
    ],
    screenshot: {
      src: "/images/screenshots/alert-flash-color.jpg",
      alt: "Flash color picker",
      caption: "Custom flash colors per alert tier",
    },
  },
  {
    id: "tornado-emergency",
    eyebrow: "Tornado Emergency",
    title: "Alarm-style takeover for life-threatening alerts",
    body: [
      "On Android 14+, opt in to a full-screen intent for Tornado Emergencies and PDS warnings. The notification wakes the screen and opens an alarm-style takeover even on a locked device — built specifically for the events most likely to kill someone.",
      "It is opt-in, prompted once when you enable alerts, and only ever fires for the very top alert tiers.",
    ],
  },
  {
    id: "warnings-overlay",
    eyebrow: "Map Overlay",
    title: "Warnings, watches, and detail sheets",
    body: [
      "Every active NWS warning, watch, advisory, and statement is also drawn on the map as a polygon, with full detail on tap.",
    ],
    bullets: [
      "Tornado, severe thunderstorm, flash flood, and fire warnings as polygons",
      "Tornado and severe thunderstorm watch boxes",
      "Tap any polygon for the full NWS product text and threat info",
      "An alert disambiguation sheet when polygons overlap so you can pick the one you meant",
    ],
    flip: true,
  },
  {
    id: "spc",
    eyebrow: "SPC Products",
    title: "Mesoscale discussions and convective outlooks",
    body: [
      "Spotter Tools Pro pulls the SPC products you actually use during severe weather and renders them as toggleable map layers with full detail sheets.",
    ],
    bullets: [
      "Mesoscale Discussions — short-fuse SPC forecast areas with full text",
      "Day 1 / Day 2 Convective Outlooks — Categorical, Tornado, Wind, and Hail",
      "Today's SPC tornado, hail, and damaging-wind reports as map markers",
      "Optional notification when a new MCD is posted that overlaps your zones",
    ],
    screenshot: {
      src: "/images/screenshots/alert-outlook-day1.jpg",
      alt: "SPC Day 1 categorical outlook on the map",
      caption: "Day 1 Categorical outlook polygons drawn on the map",
    },
  },
  {
    id: "spc-detail",
    eyebrow: "SPC Detail",
    title: "Tap a risk area for the full SPC text",
    body: [
      "Outlook polygons are interactive — tap any one to read the full SPC discussion, issue/valid/expires times, the forecaster on duty, and the risk-level legend without leaving the map.",
    ],
    screenshot: {
      src: "/images/screenshots/alert-outlook-detail.jpg",
      alt: "Convective Outlook detail sheet — Enhanced Risk",
      caption: "Per-risk detail with discussion text, times, and forecaster",
    },
    flip: true,
  },
  {
    id: "dashboard",
    eyebrow: "Dashboard",
    title: "Browse every active alert",
    body: [
      "When you want the full picture instead of just what's overhead, the Alerts dashboard lists every active NWS alert nationwide with type / severity filters and one-tap detail.",
    ],
    bullets: [
      "Severity chips — Extreme, Severe, Moderate, Minor",
      "Per-event-type chips — Tornado, Severe T-Storm, Flood, and more",
      "Time-remaining countdowns on every alert",
      "One-tap zoom-to-polygon for any alert in the list",
    ],
    screenshot: {
      src: "/images/screenshots/alert-detail-sheet.jpg",
      alt: "Alerts dashboard with severity filters",
      caption: "Full alerts dashboard with severity and type filters",
    },
  },
];

export default function AlertsPage() {
  return (
    <main className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Smart Alerts"
          title="The alerts page chasers actually want"
          description="A real on-device watcher with watch zones, outbreak mode, custom sounds and colors, and full-screen tornado-emergency takeover — plus every NWS and SPC product on the map."
        />

        <div className="space-y-24">
          {blocks.map((b) => (
            <section
              key={b.id}
              id={b.id}
              className={`scroll-mt-24 grid gap-10 lg:items-center ${
                b.screenshot
                  ? b.flip
                    ? "lg:grid-cols-[300px_1fr]"
                    : "lg:grid-cols-[1fr_300px]"
                  : ""
              }`}
            >
              {b.screenshot && b.flip ? (
                <figure>
                  <div className="phone-frame mx-auto">
                    <Image
                      src={b.screenshot.src}
                      alt={b.screenshot.alt}
                      width={440}
                      height={960}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs text-muted">
                    {b.screenshot.caption}
                  </figcaption>
                </figure>
              ) : null}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
                  {b.eyebrow}
                </p>
                <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                  {b.title}
                </h2>
                <div className="space-y-3 text-muted">
                  {b.body.map((p, i) => (
                    <p key={i} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {b.bullets ? (
                  <ul className="mt-5 space-y-2 text-sm text-muted">
                    {b.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 rounded-lg border border-white/5 bg-surface px-4 py-2.5"
                      >
                        <span aria-hidden className="text-brand-orange">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {b.screenshot && !b.flip ? (
                <figure>
                  <div className="phone-frame mx-auto">
                    <Image
                      src={b.screenshot.src}
                      alt={b.screenshot.alt}
                      width={440}
                      height={960}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs text-muted">
                    {b.screenshot.caption}
                  </figcaption>
                </figure>
              ) : null}
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 rounded-2xl border border-white/10 bg-surface p-8 text-center sm:p-12">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            <span className="gradient-text">Pair alerts with the radar</span>
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted">
            Smart push alerts get you to the map. Single-site Level 2 radar,
            full animation, and custom color tables get you what you need once
            you&apos;re there.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/radar"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange-dim"
            >
              Radar deep-dive <span aria-hidden>&rarr;</span>
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition-all hover:border-white/30 hover:bg-white/5"
            >
              All features
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
