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
  title: "Spotter Tools Pro — Professional Storm Spotting for Android",
  description:
    "Professional-grade storm spotting app for certified spotters. NEXRAD Level 2 radar, smart push alerts, GPS beacon, NWS warnings, SPC outlooks, and more.",
  keywords: [
    "storm spotter",
    "spotter network",
    "severe weather",
    "NWS alerts",
    "tornado warning",
    "storm chasing",
    "NEXRAD radar",
    "level 2 radar",
    "nexrad animation",
    "gr2analyst pal",
    "color tables",
    "mesoscale discussion",
    "convective outlook",
    "metar",
    "weather app",
  ],
  authors: [{ name: "DGWayne", url: "mailto:spottertoolspro@gmail.com" }],
  openGraph: {
    title: "Spotter Tools Pro",
    description:
      "Professional-grade storm spotting for Android. NEXRAD Level 2 radar, smart push alerts, GPS beacon, NWS warnings, and SPC outlooks.",
    type: "website",
    images: [{ url: "/images/stp-logo.png", width: 1024, height: 1024 }],
  },
  icons: {
    icon: "/images/stp-logo-256.png",
    apple: "/images/stp-logo-256.png",
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
