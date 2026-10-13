'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * MobileNav — accessible slide-down menu for small screens.
 * Closes on navigation and on Escape; traps no focus (menu is a simple
 * disclosure, not a modal).
 */
export function MobileNav({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-200 bg-white text-himalaya-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className={cn(
            'absolute inset-x-0 top-20 border-b border-cream-200 bg-cream shadow-lift',
          )}
        >
          <nav aria-label="Mobile" className="px-5 py-6">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-lg font-medium text-charcoal-soft hover:bg-white hover:text-himalaya-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400',
                      pathname === link.href && 'bg-white text-himalaya-600',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact" className="mt-4 w-full">
              Plan Your Trip
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
