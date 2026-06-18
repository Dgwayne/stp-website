import Image from "next/image";
import FeatureCard, { type Feature } from "@/components/FeatureCard";
import ScreenshotStrip, { type Screenshot } from "@/components/ScreenshotStrip";
import SectionHeader from "@/components/SectionHeader";

const features: Feature[] = [
  {
    icon: "📡",
    title: "NEXRAD Level 2 & TDWR Radar",
    description:
      "Real-time NEXRAD Level 2 decoded right on your phone — Reflectivity, Velocity, Correlation Coefficient, and Echo Tops at full resolution. Now with the complete 45-site TDWR terminal-radar network.",
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
      "Background watcher fires NWS warning notifications even when the app is closed — with watch zones, filter modes, custom sounds, and full-screen tornado-emergency takeover.",
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
    icon: "🛰️",
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
            spotters. On-device NEXRAD Level 2 &amp; TDWR radar, smart push
            alerts, live storm chasers, tens of thousands of live cameras, a GPS
            beacon, and the full NWS / SPC suite.
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
