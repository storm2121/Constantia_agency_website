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
import type { ServicePortfolioConfig } from '@/lib/service-portfolios';

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
  project: Project;
  talent: Talent | null;
  heroImage: string;
  galleryImages: string[];
  caseStudyCredit?: string;
  backHref: string;
  backLabel: string;
};

export default function MobileServiceProjectDetail({
  service,
  project,
  talent,
  heroImage,
  galleryImages,
  caseStudyCredit,
  backHref,
  backLabel,
}: Props) {
  const gallery = galleryImages.filter(
    (src, index, list) =>
      Boolean(src) && list.indexOf(src) === index && src !== heroImage
  );
  const tone = SERVICE_TONE[service.slug] ?? SERVICE_TONE.photo;

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
    <main
      className="m-scs"
      style={{
        ['--scs-tone-color' as string]: tone.color,
        ['--scs-tone-glow' as string]: tone.glow,
      }}
    >
      <MobileScrollReset />
      <MobileAmbient variant="portrait" />

      <Link href={backHref} className="m-backlink" aria-label={`Back to ${backLabel}`}>
        <span className="m-backlink-arrow" aria-hidden="true">
          <ArrowLeft size={12} strokeWidth={2.25} />
        </span>
        <span>{backLabel}</span>
      </Link>

      <section className="m-scs-hero" ref={heroRef} aria-hidden="false">
        <div ref={heroImgRef} className="m-scs-hero-img-wrap">
          <Image
            src={heroImage}
            alt={project.title}
            fill
            className="m-scs-hero-img"
            priority
            sizes="100vw"
          />
        </div>
        <div className="m-grain" />
        <div className="m-scs-hero-vignette" aria-hidden="true" />
        <div className="m-scs-hero-fade" aria-hidden="true" />
        <div className="m-scs-hero-meta">
          <span className="m-chip m-chip--floating m-scs-hero-idx">
            CON · {project.date}
          </span>
          <span className="m-chip m-chip--accent m-scs-hero-svc">
            {service.title}
          </span>
        </div>
      </section>

      <motion.section
        className="m-scs-head"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="m-scs-breadcrumb">
          <span>{service.title}</span>
          <span className="m-scs-slash">/</span>
          <span className="m-scs-breadcrumb-accent">{project.category}</span>
        </div>
        <h1 className="m-h1 m-scs-title">{project.title}</h1>
        <p className="m-scs-short">{project.shortDescription}</p>
      </motion.section>

      <section className="m-scs-specs" aria-label="Project details">
        {[
          { k: 'Client',     v: project.clientName },
          { k: 'Year',       v: project.date },
          { k: 'Discipline', v: service.title },
          { k: 'Scope',      v: project.category },
        ].map((s, i) => (
          <motion.div
            key={s.k}
            className="m-scs-spec"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
          >
            <p className="m-scs-spec-k">{s.k}</p>
            <p className="m-scs-spec-v">{s.v}</p>
          </motion.div>
        ))}
      </section>

      <motion.section
        className="m-scs-section"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="m-sec-mark m-scs-sec-mark" aria-hidden="true">
          № 02 <b>/ Overview</b>
        </div>
        <p className="m-eyebrow">The brief</p>
        <p className="m-scs-long">{project.fullDescription}</p>
      </motion.section>

      {gallery.length > 0 ? (
        <section className="m-scs-gallery" aria-label="Gallery">
          <div className="m-sec-mark m-scs-sec-mark" aria-hidden="true">
            № 03 <b>/ Gallery</b>
          </div>
          <div className="m-scs-gallery-head">
            <p className="m-eyebrow">Production frames</p>
            <span className="m-numerator m-scs-gallery-count">
              {String(gallery.length).padStart(2, '0')}
              <span className="m-numerator-sup">/ GAL</span>
            </span>
          </div>
          <div className="m-scs-gallery-grid">
            {gallery.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                className="m-frame m-frame--43 m-frame--r-md m-scs-gallery-item"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-3% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.05 }}
              >
                <Image
                  src={src}
                  alt={`${project.title} frame ${i + 1}`}
                  fill
                  sizes="(max-width: 560px) 100vw, 50vw"
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
                <div className="m-grain" />
                <span className="m-chip m-chip--floating m-scs-gallery-idx">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="m-scs-credits" aria-label="Credits">
        <div className="m-scs-credit-block">
          <p className="m-eyebrow">Created by</p>
          {talent ? (
            <Link href={`/talents/${talent.slug}`} className="m-scs-credit-link">
              <span className="m-scs-credit-name">{talent.name}</span>
              <span className="m-scs-credit-role">
                {(caseStudyCredit ?? talent.role).toUpperCase()}
              </span>
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="m-scs-credit-arrow"
              />
            </Link>
          ) : (
            <p className="m-scs-credit-name">Constantia</p>
          )}
        </div>
        <div className="m-scs-credit-block m-scs-credit-block--right">
          <p className="m-eyebrow">Client</p>
          {project.clientLogo ? (
            <div className="m-scs-client-logo">
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
            <p className="m-scs-credit-name">{project.clientName}</p>
          )}
        </div>
      </section>

      {project.tags.length > 0 ? (
        <section className="m-scs-tags" aria-label="Tags">
          <p className="m-eyebrow">Tags</p>
          <div className="m-scs-tag-row">
            {project.tags.map((tag) => (
              <span key={tag} className="m-chip m-scs-tag">
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="m-scs-viewall-wrap">
        <Link href={service.href} className="m-btn m-btn--ghost m-scs-viewall">
          <span>View all {service.title.toLowerCase()}</span>
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <MobileFooter />

      <style jsx>{`
        .m-scs {
          position: relative;
          min-height: 100svh;
          color: var(--m-ink-hi);
          isolation: isolate;
        }
        .m-scs-hero {
          position: relative;
          width: 100%;
          height: 78svh;
          min-height: 480px;
          max-height: 720px;
          background: var(--m-bg-soft);
          overflow: hidden;
        }
        .m-scs-hero-img-wrap {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .m-scs-hero-img {
          object-fit: cover;
        }
        .m-scs-hero-vignette {
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
        .m-scs-hero-fade {
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
        .m-scs-hero-meta {
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

        .m-scs-head {
          padding: 0 var(--m-pad-x) var(--m-sp-7);
          margin-top: -2rem;
          position: relative;
          z-index: 2;
        }
        .m-scs-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-ink-mid);
          margin-bottom: 1.2rem;
        }
        .m-scs-slash {
          color: var(--m-ink-muted);
        }
        .m-scs-breadcrumb-accent {
          color: var(--scs-tone-color);
        }
        .m-scs-title {
          margin: 0 0 1.5rem;
        }
        .m-scs-title :global(em) {
          color: var(--scs-tone-color);
        }
        .m-scs-short {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1.04rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          max-width: 34ch;
          margin: 0;
        }

        .m-scs-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
          padding: 0 var(--m-pad-x);
          margin-bottom: var(--m-sp-7);
        }
        .m-scs-spec {
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
        .m-scs-spec-k {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.54rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--m-ink-muted);
          margin: 0 0 0.5rem;
        }
        .m-scs-spec-v {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 0.98rem;
          line-height: 1.3;
          color: var(--m-ink-hi);
          margin: 0;
        }

        .m-scs-section {
          position: relative;
          padding: var(--m-sp-8) var(--m-pad-x);
        }
        .m-scs-sec-mark {
          position: static;
          display: block;
          margin-bottom: 1rem;
        }
        .m-scs-section .m-eyebrow {
          margin-bottom: 1.2rem;
        }
        .m-scs-long {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: var(--m-ink-mid);
          max-width: 42ch;
          margin: 0;
        }

        .m-scs-gallery {
          position: relative;
          padding: var(--m-sp-7) var(--m-pad-x) var(--m-sp-8);
        }
        .m-scs-gallery-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.6rem;
        }
        .m-scs-gallery-head .m-eyebrow {
          margin-bottom: 0;
        }
        .m-scs-gallery-count {
          font-size: clamp(1.8rem, 8vw, 2.4rem);
          flex-shrink: 0;
        }
        .m-scs-gallery-count :global(.m-numerator-sup) {
          color: var(--scs-tone-color);
        }
        .m-scs-gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
        }
        @media (min-width: 560px) {
          .m-scs-gallery-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .m-scs-gallery-item {
          position: relative;
        }
        .m-scs-gallery-idx {
          position: absolute;
          top: 0.7rem;
          right: 0.7rem;
          z-index: 4;
          font-size: 0.5rem;
          padding: 0.28rem 0.48rem;
        }

        .m-scs-credits {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.8rem 1rem;
          padding: var(--m-sp-6) var(--m-pad-x) var(--m-sp-7);
        }
        .m-scs-credit-block .m-eyebrow {
          margin-bottom: 0.8rem;
        }
        .m-scs-credit-block--right {
          text-align: right;
        }
        .m-scs-credit-block--right .m-eyebrow {
          justify-content: flex-end;
        }
        .m-scs-credit-link {
          display: inline-flex;
          flex-direction: column;
          gap: 0.3rem;
          text-decoration: none;
          position: relative;
          padding-right: 1.4rem;
        }
        .m-scs-credit-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.12rem;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--m-ink-hi);
        }
        .m-scs-credit-role {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--scs-tone-color);
        }
        .m-scs-credit-arrow {
          position: absolute;
          right: 0;
          top: 1px;
          color: var(--m-ink-lo);
        }
        .m-scs-client-logo {
          position: relative;
          width: 140px;
          height: 38px;
          margin-left: auto;
        }

        .m-scs-tags {
          padding: var(--m-sp-5) var(--m-pad-x) var(--m-sp-7);
        }
        .m-scs-tags .m-eyebrow {
          margin-bottom: 1rem;
        }
        .m-scs-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .m-scs-tag {
          color: var(--m-ink-lo);
        }

        .m-scs-viewall-wrap {
          padding: var(--m-sp-6) var(--m-pad-x) var(--m-sp-8);
        }
      `}</style>
    </main>
  );
}
