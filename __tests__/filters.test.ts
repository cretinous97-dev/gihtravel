import {
  DESTINATION_SLUGS,
  durationBucket,
  filterTours,
  filtersToQueryString,
  parseFilters,
  queryTours,
  sortTours,
} from '@/lib/filters'
import type { Tour } from '@/lib/types'

/**
 * Unit tests for the /tours filter, sort and pagination logic
 * (pure functions in lib/filters.ts).
 */

function makeTour(overrides: Partial<Tour>): Tour {
  return {
    _id: `tour-${overrides.slug ?? 'test'}`,
    title: 'Test Tour',
    slug: 'test-tour',
    shortDescription: 'A test tour.',
    heroImage: null,
    gallery: [],
    overview: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    durationDays: 7,
    durationNights: 6,
    bestSeason: [],
    featured: false,
    destinations: [],
    ...overrides,
  }
}

const tours: Tour[] = [
  makeTour({
    slug: 'cultural-week',
    title: 'Cultural Week',
    durationDays: 7,
    activityType: 'Cultural',
    difficulty: 'Easy',
    bestSeason: ['Spring', 'Autumn'],
    destinations: [{ _id: 'destination-paro', name: 'Paro', slug: 'paro' }],
    priceFrom: 2000,
    featured: true,
  }),
  makeTour({
    slug: 'high-trek',
    title: 'High Trek',
    durationDays: 12,
    activityType: 'Trekking',
    difficulty: 'Challenging',
    bestSeason: ['Autumn'],
    destinations: [{ _id: 'destination-thimphu', name: 'Thimphu', slug: 'thimphu' }],
    priceFrom: 4000,
  }),
  makeTour({
    slug: 'festival-fun',
    title: 'Festival Fun',
    durationDays: 4,
    activityType: 'Festival',
    difficulty: 'Moderate',
    bestSeason: ['Winter'],
    destinations: [
      { _id: 'destination-paro', name: 'Paro', slug: 'paro' },
      { _id: 'destination-punakha', name: 'Punakha', slug: 'punakha' },
    ],
    priceFrom: 1000,
  }),
  makeTour({
    slug: 'wellness-days',
    title: 'Wellness Days',
    durationDays: 5,
    activityType: 'Wellness',
    // no difficulty, no price, no season
    destinations: [],
  }),
]

describe('parseFilters', () => {
  it('returns defaults for empty params', () => {
    const filters = parseFilters({})
    expect(filters.sort).toBe('featured')
    expect(filters.page).toBe(1)
    expect(filters.destination).toBeUndefined()
  })

  it('accepts valid facet values', () => {
    const filters = parseFilters({
      destination: 'paro',
      activity: 'Cultural',
      difficulty: 'Easy',
      duration: '5-7',
      season: 'Spring',
      sort: 'price-asc',
      page: '2',
    })
    expect(filters).toEqual({
      destination: 'paro',
      activity: 'Cultural',
      difficulty: 'Easy',
      duration: '5-7',
      season: 'Spring',
      sort: 'price-asc',
      page: 2,
    })
  })

  it('ignores unknown values', () => {
    const filters = parseFilters({ destination: 'atlantis', activity: 'Skiing', sort: 'chaos', page: '-3' })
    expect(filters.destination).toBeUndefined()
    expect(filters.activity).toBeUndefined()
    expect(filters.sort).toBe('featured')
    expect(filters.page).toBe(1)
  })

  it('knows every destination slug used by the catalogue', () => {
    expect(DESTINATION_SLUGS).toContain('paro')
    expect(DESTINATION_SLUGS).toContain('phobjikha')
  })
})

describe('durationBucket', () => {
  it('buckets durations correctly', () => {
    expect(durationBucket(1)).toBe('1-4')
    expect(durationBucket(4)).toBe('1-4')
    expect(durationBucket(5)).toBe('5-7')
    expect(durationBucket(7)).toBe('5-7')
    expect(durationBucket(8)).toBe('8-10')
    expect(durationBucket(10)).toBe('8-10')
    expect(durationBucket(11)).toBe('11+')
  })
})

describe('filterTours', () => {
  it('filters by destination', () => {
    const result = filterTours(tours, { destination: 'paro' })
    expect(result.map((t) => t.slug)).toEqual(['cultural-week', 'festival-fun'])
  })

  it('filters by activity', () => {
    const result = filterTours(tours, { activity: 'Trekking' })
    expect(result.map((t) => t.slug)).toEqual(['high-trek'])
  })

  it('filters by difficulty', () => {
    const result = filterTours(tours, { difficulty: 'Easy' })
    expect(result.map((t) => t.slug)).toEqual(['cultural-week'])
  })

  it('filters by duration bucket', () => {
    const result = filterTours(tours, { duration: '1-4' })
    expect(result.map((t) => t.slug)).toEqual(['festival-fun'])
  })

  it('filters by season', () => {
    const result = filterTours(tours, { season: 'Winter' })
    expect(result.map((t) => t.slug)).toEqual(['festival-fun'])
  })

  it('combines facets (AND semantics)', () => {
    const result = filterTours(tours, { destination: 'paro', activity: 'Cultural' })
    expect(result.map((t) => t.slug)).toEqual(['cultural-week'])
  })

  it('returns all tours when no filters are active', () => {
    expect(filterTours(tours, {})).toHaveLength(4)
  })
})

describe('sortTours', () => {
  it('sorts by price ascending, unknown prices last', () => {
    const result = sortTours(tours, 'price-asc')
    expect(result.map((t) => t.slug)).toEqual(['festival-fun', 'cultural-week', 'high-trek', 'wellness-days'])
  })

  it('sorts by price descending', () => {
    const result = sortTours(tours, 'price-desc')
    expect(result[0]?.slug).toBe('high-trek')
  })

  it('sorts by duration', () => {
    expect(sortTours(tours, 'duration-asc').map((t) => t.durationDays)).toEqual([4, 5, 7, 12])
    expect(sortTours(tours, 'duration-desc').map((t) => t.durationDays)).toEqual([12, 7, 5, 4])
  })

  it('keeps featured tours first by default', () => {
    const result = sortTours(tours, 'featured')
    expect(result[0]?.slug).toBe('cultural-week')
  })
})

describe('queryTours (filter + sort + paginate)', () => {
  it('paginates with a stable page size', () => {
    const page1 = queryTours(tours, { sort: 'duration-asc', page: 1 })
    expect(page1.total).toBe(4)
    expect(page1.totalPages).toBe(1)
    expect(page1.tours.length).toBe(4)
  })

  it('clamps out-of-range pages', () => {
    const result = queryTours(tours, { sort: 'featured', page: 99 })
    expect(result.page).toBe(result.totalPages)
  })
})

describe('filtersToQueryString', () => {
  it('omits defaults and serialises the rest', () => {
    const qs = filtersToQueryString({ sort: 'featured', page: 1 })
    expect(qs).toBe('')
    const qs2 = filtersToQueryString({ destination: 'paro', activity: 'Cultural', sort: 'price-asc', page: 2 })
    const params = new URLSearchParams(qs2)
    expect(params.get('destination')).toBe('paro')
    expect(params.get('activity')).toBe('Cultural')
    expect(params.get('sort')).toBe('price-asc')
    expect(params.get('page')).toBe('2')
  })

  it('round-trips through parseFilters', () => {
    const filters = { destination: 'thimphu', activity: 'Trekking' as const, sort: 'duration-desc' as const, page: 1 }
    const parsed = parseFilters(Object.fromEntries(new URLSearchParams(filtersToQueryString(filters))))
    expect(parsed.destination).toBe('thimphu')
    expect(parsed.activity).toBe('Trekking')
    expect(parsed.sort).toBe('duration-desc')
  })
})
