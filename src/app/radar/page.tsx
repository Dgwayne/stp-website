import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Radar — Spotter Tools Pro",
  description:
    "Real-time NEXRAD Level 2 radar decoding, the full TDWR terminal-radar network, composite mosaic, full animation transport, custom GR2Analyst-style color tables, and storm cell picker — on iOS and Android.",
  openGraph: {
    title: "Spotter Tools Pro — Radar",
    description:
      "NEXRAD Level 2 BR/BV/CC, composite mosaic, animation, and custom .pal color tables.",
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
    id: "level-2",
    eyebrow: "Single-Site Radar",
    title: "NEXRAD Level 2, decoded on-device",
    body: [
      "Spotter Tools Pro decodes raw NEXRAD Level 2 archive files directly on your phone — no third-party tile server in between, and no degraded composite resolution.",
      "Pick a WSR-88D site (or let the app choose the closest one) and view three products at full radial resolution.",
    ],
    bullets: [
      "Reflectivity (BR) — base reflectivity for precipitation intensity",
      "Velocity (BV) — base velocity for rotation and outflow",
      "Correlation Coefficient (CC) — debris signature and hydrometeor class",
    ],
    screenshot: {
      src: "/images/screenshots/radar-br.jpg",
      alt: "Single-site reflectivity",
      caption: "Single-site reflectivity, decoded from raw Level 2",
    },
  },
  {
    id: "velocity",
    eyebrow: "Velocity & CC",
    title: "Rotation, outflow, and debris in one tap",
    body: [
      "Switch between BR, BV, and CC instantly to confirm rotation, mark outflow boundaries, and check for debris signatures during a tornado event — without leaving the map.",
    ],
    screenshot: {
      src: "/images/screenshots/radar-bv.jpg",
      alt: "Single-site velocity",
      caption: "Base velocity for rotation analysis",
    },
    flip: true,
  },
  {
    id: "animation",
    eyebrow: "Animation",
    title: "Full radar transport bar",
    body: [
      "Loop the past several volume scans with the controls you'd expect from a desktop radar app — but built for one-thumb use in the truck.",
    ],
    bullets: [
      "Play / pause and step forward / back frame by frame",
      "Drag the timeline scrubber to any frame in the loop",
      "Pick playback speed — slow walk-throughs or full-pace loops",
      "Pick frame count — short loop or long history",
      "Background frame loading with progress so you know when it's ready",
    ],
  },
  {
    id: "color-tables",
    eyebrow: "Color Tables",
    title: "Sixteen built-in palettes — and your own",
    body: [
      "Spotter Tools Pro ships with sixteen GR2Analyst-style .pal color tables for Reflectivity, Velocity, and Correlation Coefficient.",
      "If you've already got a palette you like, drop the .pal file in and it just works — same parser, same gradient logic.",
    ],
    bullets: [
      "Reflectivity: 2004 LaCrosse, Apocs, Ben, Reflec 1, Viper HD, Macdonald-Emmerson",
      "Velocity: Alpha, A Mix of 2, AWIPS Evans, Force, GRL3 v2, Velocity 1",
      "Correlation Coefficient: AWIPS RHO, KK, CC 1, WKRN Nashville",
      "Import any GR2Analyst-format .pal file from device storage",
      "Per-product selection — different tables for BR, BV, and CC at the same time",
    ],
    screenshot: {
      src: "/images/screenshots/radar-pal-picker.jpg",
      alt: "Color table picker",
      caption: "Built-in and user-imported .pal color tables",
    },
    flip: true,
  },
  {
    id: "overlay",
    eyebrow: "Power-User Controls",
    title: "Overlay opacity, clutter masks, and gate filters",
    body: [
      "Tune the radar overlay to match the way you read radar — without compromising defaults that already work for most spotters.",
    ],
    bullets: [
      "Overlay opacity slider so the basemap stays legible underneath",
      "Reflectivity clutter mask to surface ground clutter, AP, and biologicals when you want them",
      "Velocity clutter mask off by default — preserves debris signatures the way RadarOmega does",
      "Per-product gate filters for Reflectivity, Velocity, and Correlation Coefficient",
    ],
    screenshot: {
      src: "/images/screenshots/radar-overlay.jpg",
      alt: "Radar overlay settings — opacity, clutter masks, gate filters",
      caption: "Opacity, clutter masks, and per-product gate filters",
    },
  },
  {
    id: "cell-picker",
    eyebrow: "Storm Cell Picker",
    title: "Tap a cell, see the numbers",
    body: [
      "Tap any storm cell on the radar to read its identifier and key attributes — useful for cross-referencing the cell against an SPC mesoscale discussion or warning text.",
    ],
  },
  {
    id: "composite",
    eyebrow: "Composite",
    title: "CONUS mosaic for the big picture",
    body: [
      "When you're trying to spot the next play across the Plains, the single-site view is the wrong tool. Toggle the composite radar layer for a full-CONUS reflectivity mosaic with selectable sources.",
      "Composite and single-site can run side by side — single-site for tactical analysis, composite for situational awareness.",
    ],
    screenshot: {
      src: "/images/screenshots/home-map.jpg",
      alt: "Composite radar mosaic over the southeast US",
      caption: "CONUS composite mosaic across multiple sites",
    },
    flip: true,
  },
];

export default function RadarPage() {
  return (
    <main className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Radar"
          title="Real radar, not a screenshot"
          description="NEXRAD Level 2 decoded directly on your phone, a CONUS composite for the big picture, a full animation transport, and color tables you can swap or import."
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
                        <span aria-hidden className="text-brand-teal">
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
            <span className="gradient-text">More than just radar</span>
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted">
            Pair the radar with smart push alerts that fire even when the app
            is closed, full NWS / SPC overlays, and one-tap severe weather
            reporting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange-dim"
            >
              Smart push alerts <span aria-hidden>&rarr;</span>
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
