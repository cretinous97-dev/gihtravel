import type { ReactNode } from 'react'
import { SiteFooter, SiteHeader } from '@/components/site-shell'

export const dynamic = 'force-dynamic'

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
