import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ServicePortfolioReturnButton from '@/components/ServicePortfolioReturnButton'
import MobileDesignTalentPortfolio from '@/components/mobile/MobileDesignTalentPortfolio'
import DeviceGate from '@/components/DeviceGate'
import { getDesignPortfolioTalentSlugs, getDesignTalentPortfolio } from '@/lib/content-repository'
import { getServicePortfolioBySlug, getServicePortfolioProjectHref } from '@/lib/service-portfolios'
import { getDesignTalentPresentation, getTalentObjectPosition } from '@/lib/talent-presentation'
import styles from './page.module.css'

export async function generateStaticParams() {
  const talents = await getDesignPortfolioTalentSlugs()
  return talents.map((talent) => ({ talent }))
}

export const dynamicParams = false

export default async function DesignTalentPortfolioPage({
  params,
}: {
  params: Promise<{ talent: string }>
}) {
  const { talent } = await params
  const service = getServicePortfolioBySlug('design')
  const entry = await getDesignTalentPortfolio(talent)

  if (!service || !entry) {
    notFound()
  }

  const designPresentation = getDesignTalentPresentation(entry.talent.id)
  const portraitObjectPosition = getTalentObjectPosition(entry.talent.id)

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
              href="/services/design/portfolio"
              className={`${styles.breadcrumbAccent} ${styles.breadcrumbLink}`}
            >
              Graphic Design
            </Link>
            <span className={styles.breadcrumbSlash}>/</span>
            <span className={styles.breadcrumbPrimary}>{entry.talent.name}</span>
          </div>

          <div className={styles.returnWrap}>
            <ServicePortfolioReturnButton service={service} />
          </div>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroVisual}>
            <Image
              src={entry.talent.image}
              alt={entry.talent.name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 360px"
              className={styles.heroImage}
              style={portraitObjectPosition ? { objectPosition: portraitObjectPosition } : undefined}
            />
          </div>

          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Design Portfolio</span>
            <h1 className={styles.title}>{entry.talent.name}</h1>
            <p className={styles.role}>{designPresentation?.role ?? entry.talent.role}</p>
            <p className={styles.bio}>{designPresentation?.detailBio ?? entry.talent.fullBio}</p>

            <div className={styles.metaRow}>
              <span className={styles.metaPill}>
                {entry.projects.length} curated collection{entry.projects.length === 1 ? '' : 's'}
              </span>
              <span className={styles.metaPill}>
                {designPresentation?.focus ?? entry.talent.skills.slice(0, 3).join(' / ')}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.collections} aria-label={`${entry.talent.name} design collections`}>
          {entry.projects.map((project, index) => (
            <Link
              key={project.slug}
              href={getServicePortfolioProjectHref('design', project.slug)}
              className={`${styles.collectionCard} ${index % 2 === 1 ? styles.collectionCardReverse : ''}`}
            >
              <div className={styles.collectionVisual}>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 420px"
                  className={styles.collectionImage}
                />
              </div>

              <div className={styles.collectionCopy}>
                <span className={styles.collectionEyebrow}>{project.category}</span>
                <h2 className={styles.collectionTitle}>{project.title}</h2>
                <p className={styles.collectionDescription}>{project.shortDescription}</p>
                <p className={styles.collectionTags}>{project.tags.slice(0, 3).join(' / ')}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={<MobileDesignTalentPortfolio talent={entry.talent} projects={entry.projects} />}
    />
  )
}
