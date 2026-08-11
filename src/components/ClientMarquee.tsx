'use client'

import { featuredClients } from '@/lib/data/clients'

export default function ClientMarquee() {
  return (
    <section className="py-24 overflow-hidden border-y border-white/5">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row:hover > div {
          animation-play-state: paused;
        }
      `}</style>

      {/* Row 1 — scrolls left */}
      <div className="marquee-row flex overflow-hidden mb-10">
        <div
          className="flex shrink-0"
          style={{ animation: 'scroll-left 35s linear infinite' }}
        >
          {[...featuredClients, ...featuredClients].map((client, i) => (
            <div
              key={`row1-${i}`}
              className="flex items-center justify-center h-10 mx-8 px-4"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-10 w-auto object-contain max-w-[120px]"
                style={{
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.35,
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.opacity = '0.35'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-row flex overflow-hidden">
        <div
          className="flex shrink-0"
          style={{ animation: 'scroll-right 35s linear infinite' }}
        >
          {[...featuredClients, ...featuredClients].map((client, i) => (
            <div
              key={`row2-${i}`}
              className="flex items-center justify-center h-10 mx-8 px-4"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-10 w-auto object-contain max-w-[120px]"
                style={{
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.35,
                  transition: 'opacity 0.3s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.opacity = '0.35'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
