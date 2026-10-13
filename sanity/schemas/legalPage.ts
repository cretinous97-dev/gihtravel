import { defineField, defineType } from 'sanity'
import { portableTextMember, seoField } from './shared'

/**
 * Document: legalPage — privacy policy, terms & conditions, and any future
 * legal copy. One document per page (use the slug to pick which page it is).
 */
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Privacy Policy" or "Terms & Conditions of Service".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (web address)',
      type: 'slug',
      description: 'Use "privacy-policy" or "terms" so the right page picks it up.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Full text',
      type: 'array',
      description: 'The complete legal text. Copy and paste from your approved document.',
      of: [portableTextMember],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      description: 'Shown under the title so travellers know how current it is.',
    }),
    seoField,
  ],
  preview: {
    select: { title: 'title', subtitle: 'lastUpdated' },
  },
})
