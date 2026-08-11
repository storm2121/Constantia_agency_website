'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  caption: string;
  tone: 'cyan' | 'warm' | 'deep' | 'rose';
};

const STATS: Stat[] = [
  { value: 7, label: 'Specialists', caption: 'Full-time craftspeople.', tone: 'cyan' },
  { value: 120, suffix: '+', label: 'Projects', caption: 'Across film, print, screen.', tone: 'warm' },
  { value: 18, label: 'Countries', caption: 'Where the work has shipped.', tone: 'deep' },
  { value: 5,  label: 'Disciplines', caption: 'Photo, video, motion, design, code.', tone: 'rose' },
];

const TONE: Record<Stat['tone'], { glow: string; ring: string }> = {
  cyan: { glow: 'rgba(97,203,248,0.25)', ring: 'rgba(97,203,248,0.4)' },
  warm: { glow: 'rgba(243,194,138,0.22)', ring: 'rgba(243,194,138,0.36)' },
  deep: { glow: 'rgba(26,126,176,0.28)', ring: 'rgba(26,126,176,0.4)' },
  rose: { glow: 'rgba(232,113,142,0.22)', ring: 'rgba(232,113,142,0.38)' },
};

function Counter({ value, suffix, duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix ?? ''}
    </span>
  );
}

export default function MobileStats() {
  return (
    <section className="m-stat m-section" aria-labelledby="m-stat-title">
      <div className="m-stat-mark" aria-hidden="true">
        № 05 <b>/ By the Numbers</b>
      </div>

      <motion.div
        className="m-stat-head"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p className="m-eyebrow">Footprint</p>
        <h2 id="m-stat-title" className="m-h2">
          Small team,
          <br />
          <em>large reach.</em>
        </h2>
      </motion.div>

      <div className="m-stat-grid" role="list">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            role="listitem"
            className="m-stat-cell"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 + i * 0.05 }}
            style={{
              ['--tone-glow' as string]: TONE[stat.tone].glow,
              ['--tone-ring' as string]: TONE[stat.tone].ring,
            }}
          >
            <div className="m-stat-cell-top">
              <span className="m-stat-cell-idx">0{i + 1}</span>
              <span className="m-stat-cell-dot" aria-hidden="true" />
            </div>
            <p className="m-stat-cell-value">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="m-stat-cell-label">{stat.label}</p>
            <p className="m-stat-cell-caption">{stat.caption}</p>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .m-stat {
          position: relative;
          color: var(--m-ink-hi);
          overflow: hidden;
        }
        .m-stat-mark {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.34em;
          color: var(--m-ink-muted);
          margin-bottom: 2.4rem;
          text-transform: uppercase;
        }
        .m-stat-mark b {
          color: var(--m-accent);
          font-weight: 500;
        }
        .m-stat-head {
          margin-bottom: 2.6rem;
        }
        .m-stat-head .m-eyebrow {
          margin-bottom: 1.3rem;
        }

        .m-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }
        .m-stat-cell {
          position: relative;
          background: linear-gradient(
            170deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.01) 100%
          );
          border: 1px solid var(--m-border);
          border-radius: var(--m-r-lg);
          padding: 1.3rem 1rem 1.35rem;
          min-height: 172px;
          overflow: hidden;
          isolation: isolate;
        }
        .m-stat-cell::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -30%;
          width: 140%;
          height: 140%;
          background: radial-gradient(
            ellipse at 20% 20%,
            var(--tone-glow) 0%,
            transparent 55%
          );
          pointer-events: none;
          z-index: -1;
        }
        .m-stat-cell-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }
        .m-stat-cell-idx {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.32em;
          color: var(--m-ink-muted);
        }
        .m-stat-cell-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--tone-ring);
          box-shadow: 0 0 12px var(--tone-ring);
        }
        .m-stat-cell-value {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: clamp(2.6rem, 14vw, 3.8rem);
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--m-ink-hi);
          margin: 0 0 0.7rem;
          font-weight: 400;
        }
        .m-stat-cell-label {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-ink-hi);
          margin: 0 0 0.5rem;
          font-weight: 500;
        }
        .m-stat-cell-caption {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.72rem;
          line-height: 1.5;
          color: var(--m-ink-lo);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
