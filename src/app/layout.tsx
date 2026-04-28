import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotter Tools Pro — Professional Storm Spotting for Android",
  description:
    "Professional-grade storm spotting app for certified spotters. Real-time GPS beacon, NWS alerts, storm reports, and NEXRAD radar — all in one app.",
  keywords: [
    "storm spotter",
    "spotter network",
    "severe weather",
    "NWS alerts",
    "tornado warning",
    "storm chasing",
    "NEXRAD radar",
    "weather app",
  ],
  authors: [{ name: "DGWayne", url: "mailto:dustin@dustingarner.com" }],
  openGraph: {
    title: "Spotter Tools Pro",
    description:
      "Professional-grade storm spotting for Android. GPS beacon, NWS alerts, storm reports, and radar.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
