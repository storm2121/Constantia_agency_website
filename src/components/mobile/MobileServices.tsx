'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

type Service = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  blurb: string;
  image: string;
  video?: { src: string; poster: string };
  href: string;
  tone: 'cyan' | 'warm' | 'deep' | 'rose' | 'neutral';
};

type Props = {
  services?: Service[];
  videoOverrides?: { video?: { src: string; poster: string } };
};

const DEFAULT_SERVICES: Service[] = [
  {
    slug: 'photo',
    index: '01',
    title: 'Photography',
    tagline: 'Concert · Editorial · Advertising',
    blurb:
      'Every frame a deliberate act of seeing — from concert pits to campaign sets.',
    image: '/images/services/photography.jpg',
    href: '/services/photo/portfolio',
    tone: 'cyan',
  },
  {
    slug: 'video',
    index: '02',
    title: 'Videography',
    tagline: 'Brand films · Documentary · Music',
    blurb:
      'Cinematic narratives built with breath and restraint — tension that lingers after the cut.',
    image: '/images/services/videography.jpg',
    href: '/services/video/portfolio',
    tone: 'warm',
  },
  {
    slug: 'motion',
    index: '03',
    title: 'Motion',
    tagline: 'Logos · Explainers · Reels',
    blurb:
      'Timing, easing, and rhythm calibrated until every second lands with intention.',
    image: '/images/services/graphics.jpg',
    href: '/services/motion/portfolio',
    tone: 'deep',
  },
  {
    slug: 'design',
    index: '04',
    title: 'Graphic Design',
    tagline: 'Identity · Campaigns · Direction',
    blurb:
      'Visual systems shaped with precision — identities built to hold pressure across formats.',
    image: '/images/services/video-editing.jpg',
    href: '/services/design/portfolio',
    tone: 'rose',
  },
  {
    slug: 'web',
    index: '05',
    title: 'Web Development',
    tagline: 'Apps · SaaS · Platforms',
    blurb:
      'Scalable digital products — intuitive interfaces backed by robust engineering.',
    image: '/images/services/ai-digital.jpg',
    href: '/services/web/portfolio',
    tone: 'neutral',
  },
];

const TONE_STOPS: Record<Service['tone'], string> = {
  cyan: 'rgba(97,203,248,0.22)',
  warm: 'rgba(243,194,138,0.20)',
  deep: 'rgba(26,126,176,0.24)',
  rose: 'rgba(232,113,142,0.18)',
  neutral: 'rgba(255,255,255,0.04)',
};

export default function MobileServices({ services, videoOverrides }: Props) {
  const list = services ?? DEFAULT_SERVICES;

  return (
    <section id="services" className="m-svc m-section" aria-labelledby="m-svc-title">
      <div className="m-svc-mark" aria-hidden="true">
        № 03 <b>/ Services</b>
      </div>

      <div className="m-svc-head">
        <p className="m-eyebrow">What we do</p>
        <h2 id="m-svc-title" className="m-h2">
          Five disciplines,
          <br />
          <em>one studio.</em>
        </h2>
        <p className="m-lead m-svc-lead">
          Specialists who ship together. Every project passes through
          multiple hands before it earns the Constantia mark.
        </p>
      </div>

      <ul className="m-svc-list" role="list">
        {list.map((svc, i) => {
          const isVideo = svc.slug === 'video' && videoOverrides?.video;
          return (
            <motion.li
              key={svc.slug}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.75, ease: EASE, delay: i * 0.04 }}
              className="m-svc-item"
              style={{ ['--tone' as string]: TONE_STOPS[svc.tone] }}
            >
              <Link
                href={svc.href}
                className="m-svc-card"
                aria-label={`${svc.title} — view work`}
              >
                <div className="m-frame m-frame--1610 m-frame--r-lg m-svc-media">
                  {isVideo && videoOverrides?.video ? (
                    <video
                      src={videoOverrides.video.src}
                      poster={videoOverrides.video.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      loading={i < 2 ? 'eager' : 'lazy'}
                    />
                  )}
                  <div className="m-vign-bottom" />
                  <div className="m-grain" />
                  <span className="m-svc-index">
                    <i /> {svc.index}
                  </span>
                  <span className="m-arrow-btn m-svc-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="m-svc-tone" aria-hidden="true" />
                </div>

                <div className="m-svc-text">
                  <div className="m-svc-head-row">
                    <h3 className="m-svc-name">{svc.title}</h3>
                    <span className="m-svc-dot" aria-hidden="true" />
                  </div>
                  <p className="m-svc-tagline">{svc.tagline}</p>
                  <p className="m-svc-blurb">{svc.blurb}</p>
                  <span className="m-svc-link" aria-hidden="true">
                    View portfolio
                    <span>↗</span>
                  </span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <style jsx>{`
        .m-svc {
          position: relative;
          color: var(--m-ink-hi);
        }
        .m-svc-mark {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.34em;
          color: var(--m-ink-muted);
          margin-bottom: 2.4rem;
          text-transform: uppercase;
        }
        .m-svc-mark b {
          color: var(--m-accent);
          font-weight: 500;
        }
        .m-svc-head {
          margin-bottom: 2.6rem;
        }
        .m-svc-head .m-eyebrow {
          margin-bottom: 1.3rem;
        }
        .m-svc-lead {
          margin-top: 1.3rem;
        }

        .m-svc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }
        .m-svc-item {
          --tone: rgba(255,255,255,0.04);
        }

        .m-svc-card {
          display: block;
          padding: 0.75rem;
          background: linear-gradient(
            160deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.01) 100%
          );
          border: 1px solid var(--m-border);
          border-radius: var(--m-r-xl);
          overflow: hidden;
          transition:
            transform var(--m-dur-fast) var(--m-ease),
            border-color var(--m-dur) var(--m-ease);
          position: relative;
        }
        .m-svc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse 60% 80% at 10% 10%,
            var(--tone) 0%,
            transparent 60%
          );
        }
        .m-svc-card:active {
          transform: scale(0.985);
          border-color: var(--m-border-strong);
        }

        .m-svc-media {
          position: relative;
          margin-bottom: 1.1rem;
        }
        .m-svc-index {
          position: absolute;
          top: 0.9rem;
          left: 0.9rem;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.65rem;
          border-radius: 999px;
          background: rgba(10,10,10,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.32em;
          color: var(--m-ink-hi);
        }
        .m-svc-index i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--m-accent);
          box-shadow: 0 0 8px var(--m-accent-glow);
        }
        .m-svc-arrow {
          position: absolute;
          bottom: 0.9rem;
          right: 0.9rem;
          z-index: 4;
        }
        .m-svc-tone {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: radial-gradient(
            ellipse 60% 60% at 100% 100%,
            var(--tone) 0%,
            transparent 50%
          );
          mix-blend-mode: screen;
          opacity: 0.9;
        }

        .m-svc-text {
          padding: 0.6rem 0.75rem 0.85rem;
          position: relative;
        }
        .m-svc-head-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.4rem;
        }
        .m-svc-name {
          font-family: var(--font-display), 'Labil Grotesk', sans-serif;
          font-size: 1.65rem;
          line-height: 1.05;
          letter-spacing: -0.024em;
          color: var(--m-ink-hi);
          margin: 0;
          font-weight: 400;
        }
        .m-svc-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--tone);
          box-shadow: 0 0 10px var(--tone);
          flex-shrink: 0;
        }
        .m-svc-tagline {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-accent);
          margin: 0 0 0.75rem;
        }
        .m-svc-blurb {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.93rem;
          line-height: 1.6;
          color: var(--m-ink-mid);
          margin: 0 0 1rem;
        }
        .m-svc-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--m-ink-hi);
          padding-bottom: 0.25rem;
          border-bottom: 1px solid var(--m-border-strong);
        }
        .m-svc-link span {
          color: var(--m-accent);
        }
      `}</style>
    </section>
  );
}
