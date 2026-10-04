"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster: string;
  className?: string;
  /**
   * The clip's pixel size. Passed through as width/height attributes so the
   * browser reserves the right box before the poster loads, instead of
   * laying out at the 300x150 default and jumping when it arrives.
   */
  width?: number;
  height?: number;
  /** Accessible description of what the clip shows. */
  label?: string;
};

/**
 * A muted, looping demo clip that only loads + plays while it's on screen.
 * With several videos on the page, autoplaying them all at once would decode
 * every clip simultaneously (janky on phones); this observes visibility and
 * plays just the ones in view, pausing the rest. `preload="none"` means a
 * clip costs nothing until it scrolls into view.
 *
 * The poster is deferred too. A `poster` attribute downloads the moment the
 * page parses, so a page with a dozen clips used to pull every poster frame
 * (about a megabyte on a phone) before anyone scrolled. It is now attached
 * when the clip comes within a couple of screens of the viewport.
 */
export default function AutoVideo({
  src,
  poster,
  className,
  width,
  height,
  label,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const nearObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    nearObserver.observe(el);

    // Someone who has asked the OS for less motion gets the poster frame and
    // the browser's own controls instead of a loop that starts by itself.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.controls = true;
      return () => nearObserver.disconnect();
    }

    const playObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    playObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={near ? poster : undefined}
      width={width}
      height={height}
      aria-label={label}
      className={`h-auto bg-surface ${className ?? ""}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
