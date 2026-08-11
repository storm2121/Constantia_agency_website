"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOBILE_MEDIA_QUERY } from "@/lib/device";

declare global {
  interface Window {
    __lenis?: Lenis;
    __loadingDone?: boolean;
  }
}

export default function SmoothScroll({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window !== "undefined" && window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.06,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, [enabled]);

  return <>{children}</>;
}
