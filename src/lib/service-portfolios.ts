import type { PortfolioServiceSlug, ServiceType } from '@/lib/types'

export type ServicePortfolioSlug = PortfolioServiceSlug

export type ServicePortfolioConfig = {
  slug: ServicePortfolioSlug
  title: string
  projectType: ServiceType
  sliderIndex: number
  href: string
}

export type ServiceReturnState = {
  scrollY?: number
  lenisScroll?: number
  viewportHeight?: number
  servicesProgress?: number
  service: ServicePortfolioSlug
  sliderIndex: number
  savedAt: number
}

const SERVICE_RETURN_STORAGE_KEY = 'constantia:services:return-state'
const SERVICE_AWAITING_RETURN_KEY = 'constantia:services:awaiting-return'
const SERVICE_RETURN_MAX_AGE_MS = 30 * 60 * 1000
export const SERVICE_SECTION_SLIDE_COUNT = 5

export const SERVICE_PORTFOLIOS: ServicePortfolioConfig[] = [
  {
    slug: 'photo',
    title: 'Photography',
    projectType: 'photo',
    sliderIndex: 0,
    href: '/services/photo/portfolio',
  },
  {
    slug: 'video',
    title: 'Videography',
    projectType: 'video',
    sliderIndex: 1,
    href: '/services/video/portfolio',
  },
  {
    slug: 'motion',
    title: 'Motion Graphics',
    projectType: 'animation',
    sliderIndex: 2,
    href: '/services/motion/portfolio',
  },
  {
    slug: 'design',
    title: 'Graphic Design',
    projectType: 'design',
    sliderIndex: 3,
    href: '/services/design/portfolio',
  },
  {
    slug: 'web',
    title: 'Web Development',
    projectType: 'web',
    sliderIndex: 4,
    href: '/services/web/portfolio',
  },
]

const SERVICE_PORTFOLIO_BY_SLUG: Record<ServicePortfolioSlug, ServicePortfolioConfig> =
  SERVICE_PORTFOLIOS.reduce(
    (collection, service) => {
      collection[service.slug] = service
      return collection
    },
    {} as Record<ServicePortfolioSlug, ServicePortfolioConfig>
  )

const SERVICE_PORTFOLIO_BY_TYPE: Partial<Record<ServiceType, ServicePortfolioConfig>> =
  SERVICE_PORTFOLIOS.reduce(
    (collection, service) => {
      collection[service.projectType] = service
      return collection
    },
    {} as Partial<Record<ServiceType, ServicePortfolioConfig>>
  )

export const GALLERY_SLOT_ORDER = [
  'hero-left',
  'hero-center',
  'stack-top',
  'hero-right',
  'stack-middle',
  'bottom-left',
  'bottom-center',
  'stack-bottom',
  'bottom-right',
] as const

export const PLACEHOLDER_TITLES = [
  'IN PROGRESS',
  'UNDER WRAPS',
  'COMING SOON',
  'CURRENTLY CURATING',
  'IN DEVELOPMENT',
  'PRIVATE RELEASE',
  'WORKING DRAFT',
  'UNVEILING SOON',
  'NEXT DROP',
] as const

const WIP_ONLY_SERVICE_PORTFOLIOS = new Set<ServicePortfolioSlug>(['web'])

export function isServicePortfolioSlug(value: string): value is ServicePortfolioSlug {
  return SERVICE_PORTFOLIOS.some((service) => service.slug === value)
}

export function getServicePortfolioBySlug(slug: string): ServicePortfolioConfig | undefined {
  if (!isServicePortfolioSlug(slug)) return undefined
  return SERVICE_PORTFOLIO_BY_SLUG[slug]
}

export function getServicePortfolioByProjectType(
  projectType: ServiceType
): ServicePortfolioConfig | undefined {
  return SERVICE_PORTFOLIO_BY_TYPE[projectType]
}

export function isServicePortfolioWipOnly(service: ServicePortfolioSlug) {
  return WIP_ONLY_SERVICE_PORTFOLIOS.has(service)
}

export function getReturnToServicesHref(service: ServicePortfolioSlug) {
  return `/?returning=services&service=${service}#services`
}

export function getServicePortfolioProjectHref(
  service: ServicePortfolioSlug,
  projectSlug: string
) {
  return `/services/${service}/portfolio/${projectSlug}`
}

type LenisLike = {
  scroll?: number
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getCurrentLenisScroll() {
  if (typeof window === 'undefined') return 0

  const lenis = window.__lenis as LenisLike | undefined
  return isFiniteNumber(lenis?.scroll) ? lenis.scroll : window.scrollY
}

export function getServicesSectionMetrics(
  servicesSection: HTMLElement,
  scrollPosition = getCurrentLenisScroll(),
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0
) {
  const sectionTop = scrollPosition + servicesSection.getBoundingClientRect().top
  const scrollableSpan = Math.max(servicesSection.offsetHeight - viewportHeight, 0)
  const progress =
    scrollableSpan > 0
      ? clamp((scrollPosition - sectionTop) / scrollableSpan, 0, 1)
      : 0

  return {
    sectionTop,
    scrollableSpan,
    progress,
  }
}

function isValidServiceReturnState(value: unknown): value is ServiceReturnState {
  if (!value || typeof value !== 'object') return false

  const state = value as Record<string, unknown>

  if (!isServicePortfolioSlug(String(state.service ?? ''))) return false
  if (!isFiniteNumber(state.sliderIndex)) return false
  if (!isFiniteNumber(state.savedAt)) return false
  if (Date.now() - state.savedAt > SERVICE_RETURN_MAX_AGE_MS) return false

  const optionalNumbers: Array<keyof ServiceReturnState> = [
    'scrollY',
    'lenisScroll',
    'viewportHeight',
    'servicesProgress',
  ]

  for (const key of optionalNumbers) {
    const value = state[key]
    if (value !== undefined && !isFiniteNumber(value)) {
      return false
    }
  }

  if (
    isFiniteNumber(state.servicesProgress) &&
    (state.servicesProgress < 0 || state.servicesProgress > 1)
  ) {
    return false
  }

  return true
}

export function readServiceReturnState(): ServiceReturnState | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(SERVICE_RETURN_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isValidServiceReturnState(parsed)) {
      window.sessionStorage.removeItem(SERVICE_RETURN_STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    window.sessionStorage.removeItem(SERVICE_RETURN_STORAGE_KEY)
    return null
  }
}

export function writeServiceReturnState(state: ServiceReturnState) {
  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(SERVICE_RETURN_STORAGE_KEY, JSON.stringify(state))
}

export function clearServiceReturnState() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SERVICE_RETURN_STORAGE_KEY)
}

export function setAwaitingServiceReturn() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(SERVICE_AWAITING_RETURN_KEY, '1')
}

export function isAwaitingServiceReturn() {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(SERVICE_AWAITING_RETURN_KEY) === '1'
}

export function clearAwaitingServiceReturn() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SERVICE_AWAITING_RETURN_KEY)
}

export function createServiceReturnState(
  service: ServicePortfolioConfig,
  servicesSection?: HTMLElement | null
): ServiceReturnState {
  const lenisScroll = getCurrentLenisScroll()
  const baseState: ServiceReturnState = {
    service: service.slug,
    sliderIndex: service.sliderIndex,
    scrollY: typeof window !== 'undefined' ? window.scrollY : lenisScroll,
    lenisScroll,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : undefined,
    savedAt: Date.now(),
  }

  if (!servicesSection || typeof window === 'undefined') {
    return baseState
  }

  const metrics = getServicesSectionMetrics(servicesSection, lenisScroll, window.innerHeight)

  return {
    ...baseState,
    servicesProgress: metrics.progress,
  }
}
