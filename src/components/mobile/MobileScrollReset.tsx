'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Mobile pages must start at the top on every navigation.
 *
 * Without this, the browser's default scroll restoration (or Next.js App
 * Router's state) occasionally lands the user mid-page — most visibly at the
 * bottom, because both the desktop and mobile trees are in the DOM and the
 * desktop tree's intrinsic height has already influenced the document
 * before the mobile CSS gate hides it.
 *
 * We also respect hash anchors: if the URL carries #fragment, scroll to
 * that element instead of 0.
 */
export default function MobileScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const el = document.querySelector(hash);
      if (el) {
        // Defer one frame so the page has laid out before we jump.
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
