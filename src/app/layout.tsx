import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://spottertoolspro.vercel.app",
  ),
  title: "Spotter Tools Pro — Severe Weather Radar, Alerts & Cameras",
  description:
    "A severe weather app for enthusiasts, storm chasers, and spotters. GPU-rendered NEXRAD radar, live wind flow, on-device soundings, live lightning, GOES satellite, worldwide tropical, smart push alerts, live storm chasers, tens of thousands of live cameras, and the full NWS / SPC suite. On iOS and Android.",
  keywords: [
    "storm spotter",
    "spotter network",
    "severe weather",
    "NWS alerts",
    "tornado warning",
    "storm chasing",
    "live storm chasers",
    "NEXRAD radar",
    "level 2 radar",
    "TDWR terminal radar",
    "wind map",
    "surface wind flow",
    "skew-t sounding",
    "hodograph",
    "dual-view radar",
    "lightning map",
    "GOES satellite",
    "tropical tracking",
    "hurricane tracker",
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
  ],
  authors: [{ name: "DGWayne", url: "mailto:spottertoolspro@gmail.com" }],
  openGraph: {
    title: "Spotter Tools Pro",
    description:
      "Severe weather radar, lightning, satellite, tropical tracking, alerts, live cameras, and storm chasers — for enthusiasts, chasers, and spotters. iOS and Android.",
    type: "website",
    images: [{ url: "/images/stp-logo.png", width: 1024, height: 1024 }],
  },
  icons: {
    icon: "/images/stp-logo-mark.png",
    apple: "/images/stp-logo-mark.png",
  },
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
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
