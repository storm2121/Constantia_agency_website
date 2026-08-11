'use client';

import Link from 'next/link';
import { useRef, useCallback } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/* ─────────────────────────────────────────────────────────────
   Project data
───────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    num: '01',
    title: 'Concert Event Photography',
    category: 'Photography',
    year: '2024',
    hook: 'Raw energy seized at the threshold — where stage light meets decisive moment.',
    highlights: ['Live event coverage', 'Concert documentation', 'Editorial print'],
    role: 'Lead Photographer',
    deliverables: 'Photography · Post-processing · Print',
    duration: '2 days',
    src: '/images/portfolio/project-01-photography.jpg',
    surface: '#181818',
    status: 'Published',
    featured: true,
  },
  {
    num: '02',
    title: 'Revival',
    category: 'Advertising Film',
    year: '2024',
    hook: 'A cinematic narrative in 90 seconds — built on tension before the first cut.',
    highlights: ['Advertising short film', 'Cinematography direction', 'Color grading'],
    role: 'Director of Photography',
    deliverables: 'Script · Direction · Color',
    duration: '3 weeks',
    src: '/images/portfolio/project-02-videography.jpg',
    surface: '#1a1916',
    status: 'Live',
    featured: false,
  },
  {
    num: '03',
    title: 'Biban Lkhir',
    category: 'Brand Film',
    year: '2024',
    hook: 'A cultural brand story told through documentary restraint and feeling.',
    highlights: ['Brand storytelling', 'Event documentation', 'Multi-platform delivery'],
    role: 'Creative Direction',
    deliverables: 'Direction · Edit · Sound',
    duration: '4 weeks',
    src: '/images/portfolio/project-03-event.jpg',
    surface: '#161a1c',
    status: 'Case Study',
    featured: false,
  },
  {
    num: '04',
    title: 'International Conference',
    category: 'Conference',
    year: '2024',
    hook: 'Professional documentation built for broadcast precision and international reach.',
    highlights: ['Live event coverage', 'Editorial photography', 'Multi-day production'],
    role: 'Lead Photographer',
    deliverables: 'Photography · Archive · Licensing',
    duration: '5 days',
    src: '/images/portfolio/project-04-conference.jpg',
    surface: '#191917',
    status: 'Live',
    featured: false,
  },
  {
    num: '05',
    title: 'Landscape & Aerial Series',
    category: 'Aerial · Landscape',
    year: '2024',
    hook: 'Morocco seen from above — frames that reframe what the eye already knows.',
    highlights: ['Aerial photography', 'Drone cinematography', 'Fine art editions'],
    role: 'Aerial Director',
    deliverables: 'Photography · Drone · Print',
    duration: '6 weeks',
    src: '/images/portfolio/project-05-landscape.jpg',
    surface: '#1a1719',
    status: 'Selected',
    featured: false,
  },
] as const;

type Project = typeof PROJECTS[number];

/* ─────────────────────────────────────────────────────────────
   Individual card
───────────────────────────────────────────────────────────── */
function WorkCard({ project, index }: { project: Project; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const isFlipped  = index % 2 !== 0;
  const isFeatured = project.featured;

  /* scroll reveal */
  useGSAP(() => {
    if (!cardRef.current || !imgRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });

    // Card fades from invisible
    tl.set(cardRef.current, { opacity: 1 });

    // Image: subtle scale reveal
    tl.fromTo(imgRef.current,
      { scale: 1.06, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' },
      0
    );

    // Content children stagger (scoped to card)
    tl.fromTo('.wc-reveal',
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 },
      0.1
    );

    // Case strip fades in last
    tl.fromTo('.wc-strip',
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out' },
      0.55
    );
  }, { scope: cardRef });

  /* hover */
  const handleEnter = useCallback(() => {
    gsap.to(cardRef.current,  { y: -5, duration: 0.55, ease: 'power2.out' });
    gsap.to(imgRef.current,   { scale: 1.025, duration: 0.7, ease: 'power2.out' });
    gsap.to(lineRef.current,  { width: '100%', duration: 0.6, ease: 'power3.out' });
    gsap.to(arrowRef.current, { x: 5, duration: 0.35, ease: 'power2.out' });
  }, []);

  const handleLeave = useCallback(() => {
    gsap.to(cardRef.current,  { y: 0, duration: 0.55, ease: 'power2.out' });
    gsap.to(imgRef.current,   { scale: 1, duration: 0.7, ease: 'power2.out' });
    gsap.to(lineRef.current,  { width: '0%', duration: 0.4, ease: 'power2.in' });
    gsap.to(arrowRef.current, { x: 0, duration: 0.35, ease: 'power2.out' });
  }, []);

  return (
    <article
      ref={cardRef}
      className={`wc-card${isFlipped ? ' wc-flipped' : ''}${isFeatured ? ' wc-featured' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        background: project.surface,
        borderRadius: '24px',
        overflow: 'hidden',
        opacity: 0,
        cursor: 'pointer',
        willChange: 'transform',
        position: 'relative',
      }}
    >
      {/* ── Image area ── */}
      <div className="wc-image" style={{ overflow: 'hidden', position: 'relative' }}>
        <img
          ref={imgRef}
          src={project.src}
          alt={project.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transformOrigin: 'center center',
          }}
        />

        {/* Editorial gradient — blends image edge into card surface */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isFlipped
            ? `linear-gradient(to left,  transparent 50%, ${project.surface}CC 100%)`
            : `linear-gradient(to right, transparent 50%, ${project.surface}CC 100%)`,
          pointerEvents: 'none',
        }} />

        {/* Subtle bottom vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        {/* Status badge */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.52)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '100px',
          padding: '5px 14px',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.62rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}>
          {project.status}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="wc-content" style={{
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>

        {/* Top meta */}
        <div className="wc-reveal" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}>
          <div>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.65rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              marginBottom: '5px',
            }}>
              {project.num}
            </span>
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--c-cyan)',
              opacity: 0.85,
            }}>
              {project.category}
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.18)',
            marginTop: '2px',
          }}>
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="wc-reveal" style={{
          fontFamily: "'Labil Grotesk', sans-serif",
          fontSize: isFeatured
            ? 'clamp(2.2rem, 3.6vw, 4.2rem)'
            : 'clamp(1.75rem, 2.6vw, 3rem)',
          letterSpacing: '-0.03em',
          lineHeight: 0.97,
          color: '#ffffff',
          fontWeight: 400,
          marginBottom: '14px',
        }}>
          {project.title}
        </h3>

        {/* Hook */}
        <p className="wc-reveal" style={{
          fontFamily: 'var(--font-inter)',
          fontSize: isFeatured ? '1.0rem' : '0.9rem',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.42)',
          marginBottom: '24px',
          maxWidth: '360px',
        }}>
          {project.hook}
        </p>

        {/* Highlights */}
        <div className="wc-reveal" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '9px',
          marginBottom: '32px',
        }}>
          {project.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--c-cyan)',
                flexShrink: 0,
                opacity: 0.6,
              }} />
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.38)',
              }}>
                {h}
              </span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA with hover line */}
        <div className="wc-reveal">
          <div style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '18px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div
              ref={lineRef}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                height: '100%',
                width: '0%',
                background: 'rgba(255,255,255,0.3)',
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              View project
            </span>
            <span
              ref={arrowRef}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.35)',
                display: 'inline-block',
                lineHeight: 1,
              }}
            >
              ↗
            </span>
          </div>
        </div>

        {/* Case study strip */}
        <div className="wc-strip" style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {([
            { label: 'Role',         value: project.role },
            { label: 'Deliverables', value: project.deliverables },
            { label: 'Duration',     value: project.duration },
          ] as const).map(item => (
            <div key={item.label}>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.56rem',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.18)',
                marginBottom: '4px',
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.32)',
                letterSpacing: '0.01em',
              }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main section
───────────────────────────────────────────────────────────── */
export default function WorkBento() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Eyebrow
    gsap.fromTo(eyebrowRef.current,
      { opacity: 0, y: 14 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      }
    );

    // Headline — animate by line (not char — keeps it sharp and readable)
    if (headlineRef.current) {
      const lines = headlineRef.current.querySelectorAll('.wc-hl');
      gsap.fromTo(lines,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 1.05, ease: 'power4.out', stagger: 0.13,
          scrollTrigger: { trigger: headlineRef.current, start: 'top 84%', toggleActions: 'play none none reverse' },
        }
      );
    }

    // Card Morph Sequence (Physical gap)
    gsap.fromTo(sectionRef.current,
      { y: 150, borderRadius: '160px 160px 0 0', scale: 0.94 },
      {
        y: 0, borderRadius: '28px 28px 0 0', scale: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', 
          end: 'top 40%',
          scrub: 1,
        }
      }
    );

    // Supporting line
    gsap.fromTo(subRef.current,
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', delay: 0.25,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', toggleActions: 'play none none reverse' },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-[#0e0e0e] rounded-t-[28px] px-[32px] pt-[15vh] pb-[35vh] mt-[15vh]"
    >
      {/* ── Responsive grid + motion rules ── */}
      <style>{`
        /* Card grid */
        .wc-card {
          display: grid;
          grid-template-columns: 7fr 5fr;
          min-height: 560px;
        }
        .wc-card.wc-featured {
          min-height: 660px;
        }
        .wc-card.wc-flipped {
          grid-template-columns: 5fr 7fr;
        }
        .wc-card.wc-flipped .wc-image   { order: 2; }
        .wc-card.wc-flipped .wc-content { order: 1; }

        /* Mobile */
        @media (max-width: 767px) {
          .wc-card,
          .wc-card.wc-flipped {
            grid-template-columns: 1fr;
            min-height: unset;
            border-radius: 18px !important;
          }
          .wc-image   { order: 1 !important; aspect-ratio: 4 / 5; height: auto !important; }
          .wc-content { order: 2 !important; padding: 20px !important; }
        }

        /* Reduced motion — show everything immediately */
        @media (prefers-reduced-motion: reduce) {
          .wc-card     { opacity: 1 !important; transform: none !important; }
          .wc-reveal,
          .wc-strip    { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Section header ── */}
        <div style={{ maxWidth: '760px', marginBottom: '64px' }}>

          <p ref={eyebrowRef} style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            marginBottom: '28px',
          }}>
            Selected Work
          </p>

          <h2 ref={headlineRef} style={{
            fontFamily: "'Labil Grotesk', sans-serif",
            fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
            letterSpacing: '-0.035em',
            lineHeight: 0.97,
            color: '#ffffff',
            fontWeight: 400,
            marginBottom: '22px',
          }}>
            <span className="wc-hl" style={{ display: 'block' }}>Work that holds up</span>
            <span className="wc-hl" style={{ display: 'block' }}>under attention.</span>
          </h2>

          <p ref={subRef} style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.35)',
          }}>
            Photography, film, and event productions built to be<br />
            remembered — not just seen.
          </p>

        </div>

        {/* ── Project cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {PROJECTS.map((project, i) => (
            <WorkCard key={project.num} project={project} index={i} />
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '72px' }}>
          <Link
            href="/portfolio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.85rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.72rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '1rem 2.2rem',
              transition: 'color 0.35s ease, border-color 0.35s ease',
            }}
          >
            View all work <span style={{ marginLeft: '0.3rem' }}>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
