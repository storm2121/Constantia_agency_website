'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isAwaitingServiceReturn, readServiceReturnState } from '@/lib/service-portfolios';

export const PHASE_END = 3.1;

const LOGO_TEXT_WIDTH = 1730;
const LOGO_TEXT_HEIGHT = 804;

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgPathRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const shouldBypass =
      search.get('returning') === 'services' ||
      (isAwaitingServiceReturn() && readServiceReturnState() !== null);

    if (!shouldBypass) return;

    skipRef.current = true;
    if (containerRef.current) {
      containerRef.current.style.display = 'none';
    }
    document.documentElement.classList.remove('scroll-locked');
    window.__lenis?.start();
    window.__loadingDone = true;
  }, []);

  useEffect(() => {
    if (done || skipRef.current) return;

    const container = containerRef.current;
    const bgPath = bgPathRef.current;
    const logo = logoRef.current;

    if (!container || !bgPath || !logo) return;

    // Lenis may not be initialized yet (race with SmoothScroll) — poll until found
    const stopLenis = () => {
      if (window.__lenis) {
        window.__lenis.stop();
      } else {
        requestAnimationFrame(stopLenis);
      }
    };
    stopLenis();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const startWidth = Math.min(Math.max(viewportWidth * 0.28, 240), 360);
    const startHeight = startWidth * (LOGO_TEXT_HEIGHT / LOGO_TEXT_WIDTH);
    const finalWidth = Math.min(Math.max(viewportWidth * 0.12, 120), 172);
    const finalHeight = finalWidth * (LOGO_TEXT_HEIGHT / LOGO_TEXT_WIDTH);
    const startX = viewportWidth / 2 - startWidth / 2;
    const startY = viewportHeight / 2 - startHeight / 2;
    const topY = viewportHeight * 0.08;

    gsap.set(logo, {
      x: startX,
      y: startY + 12,
      width: startWidth,
      height: startHeight,
      opacity: 0,
      scale: 0.985,
      filter: 'blur(10px)',
    });

    const tl = gsap.timeline();

    tl.to(logo, {
      y: startY,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.55,
      ease: 'power3.out',
    });

    tl.to(logo, {
      x: viewportWidth / 2 - finalWidth / 2,
      y: topY,
      width: finalWidth,
      height: finalHeight,
      duration: 0.85,
      ease: 'power3.inOut',
    });

    tl.to({}, { duration: 1.1 });

    tl.to(bgPath, {
      attr: { d: 'M 0 80 Q 40 99 100 99 L 100 100 L 0 100 Z' },
      duration: 1.2,
      ease: 'power3.inOut',
    });

    tl.to(container, {
      autoAlpha: 0,
      duration: 0.5,
      delay: 0.5,
      onComplete: () => {
        document.documentElement.classList.remove('scroll-locked');
        window.__lenis?.start();
        window.__loadingDone = true;
        setDone(true);
      },
    });

    return () => {
      tl.kill();
      document.documentElement.classList.remove('scroll-locked');
      window.__lenis?.start();
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path
          ref={bgPathRef}
          d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
          fill="#0a0a0a"
        />
      </svg>

      <div
        ref={logoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Image
          src="/images/logo/Logo_text.png"
          alt="Constantia"
          fill
          priority
          sizes="360px"
          style={{ objectFit: 'contain', objectPosition: 'center top' }}
        />
      </div>
    </div>
  );
}
