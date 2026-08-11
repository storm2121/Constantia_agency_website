'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
  index?: number
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="block group">
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-white/5">
        {/* Main image */}
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 z-10 bg-[#0a0a0a]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover content — centred title + category */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span
            className="text-[10px] tracking-[0.22em] uppercase text-white/50 mb-3"
          >
            — {project.category}
          </span>
          <h3
            className="text-center text-white font-light leading-tight"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            }}
          >
            {project.title}
          </h3>
        </div>
      </div>

      {/* Below-image metadata */}
      <div className="pt-4 pb-1">
        {/* Title */}
        <p
          className="text-white/80 text-sm leading-snug mb-1 transition-colors duration-300 group-hover:text-white"
          style={{ letterSpacing: '0.01em' }}
        >
          {project.title}
        </p>

        <div className="flex items-center gap-3">
          {/* Type badge */}
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/30">
            {project.service}
          </span>

          <span className="text-white/10 text-xs">·</span>

          {/* Client */}
          <span className="text-[10px] text-white/20 truncate">
            {project.clientName}
          </span>
        </div>
      </div>
    </Link>
  )
}
