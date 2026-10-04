import Image from "next/image";
import Link from "next/link";
import AutoVideo from "@/components/AutoVideo";

export type Spotlight = {
  /** Anchor id, so other pages and the nav can deep-link to one feature. */
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  src: string;
  /** Poster frame for a video spotlight. Omit when `still` is set. */
  poster?: string;
  /** Pixel size of the clip (videos) so its box is reserved before load. */
  size?: { width: number; height: number };
  /**
   * Render `src` as a static screenshot instead of a video. The intrinsic
   * size keeps next/image from laying out at 0x0; the rendered width is
   * still the column's.
   */
  still?: { width: number; height: number };
  /**
   * Tall phone-shaped capture (roughly 9:20). Left unconstrained it would run
   * ~1300px tall in a half-width column and dwarf its own copy, so cap it to
   * phone width and let it sit centered in the column.
   */
  portrait?: boolean;
  /** Optional deep-dive link under the copy. */
  link?: { href: string; label: string };
  /** Optional line under the media, e.g. where and when it was captured. */
  caption?: string;
};

/**
 * One feature shown in motion: its clip on one side, its copy on the other.
 * `flip` swaps the columns so a run of these alternates left/right down the
 * page. On narrow screens the video always stacks above the text.
 */
export default function FeatureSpotlight({
  id,
  eyebrow,
  title,
  description,
  src,
  poster,
  size,
  still,
  portrait = false,
  link,
  caption,
  flip = false,
}: Spotlight & { flip?: boolean }) {
  return (
    <div
      id={id}
      className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 lg:gap-14"
    >
      <figure className={flip ? "lg:order-2" : ""}>
        <div
          className={`overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${
            portrait ? "mx-auto w-full max-w-[280px]" : ""
          }`}
        >
          {still ? (
            <Image
              src={src}
              alt={title}
              width={still.width}
              height={still.height}
              sizes={
                portrait
                  ? "280px"
                  : "(min-width: 1152px) 548px, (min-width: 1024px) 46vw, calc(100vw - 48px)"
              }
              className="w-full"
            />
          ) : (
            <AutoVideo
              src={src}
              poster={poster ?? ""}
              width={size?.width}
              height={size?.height}
              label={title}
              className="w-full"
            />
          )}
        </div>
        {caption ? (
          <figcaption className="mt-3 text-center text-xs text-muted">
            {caption}
          </figcaption>
        ) : null}
      </figure>
      <div className={flip ? "lg:order-1" : ""}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
          {eyebrow}
        </p>
        <h3 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h3>
        <p className="leading-relaxed text-muted">{description}</p>
        {link ? (
          <Link
            href={link.href}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal transition-colors hover:text-foreground"
          >
            {link.label} <span aria-hidden>&rarr;</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
