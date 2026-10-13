import type { Metadata } from 'next'
import { Container, Eyebrow, Heading, Lead, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { DestinationCard } from '@/components/destination-card'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getDestinations, getSiteSettings } from '@/sanity/lib/content'

/** /destinations — grid of Bhutan's valleys and regions. */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Destinations',
    description:
      'Discover Bhutan’s valleys and regions — Paro, Thimphu, Punakha, Bumthang, Phobjikha, Haa and more. Each with its own character, culture and landscapes.',
    path: '/destinations',
    ogImage: settings.defaultSeo.ogImage,
  })
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Destinations', path: '/destinations' }]} />

      <section className="bg-himalaya-600 py-20 text-white">
        <Container>
          <Eyebrow className="text-ochre-200">Destinations</Eyebrow>
          <Heading level={1} className="text-white">
            The valleys of the Dragon Kingdom
          </Heading>
          <Lead className="mt-4 text-white/85">
            From the sacred cliffs of Paro to the crane wetlands of Phobjikha — every valley has its own rhythm,
            festivals and stories.
          </Lead>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, i) => (
              <Reveal key={destination._id} delay={i * 0.05}>
                <DestinationCard destination={destination} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
