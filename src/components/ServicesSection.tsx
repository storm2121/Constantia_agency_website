'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const services = [
  { name: 'Photography', image: '/images/services/photography.jpg', description: 'Documenting moments with precision and artistry.' },
  { name: 'Videography', image: '/images/services/videography.jpg', description: 'Cinematic storytelling for brands and events.' },
  { name: 'Video Editing', image: '/images/services/video-editing.jpg', description: 'Post-production that elevates raw footage.' },
  { name: 'Graphic Design', image: '/images/services/graphics.jpg', description: 'Visual identities and print that endure.' },
  { name: 'Web Development', image: '/images/services/video-editing.jpg', description: 'Web platforms and systems built with clarity, performance, and longevity.' },
  { name: 'Social Media', image: null, description: 'Strategy and content that builds audiences.' },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      ScrollTrigger.create({
        trigger: panel,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      });
    });
  }, { scope: sectionRef });

  useEffect(() => {
    const item = itemRefs.current[active];
    const dot = dotRef.current;
    if (!item || !dot) return;
    const itemRect = item.getBoundingClientRect();
    const dotParentRect = dot.parentElement?.getBoundingClientRect();
    if (!dotParentRect) return;
    const y = itemRect.top - dotParentRect.top + itemRect.height / 2 - 4;
    gsap.to(dot, { y, duration: 0.5, ease: 'power3.out' });
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        position: 'relative',
        background: '#0a0a0a',
        borderRadius: '20px 20px 0 0',
      }}
    >
      <div style={{ padding: '10rem 6% 5rem', maxWidth: '1440px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.78rem',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: '1.2rem',
        }}>
          What we do
        </p>
        <h2 style={{
          fontFamily: "'Labil Grotesk', sans-serif",
          fontSize: 'clamp(3rem, 7vw, 8rem)',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          color: 'white',
          fontWeight: 400,
        }}>
          Our services.
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{
          width: '35%',
          position: 'sticky',
          top: '20%',
          alignSelf: 'flex-start',
          padding: '0 6%',
          paddingBottom: '10rem',
        }}>
          <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
            <div
              ref={dotRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.6)',
                transform: 'translateY(0)',
              }}
            />

            {services.map((svc, i) => (
              <div
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                style={{
                  paddingTop: i === 0 ? 0 : '2.5rem',
                  paddingBottom: '2.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'default',
                  transition: 'opacity 0.4s',
                  opacity: active === i ? 1 : 0.3,
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '0.5rem',
                  opacity: active === i ? 1 : 0,
                  transition: 'opacity 0.4s',
                }}>
                  0{i + 1}
                </p>
                <h3 style={{
                  fontFamily: "'Labil Grotesk', sans-serif",
                  fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                  letterSpacing: '-0.02em',
                  color: active === i ? 'white' : 'rgba(255,255,255,0.4)',
                  fontWeight: 400,
                  transition: 'color 0.4s',
                  lineHeight: 1.1,
                }}>
                  {svc.name}
                </h3>
                {active === i && (
                  <p style={{
                    marginTop: '0.8rem',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '1rem',
                    color: 'var(--c-gray)',
                    lineHeight: 1.5,
                  }}>
                    {svc.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '65%', position: 'relative' }}>
          {services.map((svc, i) => (
            <div
              key={i}
              ref={el => { panelRefs.current[i] = el; }}
              style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
            >
              {svc.image ? (
                <img
                  src={svc.image}
                  alt={svc.name}
                  style={{
                    width: '100%',
                    height: '110%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '-5%',
                    left: 0,
                    transform: active === i ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 8s ease-out, opacity 0.6s ease',
                    opacity: active === i ? 1 : 0.2,
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(160deg, #080d14 0%, #0d1420 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <p style={{
                    fontFamily: "'Labil Grotesk', sans-serif",
                    fontSize: 'clamp(2rem, 4vw, 4rem)',
                    color: 'rgba(255,255,255,0.08)',
                    letterSpacing: '-0.03em',
                  }}>
                    Social Media
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
