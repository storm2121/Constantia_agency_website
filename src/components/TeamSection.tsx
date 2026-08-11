'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Lightbulb,
  Megaphone,
  Monitor,
  PenTool,
  X,
  type LucideIcon,
} from 'lucide-react'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { getServicePortfolioProjectHref } from '@/lib/service-portfolios'
import type { Project, Talent } from '@/lib/types'
import { getTalentObjectPosition } from '@/lib/talent-presentation'
import { cn } from '@/lib/utils'

// Uniform card size — scales with viewport, no restrictive max
const CARD = 'w-[9.5vw] h-[12.5vw] min-w-[120px] min-h-[158px]'
const CARD_SIZES = '(max-width: 800px) 28vw, (max-width: 1280px) 18vw, 10vw'

// Tight wave pattern — cards close together, oscillating heights
// Horizontal: 8% → 75% with ~11% between left-edges (~2% real gap at 9.5vw cards)
// Vertical: alternating high/low creating a flowing wave, card 7 breaks low for tension
const clusterLayout = [
  {
    className: `left-[8%] top-[14%] z-[22] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: -5,
    idleY: 10,
    idleRotation: 1.3,
    idleDuration: 5.8,
    pointerDepth: 1.22,
  },
  {
    className: `left-[19.5%] top-[16%] z-[24] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: 5,
    idleY: 8,
    idleRotation: -1.15,
    idleDuration: 5.3,
    pointerDepth: 1.08,
  },
  {
    className: `left-[31%] top-[19%] z-[23] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: -1,
    idleY: 11,
    idleRotation: 0.95,
    idleDuration: 6.2,
    pointerDepth: 1.02,
  },
  {
    className: `left-[42.5%] top-[15%] z-[26] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: 1,
    idleY: 9,
    idleRotation: -1.05,
    idleDuration: 5.5,
    pointerDepth: 1.24,
  },
  {
    className: `left-[54%] top-[22%] z-[25] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: -2,
    idleY: 12,
    idleRotation: 1.1,
    idleDuration: 6.4,
    pointerDepth: 0.96,
  },
  {
    className: `left-[65%] top-[10%] z-[20] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: 1,
    idleY: 10,
    idleRotation: -0.9,
    idleDuration: 5.9,
    pointerDepth: 1.12,
  },
  {
    className: `left-[75%] top-[36%] z-[19] ${CARD}`,
    imageSizes: CARD_SIZES,
    baseRotation: -1,
    idleY: 7,
    idleRotation: 0.75,
    idleDuration: 6.8,
    pointerDepth: 0.84,
  },
] as const

const expertiseFallbackIcons: LucideIcon[] = [Lightbulb, Monitor, PenTool, Megaphone]

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function getOverlayProjectHref(project: Project) {
  return getServicePortfolioProjectHref(project.service, project.slug)
}

function getOverlayProjectMedia(project: Project) {
  if (project.mediaKind === 'storage-video') {
    if (project.videoEntries && project.videoEntries.length > 1) {
      return project.posterImage ?? project.videoEntries[0]?.posterPath ?? project.heroImage ?? project.thumbnail
    }

    return project.posterImage ?? project.heroImage ?? project.thumbnail
  }

  return project.heroImage ?? project.thumbnail
}

function getInitialProjectIndex(projects: Project[]) {
  const featuredIndex = projects.findIndex((project) => project.featured)
  return featuredIndex >= 0 ? featuredIndex : 0
}

function getExpertiseIcon(label: string, index: number): LucideIcon {
  const normalizedLabel = label.toLowerCase()

  if (/(strategy|system|architecture|workflow|management|leadership|solution)/.test(normalizedLabel)) {
    return Lightbulb
  }

  if (/(web|software|product|platform|interface|ux|ui|app|development|code)/.test(normalizedLabel)) {
    return Monitor
  }

  if (/(design|art|typography|motion|animation|edit|graphic|brand|logo|visual)/.test(normalizedLabel)) {
    return PenTool
  }

  if (/(campaign|social|client|communication|content|partnership|business|market|representation)/.test(normalizedLabel)) {
    return Megaphone
  }

  if (/(photo|photography|cinema|video|film|camera)/.test(normalizedLabel)) {
    return Camera
  }

  return expertiseFallbackIcons[index % expertiseFallbackIcons.length]
}

function getCardFocusMotion(index: number, activeIndex: number, baseRotation: number) {
  if (activeIndex < 0) {
    return { x: 0, y: 0, scale: 1, rotate: 0 }
  }

  if (index === activeIndex) {
    return {
      x: 0,
      y: -16,
      scale: 1.055,
      rotate: -baseRotation * 0.24,
    }
  }

  const direction = index < activeIndex ? -1 : 1
  const distance = Math.abs(index - activeIndex)

  return {
    x: direction * Math.min(10, 4 + distance * 2),
    y: Math.min(12, 4 + distance * 2),
    scale: Math.max(0.94, 0.985 - distance * 0.015),
    rotate: direction * Math.min(1.6, 0.55 + distance * 0.28),
  }
}

export default function TeamSection({
  members,
  projectsByTalent,
}: {
  members: Talent[]
  projectsByTalent: Record<string, Project[]>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const warmSurfaceRef = useRef<HTMLDivElement>(null)
  const photoWallRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const bioPanelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const splitTextContainerRef = useRef<HTMLDivElement>(null)
  const introHeadingRef = useRef<HTMLHeadingElement>(null)
  const prefersReducedMotion = useReducedMotion() ?? false

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [openMemberId, setOpenMemberId] = useState<string | null>(null)
  const orderedMembers = [...members].sort((a, b) => a.order - b.order)
  // Sticky hover: once a member is hovered, they stay highlighted until another is hovered.
  // hoveredId only clears back to null on initial render (no default member).
  const handleHover = useCallback((id: string | null) => {
    if (id !== null) setHoveredId(id)
  }, [])

  const activeId = hoveredId ?? openMemberId ?? null
  const activeIndex = orderedMembers.findIndex((member) => member.id === activeId)
  const activeMember = orderedMembers.find((member) => member.id === activeId) ?? null
  const openMember = orderedMembers.find((member) => member.id === openMemberId) ?? null

  useGSAP(
    () => {
      const shell = shellRef.current
      const warmSurface = warmSurfaceRef.current
      const photoWall = photoWallRef.current
      const bloom = bloomRef.current
      const bioPanel = bioPanelRef.current
      const list = listRef.current
      const section = sectionRef.current
      const introHeading = introHeadingRef.current
      const splitContainer = splitTextContainerRef.current

      if (
        !shell ||
        !warmSurface ||
        !photoWall ||
        !list ||
        !section ||
        !introHeading ||
        !splitContainer
      ) {
        return
      }

      const revealTargets = section.querySelectorAll<HTMLElement>('[data-team-reveal]')
      const pointerCards = section.querySelectorAll<HTMLElement>('[data-team-card]')
      const floatingCards = section.querySelectorAll<HTMLElement>('[data-team-card-float]')
      const idleTweens: gsap.core.Tween[] = []

      floatingCards.forEach((card, index) => {
        const layout = clusterLayout[index]

        if (!layout) {
          return
        }

        gsap.set(card, {
          rotation: layout.baseRotation,
          transformOrigin: '50% 58%',
          force3D: true,
        })
      })

      gsap.set(pointerCards, { x: 0, y: 0, force3D: true })
      gsap.set(list, { x: 0, y: 0, force3D: true })

      if (bioPanel) {
        gsap.set(bioPanel, { x: 0, y: 0, force3D: true })
      }

      if (bloom) {
        gsap.set(bloom, { xPercent: 0, yPercent: 0, scale: 1, opacity: 0.72, force3D: true })
      }

      if (prefersReducedMotion) {
        gsap.set(shell, { yPercent: 0, borderRadius: 0 })
        gsap.set(warmSurface, { opacity: 1 })
        gsap.set(revealTargets, { opacity: 1, y: 0 })
        gsap.set(splitContainer, { opacity: 0 })
        if (bloom) {
          gsap.set(bloom, { opacity: 0.62 })
        }
        return
      }

      const split = new SplitText(introHeading, { type: 'chars' })
      // Use opacity + small y lift (GPU-cheap) instead of per-char blur which forces
      // a filter layer per character and is expensive while scroll-scrubbing.
      gsap.set(split.chars, { opacity: 0, y: 8, force3D: true })
      gsap.set(shell, { yPercent: 100, borderRadius: '40px 40px 0 0', force3D: true })
      gsap.set(warmSurface, { opacity: 0 })
      gsap.set(revealTargets, { opacity: 0, y: 56 })

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2}`,
          // 0.4 keeps micro-smoothing without the 1-second catch-up lag that made
          // the section feel "behind" on entry and fast scrolls.
          scrub: 0.4,
        },
      })

      // Total Runtime = 2.0. 1.0 unit = 1 physical screen height.

      // 1. Text types in over 0.4 screens (0.0 → 0.4)
      intro.to(split.chars, {
        opacity: 1,
        y: 0,
        stagger: { amount: 0.1 }, // total stagger distributed across ALL chars = 0.1s
        duration: 0.3,
        ease: 'power2.out',
      }, 0)
      
      // (Text hangs powerfully readable from 0.4 to 1.0 — an inescapable 60% of a screen height of silence)
      
      // 2. Text fades out smoothly and Shell card slides up (1.0 → 1.6)
      intro.to(splitContainer, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power2.in',
      }, 1.0)

      intro.to(shell, {
        yPercent: 0,
        borderRadius: '0px',
        duration: 0.6,
        ease: 'power3.inOut',
      }, 1.0)

      // 3. Reveal inner elements slowly into the fully visible shell (1.6 → 2.0)
      // They finish EXACTLY at 2.0 (the precise end of the locked scroll)
      intro.to(warmSurface, { opacity: 1, duration: 0.4 }, 1.6);
      intro.to(revealTargets, {
        opacity: 1,
        y: 0,
        stagger: 0.1,  // entire stagger finishes in 0.1s
        duration: 0.3, // 0.3 duration + 0.1 stagger = exactly 0.4 total
        ease: 'power3.out',
      }, 1.6)

      floatingCards.forEach((card, index) => {
        const layout = clusterLayout[index]

        if (!layout) {
          return
        }

        idleTweens.push(
          gsap.to(card, {
            y: layout.idleY,
            rotation: layout.baseRotation + layout.idleRotation,
            duration: layout.idleDuration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.12,
          }),
        )
      })

      if (bloom) {
        idleTweens.push(
          gsap.to(bloom, {
            scale: 1.08,
            opacity: 0.9,
            xPercent: 3,
            yPercent: -4,
            duration: 8.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }),
        )
      }

      gsap.to(photoWall, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      gsap.to(list, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      const canUsePointerDepth =
        window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024

      const cleanupPointerDepth = canUsePointerDepth
        ? (() => {
            const cardQuickSetters = Array.from(pointerCards).map((card, index) => {
              const layout = clusterLayout[index]

              return {
                xTo: gsap.quickTo(card, 'x', { duration: 0.75, ease: 'power3.out' }),
                yTo: gsap.quickTo(card, 'y', { duration: 0.75, ease: 'power3.out' }),
                depth: layout?.pointerDepth ?? 1,
              }
            })

            const listXTo = gsap.quickTo(list, 'x', { duration: 0.9, ease: 'power3.out' })
            const listYTo = gsap.quickTo(list, 'y', { duration: 0.9, ease: 'power3.out' })
            const bioXTo = bioPanel ? gsap.quickTo(bioPanel, 'x', { duration: 1, ease: 'power3.out' }) : null
            const bioYTo = bioPanel ? gsap.quickTo(bioPanel, 'y', { duration: 1, ease: 'power3.out' }) : null
            const bloomXTo = bloom ? gsap.quickTo(bloom, 'xPercent', { duration: 1.1, ease: 'power3.out' }) : null
            const bloomYTo = bloom ? gsap.quickTo(bloom, 'yPercent', { duration: 1.1, ease: 'power3.out' }) : null

            const handlePointerMove = (event: PointerEvent) => {
              const x = event.clientX / window.innerWidth - 0.5
              const y = event.clientY / window.innerHeight - 0.5

              cardQuickSetters.forEach(({ xTo, yTo, depth }) => {
                xTo(x * 26 * depth)
                yTo(y * 18 * depth)
              })

              listXTo(-x * 14)
              listYTo(-y * 10)
              bioXTo?.(-x * 10)
              bioYTo?.(-y * 8)
              bloomXTo?.(x * 10)
              bloomYTo?.(y * 8)
            }

            const handlePointerLeave = () => {
              cardQuickSetters.forEach(({ xTo, yTo }) => {
                xTo(0)
                yTo(0)
              })

              listXTo(0)
              listYTo(0)
              bioXTo?.(0)
              bioYTo?.(0)
              bloomXTo?.(0)
              bloomYTo?.(0)
            }

            shell.addEventListener('pointermove', handlePointerMove)
            shell.addEventListener('pointerleave', handlePointerLeave)

            return () => {
              shell.removeEventListener('pointermove', handlePointerMove)
              shell.removeEventListener('pointerleave', handlePointerLeave)
              handlePointerLeave()
            }
          })()
        : null

      // Exit: sticky content scales down + fades as TeamSection scrolls out.
      // Starts at 85% (was 75%) so the revealed content holds longer before fading,
      // and uses responsive scrub so fast scrollers see the fade in sync with scroll.
      if (!prefersReducedMotion) {
        const stickyInner = shell?.parentElement // the sticky div
        if (stickyInner) {
          gsap.to(stickyInner, {
            scale: 0.94,
            opacity: 0.4,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: '85% top',
              end: 'bottom top',
              scrub: 0.4,
            },
          })
        }
      }

      return () => {
        split.revert()
        cleanupPointerDepth?.()
        idleTweens.forEach((tween) => tween.kill())
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  )

  useEffect(() => {
    if (!openMemberId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMemberId(null)
      }
    }

    const bodyOverflow = document.body.style.overflow
    const lenisWindow = window as typeof window & {
      __lenis?: {
        stop: () => void
        start: () => void
      }
    }

    document.body.style.overflow = 'hidden'
    lenisWindow.__lenis?.stop()
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = bodyOverflow
      lenisWindow.__lenis?.start()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMemberId])

  return (
    <LayoutGroup id="luxury-team-showcase">
      <section
        ref={sectionRef}
        id="team"
        className="relative overflow-clip bg-[#08090f] h-[300vh]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          
          {/* Cinematinc Background Text Layer */}
          <div ref={splitTextContainerRef} className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <p className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-2 text-[12px] uppercase tracking-[0.42em] text-white/50 mb-10">
              <span className="h-px w-8 bg-white/40" />
              <span>The talents</span>
              <span className="h-px w-8 bg-white/40" />
            </p>
            <h2
              ref={introHeadingRef}
              className="text-[clamp(2.2rem,5.5vw,6.5rem)] font-light leading-[1.05] tracking-[-0.04em] text-white uppercase max-w-[80vw]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Discover the talent<br />that makes it all happen.
            </h2>
          </div>

          <div
            ref={shellRef}
            className="absolute inset-0 z-10 w-full h-full overflow-hidden bg-[#08090f]"
          >
            {/* Indigo/violet bleed — top-right corner */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_92%_-10%,rgba(94,80,180,0.18),transparent_60%)]" />
            {/* Subtle cooler midtone — bottom-left, low opacity */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_-8%_110%,rgba(60,70,140,0.12),transparent_55%)]" />
            {/* Warm surface ref — kept as ref target, now fully neutral */}
            <div
              ref={warmSurfaceRef}
              className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]"
            />

            <div className="relative z-10 h-full w-full">
              {/* Photo wall — spans full viewport */}
              <div
                ref={photoWallRef}
                data-team-reveal
                className="absolute inset-0 z-0"
              >
                <div
                  ref={bloomRef}
                  className="pointer-events-none absolute left-[18%] top-[17%] h-[44%] w-[48%] rounded-full bg-[radial-gradient(circle,rgba(230,208,156,0.18),rgba(122,102,188,0.08)_38%,transparent_72%)] blur-[82px]"
                />
                <div className="pointer-events-none absolute inset-x-[16%] top-[14%] h-[30%] rounded-full bg-[radial-gradient(circle,rgba(193,161,94,0.12),transparent_70%)] blur-3xl" />
                <div className="pointer-events-none absolute inset-x-[12%] bottom-[10%] h-[34%] rounded-full bg-[radial-gradient(circle,rgba(130,74,37,0.12),transparent_72%)] blur-3xl" />

                <div className="relative h-full w-full">
                  {orderedMembers.map((member, index) => {
                    const layout = clusterLayout[index]

                    return (
                      <PhotoCard
                        key={member.id}
                        index={index}
                        member={member}
                        activeId={activeId}
                        activeIndex={activeIndex}
                        className={layout.className}
                        imageSizes={layout.imageSizes}
                        baseRotation={layout.baseRotation}
                        prefersReducedMotion={prefersReducedMotion}
                        onHover={handleHover}
                        onOpen={setOpenMemberId}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Bio panel — bottom, shifted toward center */}
              <div
                ref={bioPanelRef}
                data-team-reveal
                className="absolute bottom-[14%] left-[18%] z-10 hidden max-w-[510px] lg:block"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {activeMember ? (
                    <motion.div
                      key={activeMember.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? {} : { opacity: 0, y: -14 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-[10.5px] font-medium uppercase tracking-[0.35em] text-[#c8b48a]/55">
                        Currently in focus
                      </p>
                      <p
                        className="mt-3 whitespace-nowrap text-[clamp(2.4rem,4vw,4.75rem)] font-extrabold leading-[1] tracking-[-0.02em] text-[#f3f3f4]"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {activeMember.name}
                      </p>
                      <p className="mt-5 max-w-[510px] text-[clamp(0.9rem,1.6vw,1.375rem)] leading-[1.45] text-white/45">
                        {activeMember.shortBio}
                      </p>
                      <div className="mt-6 flex items-center gap-5 text-[10.5px] font-medium uppercase tracking-[0.3em] text-white/35">
                        <span className="flex flex-col leading-[1.4]">
                          <span>{String(projectsByTalent[activeMember.id]?.length ?? 0).padStart(2, '0')}</span>
                          <span>case</span>
                          <span>studies</span>
                        </span>
                        <span className="h-px w-[18px] bg-white/30" />
                        <span className="flex flex-col leading-[1.4]">
                          {activeMember.role.split(' ').map((word, i) => (
                            <span key={i}>{word}</span>
                          ))}
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Names list — right-of-center (spec: x:826 y:436 at 1366×768) */}
              <div
                ref={listRef}
                data-team-reveal
                className="absolute left-[60%] top-[50%] z-10 flex min-w-0 flex-col gap-1 lg:w-full lg:max-w-[220px]"
              >
                {orderedMembers.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    activeId={activeId}
                    onHover={handleHover}
                    onOpen={setOpenMemberId}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openMember ? (
          <ProfileOverlay
            key={openMember.id}
            member={openMember}
            projects={projectsByTalent[openMember.id] ?? []}
            prefersReducedMotion={prefersReducedMotion}
            onClose={() => setOpenMemberId(null)}
          />
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  )
}

function PhotoCard({
  index,
  member,
  activeId,
  activeIndex,
  className,
  imageSizes,
  baseRotation,
  prefersReducedMotion,
  onHover,
  onOpen,
}: {
  index: number
  member: Talent
  activeId: string | null
  activeIndex: number
  className: string
  imageSizes: string
  baseRotation: number
  prefersReducedMotion: boolean
  onHover: (id: string | null) => void
  onOpen: (id: string | null) => void
}) {
  const isActive = activeId === member.id
  const hasActive = activeIndex >= 0
  const focusMotion = getCardFocusMotion(index, activeIndex, baseRotation)

  return (
    <button
      type="button"
      data-team-card
      className={cn(
        'group absolute cursor-pointer text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e9d6ab]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090f]',
        className,
        isActive && 'z-[60]',
      )}
      aria-label={`Open ${member.name}'s profile`}
      onClick={() => onOpen(member.id)}
      onMouseEnter={() => onHover(member.id)}
      onFocus={() => onHover(member.id)}
    >
      <motion.div
        className="relative h-full w-full"
        animate={prefersReducedMotion ? undefined : focusMotion}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div data-team-card-float className="relative h-full w-full">
          <motion.div
            layoutId={`team-member-photo-${member.id}`}
            className={cn(
              'relative h-full w-full overflow-hidden rounded-[18px] border bg-[#15120f] transition-[transform,border-color,box-shadow,filter] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.02]',
              isActive
                ? 'border-white/[0.14] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_42px_rgba(0,0,0,0.42),0_0_36px_rgba(142,153,255,0.14)]'
                : hasActive
                  ? 'border-white/[0.045] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.24),0_0_28px_rgba(110,120,255,0.05)]'
                  : 'border-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.28),0_0_34px_rgba(110,120,255,0.08)]',
            )}
          >
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes={imageSizes}
              className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]"
              style={{
                objectPosition: getTalentObjectPosition(member.id) ?? 'center top',
                filter: isActive
                  ? 'brightness(1.04) saturate(1.02)'
                  : hasActive
                    ? 'brightness(0.68) saturate(0.88)'
                    : 'brightness(0.84) saturate(0.94)',
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-black/10" />
            <div
              className={cn(
                'pointer-events-none absolute inset-0 transition-opacity duration-500',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
              style={{
                background:
                  'linear-gradient(180deg, rgba(200,180,138,0.14) 0%, transparent 26%, rgba(0,0,0,0.28) 100%)',
              }}
            />
            <div
              className={cn(
                'pointer-events-none absolute inset-0 transition-opacity duration-500',
                hasActive && !isActive ? 'opacity-100' : 'opacity-0',
              )}
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,6,10,0.02) 0%, rgba(5,6,10,0.08) 28%, rgba(5,6,10,0.28) 100%)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </button>
  )
}

function MemberRow({
  member,
  activeId,
  onHover,
  onOpen,
}: {
  member: Talent
  activeId: string | null
  onHover: (id: string | null) => void
  onOpen: (id: string | null) => void
}) {
  const isActive = activeId === member.id

  return (
    <motion.button
      type="button"
      className="group relative flex flex-col items-start gap-1.5 py-[10px] text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e9d6ab]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090f]"
      animate={{ opacity: isActive ? 1 : 0.58, x: isActive ? 0 : 4 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(member.id)}
      onMouseEnter={() => onHover(member.id)}
      onFocus={() => onHover(member.id)}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative block h-[12px] w-[18px]">
          {isActive ? (
            <motion.span
              layoutId="team-active-member-pill"
              className="absolute left-0 top-1/2 h-[11px] w-[16px] -translate-y-1/2 rounded-full bg-[#e9d6ab]"
              style={{ boxShadow: '0 0 12px rgba(233,214,171,0.45)' }}
            />
          ) : (
            <span className="absolute left-[4px] top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-white/[0.14]" />
          )}
        </span>
        <motion.span
          className={cn(
            'text-[17px] leading-none tracking-tight transition-colors duration-300',
            isActive ? 'font-bold text-[#f2eee7]' : 'font-semibold text-white/[0.62]',
          )}
          animate={{ x: isActive ? 0 : 3 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {member.name}
        </motion.span>
      </div>
      <motion.span
        className={cn(
          'pl-[30px] text-[11.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
          isActive ? 'text-[#c9b892]' : 'text-[#c8b48a]/45',
        )}
        animate={{ opacity: isActive ? 1 : 0.68, y: isActive ? 0 : -1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {member.role}
      </motion.span>
    </motion.button>
  )
}

function ProfileOverlay({
  member,
  projects,
  prefersReducedMotion,
  onClose,
}: {
  member: Talent
  projects: Project[]
  prefersReducedMotion: boolean
  onClose: () => void
}) {
  const [projectIndex, setProjectIndex] = useState(() => getInitialProjectIndex(projects))
  const expertiseItems = member.skills.slice(0, 4)
  const projectCount = projects.length
  const overlaySummary = member.shortBio
  const railRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([])

  const normalizeProjectIndex = useCallback(
    (nextIndex: number) => {
      if (projectCount <= 0) {
        return 0
      }

      return ((nextIndex % projectCount) + projectCount) % projectCount
    },
    [projectCount]
  )

  const centerActiveThumbnail = useCallback(
    (activeIndex: number, behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth') => {
      const activeThumbnail = thumbnailRefs.current[activeIndex]
      const rail = railRef.current

      if (!activeThumbnail || !rail) {
        return
      }

      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
      const targetLeft = Math.min(
        Math.max(activeThumbnail.offsetLeft - (rail.clientWidth - activeThumbnail.offsetWidth) / 2, 0),
        maxScrollLeft
      )

      rail.scrollTo({
        left: targetLeft,
        behavior,
      })
    },
    [prefersReducedMotion]
  )

  const activeProjectIndex = normalizeProjectIndex(projectIndex)
  const activeProject = projects[activeProjectIndex] ?? null

  const syncActiveProjectIndex = useCallback(
    (nextIndex: number | ((currentIndex: number) => number)) => {
      setProjectIndex((prev) => {
        const resolved = typeof nextIndex === 'function' ? nextIndex(prev) : nextIndex
        return normalizeProjectIndex(resolved)
      })
    },
    [normalizeProjectIndex]
  )

  const isInitialRailRender = useRef(true)

  useLayoutEffect(() => {
    if (projectCount <= 1) {
      return
    }

    const behavior: ScrollBehavior =
      isInitialRailRender.current || prefersReducedMotion ? 'auto' : 'smooth'
    isInitialRailRender.current = false

    const frameId = window.requestAnimationFrame(() => {
      centerActiveThumbnail(activeProjectIndex, behavior)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [activeProjectIndex, centerActiveThumbnail, prefersReducedMotion, projectCount])

  useEffect(() => {
    if (projectCount <= 1) {
      return
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        syncActiveProjectIndex((current) => current - 1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        syncActiveProjectIndex((current) => current + 1)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [projectCount, syncActiveProjectIndex])

  return (
    <motion.div
      className="fixed inset-0 z-[140] bg-[#090909]/96 backdrop-blur-[10px]"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_80%_16%,rgba(255,255,255,0.04),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.03),transparent_35%)]" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.6px)',
          backgroundSize: '4px 4px',
        }}
      />

      <div className="relative h-full overflow-y-auto overflow-x-hidden overscroll-contain">
        <motion.div
          className="mx-auto flex min-h-screen w-full max-w-[1760px] flex-col px-3 py-3 sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-8 xl:py-7 2xl:px-10"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-4 sm:pb-5">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/constantia-mark.svg"
                alt="Constantia mark"
                width={63}
                height={88}
                priority
                className="h-auto w-[18px] sm:w-[20px] lg:w-[22px]"
              />
              <Image
                src="/images/logo/Constantia-text.svg"
                alt="Constantia"
                width={415}
                height={64}
                priority
                className="h-auto w-[118px] sm:w-[136px] lg:w-[152px]"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white/72 transition-all duration-300 hover:border-white/22 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
              aria-label="Close profile"
            >
              <span
                aria-hidden="true"
                className="h-px w-6 bg-current transition-[width] duration-300 group-hover:w-8"
              />
              <span>Close Profile</span>
              <X size={13} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center py-4 sm:py-6 xl:py-7">
            <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1fr)] lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(0,0.66fr)_minmax(0,1.08fr)] 2xl:gap-8">
            <motion.div
              layoutId={`team-member-photo-${member.id}`}
              className="order-1 relative mx-auto w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#141414] shadow-[0_30px_90px_rgba(0,0,0,0.42)] lg:max-w-none"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 18, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative h-[clamp(320px,46svh,520px)] w-full sm:h-[clamp(360px,50svh,580px)] lg:h-[clamp(420px,56svh,640px)] 2xl:h-[clamp(500px,64svh,760px)]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, (max-width: 1535px) 46vw, 28vw"
                  className="object-cover object-top"
                  style={{
                    objectPosition: getTalentObjectPosition(member.id) ?? 'center top',
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0)_42%,rgba(0,0,0,0.86)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 xl:p-6">
                  <p
                    className="max-w-[82%] text-balance text-[clamp(1.8rem,3vw,3.5rem)] font-black uppercase leading-[0.86] tracking-[-0.07em] text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="mt-1.5 max-w-[86%] text-balance text-[clamp(1rem,1.55vw,1.85rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white/92"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="order-2 flex h-fit min-w-0 flex-col self-center rounded-[18px] border border-white/10 bg-white/[0.025] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] sm:p-6 xl:p-7"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
              transition={{ duration: 0.34, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-5 sm:gap-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#c9b892]/68">
                    In Focus
                  </p>
                  <p className="mt-3 max-w-[24ch] text-pretty text-[clamp(0.95rem,1.06vw,1.12rem)] leading-[1.48] tracking-[-0.01em] text-white/88">
                    {overlaySummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/38">
                  <span>{String(projectCount).padStart(2, '0')} case studies</span>
                  <span className="hidden h-px w-5 bg-white/18 sm:block" />
                  <span>{member.services.slice(0, 2).map(toTitleCase).join(' / ')}</span>
                </div>

                {expertiseItems.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/62">
                      Core Expertise
                    </p>
                    <div className="flex flex-col gap-3.5">
                      {expertiseItems.map((skill, index) => {
                        const Icon = getExpertiseIcon(skill, index)

                        return (
                          <div key={skill} className="flex min-w-0 items-start gap-3.5 text-white/92">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/70">
                              <Icon size={16} strokeWidth={1.8} />
                            </span>
                            <span className="pt-1 text-[clamp(0.95rem,1.02vw,1.08rem)] leading-[1.32]">
                              {skill}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>

            <motion.div
              className="order-3 flex min-w-0 flex-col self-stretch rounded-[18px] border border-white/10 bg-white/[0.025] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.26)] sm:p-4 lg:col-span-2 lg:p-5 2xl:col-span-1 2xl:p-6"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 34 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
              transition={{ duration: 0.38, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeProject ? (
                <>
                  <Link
                    href={getOverlayProjectHref(activeProject)}
                    className="group block"
                    onClick={onClose}
                  >
                    <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
                      <div className="relative h-[clamp(300px,42svh,420px)] w-full sm:h-[clamp(340px,46svh,500px)] lg:h-[clamp(380px,50svh,560px)] 2xl:h-[clamp(500px,64svh,760px)]">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={activeProject.id}
                            className="absolute inset-0"
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            drag={projectCount > 1 ? 'x' : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.18}
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -60 || info.velocity.x < -300) {
                                syncActiveProjectIndex((current) => current + 1)
                              } else if (info.offset.x > 60 || info.velocity.x > 300) {
                                syncActiveProjectIndex((current) => current - 1)
                              }
                            }}
                          >
                            <Image
                              src={getOverlayProjectMedia(activeProject)}
                              alt={activeProject.title}
                              fill
                              sizes="(max-width: 1023px) 100vw, (max-width: 1535px) 52vw, 31vw"
                              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0)_38%,rgba(0,0,0,0.88)_100%)]" />
                            <div className="absolute inset-x-3 bottom-3 rounded-[16px] border border-white/10 bg-[#101113]/92 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4 lg:inset-x-5 lg:bottom-5 lg:p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-[#d8c29c]/78">
                                    {toTitleCase(activeProject.category)}
                                  </p>
                                  <p
                                    className="mt-1.5 min-w-0 text-balance text-[clamp(1.08rem,1.55vw,1.8rem)] font-black uppercase leading-[0.95] tracking-[-0.045em] text-white"
                                    style={{
                                      fontFamily: 'var(--font-display)',
                                      display: '-webkit-box',
                                      WebkitBoxOrient: 'vertical',
                                      WebkitLineClamp: 3,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {activeProject.title}
                                  </p>
                                </div>
                                {projectCount > 1 ? (
                                  <p className="shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/55 tabular-nums">
                                    {String(activeProjectIndex + 1).padStart(2, '0')}
                                    <span className="mx-1 text-white/24">/</span>
                                    {String(projectCount).padStart(2, '0')}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                        {projectCount > 1 ? (
                          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-3 sm:px-4 lg:px-5">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                syncActiveProjectIndex((currentIndex) => currentIndex - 1)
                              }}
                              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/38 text-white/82 backdrop-blur-md transition-all duration-300 hover:border-white/24 hover:bg-black/52 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/28 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
                              aria-label="Previous project"
                            >
                              <ArrowLeft size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                syncActiveProjectIndex((currentIndex) => currentIndex + 1)
                              }}
                              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/38 text-white/82 backdrop-blur-md transition-all duration-300 hover:border-white/24 hover:bg-black/52 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/28 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
                              aria-label="Next project"
                            >
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>

                  {projectCount > 1 ? (
                    <div className="relative mt-3 sm:mt-4">
                      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#090909] to-transparent" />
                      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#090909] to-transparent" />
                      <div
                        ref={railRef}
                        className="flex gap-3 overflow-x-auto overscroll-contain scroll-smooth px-0.5 pb-1.5"
                      >
                      {projects.map((project, index) => {
                        const isActive = index === activeProjectIndex

                        return (
                          <button
                            key={project.id}
                            type="button"
                            ref={(element) => {
                              thumbnailRefs.current[index] = element
                            }}
                            onClick={() => syncActiveProjectIndex(index)}
                            className={cn(
                              'group/thumb w-[96px] shrink-0 text-left sm:w-[110px] lg:w-[118px]',
                              isActive && 'pointer-events-none'
                            )}
                            aria-label={`Show ${project.title}`}
                            aria-pressed={isActive}
                          >
                            <div
                              className={cn(
                                'relative overflow-hidden rounded-[12px] border bg-[#141414] transition-all duration-300',
                                isActive
                                  ? 'border-[#d9c39a]/55 shadow-[0_0_0_1px_rgba(217,195,154,0.18)]'
                                  : 'border-white/10 hover:border-white/22'
                              )}
                            >
                              <div className="relative aspect-[1.08]">
                                <Image
                                  src={getOverlayProjectMedia(project)}
                                  alt={project.title}
                                  fill
                                  sizes="126px"
                                  className="object-cover transition-transform duration-500 group-hover/thumb:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.62)_100%)]" />
                              </div>
                            </div>
                            <p
                              className={cn(
                                'mt-2 text-[9px] uppercase tracking-[0.16em]',
                                isActive ? 'text-[#d8c29c]' : 'text-white/38'
                              )}
                            >
                              {toTitleCase(project.category)}
                            </p>
                            <p
                              className={cn(
                                'mt-1 text-[11px] leading-[1.25] transition-colors duration-300 sm:text-[12px]',
                                isActive ? 'text-white/92' : 'text-white/62'
                              )}
                              style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflow: 'hidden',
                              }}
                            >
                              {project.title}
                            </p>
                          </button>
                        )
                      })}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <Link href="/portfolio" className="group block" onClick={onClose}>
                  <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[#141414]">
                    <div className="flex h-[clamp(300px,42svh,420px)] w-full flex-col justify-end bg-[radial-gradient(circle_at_22%_16%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(180deg,#151618_0%,#0f1012_100%)] p-5 sm:h-[clamp(340px,46svh,500px)] sm:p-6 lg:h-[clamp(380px,50svh,560px)] 2xl:h-[clamp(500px,64svh,760px)]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#d3c09a]/72">
                        Portfolio
                      </p>
                      <p
                        className="mt-3 text-[clamp(1.35rem,1.95vw,2.15rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-white"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Portfolio Coming Soon
                      </p>
                      <p className="mt-4 max-w-[28ch] text-[0.92rem] leading-[1.55] text-white/58">
                        This artist does not have a public case study yet, but the wider Constantia archive is ready to explore.
                      </p>
                      <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/86">
                        <span>Open Portfolio Archive</span>
                        <ArrowUpRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
