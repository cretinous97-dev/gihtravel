import type { Metadata } from 'next'
import { Container, Eyebrow, Heading, Lead, Section } from '@/components/ui/layout'
import { Reveal } from '@/components/ui/reveal'
import { RichText } from '@/components/rich-text'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getAboutPage, getSiteSettings } from '@/sanity/lib/content'

/** /about — company story, mission, vision, team, sustainability. */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: 'About GIH Tour and Travel',
    description:
      'A new name, but a team whose roots run deep in the Himalayan soil. Learn about Glide Into Happiness Tour and Travel — our story, mission and vision.',
    path: '/about',
    ogImage: settings.defaultSeo.ogImage,
    type: 'article',
  })
}

export default async function AboutPage() {
  const about = await getAboutPage()

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />

      <section className="bg-himalaya-600 py-20 text-white">
        <Container>
          <Eyebrow className="text-ochre-200">About us</Eyebrow>
          <Heading level={1} className="text-white">
            About Glide Into Happiness Tours &amp; Travel
          </Heading>
          <Lead className="mt-4 text-white/85">
            A new agency with an experienced soul — guides, storytellers and cultural enthusiasts with decades of
            experience across the Dragon Kingdom.
          </Lead>
        </Container>
      </section>

      <Section tone="cream" aria-labelledby="story-heading">
        <Container>
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <Heading id="story-heading" level={2}>
              Who we are
            </Heading>
            <RichText value={about.foundingStory} className="mt-6" />
          </Reveal>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="mission-heading">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-cream-200 bg-cream/50 p-8">
                <Eyebrow>Mission</Eyebrow>
                <Heading id="mission-heading" level={3}>
                  What we do
                </Heading>
                <RichText value={about.mission} className="mt-4" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-cream-200 bg-cream/50 p-8">
                <Eyebrow>Vision</Eyebrow>
                <Heading level={3}>Where we are going</Heading>
                <RichText value={about.vision} className="mt-4" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {about.teamMembers.length > 0 ? (
        <Section tone="cream" aria-labelledby="team-heading">
          <Container>
            <Reveal className="text-center">
              <Eyebrow>Our people</Eyebrow>
              <Heading id="team-heading" level={2}>
                The team behind your journey
              </Heading>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {about.teamMembers.map((member) => (
                <Reveal key={member._key}>
                  <div className="rounded-2xl border border-cream-200 bg-white p-7 shadow-soft">
                    {member.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote CMS images are served unoptimized by design
                      <img
                        src={member.photo.src}
                        alt={member.photo.alt}
                        loading="lazy"
                        className="h-40 w-40 rounded-full object-cover"
                      />
                    ) : null}
                    <h3 className="mt-5 font-serif text-xl text-charcoal">{member.name}</h3>
                    <p className="text-sm font-medium uppercase tracking-wider text-ochre-500">{member.role}</p>
                    {member.bio ? <p className="mt-3 text-body-sm text-charcoal-muted">{member.bio}</p> : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {about.sustainabilityCommitment.length > 0 ? (
        <Section tone="sage" aria-labelledby="sustainability-heading">
          <Container>
            <Reveal>
              <Eyebrow>Travel that gives back</Eyebrow>
              <Heading id="sustainability-heading" level={2}>
                Our sustainability commitment
              </Heading>
              <RichText value={about.sustainabilityCommitment} className="mt-6" />
            </Reveal>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
