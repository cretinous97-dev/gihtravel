import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/card'
import { formatDuration, formatUsd } from '@/lib/utils'
import type { Tour } from '@/lib/types'

/**
 * TourCard — used on the home page and /tours listing.
 * Shows hero image, duration, difficulty, destinations and "from" price
 * (or an enquire prompt when no price is published).
 */
export function TourCard({ tour, priority = false }: { tour: Tour; priority?: boolean }) {
  return (
    <Card>
      <Link
        href={`/tours/${tour.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ochre-400"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
          {tour.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote CMS images are served unoptimized by design
            <img
              src={tour.heroImage.src}
              alt={tour.heroImage.alt}
              loading={priority ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-charcoal-muted">Photo coming soon</div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-himalaya-600">
            {formatDuration(tour.durationDays, tour.durationNights)}
          </span>
        </div>
        <CardBody>
          <h3 className="font-serif text-xl text-charcoal group-hover:text-ochre-500">{tour.title}</h3>
          <p className="mt-2 line-clamp-2 text-body-sm text-charcoal-muted">{tour.shortDescription}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-charcoal-muted">
            {tour.difficulty ? (
              <span className="rounded-full bg-sage-100 px-3 py-1 font-medium text-sage-700">{tour.difficulty}</span>
            ) : null}
            {tour.destinations.slice(0, 3).map((d) => (
              <span key={d.slug} className="rounded-full bg-cream-100 px-3 py-1">
                {d.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-himalaya-600">
            {tour.priceFrom ? `From ${formatUsd(tour.priceFrom)} per person` : 'Enquire for price'}
          </p>
        </CardBody>
      </Link>
    </Card>
  )
}
