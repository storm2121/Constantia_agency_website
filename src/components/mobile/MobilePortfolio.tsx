'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileNavbar from '@/components/mobile/MobileNavbar';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Project } from '@/lib/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const FILTERS: { key: string; label: string; tone: 'cyan' | 'warm' | 'deep' | 'rose' | 'neutral' }[] = [
  { key: 'all',    label: 'All',    tone: 'neutral' },
  { key: 'photo',  label: 'Photo',  tone: 'cyan' },
  { key: 'video',  label: 'Video',  tone: 'warm' },
  { key: 'motion', label: 'Motion', tone: 'rose' },
  { key: 'design', label: 'Design', tone: 'deep' },
  { key: 'web',    label: 'Web',    tone: 'cyan' },
];

const TONE_COLOR: Record<string, string> = {
  cyan: 'var(--m-accent)',
  warm: 'var(--m-warm)',
  deep: 'var(--m-accent-deep)',
  rose: 'var(--m-rose)',
  neutral: 'var(--m-ink-hi)',
};

type Props = { projects: Project[] };

export default function MobilePortfolio({ projects }: Props) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects
      .filter((p) => filter === 'all' || p.service === filter)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
  }, [filter, search, projects]);

  return (
    <main className="m-pf">
      <MobileScrollReset />
      <MobileAmbient variant="editorial" />
      <MobileNavbar />

      <section className="m-pf-head m-section">
        <div className="m-sec-mark" aria-hidden="true">
          № 01 <b>/ Selected Work</b>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <p className="m-eyebrow">The Archive</p>
          <h1 className="m-h1 m-pf-title">
            Our<br />
            <em>work.</em>
          </h1>
          <p className="m-pf-body">
            Photography, film, design and engineering — shipped for brands
            across MENA and beyond.
          </p>
        </motion.div>

        <motion.div
          className="m-pf-count"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
        >
          <span className="m-numerator">
            {projects.length.toString().padStart(2, '0')}
            <span className="m-numerator-sup">/ ARCH</span>
          </span>
          <div className="m-pf-count-text">
            <p className="m-pf-count-head">Projects in the archive</p>
            <p className="m-pf-count-sub">
              Five disciplines · one language.
            </p>
          </div>
        </motion.div>
      </section>

      <div className="m-pf-controls">
        <div className="m-pf-search">
          <Search size={15} strokeWidth={1.6} className="m-pf-search-ic" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, tags…"
            className="m-pf-search-input"
            aria-label="Search projects"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className="m-pf-search-clear"
            >
              <X size={14} strokeWidth={1.8} />
            </button>
          )}
        </div>

        <div className="m-pf-chips-wrap">
          <div className="m-pf-chips" role="tablist" aria-label="Filter by discipline">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(f.key)}
                  className={`m-pf-chip ${isActive ? 'is-active' : ''}`}
                  style={{
                    ['--chip-tone' as string]: TONE_COLOR[f.tone],
                  }}
                >
                  <span className="m-pf-chip-dot" aria-hidden="true" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="m-pf-meta">
        <span className="m-pf-meta-bar" aria-hidden="true" />
        <span className="m-pf-meta-count">
          {filtered.length.toString().padStart(2, '0')} {filtered.length === 1 ? 'project' : 'projects'}
        </span>
        {filter !== 'all' ? (
          <span className="m-pf-meta-filter">· {FILTERS.find((f) => f.key === filter)?.label}</span>
        ) : null}
      </div>

      <section className="m-pf-grid" aria-label="Portfolio grid">
        {filtered.length === 0 ? (
          <div className="m-pf-empty">
            <p className="m-pf-empty-head">Nothing here</p>
            <p className="m-pf-empty-body">
              Try removing the search or switching filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="m-btn m-btn--ghost m-pf-empty-reset"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className="m-pf-card-wrap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.05 }}
            >
              <Link
                href={`/portfolio/${project.slug}`}
                className="m-pf-card"
                aria-label={`${project.title} — view case study`}
              >
                <div className="m-frame m-frame--43 m-frame--r-lg m-pf-card-media">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 560px) 100vw, 50vw"
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="m-vign-bottom" />
                  <div className="m-grain" />
                  <span className="m-chip m-chip--floating m-pf-card-pill">
                    {project.service}
                  </span>
                  <span className="m-pf-card-idx" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="m-arrow-btn m-pf-card-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="m-pf-card-text">
                  <p className="m-pf-card-meta">
                    {project.clientName || project.category.toUpperCase()}
                  </p>
                  <h2 className="m-pf-card-title">{project.title}</h2>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </section>

      <MobileFooter />

      <style jsx>{`
        .m-pf {
          position: relative;
          min-height: 100dvh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }

        .m-pf-head {
          padding-top: calc(var(--m-safe-t) + 6rem);
          padding-bottom: var(--m-sp-7);
        }
        .m-pf-title {
          margin: 1.2rem 0 1.5rem;
        }
        .m-pf-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.58;
          color: var(--m-ink-mid);
          max-width: 32ch;
          margin: 0 0 2rem;
        }

        .m-pf-count {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1.1rem 1.2rem;
          background: linear-gradient(
            160deg,
            rgba(255,255,255,0.045) 0%,
            rgba(255,255,255,0.012) 100%
          );
          border: 1px solid var(--m-border);
          border-radius: var(--m-r-lg);
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .m-pf-count::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            rgba(97,203,248,0.14) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: -1;
        }
        .m-pf-count-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .m-pf-count-head {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.78rem;
          color: var(--m-ink-hi);
          margin: 0;
          line-height: 1.25;
        }
        .m-pf-count-sub {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.66rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
          margin: 0;
        }

        .m-pf-controls {
          padding: 0.4rem var(--m-pad-x) 0.8rem;
          position: sticky;
          top: calc(var(--m-safe-t) + 56px);
          background: linear-gradient(
            to bottom,
            rgba(10,10,10,0.92) 0%,
            rgba(10,10,10,0.92) 70%,
            rgba(10,10,10,0) 100%
          );
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 10;
        }
        .m-pf-search {
          position: relative;
          display: flex;
          align-items: center;
          height: 3rem;
          padding: 0 0.75rem;
          background: var(--m-bg-soft);
          border: 1px solid var(--m-border);
          border-radius: 999px;
          margin-bottom: 0.7rem;
          transition:
            border-color var(--m-dur) var(--m-ease),
            box-shadow var(--m-dur) var(--m-ease);
        }
        .m-pf-search:focus-within {
          border-color: var(--m-accent);
          box-shadow: 0 0 0 3px var(--m-accent-soft);
        }
        .m-pf-search-ic {
          color: var(--m-ink-lo);
          margin-right: 0.55rem;
          flex-shrink: 0;
        }
        .m-pf-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--m-ink-hi);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 16px;
          min-width: 0;
        }
        .m-pf-search-input::placeholder {
          color: var(--m-ink-muted);
        }
        .m-pf-search-input::-webkit-search-cancel-button {
          -webkit-appearance: none;
          appearance: none;
        }
        .m-pf-search-clear {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--m-bg-elev);
          border: none;
          color: var(--m-ink-mid);
          cursor: pointer;
        }

        .m-pf-chips-wrap {
          margin-left: calc(-1 * var(--m-pad-x));
          margin-right: calc(-1 * var(--m-pad-x));
        }
        .m-pf-chips {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0 var(--m-pad-x) 0.3rem;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .m-pf-chips::-webkit-scrollbar { display: none; }
        .m-pf-chip {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 36px;
          padding: 0 1rem;
          border: 1px solid var(--m-border);
          border-radius: 999px;
          background: transparent;
          color: var(--m-ink-mid);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition:
            background var(--m-dur) var(--m-ease),
            color var(--m-dur) var(--m-ease),
            border-color var(--m-dur) var(--m-ease),
            transform var(--m-dur-fast) var(--m-ease);
        }
        .m-pf-chip:active { transform: scale(0.96); }
        .m-pf-chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--chip-tone);
          opacity: 0.6;
          transition: opacity var(--m-dur) var(--m-ease), box-shadow var(--m-dur) var(--m-ease);
        }
        .m-pf-chip.is-active {
          background: rgba(255,255,255,0.06);
          color: var(--m-ink-hi);
          border-color: var(--chip-tone);
        }
        .m-pf-chip.is-active .m-pf-chip-dot {
          opacity: 1;
          box-shadow: 0 0 8px var(--chip-tone);
        }

        .m-pf-meta {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.8rem var(--m-pad-x);
        }
        .m-pf-meta-bar {
          width: 18px;
          height: 1px;
          background: var(--m-accent);
        }
        .m-pf-meta-count {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--m-ink-lo);
        }
        .m-pf-meta-filter {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-accent);
        }

        .m-pf-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.4rem;
          padding: 0.5rem var(--m-pad-x) 4rem;
        }
        @media (min-width: 560px) {
          .m-pf-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.4rem 1rem;
          }
        }
        .m-pf-card-wrap {
          width: 100%;
        }
        .m-pf-card {
          display: block;
          transition: transform var(--m-dur-fast) var(--m-ease);
        }
        .m-pf-card:active {
          transform: scale(0.985);
        }
        .m-pf-card-media {
          position: relative;
        }
        .m-pf-card-pill {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          z-index: 4;
        }
        .m-pf-card-idx {
          position: absolute;
          top: 0.95rem;
          right: 1rem;
          z-index: 4;
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          color: var(--m-ink-hi);
          mix-blend-mode: difference;
        }
        .m-pf-card-arrow {
          position: absolute;
          right: 0.85rem;
          bottom: 0.85rem;
          z-index: 4;
          width: 38px;
          height: 38px;
        }
        .m-pf-card-text {
          padding: 0.95rem 0.25rem 0.2rem;
        }
        .m-pf-card-meta {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.55rem;
        }
        .m-pf-card-title {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.2rem;
          line-height: 1.2;
          letter-spacing: -0.018em;
          color: var(--m-ink-hi);
          margin: 0;
          font-weight: 400;
        }

        .m-pf-empty {
          grid-column: 1 / -1;
          padding: 2.5rem 1.2rem 3rem;
          text-align: center;
          border: 1px dashed var(--m-border);
          border-radius: var(--m-r-lg);
          background: rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .m-pf-empty-head {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.2rem;
          color: var(--m-ink-hi);
          margin: 0;
        }
        .m-pf-empty-body {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.9rem;
          color: var(--m-ink-mid);
          margin: 0;
        }
        .m-pf-empty-reset {
          margin-top: 0.5rem;
        }
      `}</style>
    </main>
  );
}
