import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, portableTextMember, seoField } from './shared'

/** Singleton: aboutBhutanPage — the GNH / geography / seasons guide page. */
export const aboutBhutanPage = defineType({
  name: 'aboutBhutanPage',
  title: 'About Bhutan Page',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero (top of page)' },
    { name: 'gnh', title: 'Gross National Happiness' },
    { name: 'places', title: 'Geography & seasons' },
    { name: 'culture', title: 'Culture & closing sections' },
  ],
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero title', type: 'string', fieldset: 'hero', validation: (Rule) => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 2, fieldset: 'hero' }),
    imageField('heroImage', 'Hero image', 'The large photo at the top of the About Bhutan page.'),
    defineField({
      name: 'gnhIntroduction',
      title: 'GNH introduction',
      type: 'array',
      description: 'Introduce Gross National Happiness — the philosophy behind the kingdom.',
      fieldset: 'gnh',
      of: [portableTextMember],
    }),
    defineField({
      name: 'fourPillars',
      title: 'The four pillars of GNH',
      type: 'array',
      description: 'Exactly four pillars. Each needs a name and a short description.',
      fieldset: 'gnh',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'pillarName', title: 'Pillar name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: ['mountain', 'heart', 'leaf', 'compass', 'shield', 'star', 'users', 'flags'],
                layout: 'dropdown',
              },
            }),
          ],
          preview: { select: { title: 'pillarName', subtitle: 'description' } },
        }),
      ],
    }),
    defineField({
      name: 'geography',
      title: 'Geography',
      type: 'array',
      description: 'The vertical kingdom — valleys, mountains, regions.',
      fieldset: 'places',
      of: [portableTextMember],
    }),
    defineField({
      name: 'seasons',
      title: 'Seasons',
      type: 'array',
      description: 'The four seasons and when to visit.',
      fieldset: 'places',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'seasonName', title: 'Season', type: 'string', description: 'e.g. "Spring (March–May)".', validation: (Rule) => Rule.required() }),
            defineField({ name: 'months', title: 'Months', type: 'string', description: 'e.g. "March – May".' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
            imageField('image', 'Season photo', 'A photo that captures this season.', false),
          ],
          preview: { select: { title: 'seasonName', subtitle: 'months' } },
        }),
      ],
    }),
    defineField({ name: 'culturalInsights', title: 'Cultural insights & etiquette', type: 'array', fieldset: 'culture', of: [portableTextMember] }),
    defineField({ name: 'whyBhutan', title: 'Why Bhutan?', type: 'array', fieldset: 'culture', of: [portableTextMember] }),
    defineField({ name: 'whyGih', title: 'Why GIH?', type: 'array', fieldset: 'culture', of: [portableTextMember] }),
    seoField,
  ],
})
