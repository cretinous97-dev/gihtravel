import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils'
import type { ImageRef, Seo } from '@/lib/types'

/**
 * Metadata helpers — every route builds its Next.js Metadata through these
 * so titles, descriptions, canonicals and social cards stay consistent.
 */

const DEFAULT_TITLE = 'GIH Tour and Travel | Bhutan journeys, guided by local knowledge'
const DEFAULT_DESCRIPTION =
  'Plan a Bhutan journey with GIH Tour and Travel. Explore cultural tours, festivals, trekking, wellness and private experiences with a local team in Paro.'

export function buildMetadata({
  title,
  description,
  path,
  seo,
  ogImage,
  type = 'website',
}: {
  title?: string
  description?: string
  path: string
  seo?: Seo
  ogImage?: ImageRef | null
  type?: 'website' | 'article'
}): Metadata {
  const metaTitle = seo?.metaTitle ?? title ?? DEFAULT_TITLE
  const metaDescription = seo?.metaDescription ?? description ?? DEFAULT_DESCRIPTION
  const image = seo?.ogImage ?? ogImage ?? null
  const url = absoluteUrl(path)

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: 'GIH Tour and Travel',
      type,
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      ...(image ? { images: [image.src] } : {}),
    },
  }
}

export const fallbackSeo: Seo = {
  metaTitle: DEFAULT_TITLE,
  metaDescription: DEFAULT_DESCRIPTION,
}
