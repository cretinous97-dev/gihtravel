'use client'

/**
 * Sanity Studio — mounted at /studio.
 * This is the non-technical admin CMS: editors manage tours, destinations,
 * testimonials, page copy and inquiries here.
 */

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
