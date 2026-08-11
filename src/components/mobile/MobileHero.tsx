'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  heroImage?: string;
  heroLabel?: string;
};

/**
 * Editorial-first hero.
 * The image is a locked 4:5 frame (no squash, no crop surprises).
 * Title overhangs the frame for a magazine cover feel.
 * Image parallaxes -20% within its frame as the user scrolls.
 */
export default function MobileHero({ heroImage, heroLabel }: Props = {}) {
  const imageSrc = heroImage ?? '/images/hero/hero-poster.jpg';
  const imgRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const frame = frameRef.current;
      const img = imgRef.current;
      if (!frame || !img) return;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: 0 when frame enters viewport bottom, 1 when it exits the top
      const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      img.style.transform = `translate3d(0, ${(progress - 0.5) * 14}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="m-hero" aria-label="Introduction">
      <div className="m-hero-meta-top" aria-hidden="true">
        <span className="m-hero-tag">№ 01 — Intro</span>
        <span className="m-hero-tag m-hero-tag--live">
          <i /> Live
        </span>
      </div>

      <div className="m-hero-frame" ref={frameRef}>
        <div className="m-hero-img-wrap" ref={imgRef}>
          <Image
            src={imageSrc}
            alt={heroLabel ? `${heroLabel} — featured work` : 'Featured Constantia work'}
            fill
            priority
            sizes="100vw"
            className="m-hero-img"
          />
        </div>
        <div className="m-vign-bottom" />
        <div className="m-grain" />

        <motion.span
          className="m-hero-sticker"
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          aria-hidden="true"
        >
          <span>Est.</span>
          <strong>2019</strong>
        </motion.span>

        <motion.div
          className="m-hero-ticker"
          aria-hidden="true"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
        >
          <span>Casablanca</span>
          <i />
          <span>Global</span>
          <i />
          <span>Seven specialists</span>
        </motion.div>

        {heroLabel ? (
          <motion.span
            className="m-hero-caption"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.0 }}
          >
            <span className="m-hero-caption-dot" />
            Featured · {heroLabel}
          </motion.span>
        ) : null}
      </div>

      <div className="m-hero-content">
        <motion.h1
          className="m-hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          <span className="m-hero-title-a">Creative work,</span>
          <span className="m-hero-title-b">
            shaped <em>with care.</em>
          </span>
        </motion.h1>

        <motion.p
          className="m-hero-body"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
        >
          A Casablanca-based collective of photographers, filmmakers,
          designers and developers — building brand work that lingers
          past the scroll.
        </motion.p>

        <motion.div
          className="m-hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
        >
          <Link href="/portfolio" className="m-btn m-btn--primary">
            <span>See the work</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/#contact" className="m-btn m-btn--link">
            Start a project
          </Link>
        </motion.div>

        <motion.div
          className="m-hero-anchor"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <span className="m-hero-anchor-label">Scroll to explore</span>
          <span className="m-hero-anchor-line" />
        </motion.div>
      </div>

      <style jsx>{`
        .m-hero {
          position: relative;
          padding:
            calc(var(--m-safe-t) + 5.5rem)
            var(--m-pad-x)
            var(--m-sp-8);
          color: var(--m-ink-hi);
        }

        .m-hero-meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.1rem;
        }
        .m-hero-tag {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--m-ink-lo);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .m-hero-tag--live {
          color: var(--m-accent);
        }
        .m-hero-tag--live i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 10px var(--m-accent-glow);
          animation: m-hero-blink 1.6s ease-in-out infinite;
        }
        @keyframes m-hero-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }

        .m-hero-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: var(--m-r-lg);
          overflow: hidden;
          background: var(--m-bg-soft);
          isolation: isolate;
        }
        .m-hero-img-wrap {
          position: absolute;
          inset: -12% 0;
          will-change: transform;
        }
        :global(.m-hero-img) {
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.88) saturate(1.08) contrast(1.05);
        }
        .m-hero-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
          pointer-events: none;
          z-index: 4;
        }

        .m-hero-sticker {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: var(--m-accent);
          color: var(--m-bg);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          gap: 0.05rem;
          box-shadow: 0 8px 28px -6px var(--m-accent-glow);
        }
        .m-hero-sticker strong {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .m-hero-ticker {
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 0.85rem;
          border-radius: 999px;
          background: rgba(10,10,10,0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.54rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-ink-mid);
          overflow: hidden;
          white-space: nowrap;
        }
        .m-hero-ticker i {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--m-accent);
          flex-shrink: 0;
        }
        .m-hero-ticker span:first-child {
          color: var(--m-ink-hi);
        }

        .m-hero-caption {
          position: absolute;
          top: 1.1rem;
          left: 1.1rem;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.75rem;
          border-radius: 999px;
          background: rgba(13,14,18,0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.54rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-ink-hi);
        }
        .m-hero-caption-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 8px var(--m-accent-glow);
        }

        .m-hero-content {
          position: relative;
          margin-top: -2.2rem;
          padding: 0 0.1rem;
          z-index: 2;
        }

        .m-hero-title {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-weight: 400;
          font-size: clamp(2.6rem, 13vw, 4.4rem);
          line-height: 0.94;
          letter-spacing: -0.028em;
          color: var(--m-ink-hi);
          margin: 0 0 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .m-hero-title-a {
          display: inline-block;
          padding: 0.12rem 0.5rem 0.12rem 0;
          background: linear-gradient(to right, var(--m-bg) 0%, var(--m-bg) 70%, transparent 100%);
          width: fit-content;
          border-radius: 4px;
        }
        .m-hero-title-b {
          display: inline-block;
          padding-left: 1.2rem;
        }
        .m-hero-title em {
          font-style: italic;
          color: var(--m-accent);
        }

        .m-hero-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          max-width: 34ch;
          margin: 0 0 1.8rem;
          padding-left: 1.2rem;
          border-left: 1px solid var(--m-border);
        }

        .m-hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 2.2rem;
        }

        .m-hero-anchor {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.6rem;
        }
        .m-hero-anchor-label {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--m-ink-lo);
        }
        .m-hero-anchor-line {
          display: block;
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, var(--m-accent) 0%, transparent 80%);
          position: relative;
          overflow: hidden;
        }
        .m-hero-anchor-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 100%;
          background: linear-gradient(to right, transparent, var(--m-accent), transparent);
          animation: m-hero-anchor 2.4s ease-in-out infinite;
        }
        @keyframes m-hero-anchor {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </section>
  );
}
