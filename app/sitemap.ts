import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/utils'
import { getDestinationSlugs, getTourSlugs } from '@/sanity/lib/content'

/** Dynamic sitemap.xml — public pages + every tour and destination. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tourSlugs, destinationSlugs] = await Promise.all([getTourSlugs(), getDestinationSlugs()])

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/tours'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/destinations'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/about-bhutan'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/privacy-policy'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/terms'), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const tours: MetadataRoute.Sitemap = tourSlugs.map((slug) => ({
    url: absoluteUrl(`/tours/${slug}`),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const destinations: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: absoluteUrl(`/destinations/${slug}`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...tours, ...destinations]
}
