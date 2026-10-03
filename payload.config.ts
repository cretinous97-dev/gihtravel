import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { collections } from './src/collections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
let siteOrigin: string | undefined
if (configuredSiteUrl) {
  const parsedSiteUrl = new URL(configuredSiteUrl)
  if (!['http:', 'https:'].includes(parsedSiteUrl.protocol) || !parsedSiteUrl.hostname || parsedSiteUrl.username || parsedSiteUrl.password) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid absolute HTTP or HTTPS URL.')
  }
  siteOrigin = parsedSiteUrl.origin
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: siteOrigin,
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | GIH Tour and Travel',
      icons: [{ rel: 'icon', url: '/favicon.svg' }],
    },
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: path.resolve(dirname, 'src/migrations'),
  }),
  editor: lexicalEditor(),
  sharp,
  email: resendAdapter({
    defaultFromAddress: 'gihbucketlist@gmail.com',
    defaultFromName: 'GIH Tour and Travel',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  collections,
  cors: siteOrigin ? [siteOrigin] : [],
  csrf: siteOrigin ? [siteOrigin] : [],
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: { media: true },
          token: blobToken,
        }),
      ]
    : [],
})
