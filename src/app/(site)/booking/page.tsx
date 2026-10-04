import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { BookingForm } from '@/components/booking-form'
import { Container } from '@/components/ui'
import { getTrip, getTrips } from '@/lib/cms'

export const metadata = { title: 'Plan your Bhutan trip | GIH Tour and Travel' }

type BookingPageProps = { searchParams: Promise<{ package?: string | string[] }> }

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const [params, trips] = await Promise.all([searchParams, getTrips()])
  const selected = Array.isArray(params.package) ? params.package[0] : params.package
  if (!selected) {
    return <>
      <PageHero eyebrow="Start planning" title="Choose a journey to get started." description="Select a Bhutan trip and tell us when you hope to travel. Dates are a request, not a confirmed departure." />
      <section className="section"><Container><div className="booking-choices">{trips.map((trip) => <Link href={`/booking?package=${trip.slug}`} key={trip.slug} className="booking-choice"><span><strong>{trip.title}</strong><small>{trip.durationLabel}</small></span><span aria-hidden="true">→</span></Link>)}</div></Container></section>
    </>
  }
  const trip = await getTrip(selected)
  if (!trip) notFound()
  return <>
    <PageHero eyebrow="Your GIH booking" title="Let’s plan your Bhutan trip." description="Choose your preferred date and group size. GIH will confirm availability and the trip details with you." />
      <section className="section"><Container><div className="booking-layout"><BookingForm trip={trip} /></div></Container></section>
  </>
}
