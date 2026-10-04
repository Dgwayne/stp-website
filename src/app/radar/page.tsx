import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import AutoVideo from "@/components/AutoVideo";

export const metadata: Metadata = {
  title: "Radar | Spotter Tools Pro",
  description:
    "An experimental Tornado ID detector, Expert multi-radar mode, rain/snow/sleet/ice Precip Type, 3D storm volumes you can fly around, real-time NEXRAD Level 2 decoding, Level III and dual-pol, the full TDWR network, a quality-controlled national mosaic, a radar archive to the 1990s and custom GR2Analyst-style color tables, on iOS, Android and Windows.",
  alternates: { canonical: "/radar" },
  openGraph: {
    title: "Spotter Tools Pro | Radar",
    description:
      "Tornado ID, Expert mode, Precip Type, 3D storm volumes, Level 2 and Level III radar, and a radar archive back to 1991.",
    type: "website",
    url: "/radar",
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630 }],
  },
};

type Media =
  /** A 440x960 phone screenshot in the phone frame. */
  | { kind: "phone"; src: string; alt: string; caption: string }
  /** A clip, played only while on screen. */
  | {
      kind: "video";
      src: string;
      poster: string;
      width: number;
      height: number;
      caption: string;
    }
  /** A landscape still (desktop capture). */
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption: string;
    };

type Block = {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  bullets?: string[];
  /** A short heading above the bullets, when they need one. */
  bulletsTitle?: string;
  note?: string;
  media?: Media;
  flip?: boolean;
};

const blocks: Block[] = [
  {
    id: "level-2",
    eyebrow: "Single-Site Radar",
    title: "NEXRAD Level 2, decoded on-device",
    body: [
      "Spotter Tools Pro decodes raw NEXRAD Level 2 files directly on your phone or PC, with no third-party tile server in between and no degraded composite resolution.",
      "Pick a WSR-88D site (or tap a radar pill on the map) and read six products at full radial resolution, at whichever tilt you need.",
    ],
    bullets: [
      "Reflectivity (BR), for precipitation intensity and storm structure",
      "Velocity (BV), for rotation and outflow",
      "Correlation Coefficient (CC), for debris signatures and hydrometeor type",
      "Spectrum Width, Storm-Relative Velocity and Normalized Rotation",
    ],
    media: {
      kind: "phone",
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
    bullets: [
      "Level 2 velocity is unfolded by a rebuilt dealiasing pass, graded pixel by pixel against the National Weather Service's own Level III product on 43 storms",
      "Patches of wrong colour, the kind that can look like a fake couplet, are about a third as common and flicker far less from scan to scan",
      "Velocity loops hold together on days when the radar keeps changing scan modes",
    ],
    media: {
      kind: "phone",
      src: "/images/screenshots/radar-bv.jpg",
      alt: "Single-site velocity",
      caption: "Base velocity for rotation analysis",
    },
    flip: true,
  },
  {
    id: "tornado-id",
    eyebrow: "Tornado ID · Experimental",
    title: "A tornado detector built into the radar",
    body: [
      "Tornado ID looks at every circulation the radar sees and estimates the chance a tornado is on the ground right now. A marker with a percentage sits on each circulation worth your attention: amber from 5%, orange from 30% and red from 60%, so the one that matters stands out.",
      "Tap a marker for the Tornado ID card. It opens with a plain-words summary of what that marker means and what to do, then shows the score, whether it is rising or falling, how long the circulation has been tracked, how strong the rotation is, whether a debris signature is showing and how high the radar beam is at that range. The storm cell card carries a Tornado ID line too.",
      "Inside an active Tornado Warning it marks a circulation even at a low score, because a weak tornado inside a warning should never go unmarked, and a circulation the app has tracked for 15 minutes or more is marked even with a lower score, so a weak tornado can show up before a warning is issued.",
      "It works on live radar, where scores come from our servers the moment each scan arrives, and in archive mode, where your phone or computer scores the scan itself. It is off by default: open Map layers, tap Single Site Radar (on Windows, its Options button) and switch on Tornado ID.",
    ],
    bulletsTitle: "How it was built",
    bullets: [
      "A machine learning model trained on every confirmed tornado from 2017 to 2025: more than 14,000 tornado track segments from the National Weather Service's official storm records, matched to the radars that saw them",
      "3,600 tornado warnings that never produced a tornado, so it learned what a false alarm looks like, and nearly 2,000 damaging wind, hail, heavy rain and tropical storm cases with no tornado anywhere near",
      "About 81,000 archived Level 2 scans and more than 9 million circulations, each described by 68 radar measurements: how strong and tight the spin is, debris, beam height, how long it has been tracked and more",
      "Tested the honest way: the whole of 2025 was held back while it learned and used only once, at the end, to grade it",
      "The phone, the PC and our servers compute it exactly the way the training did, checked value for value",
    ],
    note: "Tornado ID is an estimate, not a warning. It can miss a tornado and it can flag a storm that never produces one. Always follow official National Weather Service warnings and your own eyes.",
    media: {
      kind: "video",
      src: "/videos/tornado-id.mp4",
      poster: "/videos/tornado-id-poster.jpg",
      width: 720,
      height: 720,
      caption: "Recorded on live radar: the card for a low-scoring circulation, seen by the Key West radar (KBYX)",
    },
  },
  {
    id: "expert-mode",
    eyebrow: "Expert Mode",
    title: "Fill the radar holes with the radars around them",
    body: [
      "One radar can be looking at the top of a storm while the radar on the other side of it sees thousands of feet lower over the same ground. Expert mode puts them together.",
      "Turn on Expert on the radar panel, then tap one or two more radar sites on the map. Tap a site again to take it out.",
    ],
    bullets: [
      "Up to three radars in one image",
      "Every pixel is still true single-site radar: each radar paints only the ground it is closest to, so nothing is counted twice and there is no bright seam where two radars meet",
      "Everything lines up in time: the app picks the moment all of the radars can cover and fetches each one's scan from then, and a radar that has gone down is left out rather than dragging the picture back",
      "Numbered badges show which radars are in the image, and every other radar on the map dims",
      "It starts fresh every time, so it never comes back on by itself after a restart",
    ],
    note: "Expert mode works with Level III products at the lowest tilt. Switch to a Level II product, a higher tilt, a loop or 3D and the extra radars step aside until you come back.",
    media: {
      kind: "image",
      src: "/images/v172/expert-mode.jpg",
      alt: "Expert mode blending the Birmingham, Jackson and Atlanta radars into one image, with numbered site badges",
      width: 1600,
      height: 1000,
      caption: "Captured in the app: Birmingham, Jackson and Atlanta radars as one image",
    },
    flip: true,
  },
  {
    id: "precip-type",
    eyebrow: "Precip Type",
    title: "Rain, snow, sleet or freezing rain",
    body: [
      "Precip Type colours the radar by what is falling. Radar cannot see the temperature between the cloud and the ground, so the strength comes from the radar and the type comes from the High Resolution Rapid Refresh model, with each pixel painted on the matching rain, snow, sleet or freezing rain scale.",
      "It is a single-site radar product, and the national mosaic has it too, built on the quality-controlled radar so a bird migration is never painted as light snow.",
    ],
    bullets: [
      "Updated every 15 minutes, so the rain and snow line moves with the storm instead of jumping once an hour, and the legend names the model time in use",
      "The inspector reads the type at any spot, alongside the reflectivity",
      "Loops work, with each frame coloured from its own time",
      "Covers the lower 48 states, where the HRRR runs, on live radar",
    ],
    media: {
      kind: "image",
      src: "/images/v172/precip-type.jpg",
      alt: "The national radar over the Southeast coloured by precipitation type, with the rain, snow, sleet and freezing rain legend",
      width: 1600,
      height: 1000,
      caption: "Captured in the app: national Precip Type, with its four-scale legend",
    },
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
    media: {
      kind: "phone",
      src: "/images/v170/volume-3d.jpg",
      alt: "Storm cells rendered as a 3D volume above the map",
      caption: "The Level 2 volume, orbited around a line of storms",
    },
    flip: true,
  },
  {
    id: "instant-l2",
    eyebrow: "Instant Level 2",
    title: "Tap a site, get the real scan",
    body: [
      "Level 2 used to mean waiting on a full scan download before anything appeared on screen. Six products now paint in about a second: reflectivity, velocity, correlation coefficient, spectrum width, storm relative velocity and normalized rotation.",
      "The newest scan reaches the app about 12 seconds after the radar sends it. The scan time and VCP are printed on the panel, so you always know how old what you are looking at really is.",
      "Nothing about it can leave you worse off. If the fast lane is slow or unavailable, the app falls back to the full on-device decode it always did.",
    ],
    media: {
      kind: "phone",
      src: "/images/v170/instant-l2.jpg",
      alt: "Level 2 velocity with a tornadic couplet and the scan time readout",
      caption: "Level 2 velocity, one minute old, with the VCP printed on the panel",
    },
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
      "Tornado ID works here too, scoring the archived scan on your own device",
      "Enter the time in Local, UTC, Eastern, Central, Mountain, Arizona, Pacific, Alaska or Hawaii, and it converts for you",
      "A same-moment line cross references UTC and your own zone, with the date, so a lookup that rolled past midnight is obvious",
      "Storm-relative velocity, the cross section and the wind profile all follow the archived clock rather than today's",
      "Layers with no history switch off rather than sitting on live data under a past-tense banner",
      "Loops build about a third faster than they used to and start playing sooner: a cold two hour Level 2 loop went from about two and a half minutes to about a minute and forty",
      "Each frame downloads only the part of the file it needs and unpacks only the tilt it paints, and an archive loop holds on its first frame until you press Play",
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
      "Pick an output size and see the estimated file size before you commit, up to an XL 1440 pixels for a desktop-sized map",
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
      "If you've already got a palette you like, drop the .pal file in and it just works, same parser, same gradient logic. With Settings Sync on, your imported palettes follow you to your other devices.",
    ],
    bullets: [
      "Reflectivity: 2004 LaCrosse, Apocs, Ben, Reflec 1, Viper HD, Macdonald-Emmerson",
      "Velocity: Alpha, A Mix of 2, AWIPS Evans, Force, GRL3 v2, Velocity 1",
      "Correlation Coefficient: AWIPS RHO, KK, CC 1, WKRN Nashville",
      "Import any GR2Analyst-format .pal file from device storage",
      "Per-product selection, different tables for BR, BV, and CC at the same time",
    ],
    media: {
      kind: "phone",
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
      "Velocity clutter mask off by default, so debris signatures are preserved",
      "Per-product gate filters for Reflectivity, Velocity, and Correlation Coefficient",
      "The Reflectivity filter cleans up the national mosaic as well as single-site radar",
    ],
    media: {
      kind: "phone",
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
    media: {
      kind: "video",
      src: "/videos/cross-section.mp4",
      poster: "/videos/cross-section-poster.jpg",
      width: 500,
      height: 1108,
      caption: "Drawing a cross section through a storm",
    },
    flip: true,
  },
  {
    id: "tilt-3d",
    eyebrow: "Beam Height",
    title: "Pitch the map and watch the beam rise",
    body: [
      "Separate from the 3D volume above, and useful for a different reason. Radar does not look straight ahead: the beam climbs as it travels, so a distant echo is sampled thousands of feet up while a nearby one is near the surface. Pitch the map and Spotter Tools Pro draws that geometry, lifting each sweep to its true height.",
      "It makes beam overshoot obvious. At long range you are not looking at the storm's base, you are looking well up inside it, and this is the view that shows you by how much.",
    ],
    media: {
      kind: "video",
      src: "/videos/radar-3d-tilt.mp4",
      poster: "/videos/radar-3d-tilt-poster.jpg",
      width: 460,
      height: 1044,
      caption: "The beam climbing with range as the map tilts",
    },
  },
  {
    id: "cell-picker",
    eyebrow: "Storm Cell Deep Dive",
    title: "Tap a cell, see the numbers",
    body: [
      "Tap any storm cell on the radar to read its identifier and key attributes, then expand it into a full readout: rainfall rate, peak reflectivity, storm-top height, footprint, mass and volume, an age tracker, at-a-glance severe indices and, with it switched on, a Tornado ID line.",
    ],
    media: {
      kind: "video",
      src: "/videos/cell-picker.mp4",
      poster: "/videos/cell-picker-poster.jpg",
      width: 640,
      height: 680,
      caption: "Picking a cell and opening the deep dive",
    },
    flip: true,
  },
  {
    id: "storm-tracks",
    eyebrow: "Storm Tracks",
    title: "Where each cell is headed",
    body: [
      "Level III storm tracks and cell attributes show where each cell is headed and how it is evolving, with mesocyclone and Tornado Vortex Signature markers on the storms that carry them, so you can size up the strongest storms at a glance.",
    ],
    media: {
      kind: "video",
      src: "/videos/storm-characteristics.mp4",
      poster: "/videos/storm-characteristics-poster.jpg",
      width: 640,
      height: 668,
      caption: "Storm tracks and cell characteristics on single-site radar",
    },
  },
  {
    id: "dual-view",
    eyebrow: "Dual-View",
    title: "Two radars, side by side",
    body: [
      "Split the screen to compare two radar views side by side, different products or two sites, each pane with its own independent controls. On Windows the divider drags, so either pane can have more room.",
    ],
    media: {
      kind: "video",
      src: "/videos/radar-dualview.mp4",
      poster: "/videos/radar-dualview-poster.jpg",
      width: 640,
      height: 670,
      caption: "Reflectivity and velocity in dual view",
    },
    flip: true,
  },
  {
    id: "composite",
    eyebrow: "National Radar",
    title: "A clean CONUS mosaic for the big picture",
    body: [
      "When you're trying to spot the next play across the Plains, the single-site view is the wrong tool. The national radar is a GPU-rendered CONUS mosaic drawn from NOAA's full MRMS product catalog, crisp at every zoom, with a transport bar, hourly playback and tap-to-read values.",
      "It opens on Base Reflectivity (QC), with birds, insects and ground clutter removed. Those returns sit at the same strength as light rain, so no filter slider could ever clear them, and on many nights they used to paint a false wash of green across the East. Prefer the original? Pick Base Reflectivity and the app remembers.",
      "Composite and single-site can run side by side: single-site for tactical analysis, composite for situational awareness.",
    ],
    bullets: [
      "Precip Type for the whole country, coloured rain, snow, sleet or freezing rain",
      "The 3D volume works nationwide too",
      "The QC product and Precip Type loop up to 2 hours; Base Reflectivity reaches 3, 6 and 12 hours",
    ],
    media: {
      kind: "phone",
      src: "/images/screenshots/home-map.jpg",
      alt: "Composite radar mosaic over the southeast US",
      caption: "The national mosaic across multiple sites",
    },
  },
];

function isNarrow(m: Media) {
  return m.kind === "phone" || (m.kind === "video" && m.height > m.width * 1.3);
}

function MediaFigure({ media }: { media: Media }) {
  if (media.kind === "phone") {
    return (
      <figure>
        <div className="phone-frame mx-auto">
          <Image
            src={media.src}
            alt={media.alt}
            width={440}
            height={960}
            sizes="220px"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-center text-xs text-muted">
          {media.caption}
        </figcaption>
      </figure>
    );
  }
  const narrow = isNarrow(media);
  return (
    <figure>
      <div
        className={`overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${
          narrow ? "mx-auto max-w-[260px]" : ""
        }`}
      >
        {media.kind === "video" ? (
          <AutoVideo
            src={media.src}
            poster={media.poster}
            width={media.width}
            height={media.height}
            label={media.caption}
            className="w-full"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="(min-width: 1152px) 520px, (min-width: 1024px) 45vw, calc(100vw - 48px)"
            className="w-full"
          />
        )}
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">
        {media.caption}
      </figcaption>
    </figure>
  );
}

export default function RadarPage() {
  return (
    <div className="px-6 pt-28 pb-24 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Radar"
          title="Real radar, not a screenshot"
          description="NEXRAD Level 2 decoded on your device, an experimental Tornado ID, Expert multi-radar mode, Precip Type, a 3D storm volume you can fly around, a clean national mosaic, a full animation transport and an archive back to 1991."
        />

        {/* Quick jump */}
        <nav
          aria-label="Radar topics"
          className="sticky top-[var(--stp-nav,57px)] z-30 -mx-6 mb-12 flex gap-2 overflow-x-auto whitespace-nowrap border-b border-white/5 bg-background/90 px-6 py-3 text-xs backdrop-blur-md [scrollbar-width:none] lg:static lg:mx-0 lg:mb-16 lg:flex-wrap lg:items-center lg:justify-center lg:overflow-visible lg:whitespace-normal lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
        >
          {blocks.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="shrink-0 rounded-full border border-white/10 bg-surface px-3 py-1.5 text-muted transition-colors hover:border-brand-teal/30 hover:text-foreground"
            >
              {b.eyebrow.replace(" · Experimental", "")}
            </a>
          ))}
        </nav>

        <div className="space-y-20 sm:space-y-24">
          {blocks.map((b) => {
            const narrow = b.media ? isNarrow(b.media) : false;
            const cols = b.media
              ? narrow
                ? b.flip
                  ? "lg:grid-cols-[300px_1fr]"
                  : "lg:grid-cols-[1fr_300px]"
                : "lg:grid-cols-2"
              : "";
            return (
              <section
                key={b.id}
                id={b.id}
                className={`scroll-mt-36 grid gap-10 lg:scroll-mt-24 lg:items-center ${cols}`}
              >
                <div
                  className={
                    b.media ? (b.flip ? "lg:order-2" : "") : "max-w-3xl"
                  }
                >
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
                    <>
                      {b.bulletsTitle ? (
                        <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
                          {b.bulletsTitle}
                        </h3>
                      ) : null}
                      <ul className="mt-4 space-y-2 text-sm text-muted">
                        {b.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-3 rounded-lg border border-white/5 bg-surface px-4 py-2.5"
                          >
                            <span aria-hidden className="text-brand-teal">
                              &bull;
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {b.note ? (
                    <p className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-amber-100/90">
                      {b.note}
                    </p>
                  ) : null}
                </div>

                {b.media ? (
                  <div className={b.flip ? "lg:order-1" : ""}>
                    <MediaFigure media={b.media} />
                  </div>
                ) : null}
              </section>
            );
          })}
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
            <Link
              href="/#download"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition-all hover:border-white/30 hover:bg-white/5"
            >
              Get the app
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
