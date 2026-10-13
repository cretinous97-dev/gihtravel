import { defineArrayMember, defineField } from 'sanity'

/**
 * Shared field fragments used across documents.
 * Every field carries a plain-English description so a non-technical
 * editor knows exactly what to type in Sanity Studio.
 */

/** SEO object: meta title/description + social share image. */
export const seoField = defineField({
  name: 'seo',
  title: 'SEO (search engine listing)',
  type: 'object',
  description: 'Optional. Controls how this page looks on Google and when shared on social media. Leave blank to use sensible defaults.',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'The blue link text on Google. Aim for 50–60 characters.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'The grey description under the Google link. Aim for 140–160 characters.',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Shown when this page is shared on Facebook/WhatsApp/Twitter. Landscape works best (1200×630).',
      options: { hotspot: true },
    }),
  ],
})

/** Portable Text rich-text editor with sensible styles. */
export const portableTextMember = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal text', value: 'normal' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
    { title: 'Heading 4', value: 'h4' },
    { title: 'Quote', value: 'blockquote' },
  ],
  lists: [
    { title: 'Bullet list', value: 'bullet' },
    { title: 'Numbered list', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      defineField({
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'Web address (URL)',
            type: 'url',
            description: 'Where the link should go, e.g. https://gihtourtravel.com',
            validation: (Rule) =>
              Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
          }),
        ],
      }),
    ],
  },
})

/** Image field with hotspot + required alt text (accessibility). */
export function imageField(name: string, title: string, description: string, required = true) {
  return defineField({
    name,
    title,
    type: 'image',
    description: `${description} Always fill in "Alt text" for accessibility.`,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the photo for visitors using screen readers (e.g. "Tiger’s Nest Monastery on a forested cliff").',
        validation: (Rule) => Rule.required(),
      }),
    ],
    validation: required ? (Rule) => Rule.required() : undefined,
  })
}
