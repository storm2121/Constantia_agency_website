'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { LiquidButton } from '@/components/ui/liquid-glass-button'
import {
  createServiceReturnState,
  getServicePortfolioBySlug,
  setAwaitingServiceReturn,
  writeServiceReturnState,
  type ServicePortfolioSlug,
} from '@/lib/service-portfolios'
import {
  HoverSlider,
  HoverSliderImageWrap,
  HoverSliderImage,
  HoverSliderVideo,
  TextStaggerHover,
  useHoverSliderContext,
} from '@/components/blocks/animated-slideshow'

type OptimizedClient = {
  name: string
  logo: string
  width: number
  height: number
  preserveTone?: boolean
}

type SliderServiceMedia =
  | {
      kind: 'image'
      src: string
    }
  | {
      kind: 'video'
      src: string
      poster: string
    }

type SliderService = {
  id: ServicePortfolioSlug
  title: string
  sub: string
  desc: string
  media: SliderServiceMedia
  clients: OptimizedClient[]
}

type ServicesHoverSliderProps = {
  mediaOverrides?: Partial<Record<ServicePortfolioSlug, SliderServiceMedia>>
}

const OPTIMIZED_CLIENTS: Record<string, OptimizedClient> = {
  unesco: {
    name: 'Unesco',
    logo: '/images/clients/optimized/unesco.webp',
    width: 148,
    height: 34,
    preserveTone: true,
  },
  alAkhawayn: {
    name: 'Al Akhawayn',
    logo: '/images/clients/optimized/al_akhawayn.webp',
    width: 150,
    height: 28,
  },
  unitedNations: {
    name: 'United Nations',
    logo: '/images/clients/optimized/united_nations.webp',
    width: 156,
    height: 28,
  },
  libra: {
    name: 'Libra',
    logo: '/images/clients/optimized/Libra.webp',
    width: 42,
    height: 42,
    preserveTone: true,
  },
  mohamedVi: {
    name: 'Mohamed VI',
    logo: '/images/clients/optimized/Mohamed_Vi_Environment_protection.webp',
    width: 164,
    height: 34,
  },
  copima: {
    name: 'Copima',
    logo: '/images/clients/optimized/copima.webp',
    width: 138,
    height: 28,
  },
  regisol: {
    name: 'Regisol',
    logo: '/images/clients/optimized/regisol.webp',
    width: 138,
    height: 28,
  },
}

function buildServices(
  mediaOverrides: Partial<Record<ServicePortfolioSlug, SliderServiceMedia>> = {}
): SliderService[] {
  return [
    {
      id: 'photo',
      title: 'Photography',
      sub: 'Concert / Events / Editorial / Advertising',
      desc: 'Every frame a deliberate act of seeing - seized at the threshold of beauty and truth. From concert pits to campaign sets, we capture moments that endure.',
      media: mediaOverrides.photo ?? {
        kind: 'image',
        src: '/images/services/photography.jpg',
      },
      clients: [
        OPTIMIZED_CLIENTS.unesco,
        OPTIMIZED_CLIENTS.alAkhawayn,
        OPTIMIZED_CLIENTS.unitedNations,
      ],
    },
    {
      id: 'video',
      title: 'Videography',
      sub: 'Brand Films / Documentaries / Music Videos / Events',
      desc: 'Cinematic narratives built with breath and restraint - tension that lingers after the cut. Advertising films that evoke emotion, not just attention.',
      media: mediaOverrides.video ?? {
        kind: 'image',
        src: '/images/services/videography.jpg',
      },
      clients: [
        OPTIMIZED_CLIENTS.libra,
        OPTIMIZED_CLIENTS.copima,
        OPTIMIZED_CLIENTS.regisol,
      ],
    },
    {
      id: 'motion',
      title: 'Motion Graphics',
      sub: 'Logo Animation / Explainer Videos / Reel Production',
      desc: 'Motion brings identity to life - timing, easing, and rhythm working in perfect calibration until every second lands with intention.',
      media: mediaOverrides.motion ?? {
        kind: 'image',
        src: '/images/services/graphics.jpg',
      },
      clients: [OPTIMIZED_CLIENTS.mohamedVi, OPTIMIZED_CLIENTS.unesco],
    },
    {
      id: 'design',
      title: 'Graphic Design',
      sub: 'Brand Identity / Social Media / Campaigns / Art Direction',
      desc: 'Visual systems shaped with precision, not decoration. Identities built to hold pressure across every format, platform, and context.',
      media: mediaOverrides.design ?? {
        kind: 'image',
        src: '/images/services/video-editing.jpg',
      },
      clients: [OPTIMIZED_CLIENTS.copima, OPTIMIZED_CLIENTS.libra],
    },
    {
      id: 'web',
      title: 'Web Development',
      sub: 'Web Apps / Mobile / SaaS / Booking Platforms',
      desc: 'Scalable digital products built with clean architecture. Intuitive interfaces backed by robust engineering - elegant solutions to complex requirements.',
      media: mediaOverrides.web ?? {
        kind: 'image',
        src: '/images/services/video-editing.jpg',
      },
      clients: [OPTIMIZED_CLIENTS.alAkhawayn],
    },
  ]
}

function ServiceRightPanel({ services }: { services: SliderService[] }) {
  const router = useRouter()
  const { activeSlide } = useHoverSliderContext()
  const svc = services[activeSlide]
  const panelRef = useRef<HTMLDivElement>(null)
  const portfolioService = getServicePortfolioBySlug(svc.id)

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    )
  }, [activeSlide])

  const handleViewPortfolio = () => {
    if (!portfolioService || typeof window === 'undefined') return

    const servicesSection = document.getElementById('services')
    writeServiceReturnState(createServiceReturnState(portfolioService, servicesSection))
    setAwaitingServiceReturn()

    router.push(portfolioService.href)
  }

  return (
    <div
      ref={panelRef}
      style={{
        flex: '0 0 28%',
        minWidth: '200px',
        paddingLeft: '1rem',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.68rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#c96442',
          marginBottom: '1.4rem',
        }}
      >
        {svc.sub}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
          lineHeight: 1.8,
          color: 'rgba(26,20,18,0.55)',
          marginBottom: '1.55rem',
        }}
      >
        {svc.desc}
      </p>

      <LiquidButton
        type="button"
        onClick={handleViewPortfolio}
        style={{
          minHeight: '3.15rem',
          padding: '0.95rem 1.4rem',
          marginBottom: '2rem',
          fontFamily: 'var(--font-display)',
          fontSize: '1.02rem',
          letterSpacing: '-0.02em',
          color: '#1a1412',
        }}
      >
        View Portfolio
      </LiquidButton>

      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.62rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(26,20,18,0.3)',
          marginBottom: '1rem',
        }}
      >
        Clients
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
        {svc.clients.map((client, j) => (
          <div
            key={j}
            style={{
              border: '1px solid rgba(26,20,18,0.1)',
              borderRadius: '14px',
              minHeight: '4.15rem',
              minWidth: client.name === 'Libra' ? '5.35rem' : '10.5rem',
              padding: client.name === 'Libra' ? '0.8rem 1.1rem' : '0.9rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.68)',
            }}
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={client.width}
              height={client.height}
              style={{
                height: `${client.height}px`,
                width: 'auto',
                objectFit: 'contain',
                filter: client.preserveTone ? 'none' : 'brightness(0)',
                opacity: client.preserveTone ? 1 : 0.72,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesInner({ services }: { services: SliderService[] }) {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const dotRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageCenterRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const activeSlideRef = useRef(activeSlide)
  const [isSectionPlaybackActive, setIsSectionPlaybackActive] = useState(false)

  useEffect(() => {
    activeSlideRef.current = activeSlide
  }, [activeSlide])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rootSection = sectionRef.current?.closest('section')
      if (!rootSection) return

      ScrollTrigger.create({
        trigger: rootSection,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => setIsSectionPlaybackActive(true),
        onEnterBack: () => setIsSectionPlaybackActive(true),
        onLeave: () => setIsSectionPlaybackActive(false),
        onLeaveBack: () => setIsSectionPlaybackActive(false),
      })

      ScrollTrigger.create({
        trigger: rootSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const newIndex = Math.round(self.progress * (services.length - 1))
          if (newIndex !== activeSlideRef.current) {
            changeSlide(newIndex)
          }
        },
      })
    })
    return () => ctx.revert()
  }, [changeSlide, services.length])

  useEffect(() => {
    const item = itemRefs.current[activeSlide]
    const dot = dotRef.current
    if (!item || !dot) return
    const itemRect = item.getBoundingClientRect()
    const dotParentRect = dot.parentElement?.getBoundingClientRect()
    if (!dotParentRect) return
    const y = itemRect.top - dotParentRect.top + itemRect.height / 2 - 3.5
    gsap.to(dot, { y, duration: 0.5, ease: 'power3.out' })
  }, [activeSlide])

  useEffect(() => {
    const el = imageCenterRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: '6%' },
        {
          y: '-6%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          } as ScrollTrigger.Vars,
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="grid grid-cols-[1fr_1.5fr_1fr] gap-8 items-center">
      <div
        style={{
          position: 'relative',
          paddingLeft: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          ref={dotRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#000000',
            transform: 'translateY(0)',
            flexShrink: 0,
          }}
        />

        {services.map((svc, i) => (
          <div
            key={svc.id}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            style={{
              paddingTop: i === 0 ? '0.15rem' : '1.4rem',
              paddingBottom: '1.4rem',
              borderBottom: '1px solid rgba(26,20,18,0.07)',
              opacity: activeSlide === i ? 1 : 0.3,
              transition: 'opacity 0.4s ease',
            }}
          >
            <TextStaggerHover
              index={i}
              text={svc.title}
              style={{
                fontFamily: "'Labil Grotesk', sans-serif",
                fontSize: 'clamp(1.6rem, 2.4vw, 2.6rem)',
                letterSpacing: '-0.02em',
                color: '#1a1412',
                fontWeight: 400,
                lineHeight: 1.1,
                cursor: 'default',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

      <div
        ref={imageCenterRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <HoverSliderImageWrap
          style={{
            width: '460px',
            height: '520px',
            borderRadius: '20px',
            flexShrink: 0,
            maxWidth: '100%',
          }}
        >
          {services.map((svc, i) =>
            svc.media.kind === 'video' ? (
              <HoverSliderVideo
                key={svc.id}
                index={i}
                src={svc.media.src}
                poster={svc.media.poster}
                isSectionActive={isSectionPlaybackActive}
                aria-label={svc.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <HoverSliderImage
                key={svc.id}
                index={i}
                src={svc.media.src}
                alt={svc.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )
          )}
        </HoverSliderImageWrap>
      </div>

      <ServiceRightPanel services={services} />
    </div>
  )
}

export default function ServicesHoverSlider({ mediaOverrides }: ServicesHoverSliderProps) {
  const services = useMemo(() => buildServices(mediaOverrides), [mediaOverrides])

  return (
    <section id="services" className="relative bg-[#f0ede6] rounded-t-[28px] h-[500vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-[6%]">
        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: '#c96442',
              marginBottom: '4.5rem',
            }}
          >
            / our services
          </p>

          <HoverSlider>
            <ServicesInner services={services} />
          </HoverSlider>
        </div>
      </div>
    </section>
  )
}
