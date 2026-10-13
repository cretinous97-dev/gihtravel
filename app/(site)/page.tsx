import type { Metadata } from 'next'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button'
import { Container, Eyebrow, Heading, Lead, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { TourCard } from '@/components/tour-card'
import { DestinationCard } from '@/components/destination-card'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { RichText } from '@/components/rich-text'
import { TrustIcon } from '@/components/icons'
import { TravelAgencyJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getAboutBhutanPage, getAboutPage, getHomePage, getSiteSettings } from '@/sanity/lib/content'

/**
 * Home page — Hero, welcome story, featured tours, popular destinations,
 * Why Bhutan? Why GIH?, trust points, testimonials carousel, final CTA band.
 * All content is editable in Sanity Studio (Home Page + About singletons).
 */

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage()
  return buildMetadata({
    path: '/',
    seo: home.seo,
    ogImage: home.heroImage,
  })
}

function Hero({ headline, subheadline, image, ctaLabel, ctaLink }: {
  headline: string
  subheadline: string
  image: { src: string; alt: string } | null
  ctaLabel: string
  ctaLink: string
}) {
  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-himalaya-600">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote CMS hero served unoptimized by design
        <img src={image.src} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-transparent" aria-hidden="true" />
      <Container className="relative z-10 pb-20 pt-32">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-ochre-200">Glide Into Happiness · Bhutan</p>
          <h1 className="max-w-3xl font-serif text-display-1 text-white">{headline}</h1>
          <p className="mt-6 max-w-xl text-body-lg text-white/90">{subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={ctaLink} size="lg">
              {ctaLabel}
            </ButtonLink>
            <ButtonLink href="/tours" variant="light" size="lg">
              Explore our journeys
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export default async function HomePage() {
  const [home, about, aboutBhutan, settings] = await Promise.all([
    getHomePage(),
    getAboutPage(),
    getAboutBhutanPage(),
    getSiteSettings(),
  ])

  return (
    <>
      <TravelAgencyJsonLd settings={settings} />

      <Hero
        headline={home.heroHeadline}
        subheadline={home.heroSubheadline}
        image={home.heroImage}
        ctaLabel={home.heroCtaLabel}
        ctaLink={home.heroCtaLink}
      />

      {/* Welcome — the founding story (editable on the About Page singleton) */}
      <Section tone="cream" aria-labelledby="welcome-heading">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>Welcome</Eyebrow>
            <Heading id="welcome-heading" level={2}>
              Welcome to {settings.siteName}
            </Heading>
            <div className="mt-6 text-left">
              <RichText value={about.foundingStory.slice(0, 3)} className="mx-auto max-w-measure-wide" />
            </div>
            <ButtonLink href="/about" variant="secondary" className="mt-8">
              Our story
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>

      {/* Featured tours */}
      {home.featuredTours.length > 0 ? (
        <Section tone="white" aria-labelledby="featured-tours-heading">
          <Container>
            <Reveal>
              <Eyebrow>Handpicked journeys</Eyebrow>
              <Heading id="featured-tours-heading" level={2}>
                Featured tours
              </Heading>
              <Lead className="mt-4">
                Get started with handpicked, top-rated trips — crafted by guides with decades of experience across the
                Dragon Kingdom.
              </Lead>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {home.featuredTours.slice(0, 6).map((tour, i) => (
                <Reveal key={tour._id} delay={i * 0.05}>
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <ButtonLink href="/tours" variant="secondary">
                View all tours
              </ButtonLink>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Popular destinations */}
      {home.featuredDestinations.length > 0 ? (
        <Section tone="cream" aria-labelledby="destinations-heading">
          <Container>
            <Reveal>
              <Eyebrow>Popular destinations</Eyebrow>
              <Heading id="destinations-heading" level={2}>
                Your next adventure starts here
              </Heading>
              <Lead className="mt-4">
                A new journey begins the moment you step off the plane. We&apos;ll guide you to destinations where the
                air smells of adventure and every view tells a story.
              </Lead>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {home.featuredDestinations.slice(0, 6).map((destination, i) => (
                <Reveal key={destination._id} delay={i * 0.05}>
                  <DestinationCard destination={destination} />
                </Reveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <ButtonLink href="/destinations" variant="secondary">
                View all destinations
              </ButtonLink>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Why Bhutan? Why GIH? */}
      <Section tone="himalaya" aria-labelledby="why-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow className="text-ochre-200">The philosophy</Eyebrow>
              <Heading id="why-heading" level={2} className="text-white">
                Why Bhutan? Why GIH?
              </Heading>
              <div className="mt-6 text-cream/90 [&_p]:text-cream/90">
                <RichText value={aboutBhutan.whyGih.slice(0, 2)} />
              </div>
              <ButtonLink href="/about-bhutan" variant="light" className="mt-8">
                Discover Bhutan
              </ButtonLink>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <RichText value={aboutBhutan.whyBhutan} className="text-cream/90 [&_h2]:text-white [&_h3]:text-white [&_li]:text-cream/90" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Trust / sustainability */}
      {home.trustPoints.length > 0 ? (
        <Section tone="white" aria-labelledby="trust-heading">
          <Container>
            <Reveal className="text-center">
              <Eyebrow>Travel with purpose</Eyebrow>
              <Heading id="trust-heading" level={2}>
                {home.trustSectionTitle}
              </Heading>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {home.trustPoints.map((point, i) => (
                <Reveal key={point._key} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-cream-200 bg-cream/50 p-7">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ochre-100 text-ochre-500">
                      <TrustIcon name={point.icon} />
                    </span>
                    <h3 className="mt-5 font-serif text-xl text-charcoal">{point.title}</h3>
                    <p className="mt-2 text-body-sm text-charcoal-muted">{point.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Testimonials */}
      {home.featuredTestimonials.length > 0 ? (
        <Section tone="sage" aria-labelledby="testimonials-heading">
          <Container>
            <Reveal className="text-center">
              <Eyebrow>Travellers share their GIH journeys</Eyebrow>
              <Heading id="testimonials-heading" level={2}>
                Client testimonials
              </Heading>
            </Reveal>
            <div className="mt-12">
              <TestimonialCarousel testimonials={home.featuredTestimonials} />
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Final CTA band */}
      <section aria-labelledby="cta-heading" className="bg-ochre-400 py-20 text-white">
        <Container className="text-center">
          <Reveal>
            <h2 id="cta-heading" className="font-serif text-display-2 text-white">
              Your journey to joy begins here
            </h2>
            <p className="mx-auto mt-5 max-w-measure text-body-lg text-white/90">
              Come, let us guide you into the heart of happiness. Tell us what your perfect Bhutan looks like — we will
              craft the rest.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/contact" size="lg" variant="light">
                Plan your trip
              </ButtonLink>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Browse tours
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
