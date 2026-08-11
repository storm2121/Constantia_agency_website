import Image from 'next/image'
import Link from 'next/link'
import MobileTalents from '@/components/mobile/MobileTalents'
import DeviceGate from '@/components/DeviceGate'
import { getAllTalents } from '@/lib/content-repository'
import { getTalentObjectPosition } from '@/lib/talent-presentation'
import type { Talent } from '@/lib/types'

export default async function TalentsPage() {
  const talents = await getAllTalents()
  const sorted = [...talents].sort((left, right) => left.order - right.order)
  const rows = [sorted.slice(0, 3), sorted.slice(3, 5), sorted.slice(5)]

  const desktopTree = (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="px-6 pt-44 pb-20 md:px-14 lg:px-20">
        <p className="text-[9px] uppercase tracking-[0.55em] text-white/18 mb-10">
          Constantia — The People
        </p>
        <h1
          className="font-light leading-[0.88]"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(4rem, 10vw, 8.5rem)',
          }}
        >
          The People
        </h1>
        <p className="mt-7 text-white/25 text-sm max-w-xs leading-relaxed tracking-wide">
          Seven specialists. One collective.
          <br />
          Working globally from Morocco.
        </p>
      </div>

      <div>
        {rows.map((row, index) => (
          <div
            key={`talent-row-${index}`}
            className={
              row.length === 3 ? 'grid grid-cols-1 md:grid-cols-3' : 'grid grid-cols-1 md:grid-cols-2'
            }
          >
            {row.map((talent) => (
              <TalentPhotoCard key={talent.id} talent={talent} index={sorted.indexOf(talent)} />
            ))}
          </div>
        ))}
      </div>

      <div className="h-32" />
    </main>
  )

  return (
    <DeviceGate
      desktop={desktopTree}
      mobile={<MobileTalents talents={talents} />}
    />
  )
}

function TalentPhotoCard({ talent, index }: { talent: Talent; index: number }) {
  return (
    <Link
      href={`/talents/${talent.slug}`}
      className="relative block w-full overflow-hidden group"
      style={{ height: '65vh', minHeight: '360px' }}
      aria-label={`View ${talent.name}'s profile`}
    >
      <Image
        src={talent.image}
        alt={talent.name}
        fill
        sizes="(max-width: 768px) 100vw, 34vw"
        className="object-cover object-top transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
        style={{ objectPosition: getTalentObjectPosition(talent.id) ?? 'center top' }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 via-[#0a0a0a]/10 to-transparent" />
      <div className="absolute inset-0 bg-[#0a0a0a]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="absolute bottom-0 left-0 p-6 lg:p-9">
        <p className="text-[9px] uppercase tracking-[0.45em] text-white/35 mb-2">
          {talent.role}
        </p>
        <p
          className="text-[1rem] font-light text-white/85"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {talent.name}
        </p>
        <div className="w-0 h-px bg-white/30 mt-3 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-8" />
      </div>

      <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/25">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </Link>
  )
}
