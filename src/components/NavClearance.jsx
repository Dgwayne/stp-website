'use client';

import { useEffect } from 'react';

// SiteNav is position:fixed, and its height is not constant: it is 61px on
// desktop but 109px at 360px wide, because the wordmark and links wrap.
// Any hard-coded top padding is therefore wrong at some width, and when it
// is too small the training top bar ends up underneath the nav, where its
// buttons cannot be clicked at all.
//
// So measure the nav and publish its height as --stp-nav. Only .stp__shell
// reads it, so this changes nothing about the rest of the site.
export default function NavClearance() {
  useEffect(() => {
    const nav = document.querySelector('header, nav');
    if (!nav) return;

    const apply = () => {
      const h = Math.ceil(nav.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty('--stp-nav', `${h}px`);
    };

    apply();

    // Height changes on resize, on rotate, and again when webfonts land and
    // reflow the wordmark, which a one-off measurement would miss.
    const observer = new ResizeObserver(apply);
    observer.observe(nav);
    window.addEventListener('resize', apply);
    document.fonts?.ready?.then(apply).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  return null;
}
