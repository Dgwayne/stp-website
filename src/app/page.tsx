import Image from "next/image";
import Link from "next/link";
import FeatureCard, { type Feature } from "@/components/FeatureCard";
import ScreenshotStrip, { type Screenshot } from "@/components/ScreenshotStrip";
import SectionHeader from "@/components/SectionHeader";
import FeatureSpotlight from "@/components/FeatureSpotlight";

const features: Feature[] = [
  {
    icon: "📡",
    title: "GPU Radar: Level 2, III & TDWR",
    description:
      "GPU-rendered and crisp at any zoom. NEXRAD Level 2 decoded on-device, WSR-88D Level III and dual-pol products, vertical cross sections, a VAD Wind Profile panel, storm tracks with mesocyclone and TVS markers, and the 45-site TDWR network. Level III loops run about eight hours deep.",
    href: "/radar",
  },
  {
    icon: "⏪",
    title: "Radar Archive to the 1990s",
    description:
      "Pick a date and a time and the radar loads as it was at that instant, with storm tracks and mesocyclones along for the ride. Level 2 reaches back to 1991 and Level III to 1992, so Moore, El Reno and Bridge Creek all load. Enter the time in whichever zone you are thinking in and the app converts it.",
    href: "/radar",
  },
  {
    icon: "✈️",
    title: "Hurricane Hunters",
    description:
      "Live NOAA and Air Force reconnaissance on the map: flight-level observations along the track and the vortex centre fixes the crews send back from the eye, plus a Recon Graphs screen charting surface wind, flight-level wind and pressure through the whole mission.",
    href: "/features",
  },
  {
    icon: "🎬",
    title: "Share Any Loop as a GIF or MP4",
    description:
      "Record what is on screen and hand it straight to the share sheet: single-site radar, the national composite, satellite, weather models or air quality. Every frame carries a stamp so the loop still says what it is once it leaves the app.",
    href: "/features",
  },
  {
    icon: "🎯",
    title: "Storm Track Projection",
    description:
      "Draw the storm's leading edge and you are done. The motion comes off the radar automatically, and you get the swath, time marks across it, and every town in the path with its arrival time, down to villages of a few hundred people.",
    href: "/storm-track",
  },
  {
    icon: "✏️",
    title: "Draw on the Map",
    description:
      "Mark up the map and have it stay put through pan, zoom and tilt. Freehand, lines, arrows, boxes and circles, eleven forecaster presets including fronts with correct pips, per-shape measurements, a saved library and PNG export.",
    href: "/draw",
  },
  {
    icon: "💨",
    title: "Live Wind Flow",
    description:
      "Real surface wind as thousands of flowing, speed-colored particles, drawn on top of every layer so it is never buried. Density, size, speed and opacity are all yours to tune.",
    href: "/features",
  },
  {
    icon: "🎈",
    title: "On-Device Soundings",
    description:
      "Skew-T and hodograph for any point, observed balloon data or forecast profiles, with a full parameter analysis and a plain-language read of what the environment supports.",
    href: "/features",
  },
  {
    icon: "🚨",
    title: "Smart Push Alerts",
    description:
      "A background watch worker with custom zones, including your home, population inside the polygon, filter modes up to Outbreak, custom sounds with DND override, and a full-screen takeover for Tornado Emergencies. Earthquake, wildfire and air quality alerts too.",
    href: "/alerts",
  },
  {
    icon: "📍",
    title: "GPS Beacon to Spotter Network",
    description:
      "Foreground and background beacon transmission so the NWS and fellow spotters see exactly where you are. Auto-restarts on device boot.",
    href: "/features",
  },
  {
    icon: "📷",
    title: "Live Traffic & Sky Cameras",
    description:
      "Tens of thousands of cameras on the map with live video where the agency streams it, across dozens of state DOT and specialty sources. See conditions on the ground before you commit to a route.",
    href: "/features",
  },
  {
    icon: "🌀",
    title: "Tropical & Hurricane Tracking",
    description:
      "Worldwide tropical cyclone tracking with forecast cones, wind fields, satellite, and NHC products, all on the same map as your radar.",
    href: "/features",
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
    caption: "45 camera sources across 37 states, pick what you see",
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

const spotlights = [
  {
    eyebrow: "Hurricane Hunters",
    title: "Fly the Mission With the Recon Crews",
    description:
      "A new Aviation layer puts live NOAA and Air Force reconnaissance on the map: the flight track, flight-level observations, and the vortex centre fixes radioed back from the eye. Open Recon Graphs for the whole mission charted, surface wind against flight-level wind with the tropical-storm and hurricane-force bands marked, then pressure and the centre-fix history.",
    src: "/images/v164/recon-graphs.jpg",
    still: { width: 1456, height: 918 },
  },
  {
    eyebrow: "Local Storm Reports",
    title: "Ground Truth, Minutes Old",
    description:
      "Storm reports now come straight from the NWS offices that publish them, minutes fresh, covering every report type from tornadoes and hail to downed trees and flooding. Tap any report for the full story, filter to what you care about, and get times in your own clock.",
    src: "/images/v164/storm-reports-lsr.jpg",
    still: { width: 1387, height: 955 },
  },
  {
    eyebrow: "Point forecast",
    title: "The Full NWS Forecast, Anywhere You Tap",
    description:
      "Long-press the map, or search a city, for the complete National Weather Service forecast at that exact spot. Current conditions, the day and night periods in the forecaster's own words, a 48 hour trend chart, the Area Forecast Discussion, and every detail the local office publishes for that cell. It keeps the last forecast so you can still read it without signal.",
    src: "/videos/point-forecast.mp4",
    poster: "/videos/point-forecast-poster.jpg",
  },
  {
    eyebrow: "Storm structure",
    title: "Radar Cross Sections",
    description:
      "Draw a line across a storm and get a vertical slice through it, so you can read the structure from the ground up instead of only the view from above. Full-volume decoding means every tilt of the scan is there.",
    src: "/videos/cross-section.mp4",
    poster: "/videos/cross-section-poster.jpg",
    portrait: true,
  },
  {
    eyebrow: "3D radar",
    title: "Tilt the Map, See the Beam Rise",
    description:
      "Pitch the map and the radar beam climbs with distance, the way the real beam does. Watch how a storm stacks up in the sky instead of guessing from a flat picture.",
    src: "/videos/radar-3d-tilt.mp4",
    poster: "/videos/radar-3d-tilt-poster.jpg",
    portrait: true,
  },
  {
    eyebrow: "Live wind",
    title: "Watch the Wind Move",
    description:
      "The live wind layer renders real surface wind as thousands of flowing, speed-colored particles, an at-a-glance read on outflow, convergence, and where it's really blowing.",
    src: "/videos/wind-flow.mp4",
    poster: "/videos/wind-flow-poster.jpg",
  },
  {
    eyebrow: "Severe parameters",
    title: "Mesoanalysis",
    description:
      "SPC-style severe-weather parameters layered right under the radar: CAPE, shear, storm-relative helicity, and derived composites like Supercell and Significant Tornado, sampled anywhere with a bilinear crosshair readout.",
    src: "/videos/mesoanalysis.mp4",
    poster: "/videos/mesoanalysis-poster.jpg",
  },
  {
    eyebrow: "Cell interrogation",
    title: "Storm Cell Deep Dive",
    description:
      "Tap a cell for an expanded readout: rainfall rate, peak reflectivity, storm-top height, footprint, mass and volume, an age tracker, and at-a-glance severe indices.",
    src: "/videos/cell-picker.mp4",
    poster: "/videos/cell-picker-poster.jpg",
  },
  {
    eyebrow: "Storm tracking",
    title: "Storm Tracks & Cell Characteristics",
    description:
      "Level III storm tracks and cell attributes show where each cell is headed and how it's evolving, so you can size up the strongest storms at a glance.",
    src: "/videos/storm-characteristics.mp4",
    poster: "/videos/storm-characteristics-poster.jpg",
  },
  {
    eyebrow: "Compare",
    title: "Dual-View Radar",
    description:
      "Split the screen to compare two radar views side by side (different products or two sites), each pane with its own independent controls.",
    src: "/videos/radar-dualview.mp4",
    poster: "/videos/radar-dualview-poster.jpg",
  },
  {
    eyebrow: "On the ground",
    title: "Live Traffic & Sky Cameras",
    description:
      "Tens of thousands of cameras right on the map, with live video where the agency streams it, so you can see conditions on the ground in real time.",
    src: "/videos/live-cams.mp4",
    poster: "/videos/live-cams-poster.jpg",
  },
];

export default function Home() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero-bg flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <div className="animate-fade-in-up">
          <Image
            src="/images/stp-logo-mark.png"
            alt="Spotter Tools Pro logo"
            width={112}
            height={112}
            priority
            className="mx-auto mb-6 rounded-2xl drop-shadow-2xl"
          />
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">Spotter Tools Pro</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted sm:text-xl">
            Severe weather, in your pocket and on your desktop. GPU radar, a
            deep radar archive, live wind flow, smart push alerts, and the full
            NWS / SPC suite, built for chasers and spotters.
          </p>
          {/*
            Official store badges, used unmodified as each vendor's brand
            guidelines require (they forbid recolouring, cropping or redrawing).

            The rendered heights are deliberately NOT equal. Google bakes its
            required clear space into the artwork: the PNG canvas is 646x250 but
            the visible badge inside it is only 564x168, i.e. 67.2% of the
            canvas height, with 41px of transparency on every side. Apple's and
            Microsoft's SVGs are full-bleed. Setting all three to the same CSS
            height therefore renders Google's visibly SMALLER than the other
            two. h-[65px] on Google puts its ink at 65 * 0.672 = 44px, matching
            the h-11 on the other two. Measured, not guessed - if you swap in a
            new badge asset, re-measure its ink bbox before changing these.
          */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.dustin.spottertools"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/badges/google-play.png"
                alt="Get it on Google Play"
                width={646}
                height={250}
                unoptimized
                className="h-[65px] w-auto"
              />
            </a>
            <a
              href="https://apps.apple.com/us/app/spotter-tools-pro/id6775985245"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/badges/app-store.svg"
                alt="Download on the App Store"
                width={120}
                height={40}
                unoptimized
                className="h-11 w-auto"
              />
            </a>
            <a
              href="https://apps.microsoft.com/detail/9NFQK1X16KZS"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/badges/microsoft-store.svg"
                alt="Get it from Microsoft"
                width={161}
                height={44}
                unoptimized
                className="h-11 w-auto"
              />
            </a>
            <a
              href="#in-app"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold transition-all hover:border-white/30 hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
          <figure className="mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/images/v164/hero-radar-warnings.jpg"
                alt="GPU radar with shaded warning polygons, lightning and storm reports on the live map"
                width={1018}
                height={911}
                priority
                className="w-full"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted">
              Live in the app: Level 2 radar with shaded warnings, lightning, and watch outlines.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- FEATURE SPOTLIGHTS (a clip per feature) ---- */}
      <section id="in-app" className="px-6 py-20">
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
      <section id="screenshots" className="bg-surface px-6 py-24">
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
      <section id="features" className="px-6 py-24">
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
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Pricing"
            title="Buy It Once. Keep It Forever."
            description="Most weather apps in this class bill you every month or every year. Spotter Tools Pro is a one-time $19.99 purchase: no subscription, no ads, no required account."
          />

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th className="px-5 py-4 font-semibold">App</th>
                  <th className="px-5 py-4 font-semibold">Pricing model</th>
                  <th className="px-5 py-4 font-semibold">What you pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="bg-brand-green/10">
                  <td className="px-5 py-4 font-bold text-foreground">
                    Spotter Tools Pro
                  </td>
                  <td className="px-5 py-4 font-semibold text-brand-green">
                    One-time purchase
                  </td>
                  <td className="px-5 py-4 font-bold text-foreground">
                    $19.99 once, no subscription
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-foreground">
                    RadarScope
                  </td>
                  <td className="px-5 py-4 text-muted">
                    Paid app + Pro subscription
                  </td>
                  <td className="px-5 py-4 text-muted">
                    $9.99 app + $9.99 to $99.99 / year
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-foreground">
                    RadarOmega
                  </td>
                  <td className="px-5 py-4 text-muted">
                    Paid app + subscription
                  </td>
                  <td className="px-5 py-4 text-muted">
                    $8.99 app + $49 to $119 / year
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-foreground">
                    WeatherWise
                  </td>
                  <td className="px-5 py-4 text-muted">
                    Free app + subscription
                  </td>
                  <td className="px-5 py-4 text-muted">$69.99 to $159.99 / year</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-foreground">
                    WeatherFront
                  </td>
                  <td className="px-5 py-4 text-muted">
                    Free app + subscription
                  </td>
                  <td className="px-5 py-4 text-muted">$99.99 / year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-base text-muted">
            Every other option here bills you again next year. Spotter Tools Pro
            doesn&apos;t. Pay $19.99 once and every feature is yours.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-relaxed text-muted/70">
            Competitor pricing as of June 2026, taken from each app&apos;s App
            Store listing or official site; those prices are set by their makers
            and may change. Comparison reflects pricing model only.
          </p>
        </div>
      </section>

      {/* ---- ABOUT / FOR SPOTTERS ---- */}
      <section className="px-6 py-24">
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
            Weather data comes directly from the{" "}
            <strong className="text-foreground">NWS</strong> and{" "}
            <strong className="text-foreground">
              Storm Prediction Center
            </strong>
            . No ad networks, no third-party trackers, and no middlemen in that
            path. We do collect anonymous usage statistics to see which features
            are worth building on, with no account or identity attached, and you
            can switch that off in Settings under Privacy. Nothing is ever sold.
          </p>
        </div>
      </section>
    </>
  );
}
