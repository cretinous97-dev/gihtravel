import { Suspense } from 'react'
import { Container } from '@/components/ui'
import { CheckoutReturn } from '@/components/checkout-return'

export const metadata = { title: 'Booking payment | GIH Tour and Travel' }

export default function BookingSuccessPage() {
  return <Container><Suspense fallback={<div className="checkout-return"><h1>Checking your payment…</h1></div>}><CheckoutReturn /></Suspense></Container>
}
