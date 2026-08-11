import Image from 'next/image'
import Link from 'next/link'
import { getDesignPortfolioTalentEntries } from '@/lib/content-repository'
import { getServicePortfolioBySlug } from '@/lib/service-portfolios'
import { getDesignTalentPresentation, getTalentObjectPosition } from '@/lib/talent-presentation'
import ServicePortfolioReturnButton from '@/components/ServicePortfolioReturnButton'
import MobileDesignPortfolio from '@/components/mobile/MobileDesignPortfolio'
import DeviceGate from '@/components/DeviceGate'
import styles from './page.module.css'

export default async function DesignPortfolioLandingPage() {
  const service = getServicePortfolioBySlug('design')
  const talentEntries = await getDesignPortfolioTalentEntries()

  if (!service) {
    return null
  }

  const desktopTree = (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbPrimary}>Services</span>
            <span className={styles.breadcrumbSlash}>/</span>
            <span className={styles.breadcrumbAccent}>Graphic Design</span>
          </div>

          <div className={styles.returnWrap}>
            <ServicePortfolioReturnButton service={service} />
          </div>
        </div>

        <section className={styles.intro}>
          <span className={styles.introEyebrow}>Graphic Design</span>
          <h1 className={styles.introTitle}>
            Ayoub. Younes. Separate lanes.
          </h1>
          <p className={styles.introBody}>
            Identity, posters, and systems on one side.
            Campaign assets, carousels, and reels on the other.
          </p>
        </section>

        <section className={styles.talentList} aria-label="Graphic design talents">
          {talentEntries.map((entry, index) => {
            const leadProject = entry.projects[0]
            const secondaryProjects = entry.projects.slice(1, 3)
            const designPresentation = getDesignTalentPresentation(entry.talent.id)
            const portraitObjectPosition = getTalentObjectPosition(entry.talent.id)

            return (
              <Link
                key={entry.talent.id}
                href={`/services/design/portfolio/talents/${entry.talent.slug}`}
                className={`${styles.talentCard} ${index % 2 === 1 ? styles.talentCardReverse : ''}`}
              >
                <div className={styles.mediaColumn}>
                  <div className={styles.portraitVisual}>
                    <Image
                      src={entry.talent.image}
                      alt={entry.talent.name}
                      fill
                      sizes="(max-width: 720px) 100vw, 320px"
                      className={styles.portraitImage}
                      style={portraitObjectPosition ? { objectPosition: portraitObjectPosition } : undefined}
                    />
                  </div>

                  <div className={styles.previewStrip}>
                    {leadProject ? (
                      <div className={styles.primaryPreview}>
                        <Image
                          src={leadProject.thumbnail}
                          alt={leadProject.title}
                          fill
                          sizes="(max-width: 720px) 100vw, 280px"
                          className={styles.previewImage}
                        />
                      </div>
                    ) : null}

                    <div className={styles.secondaryPreviews}>
                      {secondaryProjects.map((project) => (
                        <div key={project.slug} className={styles.secondaryPreview}>
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            sizes="(max-width: 720px) 50vw, 135px"
                            className={styles.previewImage}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.copyColumn}>
                  <span className={styles.collectionCount}>
                    {entry.projects.length} collection{entry.projects.length === 1 ? '' : 's'}
                  </span>
                  <h2 className={styles.talentName}>{entry.talent.name}</h2>
                  <p className={styles.talentRole}>{designPresentation?.role ?? entry.talent.role}</p>
                  <p className={styles.talentBio}>{designPresentation?.landingBio ?? entry.talent.shortBio}</p>

                  <div className={styles.projectList}>
                    {entry.projects.slice(0, 3).map((project) => (
                      <div key={project.slug} className={styles.projectRow}>
                        <span className={styles.projectBullet} />
                        <div>
                          <strong className={styles.projectTitle}>{project.title}</strong>
                          <p className={styles.projectMeta}>{project.shortDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <span className={styles.cardAction}>
                    {designPresentation?.focus ?? 'design collection'} / open full portfolio
                  </span>
                </div>
              </Link>
            )
          })}
        </section>
      </div>
    </main>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={<MobileDesignPortfolio entries={talentEntries} />}
    />
  )
}
