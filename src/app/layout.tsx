import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import NavClearance from "@/components/NavClearance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The canonical home of the site. NEXT_PUBLIC_SITE_URL can still override it
// (a preview deployment, say), but the fallback must be the real domain: it
// is what every canonical link and every og:image URL is built from.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spottertools.pro";

const DESCRIPTION =
  "A severe weather app for storm chasers, spotters and weather enthusiasts. An experimental Tornado ID detector, 3D storm volumes you can fly around, GPU-rendered NEXRAD Level 2 and Level III radar, Expert multi-radar mode, rain/snow/sleet/ice Precip Type, a radar archive back to 1991, smart push alerts, live lightning, satellite, worldwide tropical, live storm chasers, tens of thousands of live cameras and the full NWS / SPC suite. $19.99 once, no subscription. On iOS, Android and Windows.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Spotter Tools Pro: Severe Weather Radar, Alerts & Cameras",
  description: DESCRIPTION,
  applicationName: "Spotter Tools Pro",
  keywords: [
    "storm spotter",
    "spotter network",
    "severe weather",
    "tornado detection",
    "tornado ID",
    "NWS alerts",
    "tornado warning",
    "storm chasing",
    "live storm chasers",
    "NEXRAD radar",
    "3D radar",
    "3D storm volume",
    "volumetric radar",
    "level 2 radar",
    "level 3 radar",
    "multi-radar mosaic",
    "precipitation type radar",
    "rain snow sleet radar",
    "TDWR terminal radar",
    "radar archive",
    "wind map",
    "surface wind flow",
    "skew-t sounding",
    "hodograph",
    "dual-view radar",
    "lightning map",
    "GOES satellite",
    "tropical tracking",
    "hurricane tracker",
    "hurricane hunters",
    "nexrad animation",
    "gr2analyst pal",
    "weather models",
    "HRRR",
    "traffic cameras",
    "mesoscale discussion",
    "convective outlook",
    "metar",
    "weather app",
    "iOS weather app",
    "Windows weather radar",
  ],
  authors: [{ name: "DGWayne", url: "mailto:spottertoolspro@gmail.com" }],
  openGraph: {
    title: "Spotter Tools Pro",
    description:
      "Tornado ID, 3D storm volumes, Level 2 and Level III radar, Expert mode, Precip Type, alerts, live cameras and storm chasers, for enthusiasts, chasers and spotters. $19.99 once on iOS, Android and Windows.",
    type: "website",
    siteName: "Spotter Tools Pro",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "Spotter Tools Pro: severe weather radar, alerts and field tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotter Tools Pro",
    description:
      "Tornado ID, 3D storm volumes, Level 2 and Level III radar, alerts and live cameras. $19.99 once on iOS, Android and Windows.",
    images: ["/images/og-card.jpg"],
  },
  icons: {
    icon: "/images/stp-logo-mark.png",
    apple: "/images/stp-logo-mark.png",
  },
  appLinks: {
    ios: {
      url: "https://apps.apple.com/us/app/spotter-tools-pro/id6775985245",
      app_store_id: "6775985245",
      app_name: "Spotter Tools Pro",
    },
    android: {
      package: "com.dustin.spottertools",
      app_name: "Spotter Tools Pro",
    },
  },
  other: {
    // Safari shows a "View in App Store" banner on iPhone and iPad.
    "apple-itunes-app": "app-id=6775985245",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <NavClearance />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
