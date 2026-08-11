'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import MobileAmbient from '@/components/mobile/MobileAmbient';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileScrollReset from '@/components/mobile/MobileScrollReset';
import type { Project, Talent } from '@/lib/types';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  project: Project;
  talent: Talent | null;
  related: Project[];
};

export default function MobileProjectDetail({
  project,
  talent,
  related,
}: Props) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroImgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const frame = heroRef.current;
      const img = heroImgRef.current;
      if (!frame || !img) return;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      img.style.transform = `translate3d(0, ${(progress - 0.5) * 10}%, 0) scale(1.06)`;
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
    <main className="m-pd">
      <MobileScrollReset />
      <MobileAmbient variant="portrait" />

      <Link href="/portfolio" className="m-backlink" aria-label="Back to portfolio">
        <span className="m-backlink-arrow" aria-hidden="true">
          <ArrowLeft size={12} strokeWidth={2.25} />
        </span>
        <span>Portfolio</span>
      </Link>

      <section className="m-pd-hero" ref={heroRef} aria-hidden="false">
        <div ref={heroImgRef} className="m-pd-hero-img-wrap">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="m-pd-hero-img"
          />
        </div>
        <div className="m-grain" />
        <div className="m-pd-hero-vignette" aria-hidden="true" />
        <div className="m-pd-hero-fade" aria-hidden="true" />

        <div className="m-pd-hero-meta">
          <span className="m-chip m-chip--floating m-pd-hero-idx">
            CON · {project.date}
          </span>
          <span className="m-chip m-chip--accent m-pd-hero-svc">
            {project.service}
          </span>
        </div>
      </section>

      <motion.section
        className="m-pd-head"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p className="m-eyebrow">{project.category}</p>
        <h1 className="m-h1 m-pd-title">{project.title}</h1>
        <p className="m-pd-short">{project.shortDescription}</p>
      </motion.section>

      <section className="m-pd-specs" aria-label="Project details">
        {[
          { k: 'Client',     v: project.clientName },
          { k: 'Year',       v: project.date },
          { k: 'Discipline', v: project.service },
          { k: 'Scope',      v: project.category },
        ].map((s, i) => (
          <motion.div
            key={s.k}
            className="m-pd-spec"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
          >
            <p className="m-pd-spec-k">{s.k}</p>
            <p className="m-pd-spec-v">{s.v}</p>
          </motion.div>
        ))}
      </section>

      <motion.section
        className="m-pd-section m-pd-section--overview"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="m-pd-section-head">
          <div className="m-sec-mark m-pd-sec-mark" aria-hidden="true">
            № 02 <b>/ Overview</b>
          </div>
          <p className="m-eyebrow">The brief</p>
        </div>
        <p className="m-pd-long">{project.fullDescription}</p>
      </motion.section>

      <section className="m-pd-credits" aria-label="Credits">
        <div className="m-pd-credit-block">
          <p className="m-eyebrow">Created by</p>
          {talent ? (
            <Link
              href={`/talents/${talent.slug}`}
              className="m-pd-credit-link"
            >
              <span className="m-pd-credit-name">{talent.name}</span>
              <span className="m-pd-credit-role">{talent.role}</span>
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="m-pd-credit-arrow"
              />
            </Link>
          ) : (
            <p className="m-pd-credit-name">{project.primaryTalentId}</p>
          )}
        </div>
        <div className="m-pd-credit-block m-pd-credit-block--right">
          <p className="m-eyebrow">Client</p>
          {project.clientLogo ? (
            <div className="m-pd-client-logo">
              <Image
                src={project.clientLogo}
                alt={project.clientName}
                fill
                sizes="160px"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'right center',
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.6,
                }}
              />
            </div>
          ) : (
            <p className="m-pd-credit-name">{project.clientName}</p>
          )}
        </div>
      </section>

      {project.tags.length > 0 ? (
        <section className="m-pd-tags" aria-label="Tags">
          <p className="m-eyebrow">Tags</p>
          <div className="m-pd-tag-row">
            {project.tags.map((tag) => (
              <span key={tag} className="m-chip m-pd-tag">
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="m-pd-related m-section" aria-label="Related work">
          <div className="m-sec-mark" aria-hidden="true">
            № 03 <b>/ Continue</b>
          </div>

          <div className="m-pd-related-head">
            <div>
              <p className="m-eyebrow">More work</p>
              <h2 className="m-h2 m-pd-related-title">
                Keep<br />
                <em>exploring.</em>
              </h2>
            </div>
            <Link href="/portfolio" className="m-btn m-btn--ghost m-pd-related-all">
              <span>All work</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="m-pd-related-list">
            {related.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.06 }}
              >
                <Link
                  href={`/portfolio/${r.slug}`}
                  className="m-pd-related-card"
                >
                  <div className="m-frame m-frame--43 m-frame--r-lg m-pd-related-media">
                    <Image
                      src={r.thumbnail}
                      alt={r.title}
                      fill
                      sizes="(max-width: 560px) 100vw, 50vw"
                      loading={i < 2 ? 'eager' : 'lazy'}
                    />
                    <div className="m-vign-bottom" />
                    <div className="m-grain" />
                    <span className="m-chip m-chip--floating m-pd-related-pill">
                      {r.service}
                    </span>
                  </div>
                  <p className="m-pd-related-client">{r.clientName}</p>
                  <p className="m-pd-related-name">{r.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      <MobileFooter />

      <style jsx>{`
        .m-pd {
          position: relative;
          min-height: 100svh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }

        .m-pd-hero {
          position: relative;
          width: 100%;
          height: 78svh;
          min-height: 480px;
          max-height: 720px;
          background: var(--m-bg-soft);
          overflow: hidden;
        }
        .m-pd-hero-img-wrap {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .m-pd-hero-img {
          object-fit: cover;
        }
        .m-pd-hero-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              120% 80% at 50% 0%,
              transparent 0%,
              rgba(10, 10, 10, 0.45) 100%
            );
          pointer-events: none;
        }
        .m-pd-hero-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--m-bg) 0%,
            rgba(10, 10, 10, 0.35) 45%,
            rgba(10, 10, 10, 0) 70%
          );
          pointer-events: none;
        }
        .m-pd-hero-meta {
          position: absolute;
          left: var(--m-pad-x);
          right: var(--m-pad-x);
          bottom: 5.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.6rem;
          z-index: 4;
        }

        .m-pd-head {
          padding: 0 var(--m-pad-x) var(--m-sp-7);
          margin-top: -2rem;
          position: relative;
          z-index: 2;
        }
        .m-pd-title {
          margin: 1.3rem 0 1.5rem;
        }
        .m-pd-short {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1.04rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          max-width: 34ch;
        }

        .m-pd-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
          padding: 0 var(--m-pad-x);
          margin-bottom: var(--m-sp-7);
        }
        .m-pd-spec {
          position: relative;
          background: linear-gradient(
            165deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.008) 100%
          );
          border: 1px solid var(--m-border);
          border-radius: var(--m-r-md);
          padding: 1rem 0.9rem 1.05rem;
        }
        .m-pd-spec-k {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.54rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
          margin: 0 0 0.5rem;
        }
        .m-pd-spec-v {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 0.98rem;
          line-height: 1.3;
          color: var(--m-ink-hi);
          margin: 0;
        }

        .m-pd-section {
          position: relative;
          padding: var(--m-sp-8) var(--m-pad-x);
        }
        .m-pd-section-head {
          margin-bottom: 1.2rem;
          position: relative;
        }
        .m-pd-sec-mark {
          position: static;
          display: block;
          margin-bottom: 1rem;
        }
        .m-pd-long {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: var(--m-ink-mid);
          max-width: 42ch;
        }

        .m-pd-credits {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.8rem 1rem;
          padding: var(--m-sp-6) var(--m-pad-x) var(--m-sp-7);
        }
        .m-pd-credit-block .m-eyebrow {
          margin-bottom: 0.8rem;
        }
        .m-pd-credit-block--right {
          text-align: right;
        }
        .m-pd-credit-block--right .m-eyebrow {
          justify-content: flex-end;
        }
        .m-pd-credit-link {
          display: inline-flex;
          flex-direction: column;
          gap: 0.35rem;
          text-decoration: none;
          position: relative;
          padding-right: 1.4rem;
        }
        .m-pd-credit-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.14rem;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
        }
        .m-pd-credit-role {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-accent);
        }
        .m-pd-credit-arrow {
          position: absolute;
          right: 0;
          top: 1px;
          color: var(--m-ink-lo);
        }
        .m-pd-client-logo {
          position: relative;
          width: 140px;
          height: 38px;
          margin-left: auto;
        }

        .m-pd-tags {
          padding: var(--m-sp-5) var(--m-pad-x) var(--m-sp-7);
        }
        .m-pd-tags .m-eyebrow {
          margin-bottom: 1rem;
        }
        .m-pd-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .m-pd-tag {
          color: var(--m-ink-lo);
        }

        .m-pd-related {
          padding-top: var(--m-sp-9);
          padding-bottom: var(--m-sp-9);
        }
        .m-pd-related-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2.2rem;
        }
        .m-pd-related-head .m-eyebrow {
          margin-bottom: 0.9rem;
        }
        .m-pd-related-title {
          margin: 0;
        }
        .m-pd-related-all {
          flex-shrink: 0;
        }
        .m-pd-related-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.8rem;
        }
        @media (min-width: 560px) {
          .m-pd-related-list {
            grid-template-columns: 1fr 1fr;
            gap: 1.4rem 1rem;
          }
        }
        .m-pd-related-card {
          display: block;
          color: var(--m-ink-hi);
          text-decoration: none;
          transition: transform var(--m-dur-fast) var(--m-ease);
        }
        .m-pd-related-card:active {
          transform: scale(0.985);
        }
        .m-pd-related-media {
          margin-bottom: 0.9rem;
        }
        .m-pd-related-pill {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          z-index: 4;
        }
        .m-pd-related-client {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.3rem;
        }
        .m-pd-related-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.02rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
          margin: 0;
        }
      `}</style>
    </main>
  );
}
