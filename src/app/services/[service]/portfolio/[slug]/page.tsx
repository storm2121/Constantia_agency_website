import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PortfolioChildBackLink from '@/components/PortfolioChildBackLink'
import ServiceCaseStudyGallery, {
  type HeroMediaItem,
  type ImageMediaItem,
  type PlayableVideoItem,
} from '@/components/ServiceCaseStudyGallery'
import MobileServiceProjectDetail from '@/components/mobile/MobileServiceProjectDetail'
import DeviceGate from '@/components/DeviceGate'
import { getAllServiceProjectRoutes, getPortfolioCaseStudy } from '@/lib/content-repository'
import { getServicePortfolioBySlug } from '@/lib/service-portfolios'
import { getTalentObjectPosition } from '@/lib/talent-presentation'
import styles from './page.module.css'

function getMotionPosterPosition(projectSlug: string, videoTitle?: string) {
  if (projectSlug !== 'aui-explainers-gitex') {
    return undefined
  }

  if (!videoTitle) {
    return '50% 18%'
  }

  if (
    videoTitle.includes('AUI Exchange Explainer') ||
    videoTitle.includes("AUI Master's Explainer")
  ) {
    return '50% 18%'
  }

  return undefined
}

function buildSupportingMedia(
  service: string,
  title: string,
  galleryImages: string[],
  galleryLightboxImages: string[]
): ImageMediaItem[] {
  const uniqueImages = galleryImages.filter(
    (value, index, collection) => Boolean(value) && collection.indexOf(value) === index
  )
  const uniqueLightboxImages = galleryLightboxImages.filter(
    (value, index, collection) => Boolean(value) && collection.indexOf(value) === index
  )
  const filled = [...uniqueImages]
  const lightboxFilled = [...uniqueLightboxImages]

  while (filled.length < 6) {
    filled.push(`/images/portfolio/placeholders/${service}-${filled.length + 1}.png`)
    lightboxFilled.push(`/images/portfolio/placeholders/${service}-${lightboxFilled.length + 1}.png`)
  }

  return filled.map((src, index) => ({
    kind: 'image',
    src,
    fullSrc: lightboxFilled[index] ?? src,
    alt: `${title} image ${index + 2}`,
  }))
}

function buildPlayableVideos(
  caseStudy: Awaited<ReturnType<typeof getPortfolioCaseStudy>>
): PlayableVideoItem[] {
  if (!caseStudy?.videoEntries?.length) {
    return []
  }

  return caseStudy.videoEntries
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((entry) => ({
      kind: 'video',
      id: entry.id,
      title: entry.title,
      poster: entry.posterPath,
      hlsManifestPath: entry.hlsManifestPath,
      alt: `${caseStudy.project.title} ${entry.title}`,
      posterPosition: getMotionPosterPosition(caseStudy.project.slug, entry.title),
    }))
}

function buildHeroMedia(caseStudy: Awaited<ReturnType<typeof getPortfolioCaseStudy>>): HeroMediaItem {
  if (!caseStudy) {
    return {
      kind: 'image',
      src: '/images/portfolio/placeholders/web-1.png',
      alt: 'Constantia portfolio hero',
    }
  }

  const posterImage = caseStudy.posterImage ?? caseStudy.heroImage

  if (caseStudy.mediaKind === 'storage-video' && caseStudy.videoEntries?.length) {
    return {
      kind: 'image',
      src: posterImage,
      alt: `${caseStudy.project.title} poster`,
      interactive: false,
      objectPosition: getMotionPosterPosition(caseStudy.project.slug),
    }
  }

  if (caseStudy.mediaKind === 'youtube-embed' && caseStudy.youtubeVideoId) {
    return {
      kind: 'youtube-embed',
      youtubeVideoId: caseStudy.youtubeVideoId,
      youtubeStartSeconds: caseStudy.youtubeStartSeconds,
      poster: posterImage,
      alt: `${caseStudy.project.title} video`,
    }
  }

  if (caseStudy.mediaKind === 'storage-video' && caseStudy.hlsManifestPath) {
    return {
      kind: 'storage-video',
      src: caseStudy.hlsManifestPath,
      poster: posterImage,
      alt: `${caseStudy.project.title} video`,
    }
  }

  return {
      kind: 'image',
      src: caseStudy.heroImage,
      fullSrc: caseStudy.heroLightboxImage ?? caseStudy.heroImage,
      alt: `${caseStudy.project.title} hero image`,
  }
}

function toDisplayCredit(caseStudyCredit: string | undefined, fallbackRole: string | undefined) {
  return (caseStudyCredit ?? fallbackRole ?? 'Constantia Talent').toUpperCase()
}

export async function generateStaticParams() {
  const routes = await getAllServiceProjectRoutes()
  return routes.filter((route) => route.service !== 'design')
}

export const dynamicParams = false

export default async function ServicePortfolioCaseStudyPage({
  params,
}: {
  params: Promise<{ service: string; slug: string }>
}) {
  const { service, slug } = await params

  const serviceConfig = getServicePortfolioBySlug(service)
  if (!serviceConfig) {
    notFound()
  }

  const caseStudy = await getPortfolioCaseStudy(serviceConfig.slug, slug)
  if (!caseStudy) {
    notFound()
  }

  const portraitObjectPosition = getTalentObjectPosition(caseStudy.talent?.id)

  const heroMedia = buildHeroMedia(caseStudy)
  const playableVideos = buildPlayableVideos(caseStudy)
  const galleryPreviewImages =
    heroMedia.kind === 'image' && heroMedia.interactive !== false && caseStudy.galleryImages.length > 1
      ? caseStudy.galleryImages.slice(1)
      : caseStudy.galleryImages
  const galleryLightboxImages =
    heroMedia.kind === 'image' &&
    heroMedia.interactive !== false &&
    (caseStudy.galleryLightboxImages ?? caseStudy.galleryImages).length > 1
      ? (caseStudy.galleryLightboxImages ?? caseStudy.galleryImages).slice(1)
      : caseStudy.galleryLightboxImages ?? caseStudy.galleryImages
  const supportingMedia = buildSupportingMedia(
    serviceConfig.slug,
    caseStudy.project.title,
    playableVideos.length > 0 ? [] : galleryPreviewImages,
    playableVideos.length > 0 ? [] : galleryLightboxImages
  )

  const desktopTree = (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={`${styles.breadcrumbPrimary} ${styles.breadcrumbLink}`}>
              Services
            </Link>
            <span className={styles.breadcrumbSlash}>/</span>
            <Link
              href={`/services/${serviceConfig.slug}/portfolio`}
              className={`${styles.breadcrumbAccent} ${styles.breadcrumbLink}`}
            >
              Agency Portfolio
            </Link>
          </div>
          <PortfolioChildBackLink
            href={`/services/${serviceConfig.slug}/portfolio`}
            label={`${serviceConfig.title} Portfolio`}
          />
        </div>

        <div className={styles.layout}>
          <ServiceCaseStudyGallery
            title={caseStudy.project.title}
            hero={heroMedia}
            supportingMedia={supportingMedia}
            playableVideos={playableVideos}
          />

          <aside className={styles.sidebar}>
            <div className={styles.portraitWrap}>
              {caseStudy.talent ? (
                <Image
                  src={caseStudy.talent.image}
                  alt={caseStudy.talent.name}
                  fill
                  priority
                  sizes="(max-width: 1100px) 230px, 248px"
                  className={styles.portraitImage}
                  style={portraitObjectPosition ? { objectPosition: portraitObjectPosition } : undefined}
                />
              ) : null}
            </div>

            <div>
              <h2 className={styles.sidebarName}>{caseStudy.talent?.name ?? 'Constantia'}</h2>
              <p className={styles.sidebarCredit}>
                {toDisplayCredit(caseStudy.caseStudyCredit, caseStudy.talent?.role)}
              </p>
              <p className={styles.sidebarBio}>
                {caseStudy.talent?.shortBio ?? caseStudy.project.shortDescription}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={
        <MobileServiceProjectDetail
          service={serviceConfig}
          project={caseStudy.project}
          talent={caseStudy.talent}
          heroImage={caseStudy.heroImage}
          galleryImages={caseStudy.galleryImages}
          caseStudyCredit={caseStudy.caseStudyCredit}
          backHref={`/services/${serviceConfig.slug}/portfolio`}
          backLabel={serviceConfig.title}
        />
      }
    />
  )
}
