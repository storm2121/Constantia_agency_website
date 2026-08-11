'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Project } from '@/lib/types';
import {
  getServicePortfolioProjectHref,
  type ServicePortfolioConfig,
} from '@/lib/service-portfolios';

const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICE_TONE: Record<string, { color: string; glow: string }> = {
  photo:  { color: 'var(--m-accent)',      glow: 'rgba(97,203,248,0.18)' },
  video:  { color: 'var(--m-warm)',        glow: 'rgba(243,194,138,0.18)' },
  motion: { color: 'var(--m-rose)',        glow: 'rgba(232,113,142,0.18)' },
  design: { color: 'var(--m-accent-deep)', glow: 'rgba(26,126,176,0.22)' },
  web:    { color: 'var(--m-accent)',      glow: 'rgba(97,203,248,0.18)' },
};

type Props = {
  service: ServicePortfolioConfig;
  projects: Project[];
};

export default function MobileServicePortfolio({ service, projects }: Props) {
  const total = projects.length;
  const words = service.title.split(' ');
  const tone = SERVICE_TONE[service.slug] ?? SERVICE_TONE.photo;

  return (
    <main
      className="m-sp"
      style={{
        ['--sp-tone-color' as string]: tone.color,
        ['--sp-tone-glow' as string]: tone.glow,
      }}
    >
      <MobileScrollReset />
      <MobileAmbient variant="editorial" />

      <Link href="/#services" className="m-backlink" aria-label="Back to services">
        <span className="m-backlink-arrow" aria-hidden="true">
          <ArrowLeft size={12} strokeWidth={2.25} />
        </span>
        <span>Services</span>
      </Link>

      <section className="m-sp-head m-section" aria-labelledby="m-sp-title">
        <div className="m-sec-mark" aria-hidden="true">
          Services <b>/ {service.title}</b>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <p className="m-eyebrow">The Practice</p>
          <h1 className="m-h1 m-sp-title" id="m-sp-title">
            {words.map((word, i) =>
              i === words.length - 1 ? (
                <em key={`${word}-${i}`}>{word}</em>
              ) : (
                <span key={`${word}-${i}`}>{word} </span>
              )
            )}
          </h1>
          <p className="m-sp-body">
            Selected work and ongoing experiments from the{' '}
            {service.title.toLowerCase()} practice.
          </p>
        </motion.div>

        {total > 0 ? (
          <motion.div
            className="m-sp-stat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
          >
            <span className="m-numerator">
              {String(total).padStart(2, '0')}
              <span className="m-numerator-sup">/ WRK</span>
            </span>
            <div className="m-sp-stat-text">
              <p className="m-sp-stat-head">Shipped case studies</p>
              <p className="m-sp-stat-sub">Tap any to read the brief.</p>
            </div>
          </motion.div>
        ) : null}
      </section>

      {total > 0 ? (
        <section className="m-sp-grid" aria-label={`${service.title} projects`}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.05 }}
            >
              <Link
                href={getServicePortfolioProjectHref(service.slug, project.slug)}
                className="m-sp-card"
              >
                <div className="m-frame m-frame--43 m-frame--r-lg m-sp-card-media">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 560px) 100vw, 50vw"
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="m-vign-bottom" />
                  <div className="m-grain" />
                  <span className="m-chip m-chip--floating m-sp-card-num">
                    {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span className="m-chip m-chip--floating m-sp-card-pill">
                    {project.category}
                  </span>
                  <span className="m-arrow-btn m-sp-card-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="m-sp-card-meta">
                  <p className="m-sp-card-client">
                    {project.clientName} · {project.date}
                  </p>
                  <p className="m-sp-card-title">{project.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      ) : (
        <section className="m-sp-empty">
          <p className="m-sp-empty-eyebrow">Coming soon</p>
          <p className="m-sp-empty-body">
            Fresh {service.title.toLowerCase()} work is in production.
            Check back soon.
          </p>
        </section>
      )}

      <MobileFooter />

      <style jsx>{`
        .m-sp {
          position: relative;
          min-height: 100svh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }
        .m-sp-head {
          padding-top: calc(var(--m-safe-t) + 6rem);
          padding-bottom: var(--m-sp-7);
        }
        .m-sp-head .m-eyebrow {
          margin-bottom: 1.4rem;
        }
        .m-sp-head .m-eyebrow::before {
          background: var(--sp-tone-color);
        }
        .m-sp-title {
          margin: 0 0 1.4rem;
        }
        .m-sp-title :global(em) {
          color: var(--sp-tone-color);
        }
        .m-sp-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.62;
          color: var(--m-ink-mid);
          max-width: 34ch;
          margin: 0 0 2rem;
        }

        .m-sp-stat {
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
        .m-sp-stat::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            var(--sp-tone-glow) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: -1;
        }
        .m-sp-stat :global(.m-numerator-sup) {
          color: var(--sp-tone-color);
        }
        .m-sp-stat-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .m-sp-stat-head {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.78rem;
          color: var(--m-ink-hi);
          margin: 0;
          line-height: 1.25;
        }
        .m-sp-stat-sub {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.66rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
          margin: 0;
        }

        .m-sp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.8rem;
          padding: 0 var(--m-pad-x) var(--m-sp-9);
        }
        @media (min-width: 560px) {
          .m-sp-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.6rem 1rem;
          }
        }
        .m-sp-card {
          display: block;
          color: var(--m-ink-hi);
          text-decoration: none;
          transition: transform var(--m-dur-fast) var(--m-ease);
        }
        .m-sp-card:active {
          transform: scale(0.985);
        }
        .m-sp-card-media {
          margin-bottom: 0.9rem;
        }
        .m-sp-card-num {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
          z-index: 4;
          font-size: 0.5rem;
        }
        .m-sp-card-pill {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          z-index: 4;
        }
        .m-sp-card-arrow {
          position: absolute;
          right: 0.85rem;
          bottom: 0.85rem;
          z-index: 4;
          width: 36px;
          height: 36px;
        }
        .m-sp-card-client {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--sp-tone-color);
          margin: 0 0 0.35rem;
        }
        .m-sp-card-title {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.02rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
          margin: 0;
        }

        .m-sp-empty {
          padding: var(--m-sp-7) var(--m-pad-x) var(--m-sp-9);
          margin: 0 var(--m-pad-x);
          border: 1px dashed var(--m-border);
          border-radius: var(--m-r-lg);
          background: rgba(255,255,255,0.02);
        }
        .m-sp-empty-eyebrow {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--sp-tone-color);
          margin: 0 0 0.9rem;
        }
        .m-sp-empty-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.65;
          color: var(--m-ink-mid);
          margin: 0;
          max-width: 30ch;
        }
      `}</style>
    </main>
  );
}
