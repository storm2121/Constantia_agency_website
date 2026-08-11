'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Project, Talent } from '@/lib/types';
import {
  getDesignTalentPresentation,
  getTalentObjectPosition,
} from '@/lib/talent-presentation';

const EASE = [0.22, 1, 0.36, 1] as const;

const ENTRY_TONE: { color: string; glow: string }[] = [
  { color: 'var(--m-accent)',      glow: 'rgba(97,203,248,0.20)' },
  { color: 'var(--m-warm)',        glow: 'rgba(243,194,138,0.20)' },
  { color: 'var(--m-rose)',        glow: 'rgba(232,113,142,0.20)' },
  { color: 'var(--m-accent-deep)', glow: 'rgba(26,126,176,0.22)' },
];

export type DesignTalentEntry = {
  talent: Talent;
  projects: Project[];
};

type Props = {
  entries: DesignTalentEntry[];
};

export default function MobileDesignPortfolio({ entries }: Props) {
  return (
    <main className="m-dp">
      <MobileScrollReset />
      <MobileAmbient variant="editorial" />

      <Link href="/#services" className="m-backlink" aria-label="Back to services">
        <span className="m-backlink-arrow" aria-hidden="true">
          <ArrowLeft size={12} strokeWidth={2.25} />
        </span>
        <span>Services</span>
      </Link>

      <section className="m-dp-head m-section" aria-labelledby="m-dp-title">
        <div className="m-sec-mark" aria-hidden="true">
          Services <b>/ Graphic Design</b>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <p className="m-eyebrow">The Practice</p>
          <h1 className="m-h1 m-dp-title" id="m-dp-title">
            Two designers.<br />
            <em>Separate lanes.</em>
          </h1>
          <p className="m-dp-body">
            Identity, posters, and systems on one side. Campaign
            assets, carousels, and reels on the other — each with a
            distinct visual language.
          </p>
        </motion.div>

        <motion.div
          className="m-dp-meta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
        >
          <span className="m-chip">{entries.length} designers</span>
          <span className="m-chip">
            {entries.reduce((sum, e) => sum + e.projects.length, 0)} collections
          </span>
          <span className="m-chip m-chip--accent">Tap to enter</span>
        </motion.div>
      </section>

      <section className="m-dp-list" aria-label="Designers">
        {entries.map((entry, entryIdx) => {
          const lead = entry.projects[0];
          const secondary = entry.projects.slice(1, 3);
          const presentation = getDesignTalentPresentation(entry.talent.id);
          const portraitPosition = getTalentObjectPosition(entry.talent.id);
          const role = presentation?.role ?? entry.talent.role;
          const focus = presentation?.focus ?? 'design collection';
          const tone = ENTRY_TONE[entryIdx % ENTRY_TONE.length];

          return (
            <motion.div
              key={entry.talent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-4% 0px' }}
              transition={{ duration: 0.85, ease: EASE, delay: entryIdx * 0.06 }}
              className="m-dp-entry"
              style={{
                ['--entry-tone' as string]: tone.color,
                ['--entry-glow' as string]: tone.glow,
              }}
            >
              <Link
                href={`/services/design/portfolio/talents/${entry.talent.slug}`}
                className="m-dp-card"
                aria-label={`Open ${entry.talent.name}'s portfolio`}
              >
                <div className="m-dp-portrait">
                  <Image
                    src={entry.talent.image}
                    alt={entry.talent.name}
                    fill
                    sizes="100vw"
                    className="m-dp-portrait-img"
                    priority={entryIdx === 0}
                    style={
                      portraitPosition
                        ? { objectPosition: portraitPosition }
                        : undefined
                    }
                  />
                  <div className="m-grain" />
                  <div className="m-dp-portrait-vignette" aria-hidden="true" />
                  <div className="m-dp-portrait-fade" aria-hidden="true" />

                  <div className="m-dp-portrait-top">
                    <span className="m-chip m-chip--floating m-dp-idx">
                      {String(entryIdx + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                    </span>
                    <span className="m-dp-count">
                      {entry.projects.length}{' '}
                      {entry.projects.length === 1 ? 'collection' : 'collections'}
                    </span>
                  </div>

                  <div className="m-dp-portrait-caption">
                    <p className="m-dp-role">{role}</p>
                    <p className="m-dp-name">{entry.talent.name}</p>
                  </div>
                </div>

                <div className="m-dp-body-wrap">
                  <p className="m-dp-bio">
                    {presentation?.landingBio ?? entry.talent.shortBio}
                  </p>

                  {lead ? (
                    <div className="m-dp-previews">
                      <div className="m-frame m-frame--43 m-frame--r-md m-dp-primary-preview">
                        <Image
                          src={lead.thumbnail}
                          alt={lead.title}
                          fill
                          sizes="(max-width: 560px) 100vw, 50vw"
                          loading={entryIdx === 0 ? 'eager' : 'lazy'}
                        />
                        <div className="m-grain" />
                      </div>
                      {secondary.length > 0 ? (
                        <div className="m-dp-secondary-previews">
                          {secondary.map((project) => (
                            <div
                              key={project.slug}
                              className="m-frame m-frame--43 m-frame--r-sm m-dp-secondary-preview"
                            >
                              <Image
                                src={project.thumbnail}
                                alt={project.title}
                                fill
                                sizes="(max-width: 560px) 50vw, 25vw"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <ul className="m-dp-projects" aria-label="Selected works">
                    {entry.projects.slice(0, 3).map((project) => (
                      <li key={project.slug} className="m-dp-project-row">
                        <span className="m-dp-project-bullet" aria-hidden="true" />
                        <div>
                          <p className="m-dp-project-title">{project.title}</p>
                          <p className="m-dp-project-meta">
                            {project.shortDescription}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="m-dp-action">
                    <span className="m-dp-action-focus">{focus}</span>
                    <span className="m-dp-action-cta">
                      Open portfolio
                      <ArrowUpRight size={14} strokeWidth={1.75} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <MobileFooter />

      <style jsx>{`
        .m-dp {
          position: relative;
          min-height: 100svh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }
        .m-dp-head {
          padding-top: calc(var(--m-safe-t) + 6rem);
          padding-bottom: var(--m-sp-7);
        }
        .m-dp-head .m-eyebrow {
          margin-bottom: 1.4rem;
        }
        .m-dp-title {
          margin: 0 0 1.4rem;
        }
        .m-dp-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.62;
          color: var(--m-ink-mid);
          max-width: 34ch;
          margin: 0 0 1.8rem;
        }
        .m-dp-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .m-dp-list {
          display: grid;
          gap: var(--m-sp-9);
          padding: 0 0 var(--m-sp-9);
        }
        .m-dp-entry {
          position: relative;
          isolation: isolate;
        }
        .m-dp-entry::before {
          content: '';
          position: absolute;
          top: 0;
          left: -10%;
          right: -10%;
          height: 60%;
          background: radial-gradient(
            ellipse 80% 60% at 50% 30%,
            var(--entry-glow) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: -1;
        }
        .m-dp-card {
          display: block;
          color: var(--m-ink-hi);
          text-decoration: none;
        }

        .m-dp-portrait {
          position: relative;
          width: 100%;
          height: 74svh;
          min-height: 480px;
          max-height: 680px;
          background: var(--m-bg-soft);
          overflow: hidden;
        }
        .m-dp-portrait-img {
          object-fit: cover;
        }
        .m-dp-portrait-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              120% 80% at 50% 0%,
              transparent 0%,
              rgba(10, 10, 10, 0.35) 100%
            );
          pointer-events: none;
        }
        .m-dp-portrait-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--m-bg) 0%,
            rgba(10, 10, 10, 0.3) 40%,
            rgba(10, 10, 10, 0) 70%
          );
          pointer-events: none;
        }
        .m-dp-portrait-top {
          position: absolute;
          top: 1.2rem;
          left: var(--m-pad-x);
          right: var(--m-pad-x);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          z-index: 4;
        }
        .m-dp-idx {
          font-size: 0.5rem;
          padding: 0.3rem 0.55rem;
        }
        .m-dp-count {
          color: var(--entry-tone);
          letter-spacing: 0.28em;
        }
        .m-dp-portrait-caption {
          position: absolute;
          left: var(--m-pad-x);
          right: var(--m-pad-x);
          bottom: 1.6rem;
          z-index: 4;
        }
        .m-dp-role {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--entry-tone);
          margin: 0 0 0.6rem;
        }
        .m-dp-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-weight: 400;
          font-style: italic;
          font-size: clamp(2.1rem, 10vw, 2.8rem);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--m-ink-hi);
          margin: 0;
        }

        .m-dp-body-wrap {
          padding: var(--m-sp-6) var(--m-pad-x) 0;
        }
        .m-dp-bio {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.98rem;
          line-height: 1.68;
          color: var(--m-ink-mid);
          margin: 0 0 1.6rem;
          max-width: 40ch;
        }

        .m-dp-previews {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.7rem;
          margin-bottom: 1.8rem;
        }
        .m-dp-primary-preview {
          position: relative;
        }
        .m-dp-secondary-previews {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.55rem;
        }
        .m-dp-secondary-preview {
          position: relative;
        }

        .m-dp-projects {
          list-style: none;
          margin: 0 0 1.5rem;
          padding: 1.3rem 0;
          border-top: 1px solid var(--m-border);
          border-bottom: 1px solid var(--m-border);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .m-dp-project-row {
          display: flex;
          gap: 0.75rem;
        }
        .m-dp-project-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--entry-tone);
          margin-top: 0.65rem;
          flex-shrink: 0;
          box-shadow: 0 0 10px var(--entry-glow);
        }
        .m-dp-project-title {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.92rem;
          color: var(--m-ink-hi);
          font-weight: 500;
          margin: 0 0 0.2rem;
        }
        .m-dp-project-meta {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.8rem;
          line-height: 1.55;
          color: var(--m-ink-lo);
          margin: 0;
        }
        .m-dp-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-bottom: var(--m-sp-3);
        }
        .m-dp-action-focus {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
        }
        .m-dp-action-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--m-ink-hi);
          border-bottom: 1px solid var(--entry-tone);
          padding-bottom: 3px;
        }
      `}</style>
    </main>
  );
}
