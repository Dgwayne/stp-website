import Image from "next/image";
import { STORE_LINKS } from "@/lib/stores";

/**
 * The three official store badges, used unmodified as each vendor's brand
 * guidelines require (they forbid recolouring, cropping or redrawing).
 *
 * The rendered heights are deliberately NOT equal. Google bakes its required
 * clear space into the artwork: the PNG canvas is 646x250 but the visible
 * badge inside it is only 564x168, i.e. 67.2% of the canvas height, with 41px
 * of transparency on every side. Apple's and Microsoft's SVGs are full-bleed.
 * Setting all three to the same CSS height therefore renders Google's visibly
 * SMALLER than the other two. h-[65px] on Google puts its ink at
 * 65 * 0.672 = 44px, matching the h-11 on the other two. Measured, not
 * guessed: if you swap in a new badge asset, re-measure its ink bbox before
 * changing these. The -11px side margin cancels Google's transparent padding
 * (41px of 646 at 0.26 scale) so the three sit evenly spaced.
 *
 * next/image refuses SVG through its optimizer unless dangerouslyAllowSVG,
 * so all three carry `unoptimized` rather than changing next.config.
 */
export default function StoreBadges({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-3 ${className}`}
    >
      <a
        href={STORE_LINKS.googlePlay}
        target="_blank"
        rel="noopener noreferrer"
        className="-mx-[11px] transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/badges/google-play.png"
          alt="Get it on Google Play"
          width={646}
          height={250}
          unoptimized
          loading="eager"
          className="h-[65px] w-auto"
        />
      </a>
      <a
        href={STORE_LINKS.appStore}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/badges/app-store.svg"
          alt="Download on the App Store"
          width={120}
          height={40}
          unoptimized
          loading="eager"
          className="h-11 w-auto"
        />
      </a>
      <a
        href={STORE_LINKS.microsoft}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/badges/microsoft-store.svg"
          alt="Get it from Microsoft"
          width={161}
          height={44}
          unoptimized
          loading="eager"
          className="h-11 w-auto"
        />
      </a>
    </div>
  );
}
