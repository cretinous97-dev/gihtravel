import { defineArrayMember, defineField, defineType } from 'sanity'
import { portableTextMember, seoField } from './shared'

/** Singleton: aboutPage — the company story, mission, vision and team. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'foundingStory', title: 'Founding story', type: 'array', description: 'How GIH began — our story in the founders’ words.', of: [portableTextMember] }),
    defineField({ name: 'mission', title: 'Mission', type: 'array', description: 'What we exist to do.', of: [portableTextMember] }),
    defineField({ name: 'vision', title: 'Vision', type: 'array', description: 'What we are working towards.', of: [portableTextMember] }),
    defineField({
      name: 'teamMembers',
      title: 'Team members',
      type: 'array',
      description: 'The people behind the journeys. Add a card per person.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g. "Founder & Lead Guide".', validation: (Rule) => Rule.required() }),
            defineField({ name: 'bio', title: 'Short bio', type: 'text', rows: 3 }),
            defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })] }),
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        }),
      ],
    }),
    defineField({ name: 'sustainabilityCommitment', title: 'Sustainability commitment', type: 'array', description: 'How we care for Bhutan’s culture and environment.', of: [portableTextMember] }),
    seoField,
  ],
})
