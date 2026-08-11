'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileNavbar from '@/components/mobile/MobileNavbar';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Talent } from '@/lib/types';
import { getTalentObjectPosition } from '@/lib/talent-presentation';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { talents: Talent[] };

export default function MobileTalents({ talents }: Props) {
  const sorted = [...talents].sort((a, b) => a.order - b.order);
  const total = sorted.length;

  return (
    <main className="m-tl">
      <MobileScrollReset />
      <MobileAmbient variant="portrait" />
      <MobileNavbar />

      <section className="m-tl-head m-section" aria-labelledby="m-tl-title">
        <div className="m-sec-mark" aria-hidden="true">
          № 01 <b>/ The People</b>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="m-tl-head-inner"
        >
          <p className="m-eyebrow">The Collective</p>
          <h1 className="m-h1 m-tl-title" id="m-tl-title">
            The<br />
            <em>collective.</em>
          </h1>
          <p className="m-tl-body">
            {total} specialists. One studio. Working globally from Casablanca,
            Morocco — shipping photo, film, design and code to clients across
            MENA and beyond.
          </p>
        </motion.div>

        <motion.div
          className="m-tl-stat"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
        >
          <span className="m-numerator">
            {String(total).padStart(2, '0')}
            <span className="m-numerator-sup">/ PPL</span>
          </span>
          <div className="m-tl-stat-text">
            <p className="m-tl-stat-head">Full-time craftspeople</p>
            <p className="m-tl-stat-sub">Swipe the grid — tap to meet them.</p>
          </div>
        </motion.div>
      </section>

      <div className="m-tl-grid" role="list">
        {sorted.map((talent, i) => (
          <motion.div
            key={talent.id}
            role="listitem"
            className="m-tl-cell"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-4% 0px' }}
            transition={{ duration: 0.65, ease: EASE, delay: (i % 4) * 0.05 }}
          >
            <Link
              href={`/talents/${talent.slug}`}
              className="m-tl-card"
              aria-label={`View ${talent.name}'s profile`}
            >
              <div className="m-frame m-frame--34 m-frame--r-md m-tl-media">
                <Image
                  src={talent.image}
                  alt={talent.name}
                  fill
                  sizes="(max-width: 560px) 50vw, 33vw"
                  loading={i < 4 ? 'eager' : 'lazy'}
                  style={{
                    objectPosition:
                      getTalentObjectPosition(talent.id) ?? 'center top',
                  }}
                />
                <div className="m-vign-bottom" />
                <div className="m-grain" />
                <span className="m-chip m-chip--floating m-tl-idx">
                  {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <div className="m-tl-caption">
                  <p className="m-tl-role">{talent.role}</p>
                  <p className="m-tl-name">{talent.name}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <MobileFooter />

      <style jsx>{`
        .m-tl {
          position: relative;
          min-height: 100svh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }
        .m-tl-head {
          padding-top: calc(var(--m-safe-t) + 6rem);
          padding-bottom: var(--m-sp-7);
        }
        .m-tl-head-inner {
          position: relative;
          z-index: 1;
        }
        .m-tl-head .m-eyebrow {
          margin-bottom: 1.4rem;
        }
        .m-tl-title {
          margin: 0 0 1.5rem;
        }
        .m-tl-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.62;
          color: var(--m-ink-mid);
          max-width: 34ch;
          margin: 0 0 2rem;
        }

        .m-tl-stat {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1.1rem 1.2rem;
          background: linear-gradient(
            160deg,
            rgba(255,255,255,0.045) 0%,
            rgba(255,255,255,0.008) 100%
          );
          border: 1px solid var(--m-border);
          border-radius: var(--m-r-lg);
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .m-tl-stat::before {
          content: '';
          position: absolute;
          top: -40%;
          left: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            rgba(243,194,138,0.14) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: -1;
        }
        .m-tl-stat-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .m-tl-stat-head {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.78rem;
          color: var(--m-ink-hi);
          margin: 0;
          line-height: 1.25;
        }
        .m-tl-stat-sub {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.66rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
          margin: 0;
        }

        .m-tl-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 0.7rem;
          padding: 0 var(--m-pad-x) var(--m-sp-9);
        }
        @media (min-width: 640px) {
          .m-tl-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1.2rem 0.8rem;
          }
        }
        .m-tl-cell {
          position: relative;
        }
        .m-tl-card {
          display: block;
          color: var(--m-ink-hi);
          text-decoration: none;
          transition: transform var(--m-dur-fast) var(--m-ease);
        }
        .m-tl-card:active {
          transform: scale(0.98);
        }
        .m-tl-media {
          position: relative;
        }
        .m-tl-idx {
          position: absolute;
          top: 0.7rem;
          left: 0.7rem;
          z-index: 4;
          font-size: 0.5rem;
          letter-spacing: 0.26em;
          padding: 0.28rem 0.48rem;
        }
        .m-tl-caption {
          position: absolute;
          left: 0.75rem;
          right: 0.75rem;
          bottom: 0.7rem;
          z-index: 4;
        }
        .m-tl-role {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.46rem;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.25rem;
        }
        .m-tl-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-weight: 400;
          font-size: 1.1rem;
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
          margin: 0;
        }
      `}</style>
    </main>
  );
}
