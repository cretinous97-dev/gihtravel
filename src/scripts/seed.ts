import fs from 'node:fs'
import path from 'node:path'
import { config as loadDotEnv } from 'dotenv'
import { getPayload } from 'payload'

loadDotEnv({ path: path.join(process.cwd(), '.env.local') })
loadDotEnv({ path: path.join(process.cwd(), '.env') })
const { default: config } = await import('../../payload.config')
import { destinations, faqs, siteSettings, teamMembers, testimonials } from '../data/site'
import { contentPages } from '../data/pages'
import { trips } from '../data/trips'

type Doc = { id: string | number; [key: string]: unknown }
const collection = (value: string) => value as never

async function findBy(collectionSlug: string, field: string, value: string): Promise<Doc | undefined> {
  const result = await payload.find({
    collection: collection(collectionSlug),
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  } as never) as unknown as { docs?: Doc[] }
  return result.docs?.[0]
}

async function ensure(collectionSlug: string, field: string, value: string, data: Record<string, unknown>): Promise<{ doc: Doc; created: boolean }> {
  const existing = await findBy(collectionSlug, field, value)
  if (existing) return { doc: existing, created: false }
  const doc = await payload.create({ collection: collection(collectionSlug), data, overrideAccess: true } as never) as unknown as Doc
  return { doc, created: true }
}

async function mediaFor(publicPath: string, alt: string): Promise<string | number | undefined> {
  const diskPath = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
  if (!fs.existsSync(diskPath)) return undefined
  const fileName = path.basename(diskPath)
  const existing = await findBy('media', 'filename', fileName)
  if (existing) return existing.id
  const uploaded = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: diskPath,
    overrideAccess: true,
  } as never) as unknown as Doc
  console.info(`Added media: ${fileName}`)
  return uploaded.id
}

const published = () => ({ _status: 'published', publishedAt: new Date().toISOString() })

const payload = await getPayload({ config })

async function seed() {
  const mediaByPath = new Map<string, string | number>()
  const paths = new Set<string>([
    siteSettings.heroImage,
    siteSettings.featureImage,
    ...destinations.map((item) => item.image),
    ...trips.map((item) => item.image),
  ])
  for (const imagePath of paths) {
    const alt = destinations.find((item) => item.image === imagePath)?.imageAlt
      ?? trips.find((item) => item.image === imagePath)?.imageAlt
      ?? (imagePath === siteSettings.heroImage ? 'Bhutanese Himalayan landscape' : 'Bhutan and its people')
    const id = await mediaFor(imagePath, alt)
    if (id !== undefined) mediaByPath.set(imagePath, id)
  }
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  if (fs.existsSync(logoPath)) {
    const id = await mediaFor('/logo.png', 'GIH Tour and Travel logo')
    if (id !== undefined) mediaByPath.set('/logo.png', id)
  }

  const destinationIds = new Map<string, string | number>()
  for (const destination of destinations) {
    const heroImage = mediaByPath.get(destination.image)
    const { doc, created } = await ensure('destinations', 'slug', destination.slug, {
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      shortDescription: destination.shortDescription,
      ...(heroImage ? { heroImage } : {}),
      imageAlt: destination.imageAlt,
      sourceUrl: destination.sourceUrl,
      sourcePageFound: destination.pageFound,
      ...published(),
    })
    destinationIds.set(destination.name.toLowerCase(), doc.id)
    if (created) console.info(`Added destination: ${destination.name}`)
  }

  const packageIds = new Map<string, { id: string | number; created: boolean }>()
  for (const trip of trips) {
    const existing = await findBy('packages', 'slug', trip.slug)
    const featuredImage = mediaByPath.get(trip.image)
    const data: Record<string, unknown> = {
      title: trip.title,
      sourceTitle: trip.sourceTitle,
      slug: trip.slug,
      description: trip.description,
      durationDays: trip.durationDays,
      durationLabel: trip.durationLabel,
      ...(trip.priceUsd !== null ? { priceUsd: trip.priceUsd } : {}),
      pricePerPerson: trip.pricePerPerson === true,
      priceBasisNote: trip.priceBasisNote,
      destinations: trip.destinations.map((name) => destinationIds.get(name.toLowerCase())).filter((id): id is string | number => id !== undefined),
      tripTypes: trip.tripTypes.map((name) => ({ name })),
      highlights: trip.highlights.map((text) => ({ text })),
      itinerary: [],
      inclusions: trip.inclusions.map((text) => ({ text })),
      exclusions: trip.exclusions.map((text) => ({ text })),
      optionalAddOns: trip.addOns.map((item) => ({ name: item.name, ...(item.priceUsd !== null ? { priceUsd: item.priceUsd } : {}) })),
      ...(trip.targetGuest ? { targetGuest: trip.targetGuest } : {}),
      ...(trip.difficulty ? { difficulty: trip.difficulty } : {}),
      ...(trip.bestSeason ? { bestSeason: trip.bestSeason } : {}),
      notes: (trip.notes ?? []).map((text) => ({ text })),
      ...(featuredImage ? { featuredImage } : {}),
      imageAlt: trip.imageAlt,
      sourceUrl: trip.sourceUrl,
      sourceImages: trip.sourceImages.map((url) => ({ url })),
      featured: Boolean(trip.featured),
      ...published(),
    }
    const result = existing
      ? { doc: existing, created: false }
      : { doc: await payload.create({ collection: 'packages', data, overrideAccess: true } as never) as unknown as Doc, created: true }
    packageIds.set(trip.slug, { id: result.doc.id, created: result.created })
    if (result.created) console.info(`Added package: ${trip.title}`)

    if (result.created) {
      const itineraryIds: Array<string | number> = []
      for (const day of trip.itinerary) {
        const created = await payload.create({
          collection: 'itineraries',
          data: { title: day.title, day: day.day, package: result.doc.id, description: day.description, ...published() },
          overrideAccess: true,
        } as never) as unknown as Doc
        itineraryIds.push(created.id)
      }
      if (itineraryIds.length) await payload.update({ collection: 'packages', id: result.doc.id, data: { itinerary: itineraryIds }, overrideAccess: true } as never)
    }
  }

  for (const page of contentPages) {
    const { created } = await ensure('pages', 'slug', page.slug, {
      title: page.title,
      slug: page.slug,
      description: page.description,
      bodyText: page.body,
      sourceUrl: page.sourceUrl,
      ...published(),
    })
    if (created) console.info(`Added page: ${page.title}`)
  }

  const settings = await findBy('site-settings', 'name', siteSettings.name)
  if (!settings) {
    const { heroImage: heroImagePath, featureImage: featureImagePath, ...siteFields } = siteSettings
    const heroImage = mediaByPath.get(heroImagePath)
    const featureImage = mediaByPath.get(featureImagePath)
    const logo = mediaByPath.get('/logo.png')
    await payload.create({
      collection: 'site-settings',
      data: {
        ...siteFields,
        ...(heroImage ? { heroImage } : {}),
        ...(featureImage ? { featureImage } : {}),
        ...(logo ? { logo } : {}),
        heroImagePath,
        featureImagePath,
        logoPath: '/logo.png',
        socialLinks: siteSettings.socialLinks,
      },
      overrideAccess: true,
    } as never)
    console.info('Added site settings')
  }

  for (const [sortOrder, faq] of faqs.entries()) {
    if (await findBy('faqs', 'question', faq.question)) continue
    await payload.create({ collection: 'faqs', data: { ...faq, sortOrder }, overrideAccess: true } as never)
  }
  for (const [sortOrder, item] of testimonials.entries()) {
    if (await findBy('testimonials', 'quote', item.quote)) continue
    await payload.create({ collection: 'testimonials', data: { ...item, sortOrder }, overrideAccess: true } as never)
  }
  for (const [sortOrder, member] of teamMembers.entries()) {
    if (await findBy('team-members', 'name', member.name)) continue
    await payload.create({ collection: 'team-members', data: { ...member, sortOrder }, overrideAccess: true } as never)
  }

  console.info(`Seed complete: ${trips.length} packages, ${destinations.length} destinations, ${contentPages.length} pages.`)
  console.info('Seed is additive: existing CMS records are left unchanged so editorial edits are preserved.')
}

try {
  await seed()
} catch (error) {
  console.error('Content seed failed:', error)
  process.exitCode = 1
} finally {
  await payload.destroy()
}
