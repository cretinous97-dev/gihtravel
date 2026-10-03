import { TripCard } from '@/components/cards'
import { Container } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getTrips } from '@/lib/cms'

export const metadata = { title: 'Bhutan journeys | GIH Tour and Travel' }

export default async function PackagesPage() {
  const trips = await getTrips()
  return (
    <>
      <PageHero eyebrow="Find your way through Bhutan" title="Journeys made for the way you travel." description="Explore cultural visits, festival days, gentle escapes and mountain adventures. Each trip is planned by our local team in Bhutan." />
      <section className="section">
        <Container>
          <div className="listing-toolbar"><span>{trips.length} journeys from GIH Tour and Travel</span><span>Prices shown in USD</span></div>
          <div className="grid-3">
            {trips.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
          </div>
        </Container>
      </section>
    </>
  )
}
