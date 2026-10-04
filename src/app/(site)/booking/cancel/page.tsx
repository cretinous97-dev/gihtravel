import Link from 'next/link'
import { Container } from '@/components/ui'

export const metadata = { title: 'Checkout not completed | GIH Tour and Travel' }

export default async function BookingCancelPage({ searchParams }: { searchParams: Promise<{ package?: string | string[] }> }) {
  const params = await searchParams
  const selected = Array.isArray(params.package) ? params.package[0] : params.package
  return <Container><section className="checkout-return"><p className="eyebrow">GIH Tour and Travel</p><h1>No payment was taken.</h1><p>You left secure checkout before finishing. Your trip request is still available, and you can return when you’re ready.</p><Link href={selected ? `/booking?package=${encodeURIComponent(selected)}` : '/packages'} className="button button-primary">Return to your trip</Link></section></Container>
}
