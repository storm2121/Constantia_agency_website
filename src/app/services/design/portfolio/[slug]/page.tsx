import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DesignCollectionGallery, {
  type DesignGalleryImage,
  type DesignGallerySection,
  type DesignGalleryVideo,
} from '@/components/DesignCollectionGallery'
import PortfolioChildBackLink from '@/components/PortfolioChildBackLink'
import MobileServiceProjectDetail from '@/components/mobile/MobileServiceProjectDetail'
import DeviceGate from '@/components/DeviceGate'
import {
  getDesignProjectSlugs,
  getPortfolioCaseStudy,
} from '@/lib/content-repository'
import { getServicePortfolioBySlug } from '@/lib/service-portfolios'
import {
  getDesignCollectionCredit,
  getDesignTalentPresentation,
  getTalentObjectPosition,
} from '@/lib/talent-presentation'
import styles from './page.module.css'

function normalizeUnique(values: string[]) {
  return values.filter((value, index, collection) => Boolean(value) && collection.indexOf(value) === index)
}

function buildSections(caseStudy: NonNullable<Awaited<ReturnType<typeof getPortfolioCaseStudy>>>) {
  const fallbackSections = [
    {
      id: 'gallery',
      title: 'Collection',
      kind: 'images' as const,
      previewPaths: caseStudy.galleryImages,
      fullPaths: caseStudy.galleryLightboxImages ?? caseStudy.galleryImages,
      videoEntries: caseStudy.videoEntries ?? [],
    },
  ]

  const sourceSections =
    caseStudy.designSections && caseStudy.designSections.length > 0
      ? caseStudy.designSections
      : fallbackSections

  return sourceSections
    .map<DesignGallerySection>((section, sectionIndex) => {
      const previewPaths = normalizeUnique(section.previewPaths)
      const fullPaths = normalizeUnique(section.fullPaths.length > 0 ? section.fullPaths : section.previewPaths)
      const skipHero = sectionIndex === 0 && previewPaths.length > 0
      const imageStart = skipHero ? 1 : 0

      const images: DesignGalleryImage[] = previewPaths.slice(imageStart).map((src, index) => ({
        id: `${section.id}-image-${index + 1}`,
        src,
        fullSrc: fullPaths[index + imageStart] ?? src,
        alt: `${caseStudy.project.title} ${section.title} image ${index + 1}`,
      }))

      const videos: DesignGalleryVideo[] = (section.videoEntries ?? [])
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((entry) => ({
          id: `${section.id}-${entry.id}`,
          title: entry.title,
          poster: entry.posterPath,
          hlsManifestPath: entry.hlsManifestPath,
          alt: `${caseStudy.project.title} ${entry.title}`,
        }))

      return {
        id: section.id,
        title: section.title,
        kind: section.kind,
        images,
        videos,
      }
    })
    .filter((section) => section.images.length > 0 || section.videos.length > 0)
}

export async function generateStaticParams() {
  const slugs = await getDesignProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export default async function DesignCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const caseStudy = await getPortfolioCaseStudy('design', slug)

  if (!caseStudy) {
    notFound()
  }

  const designService = getServicePortfolioBySlug('design')
  const mobileGalleryImages =
    caseStudy.designSections?.flatMap((s) => s.previewPaths) ?? caseStudy.galleryImages

  const sections = buildSections(caseStudy)
  const designPresentation = getDesignTalentPresentation(caseStudy.talent?.id)
  const designCollectionCredit = getDesignCollectionCredit(caseStudy.project.slug)
  const portraitObjectPosition = getTalentObjectPosition(caseStudy.talent?.id)
  const hero = {
    id: 'hero',
    src: caseStudy.heroImage,
    fullSrc: caseStudy.heroLightboxImage ?? caseStudy.heroImage,
    alt: `${caseStudy.project.title} hero image`,
  }

  const desktopTree = (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link
              href="/"
              className={`${styles.breadcrumbPrimary} ${styles.breadcrumbLink}`}
            >
              Services
            </Link>
            <span className={styles.breadcrumbSlash}>/</span>
            <Link
              href="/services/design/portfolio"
              className={`${styles.breadcrumbAccent} ${styles.breadcrumbLink}`}
            >
              Graphic Design
            </Link>
            <span className={styles.breadcrumbSlash}>/</span>
            {caseStudy.talent ? (
              <Link
                href={`/services/design/portfolio/talents/${caseStudy.talent.slug}`}
                className={`${styles.breadcrumbPrimary} ${styles.breadcrumbLink}`}
              >
                {caseStudy.talent.name}
              </Link>
            ) : null}
          </div>
          <PortfolioChildBackLink
            href={
              caseStudy.talent
                ? `/services/design/portfolio/talents/${caseStudy.talent.slug}`
                : '/services/design/portfolio'
            }
            label={caseStudy.talent?.name ?? 'Graphic Design'}
          />
        </div>

        <div className={styles.layout}>
          <DesignCollectionGallery title={caseStudy.project.title} hero={hero} sections={sections} />

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
                {(
                  designCollectionCredit ??
                  (caseStudy.caseStudyCredit && caseStudy.caseStudyCredit !== 'Graphic Designer'
                    ? caseStudy.caseStudyCredit
                    : undefined) ??
                  designPresentation?.role ??
                  caseStudy.talent?.role ??
                  'Graphic Designer'
                ).toUpperCase()}
              </p>
              <p className={styles.sidebarBio}>
                {designPresentation?.detailBio ?? caseStudy.talent?.fullBio ?? caseStudy.project.shortDescription}
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
        designService ? (
          <MobileServiceProjectDetail
            service={designService}
            project={caseStudy.project}
            talent={caseStudy.talent}
            heroImage={caseStudy.heroImage}
            galleryImages={mobileGalleryImages}
            caseStudyCredit={caseStudy.caseStudyCredit}
            backHref={
              caseStudy.talent
                ? `/services/design/portfolio/talents/${caseStudy.talent.slug}`
                : '/services/design/portfolio'
            }
            backLabel={caseStudy.talent?.name ?? 'Graphic Design'}
          />
        ) : null
      }
    />
  )
}
