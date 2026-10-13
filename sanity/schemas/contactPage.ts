import { defineField, defineType } from 'sanity'
import { seoField } from './shared'

/** Singleton: contactPage — contact details and the contact page hero. */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero (top of page)' },
    { name: 'details', title: 'Contact details', options: { columns: 2 } },
    { name: 'map', title: 'Map & hours' },
  ],
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero title', type: 'string', fieldset: 'hero', initialValue: 'Contact Us', validation: (Rule) => Rule.required() }),
    defineField({ name: 'heroSubtitle', title: 'Hero subtitle', type: 'text', rows: 2, fieldset: 'hero' }),
    defineField({ name: 'addressLine', title: 'Address', type: 'string', fieldset: 'details', description: 'e.g. "Paro, Bhutan" or a street address.' }),
    defineField({ name: 'city', title: 'City', type: 'string', fieldset: 'details', initialValue: 'Paro' }),
    defineField({ name: 'country', title: 'Country', type: 'string', fieldset: 'details', initialValue: 'Bhutan' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', fieldset: 'details', initialValue: '+975 17901780' }),
    defineField({ name: 'email', title: 'Email', type: 'email', fieldset: 'details', initialValue: 'gihbucketlist@gmail.com' }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'text',
      rows: 2,
      fieldset: 'map',
      description: 'A Google Maps embed URL (Google Maps → Share → Embed a map → copy the src URL).',
    }),
    defineField({ name: 'officeHours', title: 'Office hours', type: 'string', fieldset: 'map', description: 'e.g. "Monday–Friday, 9:00–17:00 (Bhutan time)".' }),
    seoField,
  ],
})
