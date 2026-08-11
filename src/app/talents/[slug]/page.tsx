import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'
import MobileTalentDetail from '@/components/mobile/MobileTalentDetail'
import DeviceGate from '@/components/DeviceGate'
import {
  getAllTalents,
  getProjectsByTalent,
  getTalentBySlug,
} from '@/lib/content-repository'
import { getTalentObjectPosition } from '@/lib/talent-presentation'

export async function generateStaticParams() {
  const talents = await getAllTalents()
  return talents.map((talent) => ({ slug: talent.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function TalentProfilePage({ params }: Props) {
  const { slug } = await params

  if (slug === 'jad-tounsi') {
    redirect('/talents/mohamed-el-hansali')
  }

  const talent = await getTalentBySlug(slug)
  if (!talent) {
    notFound()
  }
  const portraitObjectPosition = getTalentObjectPosition(talent.id)

  const talentProjects = await getProjectsByTalent(talent.id)

  const desktopTree = (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="fixed top-0 left-0 z-40 pt-6 pl-6 md:pt-7 md:pl-12">
        <Link
          href="/talents"
          className="group inline-flex items-center gap-3 text-white/25 hover:text-white/70 transition-colors duration-500"
        >
          <span className="w-5 h-px bg-current transition-all duration-600 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-9" />
          <span className="text-[9px] uppercase tracking-[0.4em]">The People</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        <div className="lg:w-[42%] lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col">
          <div className="relative flex-1" style={{ minHeight: '55vh' }}>
            <Image
              src={talent.image}
              alt={talent.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              style={portraitObjectPosition ? { objectPosition: portraitObjectPosition } : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent" />
          </div>

          <div className="px-8 pt-8 pb-10 lg:px-12 lg:pt-10 lg:pb-14 bg-[#0a0a0a]">
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/25 mb-4">
              {talent.role}
            </p>
            <h1
              className="font-light leading-[0.9]"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              {talent.name}
            </h1>

            <div className="w-8 h-px bg-white/15 my-6" />

            <p className="text-white/40 text-sm leading-relaxed">{talent.shortBio}</p>

            <div className="flex flex-wrap gap-2 mt-7">
              {talent.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[9px] border border-white/10 text-white/30 px-3 py-1.5 tracking-[0.2em] uppercase"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[58%] px-8 lg:px-16 xl:px-24 pt-16 lg:pt-36 pb-28">
          <section className="mb-20">
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 mb-8">About</p>
            <p className="text-white/55 text-base leading-[1.9] max-w-2xl">{talent.fullBio}</p>
          </section>

          {talent.clients.length > 0 ? (
            <section className="mb-20">
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 mb-10">Clients</p>
              <div className="grid grid-cols-3 gap-x-6 gap-y-8">
                {talent.clients.map((client) => (
                  <div key={client.name} className="group flex items-center h-10">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={110}
                      height={40}
                      className="transition-opacity duration-300 group-hover:opacity-70"
                      style={{
                        objectFit: 'contain',
                        objectPosition: 'left center',
                        filter: 'brightness(0) invert(1)',
                        opacity: 0.35,
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="w-full h-px bg-white/6 mb-20" />

          <section>
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 mb-10">
              Selected Work
            </p>
            {talentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {talentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-white/20 text-sm tracking-wider">Projects coming soon.</p>
            )}
          </section>

          <div className="mt-16 pt-12 border-t border-white/5">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/25 hover:text-white/60 transition-colors duration-400"
            >
              <span className="w-6 h-px bg-current transition-all duration-500 group-hover:w-10" />
              <span>View All Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={<MobileTalentDetail talent={talent} projects={talentProjects} />}
    />
  )
}
