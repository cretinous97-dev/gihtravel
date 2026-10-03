import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.e2b.app'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'gihtourtravel.com', pathname: '/wp-content/**' },
      { protocol: 'https', hostname: '**.vercel-storage.com', pathname: '/**' },
    ],
  },
}

export default withPayload(nextConfig)
