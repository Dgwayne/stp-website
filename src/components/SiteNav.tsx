"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links: { href: string; label: string }[] = [
  { href: "/features", label: "Features" },
  { href: "/radar", label: "Radar" },
  { href: "/alerts", label: "Alerts" },
  { href: "/#reviews", label: "Reviews" },
];

/**
 * Fixed top bar. On phones the links collapse behind a menu button: the old
 * bar wrapped the wordmark onto three lines at 375px and grew to ~110px,
 * which put the hero logo underneath it.
 *
 * The open menu is absolutely positioned below the bar, so it never changes
 * the bar's own height. NavClearance measures this header to keep the
 * training pages' top bar clear of it, and that measurement must not jump
 * when the menu opens.
 */
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    !href.includes("#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/stp-logo-mark.png"
            alt=""
            width={36}
            height={36}
            loading="eager"
            className="h-8 w-8 rounded-lg sm:h-9 sm:w-9"
          />
          <span className="whitespace-nowrap text-base font-semibold tracking-tight sm:text-lg">
            Spotter Tools Pro
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "font-medium text-foreground"
                  : "text-muted transition-colors hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#download"
            className="rounded-full bg-brand-green px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-green-dim"
          >
            Get the app
          </Link>
        </div>

        <button
          type="button"
          className="-mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white/5 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open ? (
        <div
          id="site-menu"
          className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] bg-black/50 md:hidden"
          onClick={(e) => {
            // A tap on the dimmed page below the panel closes the menu.
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="border-b border-white/10 bg-background shadow-2xl">
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base transition-colors hover:bg-white/5 ${
                    isActive(link.href)
                      ? "font-semibold text-foreground"
                      : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#download"
                onClick={() => setOpen(false)}
                className="mt-2 mb-1 rounded-full bg-brand-green px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-green-dim"
              >
                Get the app
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
