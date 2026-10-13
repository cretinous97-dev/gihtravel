import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, seoField } from './shared'

/**
 * Singleton: homePage — everything editable on the home page.
 * Only one copy ever exists (locked by the Studio desk structure).
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero (top of page)' },
    { name: 'featured', title: 'Featured collections', options: { columns: 2 } },
    { name: 'trust', title: 'Trust & sustainability section' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
      description: 'The big line at the top of the home page.',
      fieldset: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero sub-headline',
      type: 'text',
      rows: 2,
      description: 'A friendly one-liner under the headline.',
      fieldset: 'hero',
    }),
    imageField('heroImage', 'Hero image', 'The large background photo of the home page hero.'),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero button label',
      type: 'string',
      description: 'e.g. "Plan Your Trip".',
      fieldset: 'hero',
      initialValue: 'Plan Your Trip',
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero button link',
      type: 'string',
      description: 'Where the button goes — usually "/contact".',
      fieldset: 'hero',
      initialValue: '/contact',
    }),
    defineField({
      name: 'featuredTours',
      title: 'Featured tours',
      type: 'array',
      description: 'The journeys shown in the “Featured Journeys” grid. Drag to reorder.',
      fieldset: 'featured',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tour' }] })],
    }),
    defineField({
      name: 'featuredDestinations',
      title: 'Featured destinations',
      type: 'array',
      description: 'The valleys shown in the “Popular Destinations” grid.',
      fieldset: 'featured',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'destination' }] })],
    }),
    defineField({
      name: 'featuredTestimonials',
      title: 'Featured testimonials',
      type: 'array',
      description: 'Traveller quotes for the home page carousel.',
      fieldset: 'featured',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
    }),
    defineField({
      name: 'trustSectionTitle',
      title: 'Trust section title',
      type: 'string',
      description: 'Heading for the “Why travel with us” section.',
      fieldset: 'trust',
    }),
    defineField({
      name: 'trustPoints',
      title: 'Trust points',
      type: 'array',
      description: 'Three or four short reasons to trust GIH (icon, title, description).',
      fieldset: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Pick a simple symbol.',
              options: {
                list: [
                  { title: 'Mountain', value: 'mountain' },
                  { title: 'Heart', value: 'heart' },
                  { title: 'Leaf', value: 'leaf' },
                  { title: 'Compass', value: 'compass' },
                  { title: 'Shield', value: 'shield' },
                  { title: 'Star', value: 'star' },
                  { title: 'Users', value: 'users' },
                  { title: 'Prayer flags', value: 'flags' },
                ],
                layout: 'dropdown',
              },
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
    seoField,
  ],
})
