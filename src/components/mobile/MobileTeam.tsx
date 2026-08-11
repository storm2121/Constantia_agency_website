'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Talent } from '@/lib/types';
import { getTalentObjectPosition } from '@/lib/talent-presentation';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  talents: Talent[];
};

export default function MobileTeam({ talents }: Props) {
  const sorted = [...talents].sort((a, b) => a.order - b.order);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const cards = rail.querySelectorAll<HTMLElement>('[data-card]');
      const centerX = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      let closestIndex = 0;
      let closestDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centerX);
        if (d < closestDist) {
          closestDist = d;
          closestIndex = i;
        }
      });
      setActive(closestIndex);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      rail.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="team" className="m-team m-section" aria-labelledby="m-team-title">
      <div className="m-team-mark" aria-hidden="true">
        № 04 <b>/ The People</b>
      </div>

      <div className="m-team-head">
        <p className="m-eyebrow">The Collective</p>
        <h2 id="m-team-title" className="m-h2">
          {sorted.length} specialists,
          <br />
          <em>one collective.</em>
        </h2>
        <div className="m-team-meta">
          <p className="m-team-meta-text">
            Swipe through the studio. Every member ships work you can see
            in the portfolio.
          </p>
          <Link href="/talents" className="m-btn m-btn--ghost m-team-all">
            <span>All profiles</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="m-team-rail-wrap">
        <div className="m-team-rail" role="list" ref={railRef}>
          <div className="m-team-gutter" aria-hidden="true" />
          {sorted.map((talent, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={talent.id}
                role="listitem"
                data-card
                className={`m-team-card ${isActive ? 'is-active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                transition={{ duration: 0.65, ease: EASE, delay: i * 0.04 }}
              >
                <Link
                  href={`/talents/${talent.slug}`}
                  aria-label={`View ${talent.name}'s profile`}
                  className="m-team-link"
                >
                  <div className="m-frame m-frame--34 m-frame--r-lg m-team-media">
                    <Image
                      src={talent.image}
                      alt={talent.name}
                      fill
                      sizes="80vw"
                      loading={i < 2 ? 'eager' : 'lazy'}
                      style={{
                        objectPosition:
                          getTalentObjectPosition(talent.id) ?? 'center top',
                      }}
                    />
                    <div className="m-vign-bottom" />
                    <div className="m-grain" />
                    <span className="m-team-num">
                      {String(i + 1).padStart(2, '0')}{' '}
                      <i>/ {String(sorted.length).padStart(2, '0')}</i>
                    </span>
                    <div className="m-team-caption">
                      <p className="m-team-role">{talent.role}</p>
                      <p className="m-team-name">{talent.name}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          <div className="m-team-gutter" aria-hidden="true" />
        </div>

        <div className="m-team-pagination" aria-hidden="true">
          {sorted.map((t, i) => (
            <span
              key={t.id}
              className={`m-team-dot ${i === active ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .m-team {
          position: relative;
          color: var(--m-ink-hi);
          padding-left: 0;
          padding-right: 0;
          overflow: hidden;
        }
        .m-team-mark {
          padding: 0 var(--m-pad-x);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.34em;
          color: var(--m-ink-muted);
          margin-bottom: 2.4rem;
          text-transform: uppercase;
        }
        .m-team-mark b {
          color: var(--m-accent);
          font-weight: 500;
        }

        .m-team-head {
          padding: 0 var(--m-pad-x);
          margin-bottom: 2.3rem;
        }
        .m-team-head .m-eyebrow {
          margin-bottom: 1.3rem;
        }
        .m-team-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1.4rem;
        }
        .m-team-meta-text {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.88rem;
          line-height: 1.5;
          color: var(--m-ink-mid);
          margin: 0;
          max-width: 24ch;
        }

        .m-team-rail-wrap {
          position: relative;
        }
        .m-team-rail {
          display: flex;
          gap: 0.9rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }
        .m-team-rail::-webkit-scrollbar { display: none; }
        .m-team-gutter {
          flex: 0 0 var(--m-pad-x);
        }

        .m-team-card {
          flex: 0 0 78vw;
          max-width: 340px;
          scroll-snap-align: center;
          transition:
            transform var(--m-dur) var(--m-ease),
            opacity var(--m-dur) var(--m-ease);
          opacity: 0.65;
          transform: scale(0.96);
        }
        .m-team-card.is-active {
          opacity: 1;
          transform: scale(1);
        }

        .m-team-media {
          position: relative;
        }
        .m-team-num {
          position: absolute;
          top: 0.95rem;
          right: 0.95rem;
          padding: 0.4rem 0.6rem;
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--m-ink-hi);
          z-index: 4;
        }
        .m-team-num i {
          color: var(--m-ink-muted);
          font-style: normal;
        }
        .m-team-caption {
          position: absolute;
          left: 1.1rem;
          bottom: 1.1rem;
          right: 1.1rem;
          z-index: 4;
        }
        .m-team-role {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.4rem;
        }
        .m-team-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.55rem;
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--m-ink-hi);
          margin: 0;
        }

        .m-team-pagination {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 1.6rem;
          padding: 0 var(--m-pad-x);
        }
        .m-team-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--m-border-strong);
          transition: all var(--m-dur) var(--m-ease);
        }
        .m-team-dot.is-active {
          width: 22px;
          border-radius: 2px;
          background: var(--m-accent);
          box-shadow: 0 0 10px var(--m-accent-glow);
        }
      `}</style>
    </section>
  );
}
