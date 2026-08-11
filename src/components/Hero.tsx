'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const PHASE_END = 3.1;
const HERO_DISCIPLINE_SEPARATOR = ' \u00B7 ';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<SVGSVGElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const videoWrapper = videoWrapperRef.current;
    if (!videoWrapper) return;

    gsap.set(videoWrapper, { yPercent: -100 });

    gsap.to(videoWrapper, {
      yPercent: 0,
      duration: 1.2,
      ease: 'power3.inOut',
      delay: PHASE_END,
    });

    if (wordmarkRef.current) {
      gsap.fromTo(
        wordmarkRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: 'none', delay: PHASE_END + 1.1 }
      );
    }

    if (headlineRef.current) {
      gsap.fromTo(
        headlineRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, ease: 'power2.out', delay: PHASE_END + 0.9 }
      );
    }

    return () => {};
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    const video = videoRef.current;

    if (!section || !strip) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self: ScrollTrigger) => {
          if (!video || !video.duration) return;
          const SCRUB_START = 0.25;
          if (self.progress >= SCRUB_START) {
            const vp = (self.progress - SCRUB_START) / (1 - SCRUB_START);
            targetTimeRef.current = Math.min(vp, 0.9999) * video.duration;
          }
        },
      } as ScrollTrigger.Vars,
    });

    tl.to(
      strip,
      {
        yPercent: 100,
        ease: 'power1.inOut',
        duration: 1,
      },
      0
    );

    if (wordmarkRef.current) {
      tl.to(wordmarkRef.current, { autoAlpha: 0, y: -30, ease: 'power1.in', duration: 0.8 }, 0.2);
    }

    if (headlineRef.current) {
      tl.to(headlineRef.current, { autoAlpha: 0, ease: 'power1.in', duration: 0.8 }, 0);
    }

    tl.to({}, { duration: 3 }, 1);

    const st = tl.scrollTrigger!;
    st.disable(false);
    // Wait for LoadingScreen to finish before enabling scroll-driven animations
    const checkLoading = () => {
      if (window.__loadingDone) {
        st.enable();
      } else {
        requestAnimationFrame(checkLoading);
      }
    };
    requestAnimationFrame(checkLoading);

    if (stickyContainerRef.current) {
      gsap.set(section, { backgroundColor: '#000000' });

      gsap.to(stickyContainerRef.current, {
        borderBottomLeftRadius: '11vw',
        borderBottomRightRadius: '11vw',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.fromTo(
        stickyContainerRef.current,
        { y: 0 },
        {
          y: () => window.innerHeight * 0.8,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }
  }, { scope: sectionRef });

  useEffect(() => {
    const video = videoRef.current;
    const LERP = 0.05;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!video?.duration) return;
      const delta = targetTimeRef.current - video.currentTime;
      video.currentTime += delta * LERP;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[600vh] bg-[#0a0a0a] z-0"
    >
      <div
        ref={stickyContainerRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
        }}
      >
        <div
          ref={videoWrapperRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: '#000',
            zIndex: 0,
          }}
        >
          <video
            ref={videoRef}
            src="/videos/hero/finalcuthero-scrub.mp4"
            muted
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
              zIndex: 1,
            }}
          />

          <div
            ref={wordmarkRef}
            style={{
              position: 'absolute',
              top: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: 'clamp(120px, 12vw, 172px)',
              aspectRatio: '1730 / 804',
              opacity: 0,
            }}
          >
            <Image
              src="/images/logo/Logo_text.png"
              alt="Constantia"
              fill
              priority
              sizes="172px"
              style={{ objectFit: 'contain', objectPosition: 'center top' }}
            />
          </div>
        </div>

        <div
          ref={stripRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 20,
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: '3vh',
            paddingLeft: '5vw',
            paddingRight: '5vw',
            justifyContent: 'space-between',
          }}
        >
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMax slice"
            style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0, zIndex: -1 }}
          >
            <path d="M 0 800 Q 400 990 1000 990 L 1000 1000 L 0 1000 Z" fill="#0a0a0a" />
          </svg>

          <svg
            ref={headlineRef}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMax slice"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              bottom: 0,
              left: 0,
              zIndex: 10,
              opacity: 0,
              overflow: 'visible',
            }}
          >
            <path id="text-curve" d="M 0 800 Q 400 990 1000 990" fill="transparent" />
            <text
              style={{
                fontFamily: "'Labil Grotesk', sans-serif",
                fill: 'white',
              }}
              dy="-15"
            >
              <textPath href="#text-curve" startOffset="5%">
                <tspan fontSize="36px" fontWeight="400">Made with clarity.</tspan>
                <tspan fontSize="20px" fontWeight="400" opacity="0.7" dx="30">Built to endure.</tspan>
              </textPath>
            </text>
          </svg>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.6rem, 1vw, 0.78rem)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              zIndex: 30,
            }}
          >
            {`Photography${HERO_DISCIPLINE_SEPARATOR}Film${HERO_DISCIPLINE_SEPARATOR}Design`}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.6rem, 1vw, 0.78rem)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
              zIndex: 30,
            }}
          >
            Casablanca, Morocco
          </p>
        </div>
      </div>
    </section>
  );
}
