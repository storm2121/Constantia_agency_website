'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import {
  SERVICE_SECTION_SLIDE_COUNT,
  SERVICE_PORTFOLIOS,
  clearAwaitingServiceReturn,
  clearServiceReturnState,
  getCurrentLenisScroll,
  getServicePortfolioBySlug,
  getServicesSectionMetrics,
  isAwaitingServiceReturn,
  readServiceReturnState,
  type ServicePortfolioConfig,
  type ServiceReturnState,
} from '@/lib/service-portfolios'

const FONT_READY_TIMEOUT_MS = 450
const RESTORE_TOLERANCE_PX = 10
const OVERLAY_FADE_MS = 480

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getMaxScroll() {
  return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
}

function stripReturnParams() {
  if (typeof window === 'undefined') return
  const nextUrl = `${window.location.pathname}${window.location.hash || '#services'}`
  window.history.replaceState(window.history.state, '', nextUrl)
}

function applyImmediateScroll(targetY: number) {
  const nextY = clamp(targetY, 0, getMaxScroll())

  if (window.__lenis) {
    window.__lenis.scrollTo(nextY, { immediate: true, force: true, lock: false })
    return
  }

  window.scrollTo({ top: nextY, behavior: 'auto' })
}

function resolveRestoreTarget(
  saved: ServiceReturnState | null,
  service: ServicePortfolioConfig,
  servicesSection: HTMLElement
) {
  const viewportHeight = window.innerHeight
  const maxScroll = getMaxScroll()
  const currentScroll = getCurrentLenisScroll()
  const { sectionTop, scrollableSpan } = getServicesSectionMetrics(
    servicesSection,
    currentScroll,
    viewportHeight
  )

  const absoluteCandidate = saved?.lenisScroll ?? saved?.scrollY
  const viewportMatches =
    !isFiniteNumber(saved?.viewportHeight) ||
    Math.abs(saved.viewportHeight - viewportHeight) <=
      Math.max(64, saved.viewportHeight * 0.12)

  if (viewportMatches && isFiniteNumber(absoluteCandidate)) {
    return clamp(absoluteCandidate, 0, maxScroll)
  }

  if (saved && isFiniteNumber(saved.servicesProgress)) {
    return clamp(sectionTop + scrollableSpan * saved.servicesProgress, 0, maxScroll)
  }

  const fallbackProgress =
    service.sliderIndex / Math.max(SERVICE_SECTION_SLIDE_COUNT - 1, 1)

  return clamp(sectionTop + scrollableSpan * fallbackProgress, 0, maxScroll)
}

/**
 * Determines whether we should restore scroll to the services section.
 * Two triggers:
 *  1. URL has `?returning=services` (from "Back to Services" button)
 *  2. sessionStorage awaiting flag is set (from browser back button)
 */
function detectReturn(): { returning: boolean; serviceSlug: string | null } {
  if (typeof window === 'undefined') return { returning: false, serviceSlug: null }

  const searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('returning') === 'services') {
    return { returning: true, serviceSlug: searchParams.get('service') }
  }

  if (isAwaitingServiceReturn()) {
    const saved = readServiceReturnState()
    if (saved) {
      return { returning: true, serviceSlug: saved.service }
    }
    clearAwaitingServiceReturn()
  }

  return { returning: false, serviceSlug: null }
}

export default function HomeServicesRestore() {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Before first paint: if returning, make the overlay opaque to hide the hero
  useLayoutEffect(() => {
    const { returning } = detectReturn()
    if (returning && overlayRef.current) {
      overlayRef.current.style.opacity = '1'
      overlayRef.current.style.pointerEvents = 'auto'
    }
  }, [])

  useEffect(() => {
    const { returning, serviceSlug } = detectReturn()
    if (!returning) return

    let cancelled = false
    let fontsSettled = !('fonts' in document)
    let fontTimeoutId = 0
    const rafIds: number[] = []

    const scheduleFrame = (callback: FrameRequestCallback) => {
      const id = window.requestAnimationFrame(callback)
      rafIds.push(id)
      return id
    }

    const markFontsSettled = () => {
      if (fontsSettled) return
      fontsSettled = true
      if (fontTimeoutId) {
        window.clearTimeout(fontTimeoutId)
        fontTimeoutId = 0
      }
    }

    if (!fontsSettled) {
      fontTimeoutId = window.setTimeout(markFontsSettled, FONT_READY_TIMEOUT_MS)
      void document.fonts.ready.then(markFontsSettled, markFontsSettled)
    }

    const fadeOutOverlay = () => {
      const overlay = overlayRef.current
      if (!overlay) return

      overlay.style.transition = `opacity ${OVERLAY_FADE_MS}ms ease-out`
      overlay.style.opacity = '0'

      const tid = window.setTimeout(() => {
        overlay.style.pointerEvents = 'none'
      }, OVERLAY_FADE_MS)

      rafIds.push(tid as unknown as number)
    }

    const attemptRestore = () => {
      if (cancelled) return

      const servicesSection = document.getElementById('services')
      if (!window.__loadingDone || !window.__lenis || !servicesSection || !fontsSettled) {
        scheduleFrame(attemptRestore)
        return
      }

      ScrollTrigger.refresh()

      scheduleFrame(() => {
        if (cancelled) return

        const saved = readServiceReturnState()
        const service =
          getServicePortfolioBySlug(serviceSlug ?? '') ??
          SERVICE_PORTFOLIOS[0]
        const targetY = resolveRestoreTarget(saved, service, servicesSection)

        applyImmediateScroll(targetY)

        scheduleFrame(() => {
          if (cancelled) return

          if (Math.abs(getCurrentLenisScroll() - targetY) > RESTORE_TOLERANCE_PX) {
            applyImmediateScroll(targetY)
          }

          scheduleFrame(() => {
            if (cancelled) return

            if (Math.abs(getCurrentLenisScroll() - targetY) > RESTORE_TOLERANCE_PX) {
              scheduleFrame(attemptRestore)
              return
            }

            clearServiceReturnState()
            clearAwaitingServiceReturn()
            stripReturnParams()
            fadeOutOverlay()
          })
        })
      })
    }

    scheduleFrame(attemptRestore)

    return () => {
      cancelled = true
      if (fontTimeoutId) {
        window.clearTimeout(fontTimeoutId)
      }
      for (const id of rafIds) {
        window.cancelAnimationFrame(id)
      }
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: '#0a0a0a',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
