import type { Metadata } from 'next'
import { Container, Eyebrow, Heading, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { RichText } from '@/components/rich-text'
import { TrustIcon } from '@/components/icons'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getAboutBhutanPage } from '@/sanity/lib/content'

/**
 * /about-bhutan — GNH philosophy, the four pillars, geography, seasons,
 * cultural insights and the "Why Bhutan? Why GIH?" closing sections.
 */

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutBhutanPage()
  return buildMetadata({
    title: page.seo?.metaTitle ?? 'About Bhutan — Gross National Happiness',
    description:
      'The world’s only carbon-negative country, where happiness is national policy. Gross National Happiness, the four pillars, seasons, culture and practical travel insights.',
    path: '/about-bhutan',
    seo: page.seo,
    ogImage: page.heroImage,
    type: 'article',
  })
}

export default async function AboutBhutanPage() {
  const page = await getAboutBhutanPage()

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'About Bhutan', path: '/about-bhutan' }]} />

      <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-himalaya-600">
        {page.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CMS hero served unoptimized by design
          <img src={page.heroImage.src} alt={page.heroImage.alt} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" aria-hidden="true" />
        <Container className="relative z-10 pb-16 pt-32">
          <Eyebrow className="text-ochre-200">The last Shangri-La</Eyebrow>
          <h1 className="max-w-3xl font-serif text-display-2 text-white">{page.heroTitle}</h1>
          {page.heroSubtitle ? <p className="mt-5 max-w-2xl text-body-lg text-white/90">{page.heroSubtitle}</p> : null}
        </Container>
      </section>

      {/* GNH introduction */}
      <Section tone="cream" aria-labelledby="gnh-heading">
        <Container>
          <Reveal>
            <Eyebrow>Gross National Happiness</Eyebrow>
            <Heading id="gnh-heading" level={2}>
              Happiness, measured as national policy
            </Heading>
            <RichText value={page.gnhIntroduction} className="mt-6" />
          </Reveal>

          {page.fourPillars.length > 0 ? (
            <div className="mt-14">
              <Reveal>
                <Heading level={3}>The Four Pillars of GNH</Heading>
              </Reveal>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {page.fourPillars.map((pillar, i) => (
                  <Reveal key={pillar._key} delay={i * 0.06}>
                    <div className="h-full rounded-2xl border border-cream-200 bg-white p-7 shadow-soft">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-himalaya-50 text-himalaya-600">
                        <TrustIcon name={pillar.icon ?? 'compass'} />
                      </span>
                      <h3 className="mt-5 font-serif text-lg text-charcoal">{pillar.pillarName}</h3>
                      <p className="mt-3 whitespace-pre-line text-body-sm text-charcoal-muted">{pillar.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Geography */}
      {page.geography.length > 0 ? (
        <Section tone="white" aria-labelledby="geography-heading">
          <Container>
            <Reveal>
              <Eyebrow>A vertical kingdom</Eyebrow>
              <Heading id="geography-heading" level={2}>
                Geography &amp; valleys
              </Heading>
              <RichText value={page.geography} className="mt-6" />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* Seasons */}
      {page.seasons.length > 0 ? (
        <Section tone="sage" aria-labelledby="seasons-heading">
          <Container>
            <Reveal className="text-center">
              <Eyebrow>When to visit</Eyebrow>
              <Heading id="seasons-heading" level={2}>
                Seasons of splendour
              </Heading>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {page.seasons.map((season, i) => (
                <Reveal key={season._key} delay={i * 0.06}>
                  <div className="h-full overflow-hidden rounded-2xl border border-sage-200 bg-white shadow-soft">
                    {season.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote CMS images are served unoptimized by design
                      <img src={season.image.src} alt={season.image.alt} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                    ) : null}
                    <div className="p-6">
                      <h3 className="font-serif text-xl text-charcoal">{season.seasonName}</h3>
                      {season.months ? <p className="mt-1 text-sm font-medium text-ochre-500">{season.months}</p> : null}
                      <p className="mt-3 whitespace-pre-line text-body-sm text-charcoal-muted">{season.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Cultural insights */}
      {page.culturalInsights.length > 0 ? (
        <Section tone="cream" aria-labelledby="culture-heading">
          <Container>
            <Reveal>
              <Eyebrow>Living traditions</Eyebrow>
              <Heading id="culture-heading" level={2}>
                Cultural tapestry
              </Heading>
              <RichText value={page.culturalInsights} className="mt-6" />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* Why Bhutan / Why GIH */}
      <Section tone="himalaya" aria-labelledby="why-bhutan-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {page.whyBhutan.length > 0 ? (
              <Reveal>
                <Eyebrow className="text-ochre-200">Why Bhutan?</Eyebrow>
                <Heading id="why-bhutan-heading" level={2} className="text-white">
                  Why Bhutan changes travellers
                </Heading>
                <div className="mt-6 text-cream/90 [&_h2]:text-white [&_h3]:text-white [&_li]:text-cream/90 [&_p]:text-cream/90">
                  <RichText value={page.whyBhutan} />
                </div>
              </Reveal>
            ) : null}
            {page.whyGih.length > 0 ? (
              <Reveal delay={0.1}>
                <Eyebrow className="text-ochre-200">Why GIH?</Eyebrow>
                <Heading level={2} className="text-white">
                  Your invitation to experience
                </Heading>
                <div className="mt-6 text-cream/90 [&_blockquote]:text-white [&_h2]:text-white [&_li]:text-cream/90 [&_p]:text-cream/90">
                  <RichText value={page.whyGih} />
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  )
}
