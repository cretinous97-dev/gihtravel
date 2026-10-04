import 'server-only'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { destinations as fallbackDestinations, faqs as fallbackFAQs, siteSettings as fallbackSettings, teamMembers as fallbackTeam, testimonials as fallbackTestimonials } from '@/data/site'
import { contentPages as fallbackPages } from '@/data/pages'
import { trips as fallbackTrips, type Trip } from '@/data/trips'
import { safeExternalUrl } from '@/lib/format'

export type SiteSettings = typeof fallbackSettings & {
  logoUrl?: string | null
  heroImage?: string | null
  featureImage?: string | null
}

const fallbackSiteSettings = (): SiteSettings => {
  const logoExists = existsSync(path.join(process.cwd(), 'public', 'logo.png'))
  return { ...fallbackSettings, logoUrl: logoExists ? fallbackSettings.logoPath : null, heroImage: fallbackSettings.heroImage, featureImage: fallbackSettings.featureImage }
}

const payloadClient = cache(async () => {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return null
  try {
    return await getPayload({ config })
  } catch {
    return null
  }
})

const rows = (value: unknown): Record<string, unknown>[] => Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object') : []
const text = (value: unknown, fallback = ''): string => typeof value === 'string' ? value : fallback
const numeric = (value: unknown, fallback = 0): number => typeof value === 'number' && Number.isFinite(value) ? value : fallback
const relation = (value: unknown): Record<string, unknown> | null => value && typeof value === 'object' ? value as Record<string, unknown> : null
const imageUrl = (value: unknown, fallback: string): string => {
  const candidate = text(relation(value)?.url)
  if (!candidate) return fallback
  if (candidate.startsWith('/') && !candidate.startsWith('//') && !candidate.includes('\\') && !candidate.split('/').includes('..')) return candidate
  return candidate.toLowerCase().startsWith('https://') && safeExternalUrl(candidate) ? candidate : fallback
}
const rowText = (value: unknown, field = 'text'): string[] => rows(value).map((entry) => text(entry[field])).filter(Boolean)
const safePhoneLink = (value: string, fallback: string): string => /^tel:\+?[0-9][0-9\s().-]*$/i.test(value) ? value : fallback

async function findRows(collection: string, depth = 2): Promise<Record<string, unknown>[] | null> {
  const payload = await payloadClient()
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: collection as never,
      limit: 500,
      depth,
      draft: false,
      sort: 'createdAt',
    } as never)
    return (result as unknown as { docs?: Record<string, unknown>[] }).docs ?? []
  } catch {
    return null
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const payload = await payloadClient()
  if (!payload) return fallbackSiteSettings()
  try {
    const result = await payload.find({ collection: 'site-settings', depth: 2, limit: 1 } as never)
    const doc = (result as unknown as { docs?: Record<string, unknown>[] }).docs?.[0]
    if (!doc) return fallbackSiteSettings()
    const logoPath = text(doc.logoPath, fallbackSettings.logoPath)
    const localLogoExists = logoPath.startsWith('/') && existsSync(path.join(process.cwd(), 'public', logoPath.slice(1)))
    const logoUrl = imageUrl(doc.logo, localLogoExists ? logoPath : '') || null
    return {
      ...fallbackSettings,
      ...doc,
      name: text(doc.name, fallbackSettings.name),
      legalName: text(doc.legalName, fallbackSettings.legalName),
      tagline: text(doc.tagline, fallbackSettings.tagline),
      location: text(doc.location, fallbackSettings.location),
      address: text(doc.address, fallbackSettings.address),
      phone: text(doc.phone, fallbackSettings.phone),
      phoneLink: safePhoneLink(text(doc.phoneLink, fallbackSettings.phoneLink), fallbackSettings.phoneLink),
      email: text(doc.email, fallbackSettings.email),
      footerText: text(doc.footerText, fallbackSettings.footerText),
      heroHeadline: text(doc.heroHeadline, fallbackSettings.heroHeadline),
      heroSubheadline: text(doc.heroSubheadline, fallbackSettings.heroSubheadline),
      introductionHeading: text(doc.introductionHeading, fallbackSettings.introductionHeading),
      introduction: text(doc.introduction, fallbackSettings.introduction),
      whyHeading: text(doc.whyHeading, fallbackSettings.whyHeading),
      whyText: text(doc.whyText, fallbackSettings.whyText),
      seoTitle: text(doc.seoTitle, fallbackSettings.seoTitle),
      seoDescription: text(doc.seoDescription, fallbackSettings.seoDescription),
      currency: text(doc.currency, fallbackSettings.currency),
      socialLinks: rows(doc.socialLinks).map((item) => ({ label: text(item.label), url: text(item.url) })).filter((item) => item.label && item.url.toLowerCase().startsWith('https://') && safeExternalUrl(item.url)),
      logoPath,
      logoUrl,
      heroImage: imageUrl(doc.heroImage, text(doc.heroImagePath, fallbackSettings.heroImage)),
      featureImage: imageUrl(doc.featureImage, text(doc.featureImagePath, fallbackSettings.featureImage)),
    }
  } catch {
    return fallbackSiteSettings()
  }
})

const normalizeTrip = (doc: Record<string, unknown>): Trip => {
  const fallback = fallbackTrips.find((trip) => trip.slug === text(doc.slug))
  const price = typeof doc.priceUsd === 'number' ? doc.priceUsd : null
  const itineraryRows = rows(doc.itinerary)
  return {
    slug: text(doc.slug, fallback?.slug ?? ''),
    title: text(doc.title, fallback?.title ?? ''),
    sourceTitle: text(doc.sourceTitle, fallback?.sourceTitle ?? text(doc.title)),
    description: text(doc.description, fallback?.description ?? ''),
    durationDays: numeric(doc.durationDays, fallback?.durationDays ?? 1),
    durationLabel: text(doc.durationLabel, fallback?.durationLabel ?? ''),
    priceUsd: price,
    pricePerPerson: doc.pricePerPerson === true,
    priceBasisNote: text(doc.priceBasisNote, fallback?.priceBasisNote ?? ''),
    destinations: rows(doc.destinations).map((item) => text(item.name)).filter(Boolean).length
      ? rows(doc.destinations).map((item) => text(item.name)).filter(Boolean)
      : fallback?.destinations ?? [],
    tripTypes: rows(doc.tripTypes).map((item) => text(item.name)).filter(Boolean),
    highlights: rowText(doc.highlights),
    itinerary: itineraryRows.map((day) => ({
      day: numeric(day.day),
      title: text(day.title),
      description: text(day.description),
    })).filter((day) => day.title && day.description),
    inclusions: rowText(doc.inclusions),
    exclusions: rowText(doc.exclusions),
    addOns: rows(doc.optionalAddOns).map((item) => ({ name: text(item.name), priceUsd: typeof item.priceUsd === 'number' ? item.priceUsd : null })),
    targetGuest: text(doc.targetGuest, fallback?.targetGuest),
    difficulty: text(doc.difficulty, fallback?.difficulty),
    bestSeason: text(doc.bestSeason, fallback?.bestSeason),
    notes: rowText(doc.notes),
    sourceUrl: text(doc.sourceUrl, fallback?.sourceUrl ?? ''),
    sourceImages: rows(doc.sourceImages).map((item) => text(item.url)).filter(Boolean),
    image: imageUrl(doc.featuredImage, fallback?.image ?? '/images/bhutan-himalayan-hero.jpg'),
    imageAlt: text(doc.imageAlt, fallback?.imageAlt ?? ''),
    featured: Boolean(doc.featured),
  }
}

export const getTrips = cache(async (): Promise<Trip[]> => {
  const docs = await findRows('packages')
  if (!docs?.length) return fallbackTrips
  const normalized = docs.map(normalizeTrip)
  return normalized.length ? normalized : fallbackTrips
})

export const getTrip = cache(async (slug: string): Promise<Trip | undefined> => {
  const docs = await findRows('packages')
  const doc = docs?.find((item) => item.slug === slug)
  if (doc) return normalizeTrip(doc)
  return fallbackTrips.find((trip) => trip.slug === slug)
})

export const getDestinations = cache(async () => {
  const docs = await findRows('destinations')
  if (!docs?.length) return fallbackDestinations
  return docs.map((doc) => {
    const fallback = fallbackDestinations.find((item) => item.slug === text(doc.slug))
    return {
      name: text(doc.name, fallback?.name ?? ''),
      slug: text(doc.slug, fallback?.slug ?? ''),
      description: text(doc.description, fallback?.description ?? ''),
      shortDescription: text(doc.shortDescription, fallback?.shortDescription ?? ''),
      image: imageUrl(doc.heroImage, fallback?.image ?? '/images/bhutan-himalayan-hero.jpg'),
      imageAlt: text(doc.imageAlt, fallback?.imageAlt ?? ''),
      sourceUrl: text(doc.sourceUrl, fallback?.sourceUrl ?? ''),
      pageFound: Boolean(doc.sourcePageFound ?? fallback?.pageFound),
      seoTitle: text(doc.seoTitle, fallback?.seoTitle ?? ''),
      seoDescription: text(doc.seoDescription, fallback?.seoDescription ?? ''),
    }
  })
})

export const getDestination = cache(async (slug: string) => (await getDestinations()).find((item) => item.slug === slug))

export const getFAQs = cache(async () => {
  const docs = await findRows('faqs', 0)
  if (!docs?.length) return fallbackFAQs
  return docs.sort((a, b) => numeric(a.sortOrder) - numeric(b.sortOrder)).map((doc) => ({ question: text(doc.question), answer: text(doc.answer) }))
})

export const getTestimonials = cache(async () => {
  const docs = await findRows('testimonials', 1)
  if (!docs?.length) return fallbackTestimonials
  return docs.sort((a, b) => numeric(a.sortOrder) - numeric(b.sortOrder)).map((doc) => ({
    title: text(doc.title), quote: text(doc.quote), name: text(doc.name), country: text(doc.country),
  }))
})

export const getTeamMembers = cache(async () => {
  const docs = await findRows('team-members', 1)
  if (!docs?.length) return fallbackTeam
  return docs.sort((a, b) => numeric(a.sortOrder) - numeric(b.sortOrder)).map((doc) => ({ name: text(doc.name), role: text(doc.role), bio: text(doc.bio) }))
})

export const getPages = cache(async () => {
  const docs = await findRows('pages', 1)
  if (!docs?.length) return fallbackPages
  return docs.map((doc) => ({
    slug: text(doc.slug),
    title: text(doc.title),
    description: text(doc.description),
    body: text(doc.bodyText),
    sourceUrl: text(doc.sourceUrl),
  }))
})

export const getContentPage = cache(async (slug: string) => (await getPages()).find((page) => page.slug === slug))

export const getBlogPosts = cache(async () => {
  const docs = await findRows('blog-posts', 2)
  if (!docs?.length) return []
  return docs.map((doc) => ({
    title: text(doc.title),
    slug: text(doc.slug),
    excerpt: text(doc.excerpt),
    author: text(doc.author),
    publishedAt: text(doc.publishedAt),
    seoTitle: text(doc.seoTitle),
    seoDescription: text(doc.seoDescription),
    image: imageUrl(doc.featuredImage, '/images/bhutan-trekking.jpg'),
    imageAlt: text(doc.imageAlt, text(doc.title)),
    body: doc.body,
  }))
})

export async function getCustomerBookings(customerId: string | number) {
  const payload = await payloadClient()
  if (!payload) return []
  try {
    const result = await payload.find({
      collection: 'bookings',
      where: { customer: { equals: customerId } },
      limit: 100,
      sort: '-createdAt',
    } as never)
    return (result as unknown as { docs?: Record<string, unknown>[] }).docs ?? []
  } catch {
    return []
  }
}
