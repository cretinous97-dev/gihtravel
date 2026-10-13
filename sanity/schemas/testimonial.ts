import { defineField, defineType } from 'sanity'

/** Document: testimonial — a real traveller quote. NEVER invent these. */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Traveller name',
      type: 'string',
      description: 'Exactly as the traveller signed it, e.g. "Sophie L.".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Where they travelled from, e.g. "France".',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'The traveller’s words, word-for-word. Do not edit or invent quotes.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Star rating',
      type: 'number',
      description: '1–5 stars (only if the traveller gave one).',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'Optional photo of the traveller. Leave blank for a text-only card.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'tour',
      title: 'Related tour',
      type: 'reference',
      description: 'The journey they took (optional) — shown as a link on the card.',
      to: [{ type: 'tour' }],
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the home page',
      type: 'boolean',
      description: 'On = appears in the home page testimonials carousel.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. 1, 2, 3 …',
      initialValue: 10,
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'country', media: 'photo' },
  },
})
