import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import type { StructureBuilder } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

/**
 * Sanity Studio configuration — mounted in the Next.js app at /studio.
 *
 * Singletons (Home Page, About Bhutan Page, About Page, Contact Page,
 * Site Settings) are pinned as individual desk items: editors can open and
 * edit them, but can never create duplicates or delete them.
 */

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set([
  'homePage',
  'aboutBhutanPage',
  'aboutPage',
  'contactPage',
  'siteSettings',
])

function singletonListItem(S: StructureBuilder, typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export default defineConfig({
  name: 'gih-tour-travel',
  title: 'GIH Tour and Travel',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Tours')
              .child(S.documentTypeList('tour').title('Tours')),
            S.listItem()
              .title('Destinations')
              .child(S.documentTypeList('destination').title('Destinations')),
            S.listItem()
              .title('Testimonials')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
            S.divider(),
            singletonListItem(S, 'homePage', 'Home Page'),
            singletonListItem(S, 'aboutBhutanPage', 'About Bhutan Page'),
            singletonListItem(S, 'aboutPage', 'About Page'),
            singletonListItem(S, 'contactPage', 'Contact Page'),
            singletonListItem(S, 'siteSettings', 'Site Settings'),
            S.divider(),
            S.listItem()
              .title('Legal Pages')
              .child(S.documentTypeList('legalPage').title('Legal Pages')),
            S.listItem()
              .title('Inquiries')
              .child(S.documentTypeList('inquiry').title('Inquiries')),
          ]),
    }),
    visionTool({ defaultApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01' }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Prevent singletons from being created, duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
