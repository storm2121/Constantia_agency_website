'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Project, Talent } from '@/lib/types';
import { getTalentObjectPosition } from '@/lib/talent-presentation';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  talent: Talent;
  projects: Project[];
};

export default function MobileTalentDetail({ talent, projects }: Props) {
  const portraitObjectPosition = getTalentObjectPosition(talent.id);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const portraitImgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const frame = portraitRef.current;
      const img = portraitImgRef.current;
      if (!frame || !img) return;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      img.style.transform = `translate3d(0, ${(progress - 0.5) * 12}%, 0) scale(1.08)`;
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
    <main className="m-td">
      <MobileScrollReset />
      <MobileAmbient variant="portrait" />

      <Link href="/talents" className="m-backlink" aria-label="Back to the people">
        <span className="m-backlink-arrow" aria-hidden="true">
          <ArrowLeft size={12} strokeWidth={2.25} />
        </span>
        <span>The People</span>
      </Link>

      <section className="m-td-portrait" ref={portraitRef} aria-hidden="false">
        <div ref={portraitImgRef} className="m-td-img-wrap">
          <Image
            src={talent.image}
            alt={talent.name}
            fill
            className="m-td-img"
            priority
            sizes="100vw"
            style={portraitObjectPosition ? { objectPosition: portraitObjectPosition } : undefined}
          />
        </div>
        <div className="m-grain" />
        <div className="m-td-vignette" aria-hidden="true" />
        <div className="m-td-fade" aria-hidden="true" />
        <div className="m-td-portrait-meta">
          <span className="m-chip m-chip--accent">Con · {talent.role}</span>
        </div>
      </section>

      <motion.section
        className="m-td-head"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p className="m-eyebrow">{talent.role}</p>
        <h1 className="m-h1 m-td-name">{talent.name}</h1>
        <p className="m-td-short">{talent.shortBio}</p>

        {talent.skills.length > 0 ? (
          <div className="m-td-skills" aria-label="Disciplines">
            {talent.skills.map((skill) => (
              <span key={skill} className="m-chip m-td-skill">
                {skill}
              </span>
            ))}
          </div>
        ) : null}
      </motion.section>

      <section className="m-td-section">
        <div className="m-sec-mark m-td-sec-mark" aria-hidden="true">
          № 02 <b>/ About</b>
        </div>
        <p className="m-eyebrow">Biography</p>
        <p className="m-td-bio">{talent.fullBio}</p>
      </section>

      {talent.clients.length > 0 ? (
        <section className="m-td-section m-td-section--clients">
          <p className="m-eyebrow">Trusted by</p>
          <div className="m-td-clients">
            {talent.clients.map((client) => (
              <div key={client.name} className="m-td-client">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={110}
                  height={34}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'left center',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.5,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="m-td-section m-td-section--works">
        <div className="m-sec-mark m-td-sec-mark" aria-hidden="true">
          № 03 <b>/ Selected Work</b>
        </div>
        <div className="m-td-works-head">
          <div>
            <p className="m-eyebrow">Selected Work</p>
            <h2 className="m-h2 m-td-works-title">
              Projects<br />
              <em>by {talent.name.split(' ')[0]}.</em>
            </h2>
          </div>
          <span className="m-numerator m-td-works-count">
            {String(projects.length).padStart(2, '0')}
            <span className="m-numerator-sup">/ SEL</span>
          </span>
        </div>

        {projects.length > 0 ? (
          <div className="m-td-projects">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.06 }}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="m-td-project"
                >
                  <div className="m-frame m-frame--43 m-frame--r-lg m-td-project-media">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 560px) 100vw, 50vw"
                      loading={i < 2 ? 'eager' : 'lazy'}
                    />
                    <div className="m-vign-bottom" />
                    <div className="m-grain" />
                    <span className="m-chip m-chip--floating m-td-project-pill">
                      {project.service}
                    </span>
                    <span className="m-arrow-btn m-td-project-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <p className="m-td-project-client">{project.clientName}</p>
                  <p className="m-td-project-title">{project.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="m-td-empty">Projects coming soon.</p>
        )}
      </section>

      <div className="m-td-viewall-wrap">
        <Link href="/portfolio" className="m-btn m-btn--ghost m-td-viewall">
          <span>View full portfolio</span>
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <MobileFooter />

      <style jsx>{`
        .m-td {
          position: relative;
          min-height: 100svh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }
        .m-td-portrait {
          position: relative;
          width: 100%;
          height: 82svh;
          min-height: 520px;
          max-height: 760px;
          background: var(--m-bg-soft);
          overflow: hidden;
        }
        .m-td-img-wrap {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .m-td-img {
          object-fit: cover;
        }
        .m-td-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              120% 80% at 50% 0%,
              transparent 0%,
              rgba(10, 10, 10, 0.4) 100%
            );
          pointer-events: none;
        }
        .m-td-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--m-bg) 0%,
            rgba(10, 10, 10, 0.3) 45%,
            rgba(10, 10, 10, 0) 70%
          );
          pointer-events: none;
        }
        .m-td-portrait-meta {
          position: absolute;
          left: var(--m-pad-x);
          bottom: 5.5rem;
          z-index: 4;
        }

        .m-td-head {
          padding: 0 var(--m-pad-x) var(--m-sp-7);
          margin-top: -2.5rem;
          position: relative;
          z-index: 2;
        }
        .m-td-head .m-eyebrow {
          margin-bottom: 1.1rem;
        }
        .m-td-name {
          margin: 1rem 0 1.4rem;
        }
        .m-td-short {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1.04rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          margin: 0 0 1.6rem;
          max-width: 36ch;
        }
        .m-td-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .m-td-skill {
          color: var(--m-ink-lo);
        }

        .m-td-section {
          position: relative;
          padding: var(--m-sp-8) var(--m-pad-x);
        }
        .m-td-sec-mark {
          position: static;
          display: block;
          margin-bottom: 1.1rem;
        }
        .m-td-section .m-eyebrow {
          margin-bottom: 1.2rem;
        }
        .m-td-bio {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: var(--m-ink-mid);
          margin: 0;
          max-width: 42ch;
        }

        .m-td-section--clients {
          padding-top: var(--m-sp-6);
        }
        .m-td-clients {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.4rem 1rem;
          align-items: center;
        }
        .m-td-client {
          display: flex;
          align-items: center;
          height: 34px;
        }

        .m-td-section--works {
          padding-top: var(--m-sp-9);
        }
        .m-td-works-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .m-td-works-head .m-eyebrow {
          margin-bottom: 0.8rem;
        }
        .m-td-works-title {
          margin: 0;
        }
        .m-td-works-count {
          font-size: clamp(2.4rem, 10vw, 3.2rem);
          flex-shrink: 0;
        }
        .m-td-projects {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.8rem;
        }
        @media (min-width: 560px) {
          .m-td-projects {
            grid-template-columns: 1fr 1fr;
            gap: 1.4rem 1rem;
          }
        }
        .m-td-project {
          display: block;
          color: var(--m-ink-hi);
          text-decoration: none;
          transition: transform var(--m-dur-fast) var(--m-ease);
        }
        .m-td-project:active {
          transform: scale(0.985);
        }
        .m-td-project-media {
          margin-bottom: 0.85rem;
        }
        .m-td-project-pill {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          z-index: 4;
        }
        .m-td-project-arrow {
          position: absolute;
          right: 0.8rem;
          bottom: 0.8rem;
          z-index: 4;
          width: 36px;
          height: 36px;
        }
        .m-td-project-client {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.3rem;
        }
        .m-td-project-title {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
          margin: 0;
        }
        .m-td-empty {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.9rem;
          color: var(--m-ink-muted);
          margin: 0;
        }

        .m-td-viewall-wrap {
          padding: var(--m-sp-6) var(--m-pad-x) var(--m-sp-8);
        }
      `}</style>
    </main>
  );
}
