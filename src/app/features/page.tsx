import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScreenshotStrip, {
  type Screenshot,
} from "@/components/ScreenshotStrip";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Features — Spotter Tools Pro",
  description:
    "The full Spotter Tools Pro feature list — NEXRAD Level 2 & TDWR radar, live storm chasers, tens of thousands of live cameras, weather models, smart push alerts, GPS beacon, NWS warnings, SPC outlooks, and severe weather reporting.",
  openGraph: {
    title: "Spotter Tools Pro — Features",
    description:
      "The complete feature tour: beacon, radar, alerts, reporting, and customization.",
    type: "website",
    images: [{ url: "/images/stp-logo.png", width: 1024, height: 1024 }],
  },
};

type Feature = {
  title: string;
  description: string;
};

type Category = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  features: Feature[];
  screenshot?: { src: string; alt: string; caption: string };
  cta?: { href: string; label: string };
};

const categories: Category[] = [
  {
    id: "gps-beacon",
    eyebrow: "GPS & Beacon",
    title: "Spotter Network Beacon",
    intro:
      "Transmit your position so the NWS and fellow spotters know where you are during severe weather.",
    features: [
      {
        title: "Foreground & background beacon",
        description:
          "A persistent foreground service keeps the beacon alive even when the screen is off, with a status notification you can tap to return to the map.",
      },
      {
        title: "Configurable upload interval",
        description:
          "Choose how often the app pushes your position to Spotter Network — balance accuracy against battery.",
      },
      {
        title: "Auto-restart on boot",
        description:
          "Optional boot receiver brings the beacon back automatically after a device reboot so you never forget to turn it back on.",
      },
      {
        title: "Encrypted credential storage",
        description:
          "Your Spotter Network application ID lives in encrypted device storage — never on a server we operate.",
      },
      {
        title: "Battery optimization wizard",
        description:
          "Built-in, device-specific instructions for Samsung, Xiaomi, OnePlus, Pixel, and more — so the OS doesn't kill the beacon in the background.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/battery-wizard.jpg",
      alt: "Battery optimization wizard",
      caption: "Device-specific battery setup wizard",
    },
  },
  {
    id: "map-layers",
    eyebrow: "Map & Layers",
    title: "The Map",
    intro:
      "A Mapbox-rendered tactical view with every layer a spotter needs — toggle exactly what's on screen.",
    features: [
      {
        title: "Active spotter markers",
        description:
          "See every other Spotter Network beacon on the map with callsigns, vehicle info, and status.",
      },
      {
        title: "NWS warnings & watches",
        description:
          "Tornado, severe thunderstorm, flash flood, and fire warnings as full polygons — plus tornado / severe watch boxes.",
      },
      {
        title: "SPC storm reports",
        description:
          "Today's SPC tornado, hail, and damaging-wind reports plotted in real time.",
      },
      {
        title: "SPC mesoscale discussions",
        description:
          "Short-fuse SPC forecast areas (MCDs) overlaid as polygons with full discussion text on tap.",
      },
      {
        title: "Convective outlooks",
        description:
          "Day 1 and Day 2 outlooks — Categorical, Tornado, Wind, and Hail — switchable from a single sheet.",
      },
      {
        title: "METARs",
        description:
          "Live airport observations with selectable variables (temperature, dew point, wind, pressure, visibility) and unit pickers.",
      },
      {
        title: "Map style picker",
        description:
          "Switch between basemap styles to match the conditions and your preference.",
      },
      {
        title: "Mapbox location search",
        description:
          "Geocode addresses, towns, and landmarks to jump anywhere on the map instantly.",
      },
      {
        title: "Storm track projection",
        description:
          "Drag a heading line to draw a forecast cone with configurable speed and spread — the app auto-detects every town inside it with an ETA.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/layer-selector.jpg",
      alt: "Map layers selector sheet",
      caption: "Granular per-layer toggles with live status subtitles",
    },
  },
  {
    id: "radar",
    eyebrow: "Radar",
    title: "Single-Site, TDWR & Composite Radar",
    intro:
      "Real, decoded NEXRAD Level 2 in your hand — now including the full TDWR terminal-radar network — plus a composite mosaic and a full animation transport.",
    features: [
      {
        title: "NEXRAD Level 2 decoding",
        description:
          "Reflectivity (BR), Velocity (BV), Correlation Coefficient (CC), and Echo Tops decoded directly from raw Level 2 data — no third-party tile server.",
      },
      {
        title: "TDWR terminal radar",
        description:
          "The complete 45-site Terminal Doppler Weather Radar network at high resolution — extra low-level detail near major metro areas, with looping just like the WSR-88D sites.",
      },
      {
        title: "Composite radar mosaic",
        description:
          "CONUS-wide WMS composite for at-a-glance precipitation context, with selectable sources.",
      },
      {
        title: "Full animation transport",
        description:
          "Play, pause, scrub, change loop speed, and pick frame count — same controls you'd expect from a desktop radar app.",
      },
      {
        title: "Custom GR2Analyst-style color tables",
        description:
          "Sixteen built-in .pal palettes for BR, BV, and CC, plus drop-in import for your own .pal files.",
      },
      {
        title: "Storm cell picker",
        description:
          "Tap any storm cell on the radar to see its identifier and attributes pulled from the radar product.",
      },
      {
        title: "Per-site selection",
        description:
          "Pick the closest WSR-88D site automatically, or choose a specific site to focus on — useful when chasing the edge of coverage.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/radar-pal-picker.jpg",
      alt: "Color table picker",
      caption: "Built-in palettes plus user-imported .pal files",
    },
    cta: { href: "/radar", label: "Radar deep-dive" },
  },
  {
    id: "cameras",
    eyebrow: "Live Cameras",
    title: "Traffic & Sky Cameras",
    intro:
      "See conditions on the ground with tens of thousands of cameras on the map — live video where the agency streams it.",
    features: [
      {
        title: "37 states of DOT traffic cameras",
        description:
          "State transportation cameras coast to coast — live HLS video where the agency offers it, frequently-updated stills where it doesn't.",
      },
      {
        title: "Beyond the highways",
        description:
          "FAA WeatherCams, Windy community webcams, NOAA offshore buoy cams, USGS volcano cams, National Park vista cams, and ALERTWildfire fire-watch cameras.",
      },
      {
        title: "Fullscreen & direction-aware",
        description:
          "Watch any feed fullscreen, and map icons point the direction each camera faces so you know what you're about to see.",
      },
      {
        title: "Choose your sources",
        description:
          "Pick exactly which states and agencies appear on the map from a single Camera Sources sheet — keep it focused on your area.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/live-camera.jpg",
      alt: "Live traffic camera streaming over the radar map",
      caption: "Live traffic & sky cameras, right over the radar",
    },
  },
  {
    id: "chasers",
    eyebrow: "Live Chasers",
    title: "Live Storm Chasers",
    intro:
      "Watch the chase as it happens — major storm chasers streaming live from the field, without leaving the app.",
    features: [
      {
        title: "In-app live streams",
        description:
          "YouTube and Facebook Live embeds play right on top of the map — no app-switching to follow the action.",
      },
      {
        title: "A roster of well-known chasers",
        description:
          "Reed Timmer, Ryan Hall Y'all, Max Velocity, WXChasing, Corey Gerken, Texas Storm Chasers, and more — curated in one panel.",
      },
      {
        title: "Real-time LIVE badges",
        description:
          "The app checks who's broadcasting and surfaces live streams first, so you always land on someone actually on a storm.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/live-chasers.jpg",
      alt: "Live Storm Chasers panel with named chasers",
      caption: "The Live Chasers panel — live-first, always fresh",
    },
  },
  {
    id: "models",
    eyebrow: "Weather Models",
    title: "Forecast Model Guidance",
    intro:
      "Look ahead with high-resolution model output overlaid right on the map.",
    features: [
      {
        title: "HRRR & GFS overlays",
        description:
          "Pull HRRR and GFS guidance directly onto the map — reflectivity, 2 m temperature, wind, CAPE, precipitation, and more.",
      },
      {
        title: "Animated time bar",
        description:
          "Scrub through forecast hours with a time bar and color legend to watch a system evolve before it arrives.",
      },
      {
        title: "On-map control chips",
        description:
          "Quick chips switch model, product, and run without digging through menus.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/layers-models-cameras.jpg",
      alt: "Map layers sheet showing weather models and cameras",
      caption: "Weather models, cameras, and every layer in one sheet",
    },
  },
  {
    id: "alerts",
    eyebrow: "Alerts & Notifications",
    title: "Smart Push Alerts",
    intro:
      "An on-device watch worker fires NWS warnings even when the app is closed — with the controls a chase op-center actually needs.",
    features: [
      {
        title: "Background watch worker",
        description:
          "A foreground service watches the NWS alerts feed and posts notifications without needing a cloud account.",
      },
      {
        title: "Custom watch zones",
        description:
          "Track your current location, a fixed home zone, custom counties / forecast zones, or any combination at once.",
      },
      {
        title: "Filter modes (including Outbreak)",
        description:
          "Choose between standard severity filtering or 'Outbreak' mode for active multi-state events where you want broader coverage.",
      },
      {
        title: "Event-type filters",
        description:
          "Per-event toggles for tornado warnings, severe thunderstorm warnings, flash flood, fire weather, and more.",
      },
      {
        title: "Custom sound profile + DND override",
        description:
          "Bundled severe-alert tone or stock system sounds, with an option to bypass Do Not Disturb for the most critical events.",
      },
      {
        title: "Full-screen Tornado Emergency takeover",
        description:
          "On Android 14+, opt-in alarm-style full-screen intent for Tornado Emergencies and PDS warnings — wakes the screen even when locked.",
      },
      {
        title: "Custom flash colors",
        description:
          "Pick distinctive flash colors per alert tier so a tornado warning never looks like a flood advisory.",
      },
      {
        title: "Significant report & MCD pings",
        description:
          "Optional notifications when SPC posts a new mesoscale discussion or a high-tier storm report lands inside your zones.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/alert-flash-color.jpg",
      alt: "Flash color and warning settings",
      caption: "Custom flash colors, durations, and per-tier alert tuning",
    },
    cta: { href: "/alerts", label: "Alerts deep-dive" },
  },
  {
    id: "reporting",
    eyebrow: "Reporting",
    title: "Severe Weather Reporting",
    intro:
      "File reports straight from the field — directly to Spotter Network, with the right metadata baked in.",
    features: [
      {
        title: "All Spotter Network report types",
        description:
          "Tornado, funnel cloud, wall cloud, hail, damaging wind, flooding, and damage — each with the right structured fields.",
      },
      {
        title: "Photo attachments",
        description:
          "Attach photos from the camera or gallery so your report carries verifiable visual evidence.",
      },
      {
        title: "Reporting guidelines",
        description:
          "Built-in reporting guidelines reference so you can submit a clean report under pressure.",
      },
      {
        title: "Local report history",
        description:
          "Every report is saved to a local SQLite database for your own records — even when offline.",
      },
      {
        title: "Browse SPC reports on the map",
        description:
          "Toggle today's SPC tornado / hail / wind reports as map markers and tap any of them for full detail.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/report-form.jpg",
      alt: "Severe weather report form",
      caption: "File a Spotter Network report from the field",
    },
  },
  {
    id: "customization",
    eyebrow: "Customization & Setup",
    title: "Set It Up the Way You Like",
    intro:
      "Spotter Tools Pro is opinionated about defaults but gives you control over the things that matter.",
    features: [
      {
        title: "Guided onboarding",
        description:
          "A four-step setup walks you through permissions, map data, and the beacon so you're operational the first time you open it.",
      },
      {
        title: "Searchable settings",
        description:
          "A sticky search field at the top of Settings filters every control on the page — find a toggle in seconds.",
      },
      {
        title: "Connection status indicator",
        description:
          "An always-visible chip on the map shows whether you're online, on cellular, or offline.",
      },
      {
        title: "Active spotter info sheets",
        description:
          "Tap any active spotter to see their callsign, vehicle, and last update without leaving the map.",
      },
      {
        title: "No accounts, no analytics",
        description:
          "Nothing you do is sent to a server we operate. Beacon goes to Spotter Network, weather data comes from NWS / SPC / Mapbox — that's it.",
      },
    ],
    screenshot: {
      src: "/images/screenshots/settings-search.jpg",
      alt: "Settings screen with search",
      caption: "Searchable, grouped settings",
    },
  },
];

const extras: Screenshot[] = [
  {
    src: "/images/screenshots/metars-temp.jpg",
    alt: "METARs temperature plot across the US",
    caption: "METARs — live airport temperatures across the country",
  },
  {
    src: "/images/screenshots/metars-wind.jpg",
    alt: "METARs wind plot across the US",
    caption: "Switch the METAR variable — temp, wind, dew point, and more",
  },
  {
    src: "/images/screenshots/layer-selector-radar.jpg",
    alt: "Map layers — radar and METARs",
    caption: "Single-site radar, composite, and METARs in one sheet",
  },
  {
    src: "/images/screenshots/alert-outlook-config.jpg",
    alt: "SPC convective outlook configuration",
    caption: "Pick the day, hazard, and visual style for SPC outlooks",
  },
  {
    src: "/images/screenshots/report-guidelines.jpg",
    alt: "Spotter Network reporting guidelines reference",
    caption: "Built-in SN reporting guidelines so reports stay clean",
  },
];

export default function FeaturesPage() {
  return (
    <main className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Full feature list"
          title="Everything in Spotter Tools Pro"
          description="One app, every tool. Everything below ships in the current build — tap a deep-dive link for more on radar and alerts."
        />

        {/* Quick jump */}
        <nav className="mb-16 flex flex-wrap items-center justify-center gap-2 text-xs">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-muted transition-colors hover:border-brand-teal/30 hover:text-foreground"
            >
              {cat.eyebrow}
            </a>
          ))}
        </nav>

        <div className="space-y-24">
          {categories.map((cat) => (
            <section
              key={cat.id}
              id={cat.id}
              className="scroll-mt-24 grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start"
            >
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
                  {cat.eyebrow}
                </p>
                <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                  {cat.title}
                </h2>
                <p className="mb-8 max-w-2xl text-muted">{cat.intro}</p>

                <ul className="space-y-5">
                  {cat.features.map((f) => (
                    <li
                      key={f.title}
                      className="rounded-xl border border-white/5 bg-surface p-5 transition-colors hover:border-brand-teal/30"
                    >
                      <h3 className="mb-1 font-semibold text-foreground">
                        {f.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {f.description}
                      </p>
                    </li>
                  ))}
                </ul>

                {cat.cta ? (
                  <Link
                    href={cat.cta.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition-all hover:border-brand-teal/40 hover:bg-white/5"
                  >
                    {cat.cta.label} <span aria-hidden>&rarr;</span>
                  </Link>
                ) : null}
              </div>

              {cat.screenshot ? (
                <figure className="lg:sticky lg:top-24">
                  <div className="phone-frame mx-auto">
                    <Image
                      src={cat.screenshot.src}
                      alt={cat.screenshot.alt}
                      width={440}
                      height={960}
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs text-muted">
                    {cat.screenshot.caption}
                  </figcaption>
                </figure>
              ) : null}
            </section>
          ))}
        </div>

        {/* Extras strip */}
        <section className="mt-24">
          <SectionHeader
            eyebrow="More to explore"
            title="Bonus details"
            description="A few extra views that don't fit neatly in the categories above."
          />
          <ScreenshotStrip screenshots={extras} />
        </section>

        {/* CTA to deep-dive pages */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/radar"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-green-dim"
          >
            Radar deep-dive <span aria-hidden>&rarr;</span>
          </Link>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition-all hover:border-white/30 hover:bg-white/5"
          >
            Alerts deep-dive <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
