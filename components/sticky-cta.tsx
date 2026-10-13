'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * StickyCta — persistent bottom bar on mobile so "Plan Your Trip" is always
 * one tap away. Hidden on ≥ sm screens (the header CTA covers those).
 */
export function StickyCta() {
  const pathname = usePathname()
  if (pathname === '/contact') return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <Link
        href="/contact"
        className="block w-full rounded-full bg-ochre-400 py-3 text-center font-medium text-white shadow-soft transition-colors hover:bg-ochre-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400 focus-visible:ring-offset-2"
      >
        Plan Your Trip
      </Link>
    </div>
  )
}
