import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Radar | Spotter Tools Pro",
  description:
    "3D storm volumes you can fly around, real-time NEXRAD Level 2 decoding, the full TDWR terminal-radar network, composite mosaic, a radar archive to the 1990s, custom GR2Analyst-style color tables and storm cell picker, on iOS, Android and Windows.",
  openGraph: {
    title: "Spotter Tools Pro | Radar",
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
      "Spotter Tools Pro decodes raw NEXRAD Level 2 archive files directly on your phone, no third-party tile server in between, and no degraded composite resolution.",
      "Pick a WSR-88D site (or let the app choose the closest one) and view three products at full radial resolution.",
    ],
    bullets: [
      "Reflectivity (BR), base reflectivity for precipitation intensity",
      "Velocity (BV), base velocity for rotation and outflow",
      "Correlation Coefficient (CC), debris signature and hydrometeor class",
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
      "Switch between BR, BV, and CC instantly to confirm rotation, mark outflow boundaries, and check for debris signatures during a tornado event, without leaving the map.",
    ],
    screenshot: {
      src: "/images/screenshots/radar-bv.jpg",
      alt: "Single-site velocity",
      caption: "Base velocity for rotation analysis",
    },
    flip: true,
  },
  {
    id: "volume-3d",
    eyebrow: "3D Storm Volume",
    title: "The whole scan, standing up",
    body: [
      "Radar has always been a flat slice. Turn the volume on and every tilt of the Level 2 scan is resampled into a single solid you can fly around, so you read how a storm is built instead of inferring it one elevation at a time.",
      "Two ways in, and it follows whichever layer you are on: your own site's volume for one storm in full detail, or the nationwide mosaic at about a two minute cadence so you are not tied to one radar's umbrella. Each carries its own opacity, so the mosaic can stay sheer for context while your site's radar stays solid on top.",
      "Our servers build the volume and send it down ready to draw, so it appears almost immediately rather than after your phone has ground through a full scan. If no prepared volume exists for your site, the app quietly builds one locally as before.",
    ],
    bullets: [
      "Debris and rotation marked inside the storm, not hidden in a couplet you have to find",
      "Opacity follows rain rate, so heavy cores stay solid and light rain goes sheer",
      "Height is yours to set, including true scale for real proportions",
      "It plays with the loop, so you watch a storm build and collapse in three dimensions",
      "Renders at whatever resolution keeps your device smooth, dropping detail before frames",
    ],
    screenshot: {
      src: "/images/v170/volume-3d.jpg",
      alt: "Storm cells rendered as a 3D volume above the map",
      caption: "The Level 2 volume, orbited around a line of storms",
    },
  },
  {
    id: "instant-l2",
    eyebrow: "Instant Level 2",
    title: "Tap a site, get the real scan",
    body: [
      "Level 2 used to mean waiting on a full scan download before anything appeared on screen. Six products now paint in about a second: reflectivity, velocity, correlation coefficient, spectrum width, storm relative velocity and normalized rotation.",
      "The scan time and VCP are printed on the panel, so you always know how old what you are looking at really is. Opening a site paints the real Level 2 data rather than standing in a Level III picture that can be a minute older.",
      "Nothing about it can leave you worse off. If the fast lane is slow or unavailable, the app falls back to the full on-device decode it always did.",
    ],
    screenshot: {
      src: "/images/v170/instant-l2.jpg",
      alt: "Level 2 velocity with a tornadic couplet and the scan time readout",
      caption: "Level 2 velocity, one minute old, with the VCP printed on the panel",
    },
    flip: true,
  },
  {
    id: "animation",
    eyebrow: "Animation",
    title: "Full radar transport bar",
    body: [
      "Loop the past several volume scans with the controls you'd expect from a desktop radar app, but built for one-thumb use in the truck.",
      "Deep loops are held compactly and expanded only as each frame is shown, so a long loop fits in memory, loads faster and plays smoothly instead of being thinned down to a handful of frames.",
    ],
    bullets: [
      "Play / pause and step forward / back frame by frame",
      "Drag the timeline scrubber to any frame in the loop",
      "Pick playback speed, slow walk-throughs or full-pace loops",
      "Pick frame count, up to about eight hours of Level III history",
      "Background frame loading with progress so you know when it's ready",
      "Optional FastScan sweep: a beam-reveal animation with range rings and live pipeline chips",
    ],
  },
  {
    id: "archive",
    eyebrow: "Radar Archive",
    title: "Scrub back to any date and time",
    body: [
      "The map has a second clock. Pick a date and a time and the radar loads as it was at that instant, so you can walk back through an event you missed or study one you did not.",
      "Storm cell tracks and mesocyclone markers load at the same instant, and an amber banner with a Return to Live button rides the top of the map so you always know which clock you are on.",
    ],
    bullets: [
      "Level III back to May 1992, keeping its full loop depth",
      "Level 2 back to June 1991, with the download size shown before you spend it",
      "Enter the time in Local, UTC, Eastern, Central, Mountain, Arizona, Pacific, Alaska or Hawaii, and it converts for you",
      "A same-moment line cross references UTC and your own zone, with the date, so a lookup that rolled past midnight is obvious",
      "Storm-relative velocity, the cross section and the wind profile all follow the archived clock rather than today's",
      "Layers with no history switch off rather than sitting on live data under a past-tense banner",
      "Loops build about a third faster than they used to and start playing sooner: a cold two hour Level 2 loop went from about two and a half minutes to about a minute and forty",
      "Each frame downloads only the part of the file it needs and unpacks only the tilt it paints, rather than the whole scan",
      "Phones with memory to spare keep more of the loop instead of thinning a two hour loop down to a handful of frames",
    ],
  },
  {
    id: "loop-share",
    eyebrow: "Share",
    title: "Send a loop out of the app",
    body: [
      "Record the loop that is on screen and hand it straight to the share sheet, so a chase loop can reach a net, a group chat or a post without a screen recorder.",
    ],
    bullets: [
      "GIF or MP4, on Android, iOS and Windows",
      "Single-site radar, the national composite, satellite, weather models and air quality",
      "Pick an output size and see the estimated file size before you commit, up to a new XL at 1440 pixels for a desktop-sized map",
      "Roughly three times the bitrate at the same size setting, so a shared loop holds up instead of smearing",
      "Product, site and time burned into every frame, so the loop still says what it is",
      "The 3D volume comes with it, so what you share is what you were looking at",
      "Encoding runs off the main thread, so the app keeps working while it renders",
    ],
  },
  {
    id: "color-tables",
    eyebrow: "Color Tables",
    title: "Sixteen built-in palettes, and your own",
    body: [
      "Spotter Tools Pro ships with sixteen GR2Analyst-style .pal color tables for Reflectivity, Velocity, and Correlation Coefficient.",
      "If you've already got a palette you like, drop the .pal file in and it just works, same parser, same gradient logic.",
    ],
    bullets: [
      "Reflectivity: 2004 LaCrosse, Apocs, Ben, Reflec 1, Viper HD, Macdonald-Emmerson",
      "Velocity: Alpha, A Mix of 2, AWIPS Evans, Force, GRL3 v2, Velocity 1",
      "Correlation Coefficient: AWIPS RHO, KK, CC 1, WKRN Nashville",
      "Import any GR2Analyst-format .pal file from device storage",
      "Per-product selection, different tables for BR, BV, and CC at the same time",
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
      "Tune the radar overlay to match the way you read radar, without compromising defaults that already work for most spotters.",
    ],
    bullets: [
      "Overlay opacity slider so the basemap stays legible underneath",
      "Reflectivity clutter mask to surface ground clutter, AP, and biologicals when you want them",
      "Velocity clutter mask off by default, preserves debris signatures the way RadarOmega does",
      "Per-product gate filters for Reflectivity, Velocity, and Correlation Coefficient",
    ],
    screenshot: {
      src: "/images/screenshots/radar-overlay.jpg",
      alt: "Radar overlay settings, opacity, clutter masks, gate filters",
      caption: "Opacity, clutter masks, and per-product gate filters",
    },
  },
  {
    id: "cross-section",
    eyebrow: "Cross Sections",
    title: "Slice a storm from the ground up",
    body: [
      "Draw a line across a storm and read a vertical slice through it. Instead of inferring structure from a flat top-down view, you see the core's height, how the echo leans, and where the strongest returns sit in the column.",
      "It is backed by full-volume Level 2 decoding, so every tilt of the scan feeds the slice rather than just the lowest elevation.",
    ],
  },
  {
    id: "tilt-3d",
    eyebrow: "Beam Height",
    title: "Pitch the map and watch the beam rise",
    body: [
      "Separate from the 3D volume above, and useful for a different reason. Radar does not look straight ahead: the beam climbs as it travels, so a distant echo is sampled thousands of feet up while a nearby one is near the surface. Pitch the map and Spotter Tools Pro draws that geometry, lifting each sweep to its true height.",
      "It makes beam overshoot obvious. At long range you are not looking at the storm's base, you are looking well up inside it, and this is the view that shows you by how much. On both iOS and Android.",
    ],
    flip: true,
  },
  {
    id: "cell-picker",
    eyebrow: "Storm Cell Picker",
    title: "Tap a cell, see the numbers",
    body: [
      "Tap any storm cell on the radar to read its identifier and key attributes, useful for cross-referencing the cell against an SPC mesoscale discussion or warning text.",
    ],
  },
  {
    id: "composite",
    eyebrow: "Composite",
    title: "CONUS mosaic for the big picture",
    body: [
      "When you're trying to spot the next play across the Plains, the single-site view is the wrong tool. Toggle the composite radar layer for a full-CONUS reflectivity mosaic with selectable sources.",
      "Composite and single-site can run side by side, single-site for tactical analysis, composite for situational awareness.",
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
          description="NEXRAD Level 2 decoded directly on your phone, a 3D storm volume you can fly around, a CONUS composite for the big picture, a full animation transport, and color tables you can swap or import."
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
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-green-dim"
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
