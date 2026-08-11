import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'
import MobileProjectDetail from '@/components/mobile/MobileProjectDetail'
import DeviceGate from '@/components/DeviceGate'
import {
  getAllProjects,
  getProjectBySlug,
  getRelatedProjects,
  getTalentBySlug,
} from '@/lib/content-repository'

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const [talent, related] = await Promise.all([
    getTalentBySlug(project.primaryTalentId),
    getRelatedProjects(project, 3),
  ])

  const desktopTree = (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none" style={{ height: '80px' }}>
        <div className="px-6 md:px-12 lg:px-20 h-full flex items-center">
          <Link
            href="/portfolio"
            className="pointer-events-auto group flex items-center gap-3"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="block h-px transition-all duration-500 ease-out"
              style={{
                width: '24px',
                background: 'rgba(255,255,255,0.3)',
              }}
            />
            <span
              className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Portfolio
            </span>
          </Link>
        </div>
      </div>

      <div className="relative w-full" style={{ height: '75vh', minHeight: '520px' }}>
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: '55%',
            background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: '30%',
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, transparent 100%)',
          }}
        />
      </div>

      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto -mt-2 pb-12 border-b border-white/8">
        <div className="flex items-center gap-4 mb-7">
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/30">
            {project.service}
          </span>
          <span className="block h-px w-4 bg-white/15" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/30">
            {project.date}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <h1
            className="font-light text-white leading-[0.92] tracking-[-0.02em]"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              maxWidth: '18ch',
            }}
          >
            {project.title}
          </h1>

          <div className="flex-shrink-0 lg:pb-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 border border-white/12 px-3 py-1.5">
              {project.category}
            </span>
          </div>
        </div>

        <p
          className="text-white/50 mt-8 max-w-2xl"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', lineHeight: '1.85' }}
        >
          {project.shortDescription}
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto py-16">
        <div className="max-w-[66ch]">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-6">
            — Overview
          </p>
          <p
            className="text-white/65 leading-loose"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1rem)' }}
          >
            {project.fullDescription}
          </p>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto py-14 border-t border-white/8 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-5">
            Created by
          </p>
          {talent ? (
            <>
              <Link
                href={`/talents/${talent.slug}`}
                className="text-white transition-colors duration-300 hover:text-white/60"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontWeight: 300,
                  textDecoration: 'none',
                }}
              >
                {talent.name}
              </Link>
              <p className="text-white/30 text-xs tracking-wide mt-2 uppercase">{talent.role}</p>
            </>
          ) : (
            <p className="text-white/50 text-sm">{project.primaryTalentId}</p>
          )}
        </div>

        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-5">
            Client
          </p>
          {project.clientLogo ? (
            <div className="relative h-8 w-40">
              <Image
                src={project.clientLogo}
                alt={project.clientName}
                fill
                className="object-contain filter brightness-0 invert opacity-50"
                sizes="160px"
              />
            </div>
          ) : (
            <p
              className="text-white/60"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', fontWeight: 300 }}
            >
              {project.clientName}
            </p>
          )}
        </div>
      </div>

      {project.tags.length > 0 ? (
        <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto pb-16 border-t border-white/8 pt-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-5">
            Tags
          </p>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.15em] uppercase text-white/30 border border-white/10 px-3 py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto py-20 border-t border-white/8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3">
                Continue Exploring
              </p>
              <h2
                className="font-light text-white/70 leading-none"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                }}
              >
                More Work
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors duration-300 pb-1 border-b border-white/15 hover:border-white/40"
              style={{ textDecoration: 'none' }}
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
            {related.map((relatedProject) => (
              <ProjectCard key={relatedProject.id} project={relatedProject} />
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={<MobileProjectDetail project={project} talent={talent ?? null} related={related} />}
    />
  )
}
