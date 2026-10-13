import { defineField, defineType } from 'sanity'
import { portableTextMember } from './shared'

/**
 * Document: inquiry — a message from the contact/enquiry form.
 * Created automatically by /api/inquiry. Admins triage with the status field.
 */
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  fieldsets: [
    { name: 'traveller', title: 'Traveller details', options: { columns: 2 } },
    { name: 'trip', title: 'Trip details', options: { columns: 2 } },
    { name: 'admin', title: 'Internal (not seen by traveller)' },
  ],
  fields: [
    defineField({ name: 'fullName', title: 'Full name', type: 'string', fieldset: 'traveller', validation: (Rule) => Rule.required() }),
    defineField({ name: 'email', title: 'Email', type: 'email', fieldset: 'traveller', validation: (Rule) => Rule.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', fieldset: 'traveller' }),
    defineField({ name: 'country', title: 'Country', type: 'string', fieldset: 'traveller' }),
    defineField({ name: 'subject', title: 'Subject', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'tour',
      title: 'Tour of interest',
      type: 'reference',
      fieldset: 'trip',
      description: 'Filled automatically when the enquiry comes from a tour page.',
      to: [{ type: 'tour' }],
    }),
    defineField({ name: 'travelDate', title: 'Preferred travel date', type: 'date', fieldset: 'trip' }),
    defineField({ name: 'groupSize', title: 'Group size', type: 'number', fieldset: 'trip', validation: (Rule) => Rule.min(1).max(100) }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'admin',
      description: 'Move this along as you reply: New → In Progress → Closed.',
      options: {
        list: [
          { title: 'New', value: 'New' },
          { title: 'In Progress', value: 'In Progress' },
          { title: 'Closed', value: 'Closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'New',
    }),
    defineField({
      name: 'notes',
      title: 'Internal notes',
      type: 'array',
      fieldset: 'admin',
      description: 'Your private notes about this enquiry. The traveller never sees these.',
      of: [portableTextMember],
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      fieldset: 'admin',
      description: 'Set automatically when the form was sent.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'subject', media: 'photo' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Inquiry', subtitle: subtitle ?? '' }
    },
  },
})
