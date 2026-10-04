import { DestinationCard } from '@/components/cards'
import { Container } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getDestinations } from '@/lib/cms'

export const metadata = { title: 'Destinations in Bhutan | GIH Tour and Travel' }

export default async function DestinationsPage() {
  const places = await getDestinations()
  return (
    <>
      <PageHero eyebrow="Bhutan, valley by valley" title="Find a place that feels like yours." description="Start with the places GIH has written about, then follow the road to the monasteries, mountain passes and farm homes along the way." />
      <section className="section"><Container><div className="destinations-grid">{places.map((place) => <DestinationCard key={place.slug} destination={place} />)}</div></Container></section>
    </>
  )
}
