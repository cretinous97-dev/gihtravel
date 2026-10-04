import path from 'node:path'
import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { adminFieldOnly, adminOnly, firstAdminOrAdmin, ownBookingsOrStaff, ownCustomerOrStaff, publicOrStaffPublished, staffOnly, userIsStaff } from '../access'

const versioned = { drafts: true as const }
const staffRoles = ['admin', 'editor']

const setStaffRoleDefaults: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const safeData = data ?? {}
  if (!req.user) {
    const existingUsers = await req.payload.find({ collection: 'users', limit: 1, depth: 0, overrideAccess: true })
    if (existingUsers.docs.length === 0) return { ...safeData, roles: ['admin'] }
    return data
  }
  if (!Array.isArray(safeData.roles) || safeData.roles.length === 0) return { ...safeData, roles: ['editor'] }
  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'Administration' },
  access: {
    admin: ({ req }) => userIsStaff(req.user),
    create: firstAdminOrAdmin,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: { beforeValidate: [setStaffRoleDefaults] },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      options: staffRoles.map((value) => ({ label: value === 'admin' ? 'Administrator' : 'Editor', value })),
    },
    { name: 'displayName', type: 'text' },
  ],
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token ?? ''
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
        const resetUrl = `${siteUrl}/reset-password?token=${encodeURIComponent(token)}`
        return `<p>Use the secure link below to choose a new GIH Tour and Travel account password.</p><p><a href="${resetUrl}">Set a new password</a></p><p>If you did not request this, you can ignore this email.</p>`
      },
    },
  },
  admin: { useAsTitle: 'email', group: 'Bookings' },
  access: {
    admin: ({ req }) => userIsStaff(req.user),
    create: () => true,
    read: ownCustomerOrStaff,
    update: ownCustomerOrStaff,
    delete: adminOnly,
  },
  fields: [
    { name: 'fullName', type: 'text', required: true, label: 'Full name' },
    { name: 'phone', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'marketingConsent', type: 'checkbox', defaultValue: false },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 960, height: 720, position: 'centre' },
      { name: 'thumb', width: 480, height: 360, position: 'centre' },
    ],
  },
  admin: { useAsTitle: 'alt', group: 'Content' },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Alternative text' },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
  ],
}

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug', '_status'], group: 'Travel content' },
  access: {
    read: publicOrStaffPublished,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  versions: versioned,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'heroImage', type: 'relationship', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'sourceUrl', type: 'text', admin: { description: 'Original GIH page used for the imported copy.' } },
    { name: 'sourcePageFound', type: 'checkbox', defaultValue: true, label: 'Destination page found on the previous site' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
    { name: 'publishedAt', type: 'date' },
    { name: 'content', type: 'richText', label: 'Additional destination content' },
  ],
}

export const Itineraries: CollectionConfig = {
  slug: 'itineraries',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'day', 'package'], group: 'Travel content' },
  access: {
    read: publicOrStaffPublished,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  versions: versioned,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'day', type: 'number', required: true, min: 1 },
    { name: 'package', type: 'relationship', relationTo: 'packages', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'image', type: 'relationship', relationTo: 'media' },
    { name: 'publishedAt', type: 'date' },
  ],
}

export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'durationLabel', 'priceUsd', '_status'], group: 'Travel content' },
  access: {
    read: publicOrStaffPublished,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  versions: versioned,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'sourceTitle', type: 'text' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'durationDays', type: 'number', required: true, min: 1 },
    { name: 'durationLabel', type: 'text', required: true },
    { name: 'priceUsd', type: 'number', min: 0, access: { create: adminFieldOnly, update: adminFieldOnly }, admin: { description: 'Listing price imported from the previous site, in USD. Confirm the price basis before live payments.' } },
    { name: 'pricePerPerson', type: 'checkbox', defaultValue: false, access: { create: adminFieldOnly, update: adminFieldOnly }, label: 'Price is confirmed per traveler', admin: { description: 'Only enable after confirming the current price basis and amount with GIH. Checkout remains disabled until this is checked.' } },
    { name: 'priceBasisNote', type: 'text' },
    { name: 'groupRates', type: 'array', access: { create: adminFieldOnly, update: adminFieldOnly }, fields: [
      { name: 'minimumTravelers', type: 'number', required: true, min: 1 },
      { name: 'maximumTravelers', type: 'number', min: 1 },
      { name: 'priceUsd', type: 'number', required: true, min: 0, access: { create: adminFieldOnly, update: adminFieldOnly } },
      { name: 'notes', type: 'text' },
    ] },
    { name: 'destinations', type: 'relationship', relationTo: 'destinations', hasMany: true },
    { name: 'tripTypes', type: 'array', fields: [{ name: 'name', type: 'text', required: true }] },
    { name: 'highlights', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'itinerary', type: 'relationship', relationTo: 'itineraries', hasMany: true },
    { name: 'inclusions', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'exclusions', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'optionalAddOns', type: 'array', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'priceUsd', type: 'number', min: 0, access: { create: adminFieldOnly, update: adminFieldOnly }, admin: { description: 'Leave blank until the price is confirmed.' } },
    ] },
    { name: 'targetGuest', type: 'text' },
    { name: 'difficulty', type: 'text' },
    { name: 'bestSeason', type: 'text' },
    { name: 'notes', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
    { name: 'featuredImage', type: 'relationship', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'sourceImages', type: 'array', fields: [{ name: 'url', type: 'text', required: true }] },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedAt', type: 'date' },
    { name: 'content', type: 'richText', label: 'Additional package content' },
  ],
}

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt', '_status'], group: 'Editorial' },
  access: {
    read: publicOrStaffPublished,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  versions: versioned,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'body', type: 'richText', required: true },
    { name: 'featuredImage', type: 'relationship', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'author', type: 'text' },
    { name: 'publishedAt', type: 'date' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'], group: 'Editorial' },
  access: {
    read: publicOrStaffPublished,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  versions: versioned,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    { name: 'bodyText', type: 'textarea', admin: { description: 'Imported page copy, kept as text for a faithful first import.' } },
    { name: 'body', type: 'richText', label: 'Rich text content' },
    { name: 'heroImage', type: 'relationship', relationTo: 'media' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'sortOrder'], group: 'Editorial' },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'sourceUrl', type: 'text' },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'country', 'sortOrder'], group: 'Editorial' },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'country', type: 'text' },
    { name: 'image', type: 'relationship', relationTo: 'media' },
    { name: 'sourceImageUrl', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'sourceUrl', type: 'text' },
  ],
}

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'sortOrder'], group: 'Company' },
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'relationship', relationTo: 'media' },
    { name: 'sourcePhotoUrl', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'legalName'], group: 'Company' },
  access: {
    read: () => true,
    create: adminOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'legalName', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'phoneLink', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'logo', type: 'relationship', relationTo: 'media' },
    { name: 'logoPath', type: 'text', defaultValue: '/logo.png', admin: { description: 'The owner supplied logo is expected at /public/logo.png. Upload it to Media or replace this reference.' } },
    { name: 'heroImage', type: 'relationship', relationTo: 'media' },
    { name: 'heroImagePath', type: 'text' },
    { name: 'heroHeadline', type: 'text' },
    { name: 'heroSubheadline', type: 'text' },
    { name: 'introductionHeading', type: 'text' },
    { name: 'introduction', type: 'textarea' },
    { name: 'whyHeading', type: 'text' },
    { name: 'whyText', type: 'textarea' },
    { name: 'footerText', type: 'text' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'url', type: 'text', required: true },
    ] },
  ],
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: { useAsTitle: 'bookingReference', defaultColumns: ['bookingReference', 'guestName', 'packageTitle', 'status', 'createdAt'], group: 'Bookings' },
  access: {
    read: ownBookingsOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'bookingReference', type: 'text', required: true, unique: true },
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    { name: 'package', type: 'relationship', relationTo: 'packages' },
    { name: 'packageTitle', type: 'text', required: true },
    { name: 'packageSlug', type: 'text', required: true },
    { name: 'guestName', type: 'text', required: true },
    { name: 'guestEmail', type: 'email', required: true },
    { name: 'guestPhone', type: 'text' },
    { name: 'travelDate', type: 'date', required: true },
    { name: 'travelers', type: 'number', required: true, min: 1 },
    { name: 'addOns', type: 'array', fields: [{ name: 'name', type: 'text', required: true }, { name: 'priceUsd', type: 'number', required: true }] },
    { name: 'totalUsd', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending_payment', options: [
      { label: 'Pending payment', value: 'pending_payment' },
      { label: 'Paid', value: 'paid' },
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Cancelled', value: 'cancelled' },
      { label: 'Refunded', value: 'refunded' },
    ] },
    { name: 'stripeSessionId', type: 'text' },
    { name: 'stripePaymentIntentId', type: 'text' },
    { name: 'specialRequests', type: 'textarea' },
  ],
}

export const StripeEvents: CollectionConfig = {
  slug: 'stripe-events',
  admin: { useAsTitle: 'stripeEventId', defaultColumns: ['stripeEventId', 'eventType', 'status', 'createdAt'], group: 'Administration' },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'stripeEventId', type: 'text', required: true, unique: true, index: true },
    { name: 'eventType', type: 'text', required: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'processing', options: [
      { label: 'Processing', value: 'processing' },
      { label: 'Processed', value: 'processed' },
      { label: 'Failed', value: 'failed' },
    ] },
    { name: 'error', type: 'textarea' },
  ],
}

export const collections: CollectionConfig[] = [
  Users,
  Customers,
  Media,
  Packages,
  Itineraries,
  Destinations,
  BlogPosts,
  Pages,
  FAQs,
  Testimonials,
  TeamMembers,
  SiteSettings,
  Bookings,
  StripeEvents,
]
