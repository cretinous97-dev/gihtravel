import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, portableTextMember, seoField } from './shared'

/** Singleton: siteSettings — brand, footer, socials, notification email. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    { name: 'brand', title: 'Brand' },
    { name: 'footer', title: 'Footer' },
    { name: 'notifications', title: 'Notifications' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string', fieldset: 'brand', initialValue: 'GIH Tour and Travel', validation: (Rule) => Rule.required() }),
    defineField({ name: 'siteTagline', title: 'Tagline', type: 'string', fieldset: 'brand', initialValue: 'Expand Your Comfort Zone' }),
    imageField('logo', 'Logo', 'Shown in the header and footer. Square PNG with a transparent background works best.', false),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image', description: 'The small icon in the browser tab.', options: { hotspot: true } }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      description: 'Links shown in the header/footer. Order matters.',
      fieldset: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['WhatsApp', 'Facebook', 'Instagram', 'X', 'YouTube', 'TripAdvisor'],
                layout: 'dropdown',
              },
            }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.uri({ allowRelative: false }) }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'footerText', title: 'Footer text', type: 'array', description: 'The closing line of the footer (copyright etc.).', fieldset: 'footer', of: [portableTextMember] }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      description: 'Quick-link columns in the footer.',
      fieldset: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Column heading', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'href', title: 'Link', type: 'string', description: 'e.g. "/tours" or "https://…"', validation: (Rule) => Rule.required() }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'href' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'heading', subtitle: 'links' } },
        }),
      ],
    }),
    seoField,
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'object',
      description: 'Fallback meta title/description used on pages without their own SEO.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'metaTitle', title: 'Default meta title', type: 'string', initialValue: 'GIH Tour and Travel | Bhutan journeys, guided by local knowledge' }),
        defineField({ name: 'metaDescription', title: 'Default meta description', type: 'text', rows: 3 }),
        defineField({ name: 'ogImage', title: 'Default social share image', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'inquiryNotificationEmail',
      title: 'Inquiry notification email',
      type: 'email',
      fieldset: 'notifications',
      description: 'Where new enquiries are emailed. Usually gihbucketlist@gmail.com.',
      initialValue: 'gihbucketlist@gmail.com',
    }),
    defineField({
      name: 'analyticsId',
      title: 'Analytics ID',
      type: 'string',
      fieldset: 'notifications',
      description: 'Optional — e.g. "G-XXXXXXX" for Google Analytics. Leave blank to disable.',
    }),
  ],
})
