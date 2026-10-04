import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeatureCard, { type Feature } from "@/components/FeatureCard";
import ScreenshotStrip, { type Screenshot } from "@/components/ScreenshotStrip";
import SectionHeader from "@/components/SectionHeader";
import FeatureSpotlight, { type Spotlight } from "@/components/FeatureSpotlight";
import StoreBadges from "@/components/StoreBadges";
import StoreReviews, { StoreRatingLine } from "@/components/StoreReviews";

// The reviews section reads Google Play and the App Store live. Rebuild the
// page in the background at most every 6 hours so new reviews and ratings
// show up without a deploy (see lib/storeReviews.ts for the failure policy).
export const revalidate = 21600;

// Title, description and the social card come from the root layout. The
// canonical is set here rather than there, because a canonical in the layout
// would be inherited by every page that does not set its own.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The headline of the newest releases, shown as a featured spotlight. Keep
 * this to the one feature people will share; the rest go in `newCards`.
 */
const newHeadline: Spotlight = {
  id: "tornado-id",
  eyebrow: "Tornado ID · Experimental",
  title: "A Tornado Detector Built Into the Radar",
  description:
    "Tornado ID looks at every circulation the radar sees and estimates the chance a tornado is on the ground right now. Markers turn amber from 5%, orange from 30% and red from 60%, and a tap opens a plain-words card with the score, whether it is rising, how long the circulation has been tracked, how strong the rotation is, any debris signature and how high the beam is. Behind it is a machine learning model trained on every confirmed tornado from 2017 to 2025: more than 14,000 tornado track segments, 3,600 warnings that never produced one, and about 81,000 archived radar scans. It works on live radar and in archive mode. It is an estimate, not a warning, so always follow the National Weather Service.",
  src: "/images/v172/tornado-id-greenfield.jpg",
  still: { width: 1000, height: 1000 },
  caption:
    "Archive replay in the app: the Greenfield, Iowa tornado of May 21, 2024, on the Des Moines radar (KDMX)",
  link: { href: "/radar#tornado-id", label: "How Tornado ID was built" },
};

type NewCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: { src: string; width: number; height: number; alt: string };
  /**
   * Map captures fill the frame. A tall UI panel is pinned to its top edge
   * instead, so its first rows stay large enough to read on a phone.
   */
  fit?: "cover" | "top";
  link: { href: string; label: string };
};

const newCards: NewCard[] = [
  {
    id: "expert-mode",
    eyebrow: "Expert mode",
    title: "Fill the Radar Holes",
    description:
      "One radar can be overshooting a storm while the radar beside it sees thousands of feet lower. Expert mode builds one image from up to three radars, each painting only the ground it is closest to, lined up to the same moment, with numbered badges so you always know which is which.",
    image: {
      src: "/images/v172/expert-mode.jpg",
      width: 1600,
      height: 1000,
      alt: "Expert mode blending the Birmingham, Jackson and Atlanta radars into one image, with numbered site badges",
    },
    link: { href: "/radar#expert-mode", label: "How it works" },
  },
  {
    id: "precip-type",
    eyebrow: "Precip Type",
    title: "Rain, Snow, Sleet or Ice",
    description:
      "Colour the radar by what is actually falling: rain, snow, sleet or freezing rain. The strength comes from the radar and the type from the HRRR model, refreshed every 15 minutes, on single site radar and across the whole national mosaic.",
    image: {
      src: "/images/v172/precip-type.jpg",
      width: 1600,
      height: 1000,
      alt: "The national radar over the Southeast coloured by precipitation type, with the rain, snow, sleet and freezing rain legend",
    },
    link: { href: "/radar#precip-type", label: "See Precip Type" },
  },
  {
    id: "settings-sync",
    eyebrow: "Settings Sync",
    title: "Set It Up Once",
    description:
      "Sign in with Google, Apple or email and your map style, layers, radar setup, colour palettes, alert zones and home location are the same on your phone, your tablet and your PC. Pick which groups sync, or keep a device to itself.",
    image: {
      src: "/images/howto-1.0.72/sync-categories.png",
      width: 824,
      height: 1014,
      alt: "Settings Sync options: map style, layers, radar, alerts, marker sizes and home location",
    },
    fit: "top",
    link: { href: "/features#sync", label: "What syncs" },
  },
];

const features: Feature[] = [
  {
    icon: "🌪️",
    title: "Tornado ID (Experimental)",
    description:
      "A machine learning model trained on nine years of confirmed tornadoes scores every circulation the radar sees, with amber, orange and red markers and a plain-words card for each one. Live, and in archive mode.",
    href: "/radar#tornado-id",
  },
  {
    icon: "🧊",
    title: "Storms in 3D",
    description:
      "Stand the whole scan up as a solid you can fly around. Your own site's Level 2 volume in full detail, or the nationwide mosaic anywhere in the lower 48. Debris and rotation are marked inside the storm, cores show through the envelope, and it plays with the loop. Our servers build the volume, so it appears almost immediately.",
    href: "/radar#volume-3d",
  },
  {
    icon: "📡",
    title: "GPU Radar: Level 2, III & TDWR",
    description:
      "GPU-rendered and crisp at any zoom. Level 2 decoded on-device, Level III and dual-pol, the 45-site TDWR network, cross sections and storm tracks. Expert mode blends up to three radars into one image, and Precip Type colours rain, snow, sleet and ice.",
    href: "/radar",
  },
  {
    icon: "⏪",
    title: "Radar Archive to the 1990s",
    description:
      "Pick a date and a time and the radar loads as it was at that instant, with storm tracks and mesocyclones along for the ride. Level 2 reaches back to 1991 and Level III to 1992, so Moore, El Reno and Bridge Creek all load.",
    href: "/radar#archive",
  },
  {
    icon: "🎯",
    title: "Storm Track Projection",
    description:
      "Draw the storm's leading edge and you are done. The motion comes off the radar automatically, and you get the swath, time marks across it, and every town in the path with its arrival time, down to villages of a few hundred people.",
    href: "/storm-track",
  },
  {
    icon: "🚨",
    title: "Smart Push Alerts",
    description:
      "A background watch worker with custom zones, including your home, population inside the polygon, filter modes up to Outbreak, custom sounds with DND override, and a full-screen takeover for Tornado Emergencies. Earthquake, wildfire and air quality alerts too.",
    href: "/alerts",
  },
  {
    icon: "🔄",
    title: "Settings Sync",
    description:
      "Sign in once and your map, layers, radar setup, palettes, alert zones and home location follow you between phone, tablet and PC. Choose which groups sync, and delete the saved copy whenever you like.",
    href: "/features#sync",
  },
  {
    icon: "🎬",
    title: "Share Any Loop as a GIF or MP4",
    description:
      "Record what is on screen and hand it straight to the share sheet: single-site radar, the national composite, satellite, weather models or air quality. Every frame carries a stamp so the loop still says what it is once it leaves the app.",
    href: "/features#loop-share",
  },
  {
    icon: "🎈",
    title: "On-Device Soundings",
    description:
      "Skew-T and hodograph for any point, observed balloon data or forecast profiles, with a full parameter analysis and a plain-language read of what the environment supports.",
    href: "/features#soundings",
  },
  {
    icon: "📍",
    title: "GPS Beacon to Spotter Network",
    description:
      "Foreground and background beacon transmission so the NWS and fellow spotters see exactly where you are, file reports with the exact fields Spotter Network expects, and come back on automatically after a reboot.",
    href: "/features#gps-beacon",
  },
  {
    icon: "📷",
    title: "Live Traffic & Sky Cameras",
    description:
      "Tens of thousands of cameras on the map with live video where the agency streams it, across 61 state DOT and specialty sources covering 48 states. Filter to live video or stills and see conditions on the ground before you commit to a route.",
    href: "/features#cameras",
  },
  {
    icon: "🌀",
    title: "Tropical, and the Hurricane Hunters",
    description:
      "Worldwide tropical cyclone tracking with forecast cones, wind fields and every model's latest track. Plus live NOAA and Air Force reconnaissance on the map, Recon Graphs for the whole mission, and a flight export that turns it into a ready-to-post picture brief or spreadsheet.",
    href: "/features#imagery",
  },
];

const marqueeScreenshots: Screenshot[] = [
  {
    src: "/images/screenshots/radar-single-site.jpg",
    alt: "Single-site NEXRAD Level 2 reflectivity with warning polygons",
    caption: "Single-site NEXRAD Level 2, decoded on-device, with warning polygons",
  },
  {
    src: "/images/screenshots/live-camera.jpg",
    alt: "Live traffic camera streaming over the radar map",
    caption: "Tens of thousands of live traffic & sky cameras, right on the map",
  },
  {
    src: "/images/screenshots/live-chasers.jpg",
    alt: "Live Storm Chasers panel with named chasers",
    caption: "Live Storm Chasers: watch the field via YouTube & Facebook Live",
  },
  {
    src: "/images/screenshots/camera-sources.jpg",
    alt: "Camera source picker listing state DOT and agency feeds",
    caption: "61 camera sources across 48 states, pick what you see",
  },
  {
    src: "/images/screenshots/layers-models-cameras.jpg",
    alt: "Map layers sheet with weather models and traffic cameras",
    caption: "Granular layers: radar, weather models, cameras & more",
  },
  {
    src: "/images/screenshots/field-tools-menu.jpg",
    alt: "On-map quick action menu with field tools",
    caption: "One-tap field tools: storm track, report, beacon, Live Chasers",
  },
];

const spotlights: Spotlight[] = [
  {
    eyebrow: "Storms in 3D",
    title: "Fly Around the Whole Storm",
    description:
      "Radar has always been a flat slice. Now the whole Level 2 scan stands up as a solid you can orbit, so you see how a storm is built instead of inferring it one tilt at a time. Debris and rotation are marked inside the storm rather than hidden in a couplet you have to go find. Opacity follows rain rate, so heavy cores stay solid while light rain goes sheer and you can see straight into it from any side. Height is yours to set, including true scale, and the volume runs with the loop.",
    src: "/videos/radar-3d-volume.mp4",
    poster: "/videos/radar-3d-volume-poster.jpg",
    size: { width: 460, height: 1024 },
    portrait: true,
  },
  {
    eyebrow: "Nationwide in 3D",
    title: "The Whole Mosaic, Stood Up",
    description:
      "The 3D volume is not tied to one radar's umbrella. Switch to the national mosaic and you get the same solid anywhere in the lower 48, refreshed at about a two minute cadence, so a line running three states over reads as a structure rather than a smear. Site 3D and national 3D each carry their own opacity, so you can leave the mosaic sheer for context and keep your own radar solid on top of it.",
    src: "/videos/radar-3d-national.mp4",
    poster: "/videos/radar-3d-national-poster.jpg",
    size: { width: 460, height: 1024 },
    portrait: true,
  },
  {
    eyebrow: "Instant Level 2",
    title: "Tap a Site, Get the Real Scan",
    description:
      "Six Level 2 products paint in about a second: reflectivity, velocity, correlation coefficient, spectrum width, storm relative velocity and normalized rotation. The newest scan reaches the app about 12 seconds after the radar sends it, the scan time and VCP are printed right there, and if the fast lane is ever slow the app falls back to the full decode rather than leaving you waiting.",
    src: "/videos/radar-instant-l2.mp4",
    poster: "/videos/radar-instant-l2-poster.jpg",
    size: { width: 460, height: 1024 },
    portrait: true,
  },
  {
    eyebrow: "Hurricane Hunters",
    title: "Fly the Mission With the Recon Crews",
    description:
      "The Aviation layer puts live NOAA and Air Force reconnaissance on the map: the flight track, flight-level observations, and the vortex centre fixes radioed back from the eye. Open Recon Graphs for the whole mission charted, then export it as a clean two page picture brief, ready to post, or as spreadsheets in the aircraft's own units.",
    src: "/images/v164/recon-graphs.jpg",
    still: { width: 1456, height: 918 },
  },
  {
    eyebrow: "Point forecast",
    title: "The Full NWS Forecast, Anywhere You Tap",
    description:
      "Long-press the map, or search a city, for the complete National Weather Service forecast at that exact spot. Current conditions, the day and night periods in the forecaster's own words, a 48 hour trend chart, the Area Forecast Discussion, and every detail the local office publishes for that cell. It keeps the last forecast so you can still read it without signal.",
    src: "/videos/point-forecast.mp4",
    poster: "/videos/point-forecast-poster.jpg",
    size: { width: 520, height: 548 },
  },
  {
    eyebrow: "Storm structure",
    title: "Radar Cross Sections",
    description:
      "Draw a line across a storm and get a vertical slice through it, so you can read the structure from the ground up instead of only the view from above. Full-volume decoding means every tilt of the scan is there.",
    src: "/videos/cross-section.mp4",
    poster: "/videos/cross-section-poster.jpg",
    size: { width: 500, height: 1108 },
    portrait: true,
  },
  {
    eyebrow: "Severe parameters",
    title: "Mesoanalysis",
    description:
      "SPC-style severe-weather parameters layered right under the radar: CAPE, shear, storm-relative helicity, and derived composites like Supercell and Significant Tornado, sampled anywhere with a bilinear crosshair readout.",
    src: "/videos/mesoanalysis.mp4",
    poster: "/videos/mesoanalysis-poster.jpg",
    size: { width: 640, height: 672 },
  },
  {
    eyebrow: "Live wind",
    title: "Watch the Wind Move",
    description:
      "The live wind layer renders real surface wind as thousands of flowing, speed-colored particles, an at-a-glance read on outflow, convergence, and where it's really blowing. It draws on top of every layer, so it is never buried under the radar.",
    src: "/videos/wind-flow.mp4",
    poster: "/videos/wind-flow-poster.jpg",
    size: { width: 1280, height: 2474 },
    portrait: true,
  },
  {
    eyebrow: "Compare",
    title: "Dual-View Radar",
    description:
      "Split the screen to compare two radar views side by side (different products or two sites), each pane with its own independent controls. On Windows you can drag the divider to give either pane more room.",
    src: "/videos/radar-dualview.mp4",
    poster: "/videos/radar-dualview-poster.jpg",
    size: { width: 640, height: 670 },
  },
  {
    eyebrow: "On the ground",
    title: "Live Traffic & Sky Cameras",
    description:
      "Tens of thousands of cameras right on the map, with live video where the agency streams it, so you can see conditions on the ground in real time. A filter switches between everything, live video only, or stills only, with a count of each.",
    src: "/videos/live-cams.mp4",
    poster: "/videos/live-cams-poster.jpg",
    size: { width: 640, height: 668 },
  },
];

const competitors: {
  name: string;
  model: string;
  price: string;
  highlight?: boolean;
}[] = [
  {
    name: "Spotter Tools Pro",
    model: "One-time purchase",
    price: "$19.99 once, no subscription",
    highlight: true,
  },
  {
    name: "RadarScope",
    model: "Paid app + Pro subscription",
    price: "$9.99 app + $9.99 to $99.99 / year",
  },
  {
    name: "RadarOmega",
    model: "Paid app + subscription",
    price: "$8.99 app + $49 to $119 / year",
  },
  {
    name: "WeatherWise",
    model: "Free app + subscription",
    price: "$69.99 to $159.99 / year",
  },
  {
    name: "WeatherFront",
    model: "Free app + subscription",
    price: "$99.99 / year",
  },
];

export default function Home() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero-bg flex flex-col items-center justify-center px-5 pt-24 pb-14 text-center sm:px-6 sm:pt-28 sm:pb-16">
        <div className="animate-fade-in-up w-full">
          <Link
            href="#new"
            className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-green hover:bg-brand-green/20 sm:text-sm"
          >
            <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">
              New
            </span>
            <span className="truncate">
              Tornado ID, Expert mode, Precip Type
              <span className="hidden sm:inline"> and Settings Sync</span>
            </span>
            <span aria-hidden>&rarr;</span>
          </Link>
          <Image
            src="/images/stp-logo-mark.png"
            alt="Spotter Tools Pro logo"
            width={112}
            height={112}
            loading="eager"
            className="mx-auto mb-5 h-20 w-20 rounded-2xl drop-shadow-2xl sm:mb-6 sm:h-28 sm:w-28"
          />
          <h1 className="mb-4 text-[2.6rem] leading-tight font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">Spotter Tools Pro</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted sm:text-xl">
            Severe weather, in your pocket and on your desktop. Tornado ID,
            storms in 3D, GPU radar, a radar archive back to 1991, smart push
            alerts, and the full NWS / SPC suite, built for chasers and
            spotters.
          </p>
          <StoreBadges />
          <div className="mt-5 flex flex-col items-center gap-1.5">
            <StoreRatingLine />
            <p className="text-sm text-muted">
              One-time $19.99 purchase. No subscription, no ads.
            </p>
          </div>
          <figure className="mx-auto mt-12 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/images/v164/hero-radar-warnings.jpg"
                alt="GPU radar with shaded warning polygons, lightning and storm reports on the live map"
                width={1018}
                height={911}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 944px) 896px, calc(100vw - 40px)"
                className="w-full"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted">
              Live in the app: Level 2 radar with shaded warnings, lightning,
              and watch outlines.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- WHAT'S NEW ---- */}
      <section id="new" className="scroll-mt-20 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Just shipped"
            title="New in the Latest Updates"
            description="The newest features, free for everyone who already owns the app. Every update is part of the one-time purchase."
          />
          <FeatureSpotlight {...newHeadline} />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 sm:mt-20">
            {newCards.map((c) => (
              <article
                key={c.id}
                id={c.id}
                className="flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="(min-width: 1152px) 368px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, calc(100vw - 48px)"
                    className={
                      c.fit === "top"
                        ? "object-cover object-top"
                        : "object-cover"
                    }
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
                    {c.eyebrow}
                  </p>
                  <h3 className="mb-3 text-xl font-bold">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {c.description}
                  </p>
                  <Link
                    href={c.link.href}
                    className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-teal transition-colors hover:text-foreground"
                  >
                    {c.link.label} <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted">
            <strong className="text-foreground">Also new:</strong> nearly every
            NOAA winter, hazard and long range outlook, Hurricane Hunter flight
            export, cleaner Level 2 velocity, a quality-controlled national
            radar, a live or stills camera filter, and 38 more New Mexico
            cameras.{" "}
            <Link
              href="/features"
              className="font-semibold text-brand-teal hover:underline"
            >
              See every feature
            </Link>
          </p>
        </div>
      </section>

      {/* ---- REVIEWS (live from the stores) ---- */}
      <div className="bg-surface/40">
        <StoreReviews />
      </div>

      {/* ---- FEATURE SPOTLIGHTS (a clip per feature) ---- */}
      <section id="in-app" className="scroll-mt-20 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="See it move"
            title="See It in the App"
            description="Every one of these was recorded right in the app. Here's what the headline features actually look like in the field."
          />
          <div className="space-y-16 sm:space-y-24">
            {spotlights.map((s, i) => (
              <FeatureSpotlight key={s.src} {...s} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- SCREENSHOTS ---- */}
      <section id="screenshots" className="bg-surface px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="In the field"
            title="See It in Action"
            description="A few highlights from the app. Explore the deep-dive pages for the full tour."
          />
          <ScreenshotStrip screenshots={marqueeScreenshots} />
        </div>
      </section>

      {/* ---- FEATURES (top-level cards) ---- */}
      <section id="features" className="scroll-mt-20 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Capabilities"
            title="Everything Severe Weather, in One App"
            description="The highlights. Pro-grade tools with no ads, no third-party trackers, and no required account."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full border border-brand-teal/40 px-6 py-3 font-semibold text-brand-teal transition-all hover:border-brand-teal hover:bg-brand-teal/10"
            >
              See every feature <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- PRICING / VALUE ---- */}
      <section id="pricing" className="scroll-mt-20 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Pricing"
            title="Buy It Once. Keep It Forever."
            description="Most weather apps in this class bill you every month or every year. Spotter Tools Pro is a one-time $19.99 purchase: no subscription, no ads, no required account."
          />

          {/* Phones: one card per app instead of a table you scroll sideways. */}
          <ul className="space-y-3 md:hidden">
            {competitors.map((c) => (
              <li
                key={c.name}
                className={`rounded-2xl border p-5 ${
                  c.highlight
                    ? "border-brand-green/40 bg-brand-green/10"
                    : "border-white/10 bg-surface"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={`font-bold ${c.highlight ? "text-foreground" : "text-foreground/90"}`}
                  >
                    {c.name}
                  </p>
                  <p
                    className={`text-right text-xs ${c.highlight ? "font-semibold text-brand-green" : "text-muted"}`}
                  >
                    {c.model}
                  </p>
                </div>
                <p
                  className={`mt-1.5 text-sm ${c.highlight ? "font-semibold text-foreground" : "text-muted"}`}
                >
                  {c.price}
                </p>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th className="px-5 py-4 font-semibold">App</th>
                  <th className="px-5 py-4 font-semibold">Pricing model</th>
                  <th className="px-5 py-4 font-semibold">What you pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {competitors.map((c) =>
                  c.highlight ? (
                    <tr key={c.name} className="bg-brand-green/10">
                      <td className="px-5 py-4 font-bold text-foreground">
                        {c.name}
                      </td>
                      <td className="px-5 py-4 font-semibold text-brand-green">
                        {c.model}
                      </td>
                      <td className="px-5 py-4 font-bold text-foreground">
                        {c.price}
                      </td>
                    </tr>
                  ) : (
                    <tr key={c.name}>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {c.name}
                      </td>
                      <td className="px-5 py-4 text-muted">{c.model}</td>
                      <td className="px-5 py-4 text-muted">{c.price}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-base text-muted">
            Every other option here bills you again next year. Spotter Tools Pro
            doesn&apos;t. Pay $19.99 once and every feature is yours, and so is
            every update.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-relaxed text-muted/70">
            Competitor pricing as of June 2026, taken from each app&apos;s App
            Store listing or official site; those prices are set by their makers
            and may change. Comparison reflects pricing model only.
          </p>
        </div>
      </section>

      {/* ---- ABOUT / FOR SPOTTERS ---- */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Built by a Spotter, for Everyone Who Watches the Sky
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-muted">
            Spotter Tools Pro started as a focused field tool for{" "}
            <strong className="text-foreground">
              certified SKYWARN storm spotters
            </strong>{" "}
            and Spotter Network members, and it still is. But the same
            pro-grade radar, alerts, and live cameras now serve storm chasers
            and weather enthusiasts too. No bloated features, no ads, no data
            harvesting. Just the tools to keep you informed during severe
            weather.
          </p>
          <p className="text-lg leading-relaxed text-muted">
            Your position data goes directly to{" "}
            <strong className="text-foreground">Spotter Network</strong>.
            Weather data comes from public sources, chiefly{" "}
            <strong className="text-foreground">NOAA</strong>: the National
            Weather Service, the{" "}
            <strong className="text-foreground">
              Storm Prediction Center
            </strong>{" "}
            and the national radar network, with some of it prepared on our own
            servers so it reaches you faster. No ad networks and no third-party
            trackers. We do collect anonymous usage statistics to see which
            features are worth building on, with no account or identity
            attached, and you can switch that off in Settings under Privacy.
            Nothing is ever sold.
          </p>
        </div>
      </section>

      {/* ---- DOWNLOAD ---- */}
      <section id="download" className="scroll-mt-20 px-5 pb-24 sm:px-6">
        <div className="hero-bg mx-auto max-w-4xl rounded-3xl border border-white/10 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-14">
          <Image
            src="/images/stp-logo-mark.png"
            alt=""
            width={112}
            height={112}
            className="mx-auto mb-5 h-16 w-16 rounded-2xl"
          />
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">Get Spotter Tools Pro</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted">
            $19.99 once, with every feature and every update. For iPhone and
            iPad, Android and Windows.
          </p>
          <StoreBadges />
          <div className="mt-6 flex justify-center">
            <StoreRatingLine />
          </div>
        </div>
      </section>
    </>
  );
}
