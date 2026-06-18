import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-surface px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-sm text-muted sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/stp-logo-mark.png"
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
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          <Link
            href="/features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/radar"
            className="transition-colors hover:text-foreground"
          >
            Radar
          </Link>
          <Link
            href="/alerts"
            className="transition-colors hover:text-foreground"
          >
            Alerts
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <a
            href="mailto:spottertoolspro@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
