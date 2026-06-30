import Image from "next/image";
import FeatureCard, { type Feature } from "@/components/FeatureCard";
import ScreenshotStrip, { type Screenshot } from "@/components/ScreenshotStrip";
import SectionHeader from "@/components/SectionHeader";

const features: Feature[] = [
  {
    icon: "📡",
    title: "GPU Radar — Level 2, III & TDWR",
    description:
      "GPU-rendered and crisp at any zoom. NEXRAD Level 2 decoded on-device — Reflectivity, Velocity, Correlation Coefficient, Echo Tops — plus WSR-88D Level III velocity/reflectivity, dual-pol products (ZDR, Hydrometeor Classification), storm tracks, mesocyclone rotation, and the 45-site TDWR network.",
    href: "/radar",
  },
  {
    icon: "🎞️",
    title: "Composite & Animated Radar",
    description:
      "CONUS MRMS composite mosaic plus a full transport bar — play, pause, scrub, change loop speed and frame count.",
    href: "/radar",
  },
  {
    icon: "🪟",
    title: "Dual-View Radar Compare",
    description:
      "Split the screen to compare two radar views side by side — different products or two sites — each with its own controls.",
    href: "/radar",
  },
  {
    icon: "🎈",
    title: "On-Device Soundings",
    description:
      "Pull full atmospheric profiles in the app — skew-T diagrams, hodographs, and complete sounding analysis from observed balloon data and HRRR forecasts.",
    href: "/features",
  },
  {
    icon: "⚡",
    title: "Live Lightning",
    description:
      "Real-time GOES GLM lightning strikes on the map, with an adjustable display window, bolt size, and radar-loop sync.",
    href: "/features",
  },
  {
    icon: "🛰️",
    title: "GOES Satellite",
    description:
      "GOES-East satellite imagery — Infrared, Water Vapor, Visible, and GeoColor — with animation playback and on-map product chips.",
    href: "/features",
  },
  {
    icon: "🌀",
    title: "Tropical & Hurricane Tracking",
    description:
      "Worldwide tropical tracking — NHC outlook areas-to-watch plus named-storm forecast cones, tracks, and intensity in every basin (typhoons too). Tap any storm for details.",
    href: "/features",
  },
  {
    icon: "📹",
    title: "Live Storm Chasers",
    description:
      "Watch major storm chasers stream live from the field via YouTube and Facebook Live, right on the map. Live badges update in real time so you always see who's broadcasting now.",
    href: "/features",
  },
  {
    icon: "📷",
    title: "Live Traffic & Sky Cameras",
    description:
      "Tens of thousands of DOT traffic cameras across 37 states, plus FAA, Windy, NOAA buoy, USGS volcano, National Park, and ALERTWildfire cameras — live video where it's offered.",
    href: "/features",
  },
  {
    icon: "🚨",
    title: "Smart Push Alerts",
    description:
      "Background watcher fires NWS warning notifications even when the app is closed — with watch zones, filter modes, custom sounds, full-screen tornado-emergency takeover, and an estimated population count inside each warning polygon.",
    href: "/alerts",
  },
  {
    icon: "⚠️",
    title: "NWS, SPC & Convective Outlooks",
    description:
      "Warnings, watches, mesoscale discussions, and Day 1 / Day 2 categorical, tornado, wind, and hail outlooks — all overlaid on the map.",
    href: "/alerts",
  },
  {
    icon: "📈",
    title: "Weather Models",
    description:
      "Overlay HRRR and GFS forecast guidance — reflectivity, temperature, wind, CAPE, and precipitation — with an animated time bar and color legend.",
    href: "/features",
  },
  {
    icon: "🎯",
    title: "Storm Track Projection",
    description:
      "Drag a heading line to draw a forecast cone with configurable speed and spread, then auto-detect every town inside it with an ETA.",
    href: "/features",
  },
  {
    icon: "📍",
    title: "GPS Beacon to Spotter Network",
    description:
      "Foreground and background beacon transmission so the NWS and fellow spotters see exactly where you are. Auto-restarts on device boot.",
    href: "/features",
  },
  {
    icon: "📋",
    title: "Severe Weather Reporting",
    description:
      "Submit tornado, hail, wind, flood, funnel, wall-cloud, and damage reports straight to Spotter Network — with the exact fields the form expects and offline queueing.",
    href: "/features",
  },
  {
    icon: "🎨",
    title: "Customizable Color Tables",
    description:
      "Sixteen built-in palettes plus import your own GR2Analyst-style .pal files for BR, BV, and CC.",
    href: "/radar",
  },
  {
    icon: "🌡️",
    title: "METARs & Storm Cell Picker",
    description:
      "Live airport observations on the map, plus tap any storm cell to sample its radar attributes and identifier.",
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
    caption: "Live Storm Chasers — watch the field via YouTube & Facebook Live",
  },
  {
    src: "/images/screenshots/camera-sources.jpg",
    alt: "Camera source picker listing state DOT and agency feeds",
    caption: "45 camera sources across 37 states — pick what you see",
  },
  {
    src: "/images/screenshots/layers-models-cameras.jpg",
    alt: "Map layers sheet with weather models and traffic cameras",
    caption: "Granular layers: radar, weather models, cameras & more",
  },
  {
    src: "/images/screenshots/field-tools-menu.jpg",
    alt: "On-map quick action menu with field tools",
    caption: "One-tap field tools — storm track, report, beacon, Live Chasers",
  },
];

export default function Home() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero-bg flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center">
        <div className="animate-fade-in-up">
          <Image
            src="/images/stp-logo-mark.png"
            alt="Spotter Tools Pro logo"
            width={160}
            height={160}
            priority
            className="mx-auto mb-8 rounded-3xl drop-shadow-2xl"
          />
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">Spotter Tools Pro</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted sm:text-xl">
            Severe weather, in your pocket — for enthusiasts, storm chasers, and
            spotters. GPU-rendered NEXRAD Level 2 &amp; TDWR radar, soundings,
            live lightning, GOES satellite, worldwide tropical, smart push
            alerts, live storm chasers, tens of thousands of live cameras, and
            the full NWS / SPC suite.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.dustin.spottertools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brand-green-dim hover:shadow-brand-green/25"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.575 1.49c.478.277.478.972 0 1.249l-2.575 1.49-2.556-2.556 2.556-2.673zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
              </svg>
              Get it on Google Play
            </a>
            <a
              href="https://apps.apple.com/us/app/spotter-tools-pro/id6775985245"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black shadow-lg transition-all hover:bg-white/90"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09z" />
              </svg>
              Download on the App Store
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold transition-all hover:border-white/30 hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ---- FEATURES (top-level cards) ---- */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Capabilities"
            title="Everything Severe Weather, in One App"
            description="Pro-grade tools for weather enthusiasts, storm chasers, and certified spotters alike. No ads, no tracking, no accounts — just tools."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
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
            description="A few highlights from the app — explore the deep-dive pages for the full tour."
          />
          <ScreenshotStrip screenshots={marqueeScreenshots} />
        </div>
      </section>

      {/* ---- PRICING / VALUE ---- */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Pricing"
            title="Buy It Once. Keep It Forever."
            description="Most weather apps in this class bill you every month or every year. Spotter Tools Pro is a one-time $19.99 purchase — no subscription, no ads, no account."
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
                    $19.99 once — no subscription
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
                    $9.99 app + $9.99–$99.99 / year
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
                    $8.99 app + $49–$119 / year
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-foreground">
                    WeatherWise
                  </td>
                  <td className="px-5 py-4 text-muted">
                    Free app + subscription
                  </td>
                  <td className="px-5 py-4 text-muted">$69.99–$159.99 / year</td>
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
            doesn&apos;t — pay $19.99 once and every feature is yours.
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
            and Spotter Network members — and it still is. But the same
            pro-grade radar, alerts, and live cameras now serve storm chasers
            and weather enthusiasts too. No bloated features, no ads, no data
            harvesting — just the tools to keep you informed during severe
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
            . We have no servers, no accounts, and no middlemen.
          </p>
        </div>
      </section>
    </>
  );
}
