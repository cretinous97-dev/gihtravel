import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ButtonLink } from '@/components/ui/button'
import { Container, Eyebrow, Heading, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { Accordion } from '@/components/ui/accordion'
import { Gallery } from '@/components/gallery'
import { RichText } from '@/components/rich-text'
import { TourCard } from '@/components/tour-card'
import { InquiryForm } from '@/components/inquiry-form'
import { BreadcrumbJsonLd, TouristTripJsonLd } from '@/components/seo/json-ld'
import { CheckIcon, CloseIcon } from '@/components/icons'
import { buildMetadata } from '@/lib/seo'
import { formatDuration, formatUsd } from '@/lib/utils'
import { getRelatedTours, getTourBySlug, getTourSlugs, getTours } from '@/sanity/lib/content'
import type { Tour } from '@/lib/types'

/**
 * /tours/[slug] — full tour detail: hero, overview, day-by-day accordion,
 * inclusions/exclusions, pricing, gallery, related tours, and a prominent
 * pre-filled enquiry form.
 */

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getTourSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) return buildMetadata({ title: 'Tour not found', path: `/tours/${slug}` })
  return buildMetadata({
    title: tour.seo?.metaTitle ?? tour.title,
    description: tour.seo?.metaDescription ?? tour.shortDescription,
    path: `/tours/${tour.slug}`,
    seo: tour.seo,
    ogImage: tour.heroImage,
    type: 'article',
  })
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-cream-200 py-3">
      <dt className="text-sm uppercase tracking-wider text-charcoal-muted">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  )
}

function DayContent({ day }: { day: Tour['itinerary'][number] }) {
  return (
    <div>
      <RichText value={[{ _type: 'block', _key: day._key, style: 'normal', children: [{ _type: 'span', _key: 's', text: day.dayDescription }]}]} className="[&_p]:my-0" />
      {day.accommodation || day.mealsIncluded ? (
        <dl className="mt-4 grid gap-2 rounded-xl bg-cream/70 p-4 text-sm sm:grid-cols-2">
          {day.accommodation ? (
            <div>
              <dt className="font-semibold text-charcoal">Accommodation</dt>
              <dd className="text-charcoal-muted">{day.accommodation}</dd>
            </div>
          ) : null}
          {day.mealsIncluded ? (
            <div>
              <dt className="font-semibold text-charcoal">Meals</dt>
              <dd className="text-charcoal-muted">{day.mealsIncluded}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  )
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) notFound()

  const allTours = await getTours()
  const related = getRelatedTours(allTours, tour)

  return (
    <>
      <TouristTripJsonLd tour={tour} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Tours', path: '/tours' },
          { name: tour.title, path: `/tours/${tour.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-himalaya-600">
        {tour.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CMS hero served unoptimized by design
          <img src={tour.heroImage.src} alt={tour.heroImage.alt} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
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
                <Link href="/tours" className="hover:text-ochre-200">Tours</Link>
                <span aria-hidden="true" className="mx-2">/</span>
              </li>
              <li aria-current="page" className="text-white">{tour.title}</li>
            </ol>
          </nav>
          <h1 className="max-w-3xl font-serif text-display-2 text-white">{tour.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-white/90">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm">{formatDuration(tour.durationDays, tour.durationNights)}</span>
            {tour.difficulty ? <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm">{tour.difficulty}</span> : null}
            {tour.activityType ? <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm">{tour.activityType}</span> : null}
            {tour.bestSeason.length > 0 ? (
              <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm">Best: {tour.bestSeason.join(', ')}</span>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Reveal>
                <Eyebrow>Overview</Eyebrow>
                <RichText value={tour.overview} />
              </Reveal>

              {tour.itinerary.length > 0 ? (
                <Reveal>
                  <div className="mt-12">
                    <Eyebrow>Day by day</Eyebrow>
                    <Heading level={2}>Itinerary</Heading>
                    <div className="mt-6">
                      <Accordion
                        items={tour.itinerary.map((day) => ({
                          key: day._key,
                          title: `Day ${day.dayNumber}: ${day.dayTitle}`,
                          content: <DayContent day={day} />,
                        }))}
                        defaultOpenKey={tour.itinerary[0]?._key}
                      />
                    </div>
                  </div>
                </Reveal>
              ) : null}

              {tour.gallery.length > 0 ? (
                <Reveal>
                  <div className="mt-12">
                    <Eyebrow>Gallery</Eyebrow>
                    <Heading level={2}>Moments from the journey</Heading>
                    <Gallery images={tour.gallery} className="mt-6" />
                  </div>
                </Reveal>
              ) : null}

              {(tour.inclusions.length > 0 || tour.exclusions.length > 0) ? (
                <Reveal>
                  <div className="mt-12 grid gap-8 sm:grid-cols-2">
                    <div>
                      <Eyebrow>What&apos;s included</Eyebrow>
                      <ul className="space-y-2.5">
                        {tour.inclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-body-sm text-charcoal-soft">
                            <span className="mt-0.5 text-sage-500">
                              <CheckIcon size={18} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Eyebrow>What&apos;s not included</Eyebrow>
                      <ul className="space-y-2.5">
                        {tour.exclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-body-sm text-charcoal-soft">
                            <span className="mt-0.5 text-terracotta-300">
                              <CloseIcon size={18} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>

            {/* Sidebar */}
            <aside>
              <Reveal>
                <div className="sticky top-28 rounded-2xl border border-cream-200 bg-white p-7 shadow-soft">
                  <p className="text-sm uppercase tracking-wider text-charcoal-muted">Price</p>
                  <p className="mt-1 font-serif text-3xl text-himalaya-600">
                    {tour.priceFrom ? `From ${formatUsd(tour.priceFrom)}` : 'Enquire for price'}
                  </p>
                  {tour.priceFrom ? <p className="mt-1 text-sm text-charcoal-muted">per person, USD</p> : null}

                  <dl className="mt-6">
                    <FactRow label="Duration" value={formatDuration(tour.durationDays, tour.durationNights)} />
                    {tour.difficulty ? <FactRow label="Difficulty" value={tour.difficulty} /> : null}
                    {tour.activityType ? <FactRow label="Activity" value={tour.activityType} /> : null}
                    {tour.groupSizeMin || tour.groupSizeMax ? (
                      <FactRow
                        label="Group size"
                        value={`${tour.groupSizeMin ?? 1}–${tour.groupSizeMax ?? 'flexible'} travellers`}
                      />
                    ) : null}
                    {tour.bestSeason.length > 0 ? <FactRow label="Best season" value={tour.bestSeason.join(', ')} /> : null}
                    {tour.destinations.length > 0 ? (
                      <FactRow label="Destinations" value={tour.destinations.map((d) => d.name).join(', ')} />
                    ) : null}
                  </dl>

                  <ButtonLink href="#enquire" className="mt-6 w-full" size="lg">
                    Enquire about this tour
                  </ButtonLink>
                  <p className="mt-3 text-center text-xs text-charcoal-muted">
                    Or call us:{' '}
                    <a className="underline-offset-2 hover:underline" href="tel:+97517901780">
                      +975 17901780
                    </a>
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Enquiry */}
      <Section tone="white" id="enquire" aria-labelledby="enquire-heading">
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <Eyebrow>Ready when you are</Eyebrow>
            <Heading id="enquire-heading" level={2}>
              Enquire about this tour
            </Heading>
            <p className="mt-4 max-w-measure text-body-lg text-charcoal-soft">
              Tell us your dates and wishes — we reply within 24–48 hours with a personalised plan.
            </p>
            <div className="mt-8">
              <InquiryForm tourSlug={tour.slug} tourTitle={tour.title} />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Related tours */}
      {related.length > 0 ? (
        <Section tone="cream" aria-labelledby="related-heading">
          <Container>
            <Reveal>
              <Eyebrow>Keep exploring</Eyebrow>
              <Heading id="related-heading" level={2}>
                You might also love
              </Heading>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t, i) => (
                <Reveal key={t._id} delay={i * 0.05}>
                  <TourCard tour={t} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
