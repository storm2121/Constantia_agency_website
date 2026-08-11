'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Show a "back to home" button only on these top-level pages
const PAGES_WITH_CLOSE: string[] = ['/portfolio', '/talents']

export default function CloseButton() {
  const pathname = usePathname()

  if (!PAGES_WITH_CLOSE.includes(pathname)) return null

  return (
    <div className="fixed bottom-8 left-8 z-50 hidden md:block">
      <Link
        href="/"
        className="group inline-flex items-center gap-3 text-white/20 hover:text-white/60 transition-colors duration-500"
      >
        <span className="w-5 h-px bg-current transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-9" />
        <span className="text-[9px] uppercase tracking-[0.4em]">Home</span>
      </Link>
    </div>
  )
}
