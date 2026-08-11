'use client'

import { useMemo, useState } from 'react'
import FilterBar from '@/components/FilterBar'
import ProjectCard from '@/components/ProjectCard'
import type { Project } from '@/lib/types'

export default function PortfolioArchiveClient({
  projects,
}: {
  projects: Project[]
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return projects
      .filter((project) => activeFilter === 'all' || project.service === activeFilter)
      .filter(
        (project) =>
          !searchQuery ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  }, [activeFilter, projects, searchQuery])

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="px-6 md:px-12 lg:px-20 pt-40 pb-20 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-8">
            Selected Work
          </p>

          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h1
              className="font-light text-white leading-[0.9] tracking-[-0.02em]"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              }}
            >
              Our Work
            </h1>

            <div className="text-right pb-2 flex-shrink-0">
              <span
                className="block font-light leading-none text-white/8"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  color: 'rgba(255,255,255,0.06)',
                }}
              >
                {projects.length.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-white/20 block mt-1">
                Projects
              </span>
            </div>
          </div>

          <p
            className="text-white/40 mt-10 max-w-xl"
            style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', lineHeight: '1.8' }}
          >
            A decade of creative and digital work across MENA and beyond —
            photography, film, design, and emerging technology.
          </p>
        </div>
      </section>

      <div
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 pt-10 pb-2">
          <span className="block h-px w-6 bg-white/15" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/25">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>

      <section className="px-6 md:px-12 lg:px-20 pt-8 pb-32 max-w-[1400px] mx-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <span
              className="text-white/10 font-light"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
              }}
            >
              —
            </span>
            <p className="text-white/25 text-sm tracking-[0.1em]">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
