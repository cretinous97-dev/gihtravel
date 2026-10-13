import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Eyebrow, Heading, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { RichText } from '@/components/rich-text'
import { TourCard } from '@/components/tour-card'
import { ButtonLink } from '@/components/ui/button'
import { BreadcrumbJsonLd, TouristAttractionJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import {
  getDestinationBySlug,
  getDestinationSlugs,
  getToursForDestination,
} from '@/sanity/lib/content'

/**
 * /destinations/[slug] — destination detail with description, highlights
 * and the journeys that visit this place.
 */

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) return buildMetadata({ title: 'Destination not found', path: `/destinations/${slug}` })
  return buildMetadata({
    title: destination.seo?.metaTitle ?? destination.name,
    description: destination.seo?.metaDescription,
    path: `/destinations/${destination.slug}`,
    seo: destination.seo,
    ogImage: destination.image,
    type: 'article',
  })
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) notFound()

  const tours = await getToursForDestination(destination.slug)

  return (
    <>
      <TouristAttractionJsonLd destination={destination} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Destinations', path: '/destinations' },
          { name: destination.name, path: `/destinations/${destination.slug}` },
        ]}
      />

      <section className="relative flex min-h-[48vh] items-end overflow-hidden bg-himalaya-600">
        {destination.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CMS hero served unoptimized by design
          <img
            src={destination.image.src}
            alt={destination.image.alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" aria-hidden="true" />
        <Container className="relative z-10 pb-14 pt-32">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/80">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-ochre-200">Home</Link>
                <span aria-hidden="true" className="mx-2">/</span>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-ochre-200">Destinations</Link>
                <span aria-hidden="true" className="mx-2">/</span>
              </li>
              <li aria-current="page" className="text-white">{destination.name}</li>
            </ol>
          </nav>
          <h1 className="font-serif text-display-2 text-white">{destination.name}</h1>
          {destination.region || destination.altitude ? (
            <p className="mt-3 text-white/85">
              {[destination.region, destination.altitude].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <Eyebrow>About this place</Eyebrow>
                <RichText value={destination.description} />
              </Reveal>
            </div>
            {destination.highlights.length > 0 ? (
              <aside>
                <Reveal>
                  <div className="rounded-2xl border border-cream-200 bg-white p-7 shadow-soft">
                    <h2 className="font-serif text-xl text-charcoal">Highlights</h2>
                    <ul className="mt-4 space-y-2.5">
                      {destination.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-body-sm text-charcoal-soft">
                          <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ochre-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </aside>
            ) : null}
          </div>
        </Container>
      </Section>

      {tours.length > 0 ? (
        <Section tone="white" aria-labelledby="tours-heading">
          <Container>
            <Reveal>
              <Eyebrow>Journeys here</Eyebrow>
              <Heading id="tours-heading" level={2}>
                Tours that visit {destination.name}
              </Heading>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour, i) => (
                <Reveal key={tour._id} delay={i * 0.05}>
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : (
        <Section tone="white">
          <Container className="text-center">
            <p className="text-charcoal-muted">No published tours visit this destination yet.</p>
            <ButtonLink href="/tours" variant="secondary" className="mt-6">
              Browse all tours
            </ButtonLink>
          </Container>
        </Section>
      )}
    </>
  )
}
