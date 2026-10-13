'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import {
  DESTINATION_SLUGS,
  FILTER_LABELS,
  filtersToQueryString,
  type SortOption,
  type TourFilters,
} from '@/lib/filters'
import { cn } from '@/lib/utils'
import type { ActivityType, Difficulty, Season } from '@/lib/types'

/**
 * FilterBar — facet filters for /tours. Every change rewrites the URL query
 * string (shareable results) via the Next.js router; all controls are native
 * selects/links so keyboard navigation works out of the box.
 */

const DESTINATION_LABELS: Record<string, string> = {
  bumthang: 'Bumthang',
  haa: 'Haa',
  paro: 'Paro',
  phobjikha: 'Phobjikha Valley',
  punakha: 'Punakha',
  thimphu: 'Thimphu',
  trongsa: 'Trongsa',
  wangdue: 'Wangdue',
}

export function FilterBar({ filters, total }: { filters: TourFilters; total: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const update = useCallback(
    (patch: Partial<TourFilters>) => {
      const merged: TourFilters = { ...filters, ...patch, page: 1 }
      const qs = filtersToQueryString(merged)
      startTransition(() => {
        router.push(qs ? `/tours?${qs}` : '/tours')
      })
    },
    [filters, router],
  )

  const activeCount = [filters.destination, filters.activity, filters.difficulty, filters.duration, filters.season].filter(
    Boolean,
  ).length

  const selectClass =
    'w-full rounded-full border border-cream-200 bg-white px-4 py-2.5 text-sm text-charcoal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400'

  return (
    <section aria-label="Filter tours" className={cn('rounded-2xl border border-cream-200 bg-cream/60 p-5', isPending && 'opacity-70')}>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex-1 min-w-[10rem]">
          <span className="sr-only">Filter by destination</span>
          <select
            className={selectClass}
            value={filters.destination ?? ''}
            onChange={(e) => update({ destination: e.target.value || undefined })}
          >
            <option value="">All destinations</option>
            {DESTINATION_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {DESTINATION_LABELS[slug] ?? slug}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 min-w-[10rem]">
          <span className="sr-only">Filter by activity type</span>
          <select
            className={selectClass}
            value={filters.activity ?? ''}
            onChange={(e) => update({ activity: (e.target.value || undefined) as ActivityType | undefined })}
          >
            <option value="">All activities</option>
            {(Object.keys(FILTER_LABELS.activity) as ActivityType[]).map((value) => (
              <option key={value} value={value}>
                {FILTER_LABELS.activity[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 min-w-[10rem]">
          <span className="sr-only">Filter by difficulty</span>
          <select
            className={selectClass}
            value={filters.difficulty ?? ''}
            onChange={(e) => update({ difficulty: (e.target.value || undefined) as Difficulty | undefined })}
          >
            <option value="">Any difficulty</option>
            {(Object.keys(FILTER_LABELS.difficulty) as Difficulty[]).map((value) => (
              <option key={value} value={value}>
                {FILTER_LABELS.difficulty[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 min-w-[10rem]">
          <span className="sr-only">Filter by duration</span>
          <select
            className={selectClass}
            value={filters.duration ?? ''}
            onChange={(e) => update({ duration: (e.target.value || undefined) as TourFilters['duration'] })}
          >
            <option value="">Any duration</option>
            {(Object.keys(FILTER_LABELS.duration) as Array<keyof typeof FILTER_LABELS.duration>).map((value) => (
              <option key={value} value={value}>
                {FILTER_LABELS.duration[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 min-w-[10rem]">
          <span className="sr-only">Filter by best season</span>
          <select
            className={selectClass}
            value={filters.season ?? ''}
            onChange={(e) => update({ season: (e.target.value || undefined) as Season | undefined })}
          >
            <option value="">Any season</option>
            {(Object.keys(FILTER_LABELS.season) as Season[]).map((value) => (
              <option key={value} value={value}>
                {FILTER_LABELS.season[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 min-w-[10rem]">
          <span className="sr-only">Sort tours</span>
          <select
            className={selectClass}
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortOption })}
          >
            {(Object.keys(FILTER_LABELS.sort) as SortOption[]).map((value) => (
              <option key={value} value={value}>
                {FILTER_LABELS.sort[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-charcoal-muted">
        <p aria-live="polite">
          {total} {total === 1 ? 'journey' : 'journeys'} found
          {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? '' : 's'} active` : ''}
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => update({ destination: undefined, activity: undefined, difficulty: undefined, duration: undefined, season: undefined })}
            className="rounded-full border border-cream-200 bg-white px-4 py-1.5 text-charcoal-soft transition-colors hover:border-ochre-400 hover:text-ochre-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
          >
            Clear all filters
          </button>
        ) : null}
      </div>
    </section>
  )
}
