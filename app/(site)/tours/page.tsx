import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'
import { Container, Eyebrow, Heading, Lead, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { TourCard } from '@/components/tour-card'
import { FilterBar } from '@/components/filter-bar'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { parseFilters, queryTours, filtersToQueryString, type TourFilters } from '@/lib/filters'
import { getSiteSettings, getTours } from '@/sanity/lib/content'

/**
 * /tours — filterable, sortable, paginated tour listing.
 * Filters live in the URL query string (shareable); pagination is numbered.
 */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'Tours & Journeys',
    description:
      'Explore cultural tours, treks, festivals, wellness retreats and private journeys across Bhutan. Filter by destination, activity, difficulty and season.',
    path: '/tours',
    ogImage: settings.defaultSeo.ogImage,
  })
}

function Pagination({ filters, totalPages }: { filters: TourFilters; totalPages: number }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap justify-center gap-2">
      {pages.map((page) => {
        const qs = filtersToQueryString({ ...filters, page })
        const current = page === filters.page
        return (
          <ButtonLink
            key={page}
            href={qs ? `/tours?${qs}` : '/tours'}
            size="sm"
            variant={current ? 'primary' : 'secondary'}
            aria-current={current ? 'page' : undefined}
          >
            {page}
          </ButtonLink>
        )
      })}
    </nav>
  )
}

export default async function ToursPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const filters = parseFilters(params)
  const allTours = await getTours()
  const { tours, total, totalPages } = queryTours(allTours, filters)

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'Tours', path: '/tours' }]} />

      <section className="bg-himalaya-600 py-20 text-white">
        <Container>
          <Eyebrow className="text-ochre-200">Tours &amp; journeys</Eyebrow>
          <Heading level={1} className="text-white">
            Find your Bhutan
          </Heading>
          <Lead className="mt-4 text-white/85">
            Every journey is crafted by local experts and aligned with Bhutan&apos;s high-value, low-impact tourism
            policy. Filter by destination, activity, difficulty, duration or season.
          </Lead>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <FilterBar filters={filters} total={total} />

          {tours.length > 0 ? (
            <>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour, i) => (
                  <Reveal key={tour._id} delay={i * 0.04}>
                    <TourCard tour={tour} />
                  </Reveal>
                ))}
              </div>
              <Pagination filters={filters} totalPages={totalPages} />
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-cream-200 bg-white p-12 text-center">
              <h2 className="font-serif text-heading-3 text-charcoal">No journeys match those filters</h2>
              <p className="mx-auto mt-3 max-w-measure text-charcoal-muted">
                Try widening your search — or tell us what you are dreaming of and we will craft it for you.
              </p>
              <ButtonLink href="/contact" className="mt-6">
                Plan a custom trip
              </ButtonLink>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
