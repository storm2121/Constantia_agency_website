'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Project, Talent } from '@/lib/types';
import { getServicePortfolioProjectHref } from '@/lib/service-portfolios';
import {
  getDesignTalentPresentation,
  getTalentObjectPosition,
} from '@/lib/talent-presentation';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  talent: Talent;
  projects: Project[];
};

export default function MobileDesignTalentPortfolio({
  talent,
  projects,
}: Props) {
  const presentation = getDesignTalentPresentation(talent.id);
  const portraitPosition = getTalentObjectPosition(talent.id);
  const focus =
    presentation?.focus ??
    (talent.skills.length > 0 ? talent.skills.slice(0, 3).join(' / ') : 'design');
  const role = presentation?.role ?? talent.role;

  return (
    <main className="m-dt">
      <MobileScrollReset />
      <Link
        href="/services/design/portfolio"
        className="m-backlink"
        aria-label="Back to graphic design"
      >
        <span className="m-backlink-arrow" aria-hidden="true">
          <ArrowLeft size={12} strokeWidth={2.25} />
        </span>
        <span>Graphic Design</span>
      </Link>

      <section className="m-dt-hero" aria-hidden="false">
        <Image
          src={talent.image}
          alt={talent.name}
          fill
          priority
          sizes="100vw"
          className="m-dt-hero-img"
          style={portraitPosition ? { objectPosition: portraitPosition } : undefined}
        />
        <div className="m-dt-hero-vignette" aria-hidden="true" />
        <div className="m-dt-hero-fade" aria-hidden="true" />
        <div className="m-dt-hero-meta">
          <span className="m-dt-hero-mark">Con — Design Portfolio</span>
        </div>
      </section>

      <motion.section
        className="m-dt-head"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p className="m-eyebrow">— {role}</p>
        <h1 className="m-h1 m-dt-title">{talent.name}</h1>
        <p className="m-dt-bio">{presentation?.detailBio ?? talent.fullBio}</p>
        <div className="m-dt-meta">
          <span className="m-dt-pill m-dt-pill-accent">
            {projects.length}{' '}
            {projects.length === 1 ? 'collection' : 'collections'}
          </span>
          <span className="m-dt-pill">{focus}</span>
        </div>
      </motion.section>

      <section className="m-dt-collections" aria-label="Collections">
        <div className="m-dt-section-head">
          <p className="m-eyebrow">— Collections</p>
          <span className="m-dt-section-count">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>
        <div className="m-dt-collection-list">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-3% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.04 }}
            >
              <Link
                href={getServicePortfolioProjectHref('design', project.slug)}
                className="m-dt-collection"
              >
                <div className="m-dt-collection-media">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 560px) 100vw, 50vw"
                    className="m-dt-collection-img"
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  <span className="m-dt-collection-pill">{project.category}</span>
                </div>
                <p className="m-dt-collection-year">{project.date}</p>
                <p className="m-dt-collection-title">{project.title}</p>
                <p className="m-dt-collection-desc">{project.shortDescription}</p>
                {project.tags.length > 0 ? (
                  <p className="m-dt-collection-tags">
                    {project.tags.slice(0, 3).join(' / ')}
                  </p>
                ) : null}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <MobileFooter />

      <style jsx>{`
        .m-dt {
          background: var(--m-bg);
          color: var(--m-ink-hi);
          min-height: 100svh;
        }
        .m-dt-hero {
          position: relative;
          width: 100%;
          height: 76svh;
          min-height: 500px;
          max-height: 720px;
          background: var(--m-bg-soft);
          overflow: hidden;
        }
        .m-dt-hero-img {
          object-fit: cover;
        }
        .m-dt-hero-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              120% 80% at 50% 0%,
              transparent 0%,
              rgba(10, 10, 10, 0.3) 100%
            );
          pointer-events: none;
        }
        .m-dt-hero-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--m-bg) 0%,
            rgba(10, 10, 10, 0.25) 45%,
            rgba(10, 10, 10, 0) 70%
          );
          pointer-events: none;
        }
        .m-dt-hero-meta {
          position: absolute;
          left: var(--m-pad-x);
          bottom: 5.5rem;
        }
        .m-dt-hero-mark {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-accent);
        }

        .m-dt-head {
          padding: 0 var(--m-pad-x) var(--m-sp-7);
          margin-top: -2.5rem;
          position: relative;
          z-index: 2;
        }
        .m-dt-head .m-eyebrow {
          margin-bottom: 1rem;
        }
        .m-dt-title {
          margin: 0 0 1.3rem;
        }
        .m-dt-bio {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.68;
          color: var(--m-ink-mid);
          margin: 0 0 1.5rem;
          max-width: 38ch;
        }
        .m-dt-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .m-dt-pill {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--m-ink-lo);
          border: 1px solid var(--m-border-strong);
          padding: 0.42rem 0.7rem;
          border-radius: 999px;
        }
        .m-dt-pill-accent {
          color: var(--m-accent);
          border-color: var(--m-accent-dim);
        }

        .m-dt-collections {
          padding: var(--m-sp-7) var(--m-pad-x) var(--m-sp-9);
          border-top: 1px solid var(--m-border);
        }
        .m-dt-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.6rem;
        }
        .m-dt-section-head .m-eyebrow {
          margin-bottom: 0;
        }
        .m-dt-section-count {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.2rem;
          line-height: 1;
          color: var(--m-accent);
        }
        .m-dt-collection-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.8rem;
        }
        @media (min-width: 560px) {
          .m-dt-collection-list {
            grid-template-columns: 1fr 1fr;
            gap: 1.6rem 1rem;
          }
        }
        .m-dt-collection {
          display: block;
          color: var(--m-ink-hi);
          text-decoration: none;
        }
        .m-dt-collection-media {
          position: relative;
          aspect-ratio: 4 / 3;
          background: var(--m-bg-soft);
          border-radius: var(--m-r-md);
          overflow: hidden;
          margin-bottom: 0.85rem;
        }
        .m-dt-collection-img {
          object-fit: cover;
        }
        .m-dt-collection-pill {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--m-ink-hi);
          background: rgba(10, 10, 10, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.35rem 0.55rem;
          border-radius: 999px;
        }
        .m-dt-collection-year {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.54rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.35rem;
        }
        .m-dt-collection-title {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.05rem;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
          margin: 0 0 0.45rem;
        }
        .m-dt-collection-desc {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--m-ink-mid);
          margin: 0 0 0.55rem;
        }
        .m-dt-collection-tags {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
          margin: 0;
        }
      `}</style>
    </main>
  );
}
