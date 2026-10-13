import { absoluteUrl, formatUsd } from '@/lib/utils'
import type { Destination, SiteSettings, Tour } from '@/lib/types'

/**
 * JSON-LD structured data (Google rich results):
 *  - TravelAgency for the organisation
 *  - TouristTrip for individual tours
 *  - BreadcrumbList for detail pages
 * Each component renders a <script type="application/ld+json"> tag.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function TravelAgencyJsonLd({ settings }: { settings: SiteSettings }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: settings.siteName,
    alternateName: 'GIH Tour and Travel',
    description: settings.defaultSeo.metaDescription,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo.png'),
    slogan: settings.siteTagline,
    telephone: '+975 17901780',
    email: 'gihbucketlist@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paro',
      addressCountry: 'BT',
    },
    areaServed: { '@type': 'Country', name: 'Bhutan' },
    sameAs: settings.socialLinks.map((s) => s.url),
  }
  return <JsonLd data={data} />
}

export function TouristTripJsonLd({ tour }: { tour: Tour }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.shortDescription,
    url: absoluteUrl(`/tours/${tour.slug}`),
    image: tour.heroImage?.src,
    touristType: tour.activityType ? [tour.activityType] : undefined,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: tour.itinerary.map((day, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: day.dayTitle,
        description: day.dayDescription,
      })),
    },
    offers: tour.priceFrom
      ? {
          '@type': 'Offer',
          price: tour.priceFrom,
          priceCurrency: 'USD',
          description: `From ${formatUsd(tour.priceFrom)} per person`,
          url: absoluteUrl(`/tours/${tour.slug}`),
        }
      : undefined,
    provider: {
      '@type': 'TravelAgency',
      name: 'GIH Tour and Travel',
      url: absoluteUrl('/'),
    },
  }
  return <JsonLd data={data} />
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
  return <JsonLd data={data} />
}

/** Destination detail JSON-LD (TouristAttraction). */
export function TouristAttractionJsonLd({ destination }: { destination: Destination }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: destination.name,
    description: destination.image?.alt,
    url: absoluteUrl(`/destinations/${destination.slug}`),
    image: destination.image?.src,
    address: {
      '@type': 'PostalAddress',
      addressRegion: destination.region,
      addressCountry: 'BT',
    },
  }
  return <JsonLd data={data} />
}
