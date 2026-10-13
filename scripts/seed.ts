/**
 * Idempotent seed script — populates Sanity with the real content extracted
 * from https://gihtourtravel.com (see sanity/lib/seed-content/).
 *
 * Usage:
 *   1. Fill in .env.local (NEXT_PUBLIC_SANITY_PROJECT_ID, dataset,
 *      SANITY_API_WRITE_TOKEN)
 *   2. npm run seed
 *
 * Behaviour:
 *   - Idempotent: every document is created with `createOrReplace` keyed on a
 *     stable ID (tour-<slug>, destination-<slug>, singleton names). Running
 *     the script twice never creates duplicates.
 *   - Images referenced by URL are downloaded and uploaded to the Sanity
 *     asset store once (looked up by filename on later runs).
 *   - Prints a clear summary of what was created at the end.
 */

import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient, type SanityClient } from '@sanity/client'
import type { ImageRef, PortableTextBlock } from '../lib/types'
import {
  aboutBhutanPage,
  aboutPage,
  contactPage,
  destinations,
  homePage,
  legalPages,
  siteSettings,
  testimonials,
  tours,
} from '../sanity/lib/seed-docs'

// Load .env.local then .env (same as `next dev`).
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
for (const file of ['.env.local', '.env']) {
  const p = path.join(root, file)
  if (existsSync(p)) loadEnv({ path: p })
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || projectId === 'your-project-id' || !token || token === 'your-sanity-write-token-here') {
  console.error('\n✖ Sanity is not configured.')
  console.error('  Fill in NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local, then run `npm run seed` again.')
  console.error('  (See README → MANUAL SETUP — YOUR PART.)\n')
  process.exit(1)
}

const client: SanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

// ---------------------------------------------------------------------------
// Image handling
// ---------------------------------------------------------------------------

/** URL- or path-based images → uploaded Sanity image objects. */
const assetCache = new Map<string, string>()

async function uploadImage(image: ImageRef | null | undefined): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string }; alt: string } | undefined> {
  if (!image?.src) return undefined
  const alt = image.alt || ''

  const cached = assetCache.get(image.src)
  if (cached) return { _type: 'image', asset: { _type: 'reference', _ref: cached }, alt }

  // Already uploaded? Reuse the asset (keyed on original filename).
  const filename = image.src.split('/').pop() ?? image.src
  const existing = await client.fetch<string>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  )
  if (existing) {
    assetCache.set(image.src, existing)
    return { _type: 'image', asset: { _type: 'reference', _ref: existing }, alt }
  }

  let buffer: Buffer
  if (image.src.startsWith('/')) {
    // Local file from the project's public/ directory.
    const filePath = path.join(root, 'public', image.src)
    if (!existsSync(filePath)) {
      console.warn(`  ⚠ image missing locally, skipping: ${image.src}`)
      return undefined
    }
    const { readFile } = await import('fs/promises')
    buffer = await readFile(filePath)
  } else {
    const res = await fetch(image.src)
    if (!res.ok) {
      console.warn(`  ⚠ could not download image (${res.status}), skipping: ${image.src}`)
      return undefined
    }
    buffer = Buffer.from(await res.arrayBuffer())
  }

  const asset = await client.assets.upload('image', buffer, { filename })
  assetCache.set(image.src, asset._id)
  console.log(`  ↑ uploaded image: ${filename}`)
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt }
}

async function uploadImages(images: (ImageRef | null | undefined)[]): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string }; alt: string }[]> {
  const out = []
  for (const image of images) {
    const uploaded = await uploadImage(image)
    if (uploaded) out.push(uploaded)
  }
  return out
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ref(type: string, id: string) {
  return { _type: 'reference', _ref: id }
}

const slug = (current: string) => ({ _type: 'slug', current })
const count = { tours: 0, destinations: 0, testimonials: 0, singletons: 0, legalPages: 0 }

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seedDestinations() {
  console.log('\n◆ Destinations')
  for (const d of destinations) {
    const image = await uploadImage(d.image)
    await client.createOrReplace({
      _id: d._id,
      _type: 'destination',
      name: d.name,
      slug: slug(d.slug),
      description: d.description as PortableTextBlock[],
      image,
      region: d.region,
      altitude: d.altitude,
      highlights: d.highlights,
      seo: {
        _type: 'object',
        metaTitle: d.seo?.metaTitle,
        metaDescription: d.seo?.metaDescription,
        ogImage: await uploadImage(d.seo?.ogImage),
      },
    })
    count.destinations += 1
    console.log(`  ✓ ${d.name}`)
  }
}

async function seedTours() {
  console.log('\n◆ Tours')
  for (const t of tours) {
    const heroImage = await uploadImage(t.heroImage)
    const gallery = await uploadImages(t.gallery)
    await client.createOrReplace({
      _id: t._id,
      _type: 'tour',
      title: t.title,
      slug: slug(t.slug),
      shortDescription: t.shortDescription,
      heroImage,
      gallery,
      overview: t.overview as PortableTextBlock[],
      itinerary: t.itinerary.map((day) => ({
        _type: 'object',
        _key: day._key,
        dayNumber: day.dayNumber,
        dayTitle: day.dayTitle,
        dayDescription: day.dayDescription,
        mealsIncluded: day.mealsIncluded,
        accommodation: day.accommodation,
      })),
      inclusions: t.inclusions,
      exclusions: t.exclusions,
      durationDays: t.durationDays,
      durationNights: t.durationNights,
      difficulty: t.difficulty,
      activityType: t.activityType,
      destinations: t.destinations.map((d) => ref('destination', d._id)),
      priceFrom: t.priceFrom,
      groupSizeMin: t.groupSizeMin,
      groupSizeMax: t.groupSizeMax,
      bestSeason: t.bestSeason,
      featured: t.featured,
      seo: {
        _type: 'object',
        metaTitle: t.seo?.metaTitle,
        metaDescription: t.seo?.metaDescription,
        ogImage: await uploadImage(t.seo?.ogImage),
      },
    })
    count.tours += 1
    console.log(`  ✓ ${t.title}`)
  }
}

async function seedTestimonials() {
  console.log('\n◆ Testimonials')
  for (const t of testimonials) {
    await client.createOrReplace({
      _id: t._id,
      _type: 'testimonial',
      name: t.name,
      country: t.country,
      quote: t.quote,
      rating: t.rating,
      photo: await uploadImage(t.photo),
      tour: t.tour ? ref('tour', t.tour._id) : undefined,
      featured: t.featured,
      order: t.order,
    })
    count.testimonials += 1
    console.log(`  ✓ ${t.name}`)
  }
}

async function seedSingletons() {
  console.log('\n◆ Page singletons')

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    heroHeadline: homePage.heroHeadline,
    heroSubheadline: homePage.heroSubheadline,
    heroImage: await uploadImage(homePage.heroImage),
    heroCtaLabel: homePage.heroCtaLabel,
    heroCtaLink: homePage.heroCtaLink,
    featuredTours: homePage.featuredTours.map((t) => ref('tour', t._id)),
    featuredDestinations: homePage.featuredDestinations.map((d) => ref('destination', d._id)),
    featuredTestimonials: homePage.featuredTestimonials.map((t) => ref('testimonial', t._id)),
    trustSectionTitle: homePage.trustSectionTitle,
    trustPoints: homePage.trustPoints.map((p) => ({ _type: 'object', _key: p._key, icon: p.icon, title: p.title, description: p.description })),
  })
  count.singletons += 1
  console.log('  ✓ Home Page')

  await client.createOrReplace({
    _id: 'aboutBhutanPage',
    _type: 'aboutBhutanPage',
    heroTitle: aboutBhutanPage.heroTitle,
    heroSubtitle: aboutBhutanPage.heroSubtitle,
    heroImage: await uploadImage(aboutBhutanPage.heroImage),
    gnhIntroduction: aboutBhutanPage.gnhIntroduction as PortableTextBlock[],
    fourPillars: aboutBhutanPage.fourPillars.map((p) => ({
      _type: 'object',
      _key: p._key,
      pillarName: p.pillarName,
      description: p.description,
      icon: p.icon,
    })),
    geography: aboutBhutanPage.geography as PortableTextBlock[],
    seasons: await Promise.all(
      aboutBhutanPage.seasons.map(async (s) => ({
        _type: 'object',
        _key: s._key,
        seasonName: s.seasonName,
        months: s.months,
        description: s.description,
        image: await uploadImage(s.image),
      })),
    ),
    culturalInsights: aboutBhutanPage.culturalInsights as PortableTextBlock[],
    whyBhutan: aboutBhutanPage.whyBhutan as PortableTextBlock[],
    whyGih: aboutBhutanPage.whyGih as PortableTextBlock[],
  })
  count.singletons += 1
  console.log('  ✓ About Bhutan Page')

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    foundingStory: aboutPage.foundingStory as PortableTextBlock[],
    mission: aboutPage.mission as PortableTextBlock[],
    vision: aboutPage.vision as PortableTextBlock[],
    teamMembers: [],
    sustainabilityCommitment: aboutPage.sustainabilityCommitment as PortableTextBlock[],
  })
  count.singletons += 1
  console.log('  ✓ About Page')

  await client.createOrReplace({
    _id: 'contactPage',
    _type: 'contactPage',
    heroTitle: contactPage.heroTitle,
    heroSubtitle: contactPage.heroSubtitle,
    addressLine: contactPage.addressLine,
    city: contactPage.city,
    country: contactPage.country,
    phone: contactPage.phone,
    email: contactPage.email,
    mapEmbedUrl: contactPage.mapEmbedUrl,
    officeHours: contactPage.officeHours,
  })
  count.singletons += 1
  console.log('  ✓ Contact Page')

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: siteSettings.siteName,
    siteTagline: siteSettings.siteTagline,
    logo: await uploadImage(siteSettings.logo),
    socialLinks: siteSettings.socialLinks.map((s) => ({ _type: 'object', _key: s._key, platform: s.platform, url: s.url })),
    footerText: siteSettings.footerText as PortableTextBlock[],
    footerColumns: siteSettings.footerColumns.map((c) => ({
      _type: 'object',
      _key: c._key,
      heading: c.heading,
      links: c.links.map((l) => ({ _type: 'object', _key: l.label, label: l.label, href: l.href })),
    })),
    defaultSeo: {
      _type: 'object',
      metaTitle: siteSettings.defaultSeo.metaTitle,
      metaDescription: siteSettings.defaultSeo.metaDescription,
      ogImage: await uploadImage(siteSettings.defaultSeo.ogImage),
    },
    inquiryNotificationEmail: siteSettings.inquiryNotificationEmail,
  })
  count.singletons += 1
  console.log('  ✓ Site Settings')
}

async function seedLegalPages() {
  console.log('\n◆ Legal pages')
  for (const page of legalPages) {
    await client.createOrReplace({
      _id: page._id,
      _type: 'legalPage',
      title: page.title,
      slug: slug(page.slug),
      body: page.body as PortableTextBlock[],
      lastUpdated: page.lastUpdated || undefined,
    })
    count.legalPages += 1
    console.log(`  ✓ ${page.title}`)
  }
}

async function main() {
  console.log(`Seeding Sanity project "${projectId}" (dataset: ${dataset}) …`)

  await seedDestinations()
  await seedTours()
  await seedTestimonials()
  await seedSingletons()
  await seedLegalPages()

  console.log('\n════════════════════════════════════════')
  console.log('  Seed complete — summary')
  console.log('════════════════════════════════════════')
  console.log(`  Tours:         ${count.tours}`)
  console.log(`  Destinations:  ${count.destinations}`)
  console.log(`  Testimonials:  ${count.testimonials}`)
  console.log(`  Singletons:    ${count.singletons} (home, about-bhutan, about, contact, site settings)`)
  console.log(`  Legal pages:   ${count.legalPages}`)
  console.log('════════════════════════════════════════\n')
}

main().catch((error) => {
  console.error('\n✖ Seed failed:', error)
  process.exit(1)
})
