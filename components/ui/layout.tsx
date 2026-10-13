import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Layout primitives: Container (page gutters + max width),
 * Section (vertical rhythm), Heading (editorial type hierarchy).
 */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
}

export function Section({
  className,
  children,
  id,
  tone = 'cream',
  'aria-labelledby': ariaLabelledBy,
}: {
  className?: string
  children: ReactNode
  id?: string
  tone?: 'cream' | 'white' | 'himalaya' | 'sage'
  'aria-labelledby'?: string
}) {
  const toneClass = {
    cream: 'bg-cream text-charcoal',
    white: 'bg-white text-charcoal',
    himalaya: 'bg-himalaya-600 text-cream',
    sage: 'bg-sage-100 text-charcoal',
  }[tone]
  return (
    <section id={id} aria-labelledby={ariaLabelledBy} className={cn('py-16 sm:py-24', toneClass, className)}>
      {children}
    </section>
  )
}

export function Heading({
  level = 2,
  className,
  children,
  id,
}: {
  level?: 1 | 2 | 3 | 4
  className?: string
  children: ReactNode
  id?: string
}) {
  const Tag = `h${level}` as const
  const sizes = {
    1: 'text-display-2 font-serif',
    2: 'text-heading-1 font-serif',
    3: 'text-heading-2 font-serif',
    4: 'text-heading-3 font-serif',
  }[level]
  return (
    <Tag id={id} className={cn(sizes, 'text-balance text-charcoal', className)}>
      {children}
    </Tag>
  )
}

/** Small eyebrow label above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ochre-500', className)}>{children}</p>
  )
}

/** Lead paragraph with a comfortable reading measure. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('max-w-measure text-body-lg text-charcoal-soft', className)}>{children}</p>
}
