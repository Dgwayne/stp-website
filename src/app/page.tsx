import Image from "next/image";
import FeatureCard, { type Feature } from "@/components/FeatureCard";
import ScreenshotStrip, { type Screenshot } from "@/components/ScreenshotStrip";
import SectionHeader from "@/components/SectionHeader";

const features: Feature[] = [
  {
    icon: "📡",
    title: "Single-Site NEXRAD Radar",
    description:
      "Real-time NEXRAD Level 2 decoded right on your phone — Reflectivity, Velocity, and Correlation Coefficient products at full resolution, per radar site.",
    href: "/radar",
  },
  {
    icon: "🎞️",
    title: "Composite & Animated Radar",
    description:
      "CONUS composite mosaic plus a full transport bar — play, pause, scrub, change loop speed and frame count.",
    href: "/radar",
  },
  {
    icon: "🎨",
    title: "Customizable Color Tables",
    description:
      "Sixteen built-in palettes plus import your own GR2Analyst-style .pal files for BR, BV, and CC.",
    href: "/radar",
  },
  {
    icon: "🚨",
    title: "Smart Push Alerts",
    description:
      "Background watcher fires NWS warning notifications even when the app is closed — with watch zones, outbreak mode, custom sounds, and full-screen tornado-emergency takeover.",
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
    icon: "⚠️",
    title: "NWS, SPC & Convective Outlooks",
    description:
      "Warnings, watches, mesoscale discussions, and Day 1 / Day 2 categorical, tornado, wind, and hail outlooks — all overlaid on the map.",
    href: "/alerts",
  },
  {
    icon: "🌡️",
    title: "METARs & Storm Cell Picker",
    description:
      "Live airport observations on the map, plus tap any storm cell to see its radar attributes and identifier.",
    href: "/features",
  },
  {
    icon: "📋",
    title: "Severe Weather Reporting",
    description:
      "Submit tornado, hail, wind, flood, funnel, wall-cloud, and damage reports directly to Spotter Network — with optional photos.",
    href: "/features",
  },
];

const marqueeScreenshots: Screenshot[] = [
  {
    src: "/images/screenshots/home-map.jpg",
    alt: "Composite radar map view",
    caption: "Composite radar mosaic — at-a-glance precipitation context",
  },
  {
    src: "/images/screenshots/radar-br.jpg",
    alt: "Single-site reflectivity with severe storm",
    caption: "Single-site Level 2 reflectivity decoded in-app",
  },
  {
    src: "/images/screenshots/radar-bv.jpg",
    alt: "Single-site velocity",
    caption: "Single-site Level 2 velocity for rotation analysis",
  },
  {
    src: "/images/screenshots/layer-selector.jpg",
    alt: "Map layer selector sheet",
    caption: "Granular per-layer toggles with live status subtitles",
  },
  {
    src: "/images/screenshots/alert-outlook-day1.jpg",
    alt: "SPC Day 1 convective outlook on the map",
    caption: "SPC convective outlooks and mesoscale discussions",
  },
  {
    src: "/images/screenshots/alert-detail-sheet.jpg",
    alt: "Alerts dashboard with severity filters",
    caption: "Browse every active NWS alert with type and severity filters",
  },
];

export default function Home() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero-bg flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center">
        <div className="animate-fade-in-up">
          <Image
            src="/images/stp-logo.png"
            alt="Spotter Tools Pro logo"
            width={160}
            height={160}
            priority
            className="mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="gradient-text">Spotter Tools Pro</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted sm:text-xl">
            Professional-grade storm spotting for Android. Real-time NEXRAD
            Level 2 radar, smart push alerts, GPS beacon, and the full NWS /
            SPC suite — built for certified storm spotters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.dustin.spottertools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brand-orange-dim hover:shadow-brand-orange/25"
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
            title="Everything a Spotter Needs"
            description="Built from the ground up for Spotter Network members and certified storm spotters. No ads, no tracking, no accounts — just tools."
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
            Built for Spotters, by a Spotter
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-muted">
            Spotter Tools Pro is designed for{" "}
            <strong className="text-foreground">
              certified SKYWARN storm spotters
            </strong>{" "}
            and Spotter Network members who need reliable, focused tools in the
            field. No bloated features, no ads, no data harvesting — just the
            essentials to keep you safe and connected to the National Weather
            Service during severe weather events.
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
