'use client';

import { useEffect, useRef } from 'react';

type Props = {
  variant?: 'default' | 'portrait' | 'editorial';
};

/**
 * Fixed, scroll-reactive aurora backdrop for the mobile tree.
 * Three orbs drift continuously; scroll position nudges their transform
 * and opacity so the backdrop feels alive across sections.
 */
export default function MobileAmbient({ variant = 'default' }: Props) {
  const cyanRef = useRef<HTMLDivElement | null>(null);
  const warmRef = useRef<HTMLDivElement | null>(null);
  const deepRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * 0.08;
      const p = currentRef.current;

      if (cyanRef.current) {
        cyanRef.current.style.transform = `translate3d(${p * -14}vw, ${p * 22}vw, 0)`;
        cyanRef.current.style.opacity = String(0.58 - p * 0.22);
      }
      if (warmRef.current) {
        warmRef.current.style.transform = `translate3d(${p * 10}vw, ${p * -28}vw, 0)`;
        warmRef.current.style.opacity = String(0.32 + p * 0.3);
      }
      if (deepRef.current) {
        deepRef.current.style.transform =
          `translate3d(${p * -6}vw, ${p * 14}vw, 0) scale(${1 + p * 0.25})`;
        deepRef.current.style.opacity = String(0.25 + p * 0.35);
      }

      if (Math.abs(targetRef.current - currentRef.current) > 0.001) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      targetRef.current = Math.min(Math.max(window.scrollY / max, 0), 1);
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const portraitBias = variant === 'portrait';
  const editorialBias = variant === 'editorial';

  return (
    <div className="m-aurora" aria-hidden="true">
      <div className="m-aurora-grid" />
      <div
        ref={cyanRef}
        className="m-aurora-orb m-aurora-orb--cyan"
        style={{
          animation: 'm-drift-a 28s ease-in-out infinite',
          opacity: portraitBias ? 0.4 : undefined,
        }}
      />
      <div
        ref={warmRef}
        className="m-aurora-orb m-aurora-orb--warm"
        style={{
          animation: 'm-drift-b 34s ease-in-out infinite',
          opacity: portraitBias ? 0.5 : editorialBias ? 0.46 : undefined,
        }}
      />
      <div
        ref={deepRef}
        className="m-aurora-orb m-aurora-orb--deep"
        style={{ animation: 'm-drift-c 42s ease-in-out infinite' }}
      />
      <style jsx>{`
        .m-aurora {
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(97,203,248,0.08) 0%, transparent 60%),
            var(--m-bg);
        }
      `}</style>
    </div>
  );
}
