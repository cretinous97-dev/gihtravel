import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, portableTextMember, seoField } from './shared'

/** Document: destination — a valley/region (Paro, Thimphu, Punakha, …). */
export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Destination name',
      type: 'string',
      description: 'e.g. "Paro" or "Phobjikha Valley".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (web address)',
      type: 'slug',
      description: 'Generated from the name — click "Generate".',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Tell travellers what makes this place special.',
      of: [portableTextMember],
    }),
    imageField('image', 'Photo', 'The main photo for this destination.', false),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      description: 'e.g. "Western Bhutan", "Central Bhutan".',
    }),
    defineField({
      name: 'altitude',
      title: 'Altitude',
      type: 'string',
      description: 'e.g. "2,200 m" (optional).',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      description: 'Short bullet points — the top sights and experiences.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    seoField,
  ],
  preview: {
    select: { title: 'name', subtitle: 'region', media: 'image' },
  },
})
