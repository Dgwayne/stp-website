import Image from "next/image";
import Link from "next/link";
import { STORE_LINKS } from "@/lib/stores";

const columns: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    title: "Explore",
    links: [
      { href: "/features", label: "All features" },
      { href: "/radar", label: "Radar" },
      { href: "/alerts", label: "Alerts" },
      { href: "/storm-track", label: "Storm Track" },
      { href: "/draw", label: "Draw on the map" },
    ],
  },
  {
    title: "Get the app",
    links: [
      { href: STORE_LINKS.googlePlay, label: "Google Play", external: true },
      { href: STORE_LINKS.appStore, label: "App Store", external: true },
      { href: STORE_LINKS.microsoft, label: "Microsoft Store", external: true },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "mailto:spottertoolspro@gmail.com", label: "Contact", external: true },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/delete-account", label: "Delete account" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-surface px-6 pt-14 pb-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/stp-logo-mark.png"
              alt=""
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold tracking-tight">
              Spotter Tools Pro
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Pro-grade severe weather radar, alerts and field tools for storm
            chasers, spotters and weather enthusiasts. One purchase, no
            subscription.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              {col.title}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-muted transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-muted transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-white/5 pt-6 text-xs leading-relaxed text-muted/80 md:flex-row md:items-start md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} DGWayne (Dustin Garner). All rights
          reserved.
        </p>
        <p className="max-w-xl md:text-right">
          An independent app, not affiliated with NOAA, the National Weather
          Service or Spotter Network. Always follow official NWS warnings.
        </p>
      </div>
    </footer>
  );
}
