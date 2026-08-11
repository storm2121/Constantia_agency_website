'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const footer = footerRef.current;
    const text = textRef.current;
    const bg = bgLayerRef.current;
    if (!footer || !text || !bg) return;

    // Massive text rises from below as footer enters
    gsap.fromTo(text,
      { yPercent: 60 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'center bottom',
          scrub: true,
        } as ScrollTrigger.Vars,
      }
    );

    // Background layer moves slower (parallax depth)
    gsap.fromTo(bg,
      { yPercent: 8 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'center bottom',
          scrub: true,
        } as ScrollTrigger.Vars,
      }
    );
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      style={{
        background: '#293029',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Parallax depth layer (subtle dark radial gradient) */}
      <div
        ref={bgLayerRef}
        style={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Practical links */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '5rem 6% 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '3rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Brand */}
        <div>
          <p style={{
            fontFamily: "'Labil Grotesk', sans-serif",
            fontSize: '1rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'white',
            fontWeight: 400,
            marginBottom: '0.5rem',
          }}>
            Constantia
          </p>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            Creative Agency · Casablanca, Morocco
          </p>
        </div>

        {/* Navigate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '0.5rem',
          }}>
            Navigate
          </p>
          {[
            { label: 'Portfolio / Services', href: '#services' },
            { label: 'Talent', href: '#team' },
            { label: 'Contact', href: '/#contact' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
              transition: 'color 0.3s',
              textDecoration: 'none',
            }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Services */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '0.5rem',
          }}>
            Services
          </p>
          {['Photography', 'Videography', 'Motion Graphics', 'Graphic Design', 'Web Development'].map(s => (
            <span key={s} style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
            }}>
              {s}
            </span>
          ))}
        </div>

        {/* Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '0.5rem',
          }}>
            Contact
          </p>
          <a href="mailto:h.lachheb@constantia.ma" style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            transition: 'color 0.3s',
            textDecoration: 'none',
          }}>
            h.lachheb@constantia.ma
          </a>
          <a href="tel:+212694975470" style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.7)',
            transition: 'color 0.3s',
            textDecoration: 'none',
          }}>
            +212 6 94 97 54 70
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '1.5rem 6%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.05em',
        }}>
          &copy; {new Date().getFullYear()} Constantia. All rights reserved.
        </p>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.08em',
        }}>
          Made in Morocco.
        </p>
      </div>

      {/* Massive rising text */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        height: 'clamp(10rem, 22vw, 22vw)',
        marginTop: '2rem',
      }}>
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            willChange: 'transform',
          }}
        >
          <span style={{
            fontFamily: "'Labil Grotesk', sans-serif",
            fontSize: 'clamp(8rem, 20vw, 22vw)',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            color: 'rgba(255,255,255,0.07)',
            fontWeight: 400,
            display: 'block',
            whiteSpace: 'nowrap',
          }}>
            CONSTANTIA
          </span>
        </div>
      </div>
    </footer>
  );
}
