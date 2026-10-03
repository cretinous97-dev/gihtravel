import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type AdminRouteProps = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const normalizeParams = async (params: AdminRouteProps['params']) => ({ segments: (await params).segments ?? [] })
const normalizeSearchParams = async (searchParams: AdminRouteProps['searchParams']) => {
  const entries = Object.entries(await searchParams).filter((entry): entry is [string, string | string[]] => entry[1] !== undefined)
  return Object.fromEntries(entries)
}

export const generateMetadata = async ({ params, searchParams }: AdminRouteProps): Promise<Metadata> =>
  generatePageMetadata({ config, params: normalizeParams(params), searchParams: normalizeSearchParams(searchParams) })

export default function AdminPage({ params, searchParams }: AdminRouteProps) {
  return RootPage({ config, importMap, params: normalizeParams(params), searchParams: normalizeSearchParams(searchParams) })
}
