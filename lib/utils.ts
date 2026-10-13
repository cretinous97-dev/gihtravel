import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format a USD price for display. */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** "8 days / 7 nights" label used on tour cards. */
export function formatDuration(days: number, nights?: number): string {
  const n = nights ?? Math.max(days - 1, 0)
  return `${days} day${days === 1 ? '' : 's'} / ${n} night${n === 1 ? '' : 's'}`
}

/** Absolute URL helper for metadata, sitemap and JSON-LD. */
export function absoluteUrl(path = '/'): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gihtourtravel.vercel.app').replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/** Pluralise a count for UI copy: "3 nights", "1 night". */
export function plural(count: number, singular: string, pluralWord?: string): string {
  return `${count} ${count === 1 ? singular : pluralWord ?? `${singular}s`}`
}
