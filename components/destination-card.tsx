import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { Destination } from '@/lib/types'

/**
 * DestinationCard — image-led card for the destinations grids.
 * The description is clipped to two lines; the full copy lives on the
 * destination page.
 */
export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Card>
      <Link
        href={`/destinations/${destination.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ochre-400"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-cream-100">
          {destination.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote CMS images are served unoptimized by design
            <img
              src={destination.image.src}
              alt={destination.image.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-charcoal-muted">Photo coming soon</div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 to-transparent p-5">
            <h3 className="font-serif text-2xl text-white">{destination.name}</h3>
            {destination.region ? <p className="text-xs uppercase tracking-wider text-white/85">{destination.region}</p> : null}
          </div>
        </div>
      </Link>
    </Card>
  )
}
