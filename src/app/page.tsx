import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: "📡",
    title: "GPS Beacon",
    description:
      "Transmit your real-time GPS position to Spotter Network so the NWS and fellow spotters can see exactly where you are during severe weather.",
  },
  {
    icon: "⚠️",
    title: "NWS Warnings & Watches",
    description:
      "View active tornado warnings, severe thunderstorm warnings, flood warnings, and watches overlaid directly on the map.",
  },
  {
    icon: "🌪️",
    title: "Storm Reports",
    description:
      "See today's SPC storm reports — tornadoes, hail, and damaging wind — plotted on the map in real time.",
  },
  {
    icon: "📋",
    title: "Report Submission",
    description:
      "File severe weather reports (tornado, funnel cloud, hail, wind, flood, and more) directly to Spotter Network with optional photos.",
  },
  {
    icon: "🔔",
    title: "Alerts Dashboard",
    description:
      "Browse all active NWS alerts nationwide, filtered by type and severity — from Extreme tornado warnings to Minor advisories.",
  },
  {
    icon: "📡",
    title: "NEXRAD Radar",
    description:
      "Toggle a CONUS composite NEXRAD reflectivity mosaic on the map for at-a-glance precipitation context.",
  },
  {
    icon: "🗺️",
    title: "Map Layers",
    description:
      "Control exactly what you see: active spotters, storm reports, warnings, watches, and radar — each toggled independently.",
  },
];

const screenshots: { src: string; alt: string; caption: string }[] = [
  {
    src: "/images/screenshot-1.jpg",
    alt: "Map view with active spotters",
    caption: "Spotter Network map — see hundreds of active spotters across the US",
  },
  {
    src: "/images/screenshot-2.jpg",
    alt: "NWS warnings on the map",
    caption: "Active beacon with NWS warning polygons and local alert banner",
  },
  {
    src: "/images/screenshot-3.jpg",
    alt: "Storm reports and watches",
    caption: "SPC storm reports, NWS watches, and warnings on the Oklahoma/Texas map",
  },
  {
    src: "/images/screenshot-4.jpg",
    alt: "Map layers panel",
    caption: "Toggle map layers: spotters, reports, warnings, watches, and radar",
  },
  {
    src: "/images/screenshot-5.jpg",
    alt: "Severe weather report form",
    caption: "Submit severe weather reports — tornado, hail, flood, and more",
  },
  {
    src: "/images/screenshot-6.jpg",
    alt: "Tornado warning detail",
    caption: "Full NWS tornado warning detail with map polygon and threat info",
  },
  {
    src: "/images/screenshot-7.jpg",
    alt: "Alerts list",
    caption: "Browse and filter all active NWS alerts by type and severity",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      {/* ---- NAV ---- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/stp-logo-256.png"
              alt="STP Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold tracking-tight">
              Spotter Tools Pro
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#screenshots" className="transition-colors hover:text-foreground">
              Screenshots
            </a>
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </nav>

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
            Professional-grade storm spotting for Android. Real-time GPS beacon,
            NWS alerts, storm reports, and NEXRAD radar — built for certified
            storm spotters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brand-orange-dim hover:shadow-brand-orange/25"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.575 1.49c.478.277.478.972 0 1.249l-2.575 1.49-2.556-2.556 2.556-2.673zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
              </svg>
              Google Play (Coming Soon)
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

      {/* ---- FEATURES ---- */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            Everything a Spotter Needs
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-muted">
            Built from the ground up for Spotter Network members and certified
            storm spotters. No ads, no tracking, no accounts — just tools.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/5 bg-surface p-6 transition-all hover:border-brand-teal/30 hover:bg-surface-light"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- SCREENSHOTS ---- */}
      <section id="screenshots" className="bg-surface px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
            See It in Action
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted">
            Scroll through real screenshots from Spotter Tools Pro.
          </p>
          <div className="screenshot-scroll px-4">
            {screenshots.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="phone-frame">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={440}
                    height={960}
                    className="object-cover"
                  />
                </div>
                <p className="w-52 text-center text-xs leading-relaxed text-muted">
                  {s.caption}
                </p>
              </div>
            ))}
          </div>
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

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-white/5 bg-surface px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-sm text-muted sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/stp-logo-256.png"
              alt="STP Logo"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span>
              &copy; {new Date().getFullYear()} DGWayne (Dustin Garner). All
              rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:dustin@dustingarner.com"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
