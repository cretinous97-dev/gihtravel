import type { MetadataRoute } from 'next'
import { getBlogPosts, getDestinations, getTrips } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let base: string
  try {
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? '')
    if (!['http:', 'https:'].includes(siteUrl.protocol) || !siteUrl.hostname) return []
    base = siteUrl.origin
  } catch { return [] }
  const [trips, destinations, posts] = await Promise.all([getTrips(), getDestinations(), getBlogPosts()])
  const staticRoutes = ['', '/packages', '/destinations', '/about', '/about-bhutan', '/visa', '/the-sdf', '/faq', '/contact', '/testimonials', '/blog', '/privacy-policy', '/terms']
  const now = new Date()
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: now, changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const, priority: route === '' ? 1 : 0.6 })),
    ...trips.map((trip) => ({ url: `${base}/packages/${trip.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...destinations.map((place) => ({ url: `${base}/destinations/${place.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.publishedAt ? new Date(post.publishedAt) : now, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
