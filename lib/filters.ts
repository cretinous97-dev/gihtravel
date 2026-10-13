import type { Tour, ActivityType, Difficulty, Season } from '@/lib/types'

/**
 * Pure filter/sort/pagination logic for the /tours listing.
 * Filters live in the URL query string so results are shareable.
 * Kept free of React so it can be unit-tested directly.
 */

export const TOURS_PER_PAGE = 9

export type DurationBucket = '1-4' | '5-7' | '8-10' | '11+'
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc'

export type TourFilters = {
  destination?: string
  activity?: ActivityType
  difficulty?: Difficulty
  duration?: DurationBucket
  season?: Season
  sort: SortOption
  page: number
}

const ACTIVITIES: ActivityType[] = ['Cultural', 'Trekking', 'Festival', 'Wellness', 'Custom']
const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging']
const DURATIONS: DurationBucket[] = ['1-4', '5-7', '8-10', '11+']
const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter']
const SORTS: SortOption[] = ['featured', 'price-asc', 'price-desc', 'duration-asc', 'duration-desc']

function oneOf<T extends string>(value: string | string[] | undefined, allowed: readonly T[]): T | undefined {
  const v = Array.isArray(value) ? value[0] : value
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined
}

/** Parse incoming Next.js searchParams into a validated filter object. */
export function parseFilters(searchParams: Record<string, string | string[] | undefined> | undefined): TourFilters {
  const sp = searchParams ?? {}
  const pageRaw = oneOf(sp.page, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const)
  return {
    destination: oneOf(sp.destination, DESTINATION_SLUGS) ?? undefined,
    activity: oneOf(sp.activity, ACTIVITIES),
    difficulty: oneOf(sp.difficulty, DIFFICULTIES),
    duration: oneOf(sp.duration, DURATIONS),
    season: oneOf(sp.season, SEASONS),
    sort: oneOf(sp.sort, SORTS) ?? 'featured',
    page: pageRaw ? Math.max(1, parseInt(pageRaw, 10)) : 1,
  }
}

/** Known destination slugs (kept in sync with seed content / CMS). */
export const DESTINATION_SLUGS = [
  'bumthang',
  'haa',
  'paro',
  'phobjikha',
  'punakha',
  'thimphu',
  'trongsa',
  'wangdue',
] as const

/** Duration bucket for a tour. */
export function durationBucket(days: number): DurationBucket {
  if (days <= 4) return '1-4'
  if (days <= 7) return '5-7'
  if (days <= 10) return '8-10'
  return '11+'
}

function matchesDuration(tour: Tour, bucket: DurationBucket): boolean {
  return durationBucket(tour.durationDays) === bucket
}

/** Filter tours by every active facet. Pure function. */
export function filterTours(tours: Tour[], filters: Partial<TourFilters>): Tour[] {
  return tours.filter((tour) => {
    if (filters.destination && !tour.destinations.some((d) => d.slug === filters.destination)) return false
    if (filters.activity && tour.activityType !== filters.activity) return false
    if (filters.difficulty && tour.difficulty !== filters.difficulty) return false
    if (filters.duration && !matchesDuration(tour, filters.duration)) return false
    if (filters.season && !tour.bestSeason.includes(filters.season)) return false
    return true
  })
}

/** Sort a tour list. `featured` keeps featured journeys first, then price.
 * Tours without a published price always sort last (both price directions). */
export function sortTours(tours: Tour[], sort: SortOption): Tour[] {
  const sorted = [...tours]
  const price = (t: Tour): number | null => (typeof t.priceFrom === 'number' ? t.priceFrom : null)
  const byPrice = (a: Tour, b: Tour, dir: 1 | -1) => {
    const pa = price(a)
    const pb = price(b)
    if (pa === null && pb === null) return 0
    if (pa === null) return 1 // unknown price last
    if (pb === null) return -1
    return dir * (pa - pb)
  }
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => byPrice(a, b, 1))
    case 'price-desc':
      return sorted.sort((a, b) => byPrice(a, b, -1))
    case 'duration-asc':
      return sorted.sort((a, b) => a.durationDays - b.durationDays)
    case 'duration-desc':
      return sorted.sort((a, b) => b.durationDays - a.durationDays)
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
  }
}

export type PagedTours = {
  tours: Tour[]
  total: number
  totalPages: number
  page: number
}

/** Filter + sort + paginate in one step. */
export function queryTours(allTours: Tour[], filters: TourFilters): PagedTours {
  const matched = sortTours(filterTours(allTours, filters), filters.sort)
  const total = matched.length
  const totalPages = Math.max(1, Math.ceil(total / TOURS_PER_PAGE))
  const page = Math.min(Math.max(1, filters.page), totalPages)
  const start = (page - 1) * TOURS_PER_PAGE
  return { tours: matched.slice(start, start + TOURS_PER_PAGE), total, totalPages, page }
}

/** Build a shareable query string from a filter object (omits defaults). */
export function filtersToQueryString(filters: Partial<TourFilters>): string {
  const params = new URLSearchParams()
  if (filters.destination) params.set('destination', filters.destination)
  if (filters.activity) params.set('activity', filters.activity)
  if (filters.difficulty) params.set('difficulty', filters.difficulty)
  if (filters.duration) params.set('duration', filters.duration)
  if (filters.season) params.set('season', filters.season)
  if (filters.sort && filters.sort !== 'featured') params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  return params.toString()
}

/** Label maps used by the FilterBar UI. */
export const FILTER_LABELS = {
  activity: {
    Cultural: 'Cultural',
    Trekking: 'Trekking',
    Festival: 'Festival',
    Wellness: 'Wellness',
    Custom: 'Custom / Bespoke',
  } satisfies Record<ActivityType, string>,
  difficulty: {
    Easy: 'Easy',
    Moderate: 'Moderate',
    Challenging: 'Challenging',
  } satisfies Record<Difficulty, string>,
  duration: {
    '1-4': '1–4 days',
    '5-7': '5–7 days',
    '8-10': '8–10 days',
    '11+': '11+ days',
  } satisfies Record<DurationBucket, string>,
  season: {
    Spring: 'Spring',
    Summer: 'Summer',
    Autumn: 'Autumn',
    Winter: 'Winter',
  } satisfies Record<Season, string>,
  sort: {
    featured: 'Featured',
    'price-asc': 'Price: low to high',
    'price-desc': 'Price: high to low',
    'duration-asc': 'Duration: shortest first',
    'duration-desc': 'Duration: longest first',
  } satisfies Record<SortOption, string>,
} as const
