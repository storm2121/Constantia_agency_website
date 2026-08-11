'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Talent } from '@/lib/types'
import { getTalentObjectPosition } from '@/lib/talent-presentation'

interface TalentCardProps {
  talent: Talent
}

export default function TalentCard({ talent }: TalentCardProps) {
  return (
    <Link href={`/talents/${talent.slug}`} className="block">
      <div className="relative overflow-hidden aspect-[3/4] bg-white/5 cursor-pointer group">
        {/* Main image */}
        <Image
          src={talent.image}
          alt={talent.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          style={{ objectPosition: getTalentObjectPosition(talent.id) ?? 'center top' }}
        />

        {/* Always-present bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />

        {/* Bottom section — always visible */}
        <div className="absolute bottom-0 inset-x-0 py-4 px-4 z-20">
          <p className="font-playfair text-base font-light text-white leading-snug">
            {talent.name}
          </p>
          <p className="font-inter text-xs tracking-widest uppercase text-white/50 mt-1">
            {talent.role}
          </p>

          {/* View Profile — appears on hover */}
          <p className="font-inter text-xs tracking-widest text-white/80 mt-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            View Profile
          </p>
        </div>
      </div>
    </Link>
  )
}
