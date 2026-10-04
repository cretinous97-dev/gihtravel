import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Container, Eyebrow } from '@/components/ui'
import { TripCard } from '@/components/cards'
import { getTrip, getTrips } from '@/lib/cms'
import { formatUSD } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const trip = await getTrip(slug)
  if (!trip) return { title: 'Journey not found | GIH Tour and Travel' }
  return { title: trip.seoTitle || `${trip.title} | GIH Tour and Travel`, description: trip.seoDescription || trip.description }
}

export async function generateStaticParams() {
  return (await getTrips()).map((trip) => ({ slug: trip.slug }))
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [trip, trips] = await Promise.all([getTrip(slug), getTrips()])
  if (!trip) notFound()
  const relatedTrips = trips.filter((other) => other.slug !== trip.slug && other.destinations.some((place) => trip.destinations.includes(place))).slice(0, 3)

  return (
    <>
      <section className="detail-hero">
        <Container>
          <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href="/packages">Journeys</Link><span>›</span><span>{trip.title}</span></div>
          <div className="detail-grid">
            <div className="detail-main">
              <Eyebrow>{trip.tripTypes.slice(0, 2).join(' · ') || 'Bhutan journey'}</Eyebrow>
              <h1>{trip.title}</h1>
              <p className="detail-intro">{trip.description}</p>
              <div className="detail-facts">
                <div className="detail-fact"><span>Length</span><strong>{trip.durationLabel}</strong></div>
                <div className="detail-fact"><span>Places</span><strong>{trip.destinations.slice(0, 3).join(', ')}</strong></div>
                {trip.difficulty ? <div className="detail-fact"><span>Activity</span><strong>{trip.difficulty}</strong></div> : null}
                {trip.bestSeason ? <div className="detail-fact"><span>Best season</span><strong>{trip.bestSeason}</strong></div> : null}
              </div>
            </div>
            <aside className="booking-card">
              {trip.priceUsd ? <div className="price-block"><strong>{formatUSD(trip.priceUsd)}</strong><span>{trip.pricePerPerson ? 'per traveler, in USD' : 'listed rate, in USD'}</span></div> : <div className="price-block"><strong>Request a quote</strong><span>Price not listed on the previous site</span></div>}
              <p>{trip.pricePerPerson ? 'This price has been confirmed by GIH as a per-traveler rate.' : trip.priceUsd ? 'The previous site listed this amount but did not specify whether it was per traveler or for a group. Contact GIH to confirm the current rate.' : 'Optional extras with no confirmed price are arranged with our team.'}</p>
              {trip.priceUsd && trip.pricePerPerson ? <Link href={`/booking?package=${trip.slug}`} className="button button-primary">Choose dates <ArrowUpRight size={15} /></Link> : <Link href={`/contact?package=${trip.slug}`} className="button button-primary">Ask about this trip <ArrowUpRight size={15} /></Link>}
              <p className="booking-card-note">{trip.durationDays} days with GIH Tour and Travel. Contact us if you’d like to adjust the pace or details.</p>
            </aside>
          </div>
          <div className="detail-image" style={{ marginTop: 42 }}>
            <Image src={trip.image} alt={trip.imageAlt || trip.title} fill priority sizes="(max-width: 900px) 92vw, 1180px" />
          </div>
        </Container>
      </section>

      <section className="detail-body">
        <Container>
          <nav className="detail-tabs" aria-label="Trip details">
            <a href="#itinerary">Itinerary</a><a href="#included">Included</a><a href="#not-included">Not included</a>{trip.highlights.length ? <a href="#highlights">Highlights</a> : null}
          </nav>
          <div className="detail-content-grid">
            <div className="detail-content">
              {trip.highlights.length ? <section id="highlights"><h2>Highlights</h2><ul className="detail-list">{trip.highlights.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
              <section id="itinerary" style={{ marginTop: 50 }}>
                <h2>Day by day</h2>
                <div className="itinerary-list">
                  {trip.itinerary.map((day) => (
                    <article className="itinerary-day" key={`${day.day}-${day.title}`}>
                      <div className="itinerary-day-number">Day {String(day.day).padStart(2, '0')}</div>
                      <div><h3>{day.title}</h3><p>{day.description}</p></div>
                    </article>
                  ))}
                </div>
              </section>
              <section id="included" style={{ marginTop: 52 }}><h2>What’s included</h2><ul className="detail-list">{trip.inclusions.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section id="not-included" style={{ marginTop: 52 }}><h2>Not included</h2>{trip.exclusions.length ? <ul className="detail-list">{trip.exclusions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Contact our team for details about costs not included in the itinerary.</p>}</section>
              {trip.notes?.length ? <div className="detail-notes"><strong>Good to know</strong><ul className="detail-list" style={{ marginTop: 10 }}>{trip.notes.map((note) => <li key={note}>{note}</li>)}</ul></div> : null}
            </div>
            <aside className="detail-aside">
              <h3>At a glance</h3>
              <ul className="detail-list">
                <li><strong>Length:</strong> {trip.durationLabel}</li>
                {trip.targetGuest ? <li><strong>Best for:</strong> {trip.targetGuest}</li> : null}
                {trip.destinations.map((place) => <li key={place}><MapPin size={13} style={{ display: 'inline', marginRight: 5 }} />{place}</li>)}
              </ul>
              {trip.addOns.length ? <><h3>Optional extras</h3><ul className="detail-list">{trip.addOns.map((addon) => <li key={addon.name}>{addon.name}{addon.priceUsd === null ? ' · price on request' : ` · ${formatUSD(addon.priceUsd)}`}</li>)}</ul></> : null}
              <Link href="/contact" className="text-link">Ask us a question <ArrowUpRight size={15} /></Link>
            </aside>
          </div>
        </Container>
      </section>

      {relatedTrips.length ? <section className="section section-sand"><Container><div className="section-head-row"><div><Eyebrow>Keep exploring</Eyebrow><h2 style={{ margin: 0, color: 'var(--pine)', fontFamily: 'var(--serif)', fontSize: 42, fontWeight: 400 }}>More journeys in these valleys.</h2></div><Link href="/packages" className="text-link">Browse all journeys <ArrowUpRight size={15} /></Link></div><div className="grid-3">{relatedTrips.map((other) => <TripCard key={other.slug} trip={other} compact />)}</div></Container></section> : null}
    </>
  )
}
