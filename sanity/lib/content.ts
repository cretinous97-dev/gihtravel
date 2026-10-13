import { sanityFetch } from './client'
import { queries } from './queries'
import * as seed from './seed-docs'
import type {
  AboutBhutanPage,
  AboutPage,
  ContactPage,
  Destination,
  HomePage,
  LegalPage,
  SiteSettings,
  Testimonial,
  Tour,
} from '@/lib/types'

/**
 * Content access layer for every page.
 *
 * Behaviour:
 *   - Sanity configured  → live CMS data (with 60s ISR)
 *   - Sanity unreachable → falls back to the bundled seed content so the
 *     site never crashes and never shows an empty shell
 *   - Sanity not configured yet → seed content immediately (local dev works
 *     with zero setup)
 *
 * Individual lookups fall back to the matching seed document.
 */

export async function getTours(): Promise<Tour[]> {
  const data = await sanityFetch<Tour[]>({ query: queries.tours, tags: ['tour'] })
  return data ?? seed.tours
}

export async function getTourSlugs(): Promise<string[]> {
  const data = await sanityFetch<{ slug: string }[]>({ query: queries.tourSlugs, tags: ['tour'] })
  return data?.map((d) => d.slug) ?? seed.tours.map((t) => t.slug)
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const data = await sanityFetch<Tour>({ query: queries.tourBySlug, params: { slug }, tags: ['tour'] })
  return data ?? seed.tours.find((t) => t.slug === slug) ?? null
}

export async function getDestinations(): Promise<Destination[]> {
  const data = await sanityFetch<Destination[]>({ query: queries.destinations, tags: ['destination'] })
  return data ?? seed.destinations
}

export async function getDestinationSlugs(): Promise<string[]> {
  const data = await sanityFetch<{ slug: string }[]>({ query: queries.destinationSlugs, tags: ['destination'] })
  return data?.map((d) => d.slug) ?? seed.destinations.map((d) => d.slug)
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const data = await sanityFetch<Destination>({
    query: queries.destinationBySlug,
    params: { slug },
    tags: ['destination'],
  })
  return data ?? seed.destinations.find((d) => d.slug === slug) ?? null
}

/** Tours that visit a given destination (for the destination detail page). */
export async function getToursForDestination(destinationSlug: string): Promise<Tour[]> {
  const tours = await getTours()
  return tours.filter((t) => t.destinations.some((d) => d.slug === destinationSlug))
}

/** Related tours: same activity type or shared destination, excluding itself. */
export function getRelatedTours(allTours: Tour[], tour: Tour, limit = 3): Tour[] {
  return allTours
    .filter((t) => t.slug !== tour.slug)
    .map((t) => {
      let score = 0
      if (t.activityType && t.activityType === tour.activityType) score += 2
      if (t.destinations.some((d) => tour.destinations.some((td) => td.slug === d.slug))) score += 1
      return { t, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.t)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await sanityFetch<Testimonial[]>({ query: queries.testimonials, tags: ['testimonial'] })
  return data ?? seed.testimonials
}

export async function getHomePage(): Promise<HomePage> {
  const data = await sanityFetch<HomePage>({ query: queries.homePage, tags: ['homePage'] })
  if (data) return data
  return seed.homePage
}

export async function getAboutBhutanPage(): Promise<AboutBhutanPage> {
  const data = await sanityFetch<AboutBhutanPage>({ query: queries.aboutBhutanPage, tags: ['aboutBhutanPage'] })
  return data ?? seed.aboutBhutanPage
}

export async function getAboutPage(): Promise<AboutPage> {
  const data = await sanityFetch<AboutPage>({ query: queries.aboutPage, tags: ['aboutPage'] })
  return data ?? seed.aboutPage
}

export async function getContactPage(): Promise<ContactPage> {
  const data = await sanityFetch<ContactPage>({ query: queries.contactPage, tags: ['contactPage'] })
  return data ?? seed.contactPage
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings>({ query: queries.siteSettings, tags: ['siteSettings'] })
  return data ?? seed.siteSettings
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  const data = await sanityFetch<LegalPage>({
    query: queries.legalPageBySlug,
    params: { slug },
    tags: ['legalPage'],
  })
  return data ?? seed.legalPages.find((p) => p.slug === slug) ?? null
}
