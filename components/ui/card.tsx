import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — soft-surface container used by tour/destination/testimonial cards.
 * Kept deliberately quiet: hairline border + soft shadow, no heavy chrome.
 */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-6', className)}>{children}</div>
}
