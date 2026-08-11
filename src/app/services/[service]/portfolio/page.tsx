import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ServicePortfolioReturnButton from '@/components/ServicePortfolioReturnButton'
import MobileServicePortfolio from '@/components/mobile/MobileServicePortfolio'
import DeviceGate from '@/components/DeviceGate'
import { getServiceProjects } from '@/lib/content-repository'
import type { Project } from '@/lib/types'
import {
  GALLERY_SLOT_ORDER,
  PLACEHOLDER_TITLES,
  SERVICE_PORTFOLIOS,
  getServicePortfolioProjectHref,
  getServicePortfolioBySlug,
  isServicePortfolioWipOnly,
  type ServicePortfolioSlug,
} from '@/lib/service-portfolios'
import styles from './page.module.css'

type TileKind = 'project' | 'placeholder'

type GalleryTile = {
  kind: TileKind
  slot: (typeof GALLERY_SLOT_ORDER)[number]
  title: string
  meta: string
  image: string
  href?: string
  alt: string
}

type OverflowTile = {
  title: string
  meta: string
  image: string
  href: string
  alt: string
}

const SLOT_CLASSES: Record<(typeof GALLERY_SLOT_ORDER)[number], string> = {
  'hero-left': styles.heroVisual,
  'hero-center': styles.heroVisual,
  'stack-top': styles.stackTopVisual,
  'hero-right': styles.heroVisual,
  'stack-middle': styles.stackMiddleVisual,
  'bottom-left': styles.bottomVisual,
  'bottom-center': styles.bottomVisual,
  'stack-bottom': styles.stackBottomVisual,
  'bottom-right': styles.bottomVisual,
}

const COLUMN_SLOTS = [
  ['hero-left', 'bottom-left'],
  ['hero-center', 'bottom-center'],
  ['stack-top', 'stack-middle', 'stack-bottom'],
  ['hero-right', 'bottom-right'],
] as const

function cleanText(value: string) {
  return value
    .replace(/â€”/g, '—')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/Â/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toDisplayMeta(project: Project, fallbackTitle: string) {
  const tags = project.tags
    .slice(0, 2)
    .map((tag) => cleanText(tag).replace(/-/g, ' '))
    .map((tag) => tag.toUpperCase())

  if (tags.length > 0) {
    return tags.join(' / ')
  }

  return fallbackTitle.toUpperCase()
}

async function buildTiles(service: ServicePortfolioSlug): Promise<{
  mosaicTiles: GalleryTile[]
  overflowTiles: OverflowTile[]
}> {
  const config = getServicePortfolioBySlug(service)
  if (!config) {
    return { mosaicTiles: [], overflowTiles: [] }
  }

  const serviceProjects = isServicePortfolioWipOnly(service)
    ? []
    : await getServiceProjects(service)

  const mosaicTiles: GalleryTile[] = GALLERY_SLOT_ORDER.map((slot, index): GalleryTile => {
    const project = serviceProjects[index]

    if (project) {
      return {
        kind: 'project',
        slot,
        title: cleanText(project.title).toUpperCase(),
        meta: toDisplayMeta(project, config.title),
        image: project.thumbnail,
        href: getServicePortfolioProjectHref(service, project.slug),
        alt: cleanText(project.title),
      }
    }

    return {
      kind: 'placeholder',
      slot,
      title: PLACEHOLDER_TITLES[index % PLACEHOLDER_TITLES.length],
      meta: `${config.title.toUpperCase()} / SOON TO BE ADDED`,
      image: `/images/portfolio/placeholders/${config.slug}-${index + 1}.png`,
      alt: `${config.title} placeholder ${index + 1}`,
    }
  })

  const overflowTiles = serviceProjects.slice(GALLERY_SLOT_ORDER.length).map((project) => ({
    title: cleanText(project.title).toUpperCase(),
    meta: toDisplayMeta(project, config.title),
    image: project.thumbnail,
    href: getServicePortfolioProjectHref(service, project.slug),
    alt: cleanText(project.title),
  }))

  return { mosaicTiles, overflowTiles }
}

export function generateStaticParams() {
  return SERVICE_PORTFOLIOS.filter((service) => service.slug !== 'design').map((service) => ({
    service: service.slug,
  }))
}

export const dynamicParams = false

export default async function ServicePortfolioPage({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service } = await params
  const config = getServicePortfolioBySlug(service)

  if (!config) {
    notFound()
  }

  const mobileProjects = isServicePortfolioWipOnly(config.slug)
    ? []
    : await getServiceProjects(config.slug)
  const { mosaicTiles, overflowTiles } = await buildTiles(config.slug)

  const desktopTree = (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbPrimary}>Services</span>
            <span className={styles.breadcrumbSlash}>/</span>
            <span className={styles.breadcrumbAccent}>{config.title}</span>
          </div>

          <div className={styles.returnWrap}>
            <ServicePortfolioReturnButton service={config} />
          </div>
        </div>

        <section className={styles.grid} aria-label={`${config.title} portfolio gallery`}>
          {COLUMN_SLOTS.map((columnSlots, columnIndex) => (
            <div key={`column-${columnIndex}`} className={styles.column}>
              {columnSlots.map((slotName) => {
                const tile = mosaicTiles.find((entry) => entry.slot === slotName)
                if (!tile) return null

                const visualClass = SLOT_CLASSES[slotName]
                const title = (
                  <>
                    <h2 className={`${styles.tileTitle} ${styles.tileTitleClamp}`}>{tile.title}</h2>
                    <p className={styles.tileMeta}>{tile.meta}</p>
                  </>
                )

                if (tile.kind === 'project' && tile.href) {
                  return (
                    <Link
                      key={slotName}
                      href={tile.href}
                      className={`${styles.tile} ${styles.tileInteractive}`}
                    >
                      <div className={`${styles.tileVisual} ${visualClass}`}>
                        <Image
                          src={tile.image}
                          alt={tile.alt}
                          fill
                          className={styles.tileImage}
                          sizes="(max-width: 720px) calc(100vw - 24px), (max-width: 1150px) calc((100vw - 70px) / 2), 242px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      {title}
                    </Link>
                  )
                }

                return (
                  <article key={slotName} className={`${styles.tile} ${styles.placeholder}`}>
                    <div className={`${styles.tileVisual} ${visualClass}`}>
                      <Image
                        src={tile.image}
                        alt={tile.alt}
                        fill
                        className={styles.tileImage}
                        sizes="(max-width: 720px) calc(100vw - 24px), (max-width: 1150px) calc((100vw - 70px) / 2), 242px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    {title}
                  </article>
                )
              })}
            </div>
          ))}
        </section>

        {overflowTiles.length > 0 ? (
          <section className={styles.overflowSection} aria-label={`${config.title} additional projects`}>
            <div className={styles.overflowHeadingWrap}>
              <p className={styles.overflowEyebrow}>More Projects</p>
            </div>

            <div className={styles.overflowGrid}>
              {overflowTiles.map((tile) => (
                <Link key={tile.href} href={tile.href} className={`${styles.tile} ${styles.tileInteractive}`}>
                  <div className={`${styles.tileVisual} ${styles.overflowVisual}`}>
                    <Image
                      src={tile.image}
                      alt={tile.alt}
                      fill
                      className={styles.tileImage}
                      sizes="(max-width: 720px) calc(100vw - 24px), (max-width: 1150px) calc((100vw - 70px) / 2), 320px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h2 className={`${styles.tileTitle} ${styles.tileTitleClamp}`}>{tile.title}</h2>
                  <p className={styles.tileMeta}>{tile.meta}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={<MobileServicePortfolio service={config} projects={mobileProjects} />}
    />
  )
}
