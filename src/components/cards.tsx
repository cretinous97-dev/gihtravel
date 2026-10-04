import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import type { Destination } from '@/data/site'
import type { Trip } from '@/data/trips'
import { formatUSD } from '@/lib/format'

export function TripCard({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
  return (
    <article className={`trip-card${compact ? ' trip-card-compact' : ''}`}>
      <Link href={`/packages/${trip.slug}`} className="trip-card-image" aria-label={`View ${trip.title}`}>
        <Image src={trip.image} alt={trip.imageAlt || trip.title} fill sizes="(max-width: 720px) 92vw, (max-width: 1100px) 45vw, 31vw" />
        {trip.tripTypes[0] ? <span className="image-tag">{trip.tripTypes[0]}</span> : null}
      </Link>
      <div className="trip-card-content">
        <div className="card-meta"><span><Clock3 size={14} />{trip.durationLabel}</span><span><MapPin size={14} />{trip.destinations.slice(0, 2).join(', ')}</span></div>
        <h3><Link href={`/packages/${trip.slug}`}>{trip.title}</Link></h3>
        <p className="card-description">{trip.description.split('\n')[0]}</p>
        <div className="trip-card-foot">
          <div className="price-block">
            {trip.priceUsd ? <><strong>{formatUSD(trip.priceUsd)}</strong><span>{trip.pricePerPerson ? 'per traveler' : 'listed rate · confirm basis'}</span></> : <><strong>Request a quote</strong><span>Price not listed</span></>}
          </div>
          <Link href={`/packages/${trip.slug}`} className="circle-link" aria-label={`Read about ${trip.title}`}><ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </article>
  )
}

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/destinations/${destination.slug}`} className="destination-card">
      <div className="destination-image">
        <Image src={destination.image} alt={destination.imageAlt} fill sizes="(max-width: 720px) 92vw, 30vw" />
        <span className="destination-card-arrow"><ArrowUpRight size={18} /></span>
      </div>
      <div className="destination-label"><span>{destination.name}</span><span>Bhutan</span></div>
    </Link>
  )
}
