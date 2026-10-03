import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { TripCard } from '@/components/cards'
import { Container, Eyebrow } from '@/components/ui'
import { getDestination, getDestinations, getTrips } from '@/lib/cms'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destination = await getDestination(slug)
  if (!destination) return { title: 'Place not found | GIH Tour and Travel' }
  return { title: destination.seoTitle || `${destination.name} | GIH Tour and Travel`, description: destination.seoDescription || destination.shortDescription }
}

export async function generateStaticParams() {
  return (await getDestinations()).map((place) => ({ slug: place.slug }))
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [destination, trips] = await Promise.all([getDestination(slug), getTrips()])
  if (!destination) notFound()
  const related = trips.filter((trip) => trip.destinations.some((place) => place.toLowerCase() === destination.name.toLowerCase()))
  return (
    <>
      <section className="detail-hero">
        <Container>
          <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href="/destinations">Places</Link><span>›</span><span>{destination.name}</span></div>
          <div className="detail-grid" style={{ marginTop: 28 }}>
            <div className="detail-main"><Eyebrow>Bhutan</Eyebrow><h1>{destination.name}</h1><p className="detail-intro">{destination.description}</p></div>
            <aside className="booking-card"><h2>See Bhutan with GIH</h2><p>Browse journeys that include {destination.name}, or tell us what you would like to see.</p><Link href="/contact" className="button button-primary">Plan a visit <ArrowUpRight size={15} /></Link></aside>
          </div>
          <div className="detail-image" style={{ marginTop: 38 }}><Image src={destination.image} alt={destination.imageAlt} fill priority sizes="(max-width: 900px) 92vw, 1180px" /></div>
        </Container>
      </section>
      <section className="section"><Container><div className="section-head-row"><div><Eyebrow>Trips that pass through</Eyebrow><h2 style={{ margin: 0, color: 'var(--pine)', fontFamily: 'var(--serif)', fontSize: 43, fontWeight: 400 }}>Journeys around {destination.name}.</h2></div></div>{related.length ? <div className="grid-3">{related.map((trip) => <TripCard key={trip.slug} trip={trip} compact />)}</div> : <p className="plain-text">No published package is currently linked to this destination.</p>}</Container></section>
    </>
  )
}
