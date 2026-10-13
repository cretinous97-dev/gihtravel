import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, portableTextMember, seoField } from './shared'

/**
 * Document: tour — a bookable journey (e.g. "Hidden Kingdom Heritage Trail").
 * This is the heart of the catalogue: everything on /tours and /tours/[slug]
 * comes from these fields.
 */
export const tour = defineType({
  name: 'tour',
  title: 'Tour',
  type: 'document',
  fieldsets: [
    { name: 'basics', title: 'Basics', options: { columns: 2 } },
    { name: 'logistics', title: 'Logistics & pricing', options: { columns: 2 } },
    { name: 'content', title: 'Detailed content' },
    { name: 'meta', title: 'Extras' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tour name',
      type: 'string',
      description: 'The name travellers see, e.g. "Hidden Kingdom Heritage Trail".',
      fieldset: 'basics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (web address)',
      type: 'slug',
      description: 'The last part of the URL, generated from the title. Click "Generate".',
      fieldset: 'basics',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown on tour cards. Maximum 160 characters.',
      validation: (Rule) => Rule.required().max(160),
    }),
    imageField('heroImage', 'Hero image', 'The large photo at the top of the tour page.'),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      description: 'Extra photos for the tour page gallery. Order matters.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required() })],
        }),
      ],
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      description: 'The full written introduction to this journey. Use headings to break it up.',
      of: [portableTextMember],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'itinerary',
      title: 'Day-by-day itinerary',
      type: 'array',
      description: 'Add one row per day. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Itinerary day',
          fields: [
            defineField({ name: 'dayNumber', title: 'Day number', type: 'number', description: 'e.g. 1 for Day 1.', validation: (Rule) => Rule.required().min(1) }),
            defineField({ name: 'dayTitle', title: 'Day title', type: 'string', description: 'e.g. "Arrival in Paro".', validation: (Rule) => Rule.required() }),
            defineField({ name: 'dayDescription', title: 'What happens', type: 'text', rows: 5, description: 'Describe the day’s activities in traveller-friendly language.', validation: (Rule) => Rule.required() }),
            defineField({ name: 'mealsIncluded', title: 'Meals included', type: 'string', description: 'e.g. "Breakfast, Lunch, Dinner" (optional).' }),
            defineField({ name: 'accommodation', title: 'Accommodation', type: 'string', description: 'Where travellers sleep tonight (optional).' }),
          ],
          preview: {
            select: { title: 'dayTitle', subtitle: 'dayNumber' },
            prepare({ title, subtitle }) {
              return { title: title ? `Day ${subtitle}: ${title}` : `Day ${subtitle}` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'inclusions',
      title: 'What’s included',
      type: 'array',
      description: 'One item per line — things the price covers.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'exclusions',
      title: 'What’s NOT included',
      type: 'array',
      description: 'One item per line — costs travellers should budget for separately.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration (days)',
      type: 'number',
      description: 'Total days, e.g. 8.',
      fieldset: 'logistics',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'durationNights',
      title: 'Duration (nights)',
      type: 'number',
      description: 'Total nights, e.g. 7.',
      fieldset: 'logistics',
      validation: (Rule) => Rule.min(0).max(59),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      description: 'How demanding the journey is.',
      fieldset: 'logistics',
      options: {
        list: [
          { title: 'Easy', value: 'Easy' },
          { title: 'Moderate', value: 'Moderate' },
          { title: 'Challenging', value: 'Challenging' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'activityType',
      title: 'Activity type',
      type: 'string',
      description: 'The main kind of experience. Used by the filters on the Tours page.',
      fieldset: 'logistics',
      options: {
        list: [
          { title: 'Cultural', value: 'Cultural' },
          { title: 'Trekking', value: 'Trekking' },
          { title: 'Festival', value: 'Festival' },
          { title: 'Wellness', value: 'Wellness' },
          { title: 'Custom / Bespoke', value: 'Custom' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'destinations',
      title: 'Destinations visited',
      type: 'array',
      description: 'Link each valley or town this journey visits.',
      fieldset: 'logistics',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'destination' }] })],
    }),
    defineField({
      name: 'priceFrom',
      title: 'Price from (USD)',
      type: 'number',
      description: 'Starting price per person in US Dollars. Leave blank to show "Enquire for price".',
      fieldset: 'logistics',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'groupSizeMin',
      title: 'Minimum group size',
      type: 'number',
      fieldset: 'meta',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'groupSizeMax',
      title: 'Maximum group size',
      type: 'number',
      fieldset: 'meta',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'bestSeason',
      title: 'Best seasons',
      type: 'array',
      description: 'When this journey is at its best. Tick all that apply.',
      fieldset: 'meta',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'Spring (Mar–May)', value: 'Spring' },
              { title: 'Summer (Jun–Aug)', value: 'Summer' },
              { title: 'Autumn (Sep–Nov)', value: 'Autumn' },
              { title: 'Winter (Dec–Feb)', value: 'Winter' },
            ],
          },
        }),
      ],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the home page',
      type: 'boolean',
      description: 'On = this tour appears in the home page’s featured collection (and first in lists).',
      initialValue: false,
    }),
    seoField,
  ],
  preview: {
    select: { title: 'title', subtitle: 'durationDays', media: 'heroImage' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? `${subtitle} days` : '', media }
    },
  },
})
