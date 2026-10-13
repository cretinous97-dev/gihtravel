/**
 * Shared TypeScript types for the GIH Tour and Travel content model.
 * These mirror the Sanity schemas in `sanity/schemas/` exactly, and are also
 * used by the bundled fallback dataset (see `sanity/lib/seed-content/`) so the
 * site renders real content before the Sanity project exists.
 */

/** Normalised image reference used across the frontend. */
export type ImageRef = {
  src: string
  alt: string
}

/** Portable Text block (subset used by the editor and the seed content). */
export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
  children: { _type: 'span'; _key: string; text: string }[]
}

export type Seo = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: ImageRef
}

export type ActivityType = 'Cultural' | 'Trekking' | 'Festival' | 'Wellness' | 'Custom'
export type Difficulty = 'Easy' | 'Moderate' | 'Challenging'
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

export type ItineraryDay = {
  _key: string
  dayNumber: number
  dayTitle: string
  dayDescription: string
  mealsIncluded?: string
  accommodation?: string
}

export type Tour = {
  _id: string
  title: string
  slug: string
  shortDescription: string
  heroImage: ImageRef | null
  gallery: ImageRef[]
  overview: PortableTextBlock[]
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  durationDays: number
  durationNights?: number
  difficulty?: Difficulty
  activityType?: ActivityType
  destinations: { _id: string; name: string; slug: string }[]
  priceFrom?: number
  groupSizeMin?: number
  groupSizeMax?: number
  bestSeason: Season[]
  featured: boolean
  seo?: Seo
}

export type Destination = {
  _id: string
  name: string
  slug: string
  description: PortableTextBlock[]
  image: ImageRef | null
  region?: string
  altitude?: string
  highlights: string[]
  seo?: Seo
}

export type Testimonial = {
  _id: string
  name: string
  country?: string
  quote: string
  rating?: number
  photo?: ImageRef | null
  tour?: { _id: string; title: string; slug: string } | null
  featured: boolean
  order: number
}

export type TrustPoint = {
  _key: string
  icon: string
  title: string
  description: string
}

export type HomePage = {
  heroHeadline: string
  heroSubheadline: string
  heroImage: ImageRef | null
  heroCtaLabel: string
  heroCtaLink: string
  featuredTours: Tour[]
  featuredDestinations: Destination[]
  featuredTestimonials: Testimonial[]
  trustSectionTitle: string
  trustPoints: TrustPoint[]
  seo?: Seo
}

export type FourPillar = {
  _key: string
  pillarName: string
  description: string
  icon: string
}

export type SeasonBlock = {
  _key: string
  seasonName: string
  months: string
  description: string
  image: ImageRef | null
}

export type AboutBhutanPage = {
  heroTitle: string
  heroSubtitle: string
  heroImage: ImageRef | null
  gnhIntroduction: PortableTextBlock[]
  fourPillars: FourPillar[]
  geography: PortableTextBlock[]
  seasons: SeasonBlock[]
  culturalInsights: PortableTextBlock[]
  whyBhutan: PortableTextBlock[]
  whyGih: PortableTextBlock[]
  seo?: Seo
}

export type TeamMember = {
  _key: string
  name: string
  role: string
  bio: string
  photo: ImageRef | null
}

export type AboutPage = {
  foundingStory: PortableTextBlock[]
  mission: PortableTextBlock[]
  vision: PortableTextBlock[]
  teamMembers: TeamMember[]
  sustainabilityCommitment: PortableTextBlock[]
  seo?: Seo
}

export type ContactPage = {
  heroTitle: string
  heroSubtitle: string
  addressLine: string
  city: string
  country: string
  phone: string
  email: string
  mapEmbedUrl: string
  officeHours: string
  seo?: Seo
}

export type FooterLink = { label: string; href: string }
export type FooterColumn = { _key: string; heading: string; links: FooterLink[] }
export type SocialLink = { _key: string; platform: string; url: string }

export type SiteSettings = {
  siteName: string
  siteTagline: string
  logo: ImageRef | null
  favicon?: ImageRef | null
  socialLinks: SocialLink[]
  footerText: PortableTextBlock[]
  footerColumns: FooterColumn[]
  defaultSeo: Seo
  inquiryNotificationEmail: string
  analyticsId?: string
}

export type LegalPage = {
  _id: string
  title: string
  slug: string
  body: PortableTextBlock[]
  lastUpdated: string
  seo?: Seo
}

/** Status values for inquiry documents in the CMS. */
export type InquiryStatus = 'New' | 'In Progress' | 'Closed'

export type Inquiry = {
  _id: string
  fullName: string
  email: string
  phone?: string
  country?: string
  subject?: string
  message: string
  tour?: { _id: string; title: string; slug: string } | null
  travelDate?: string
  groupSize?: number
  status: InquiryStatus
  submittedAt: string
}
