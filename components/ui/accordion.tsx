'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Accordion — keyboard-accessible disclosure used for the day-by-day
 * itinerary. Uses a real <button> with aria-expanded/aria-controls, and
 * supports the native `hidden` semantics via the region role.
 */

export type AccordionItem = {
  key: string
  title: string
  subtitle?: string
  content: React.ReactNode
}

export function Accordion({ items, defaultOpenKey, className }: { items: AccordionItem[]; defaultOpenKey?: string; className?: string }) {
  const [openKey, setOpenKey] = useState<string | null>(defaultOpenKey ?? null)
  const baseId = useId()

  return (
    <div className={cn('divide-y divide-cream-200 rounded-2xl border border-cream-200 bg-white', className)}>
      {items.map((item) => {
        const open = openKey === item.key
        const panelId = `${baseId}-${item.key}`
        return (
          <div key={item.key}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenKey(open ? null : item.key)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ochre-400"
              >
                <span>
                  <span className="block font-serif text-lg text-charcoal">{item.title}</span>
                  {item.subtitle ? <span className="mt-0.5 block text-sm text-charcoal-muted">{item.subtitle}</span> : null}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream-200 text-ochre-500 transition-transform duration-200',
                    open && 'rotate-45',
                  )}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" hidden={!open} className="px-6 pb-6 text-body text-charcoal-soft">
              {open ? item.content : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
