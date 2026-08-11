'use client'

const FILTERS = ['All', 'Photo', 'Video', 'Motion', 'Design', 'Web'] as const

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-8 py-5 w-full overflow-x-auto scrollbar-hide">
      {FILTERS.map((label) => {
        const value = label.toLowerCase()
        const isActive = activeFilter === value
        return (
          <button
            key={label}
            onClick={() => onFilterChange(value)}
            className="relative flex-shrink-0 group"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <span
              className="block text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
              style={{
                color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'
              }}
            >
              {label}
            </span>
            {/* Active underline */}
            <span
              className="absolute left-0 bottom-[-4px] h-px transition-all duration-300"
              style={{
                width: isActive ? '100%' : '0%',
                background: 'rgba(255,255,255,0.6)',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
