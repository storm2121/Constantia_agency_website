'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { talents } from '@/lib/data/talents'
import { getTalentObjectPosition } from '@/lib/talent-presentation'
import type { Talent } from '@/lib/types'

export default function ScatteredFellows() {
  const [selected, setSelected] = useState<Talent | null>(null)
  const busy = useRef(false)
  const savedRect = useRef<DOMRect | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const sorted = [...talents].sort((a, b) => a.order - b.order)
  const firstRow = sorted.slice(0, 3)
  const secondRow = sorted.slice(3)

  const handleOpen = useCallback((talent: Talent, el: HTMLElement) => {
    if (busy.current) return
    const rect = el.getBoundingClientRect()
    savedRect.current = rect
    busy.current = true
    setSelected(talent)

    const W = window.innerWidth
    const H = window.innerHeight
    const clip = `inset(${rect.top}px ${W - rect.right}px ${H - rect.bottom}px ${rect.left}px)`

    requestAnimationFrame(() => {
      const ov = overlayRef.current
      if (!ov) { busy.current = false; return }

      gsap.set(ov, { clipPath: clip, opacity: 1, pointerEvents: 'auto' })

      const tl = gsap.timeline({ onComplete: () => { busy.current = false } })
      tl.to(ov, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.8, ease: 'expo.inOut' })

      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll<HTMLElement>('[data-reveal]')
        tl.fromTo(
          items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
      }
    })
  }, [])

  const handleClose = useCallback(() => {
    if (busy.current || !savedRect.current) return
    const ov = overlayRef.current
    if (!ov) return
    busy.current = true

    const { top, right, bottom, left } = savedRect.current
    const W = window.innerWidth
    const H = window.innerHeight

    if (contentRef.current) {
      gsap.to(contentRef.current.querySelectorAll<HTMLElement>('[data-reveal]'), {
        opacity: 0, y: -18, stagger: 0.03, duration: 0.22, ease: 'power2.in',
      })
    }

    gsap.to(ov, {
      clipPath: `inset(${top}px ${W - right}px ${H - bottom}px ${left}px)`,
      duration: 0.65, ease: 'expo.inOut', delay: 0.08,
      onComplete: () => {
        gsap.set(ov, { opacity: 0, pointerEvents: 'none', clipPath: 'inset(50% 50%)' })
        setSelected(null)
        busy.current = false
      },
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  return (
    <section id="fellows" className="w-full bg-[#0a0a0a]">

      {/* Editorial header */}
      <div className="px-6 pt-32 pb-20 md:px-14 lg:px-24">
        <p className="text-[9px] uppercase tracking-[0.55em] text-white/20 mb-8">
          The People
        </p>
        <h2
          className="font-light leading-[0.88]"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(3.5rem, 9vw, 7rem)',
          }}
        >
          Five people.<br />
          <em className="not-italic text-white/40">One vision.</em>
        </h2>
        <p className="mt-6 text-sm text-white/25 tracking-wider max-w-xs leading-relaxed">
          Click any portrait to learn more.
        </p>
      </div>

      {/* Floating portrait grid — dark space around each photo */}
      <div className="pb-32 px-6 md:px-14 lg:px-20 xl:px-28">
        {/* Row 1: 3 portraits */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-14 lg:gap-20 mb-12 md:mb-16">
          {firstRow.map((t) => (
            <PortraitCard key={t.id} talent={t} onOpen={handleOpen} />
          ))}
        </div>
        {/* Row 2: 2 portraits, centered */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-14 lg:gap-20">
          {secondRow.map((t) => (
            <PortraitCard key={t.id} talent={t} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      {/* ─── Teleportation Overlay ─── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[150] bg-[#0a0a0a] overflow-hidden"
        style={{ opacity: 0, pointerEvents: 'none', clipPath: 'inset(50% 50%)' }}
        role="dialog"
        aria-modal="true"
      >
        {selected && (
          <div ref={contentRef} className="h-full flex flex-col lg:grid lg:grid-cols-[55%_45%]">
            {/* Close — circular, top-right */}
            <button
              data-reveal
              onClick={handleClose}
              className="absolute top-7 right-7 z-10 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/50 transition-all duration-400"
              aria-label="Close profile"
            >
              <X size={15} strokeWidth={1.5} />
            </button>

            {/* Left: biographical info */}
            <div className="flex flex-col justify-center px-8 pt-20 pb-12 lg:px-20 lg:pt-0 overflow-y-auto">
              <p
                data-reveal
                className="text-[9px] uppercase tracking-[0.55em] text-white/30 mb-8"
              >
                {selected.role}
              </p>

              <h2
                data-reveal
                className="font-light leading-[0.88]"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                }}
              >
                {selected.name}
              </h2>

              <div data-reveal className="w-10 h-px bg-white/15 my-9" />

              <p data-reveal className="text-white/50 text-sm leading-[1.85] max-w-md">
                {selected.shortBio}
              </p>

              {/* Skills */}
              <div data-reveal className="flex flex-wrap gap-2 mt-8">
                {selected.skills.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="text-[9px] border border-white/12 text-white/35 px-3 py-1.5 tracking-[0.2em] uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* CTA to full profile */}
              <Link
                data-reveal
                href={`/talents/${selected.slug}`}
                className="mt-12 inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/30 hover:text-white/70 transition-colors duration-400 group"
                onClick={handleClose}
              >
                <span className="w-6 h-px bg-current transition-all duration-500 group-hover:w-10" />
                <span>Full Profile</span>
              </Link>
            </div>

            {/* Right: large portrait */}
            <div className="hidden lg:flex items-center justify-center p-14 xl:p-20">
              <div
                data-reveal
                className="relative w-full aspect-[3/4]"
                style={{ maxWidth: '360px' }}
              >
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  className="object-cover object-top"
                  sizes="420px"
                  priority
                  style={{
                    objectPosition: getTalentObjectPosition(selected.id) ?? 'center top',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Portrait Card — floating bust with radial vignette ─── */
interface PortraitCardProps {
  talent: Talent
  onOpen: (t: Talent, el: HTMLElement) => void
}

function PortraitCard({ talent, onOpen }: PortraitCardProps) {
  return (
    <button
      type="button"
      className="group relative flex-shrink-0 text-left"
      style={{ width: 'clamp(160px, 18vw, 240px)' }}
      onClick={(e) => onOpen(talent, e.currentTarget)}
      aria-label={`View ${talent.name}`}
    >
      {/* Portrait image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
        <Image
          src={talent.image}
          alt={talent.name}
          fill
          sizes="(max-width: 768px) 45vw, 18vw"
          className="object-cover object-top transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          style={{ objectPosition: getTalentObjectPosition(talent.id) ?? 'center top' }}
        />

        {/* Radial vignette — blends photo edges into the dark background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(10,10,10,0.55) 75%, rgba(10,10,10,0.9) 100%)',
          }}
        />

        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/75 via-transparent to-transparent" />

        {/* Hover tint */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Name below portrait */}
      <div className="mt-5 text-center">
        <p className="text-[8px] uppercase tracking-[0.45em] text-white/30 mb-1.5">
          {talent.role}
        </p>
        <p
          className="text-[0.9rem] font-light text-white/70 group-hover:text-white/90 transition-colors duration-400"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {talent.name}
        </p>
        {/* Animated reveal line */}
        <div className="flex justify-center mt-2">
          <div className="w-0 h-px bg-white/25 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-8" />
        </div>
      </div>
    </button>
  )
}
