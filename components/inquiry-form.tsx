'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, type InquiryInput, type InquiryResponse } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * InquiryForm — the site-wide enquiry form.
 * Client validation via Zod + React Hook Form; the API route re-validates.
 * A hidden honeypot field catches naive spam bots. On success we replace the
 * form with a warm, on-brand confirmation (no cold error screens).
 *
 * `tourSlug` / `tourTitle` pre-fill the form when opened from a tour page.
 */

const inputClass =
  'w-full rounded-xl border border-cream-200 bg-white px-4 py-3 text-body text-charcoal placeholder:text-charcoal-muted/70 focus:border-ochre-400 focus:outline-none focus:ring-2 focus:ring-ochre-200'

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-terracotta-400">
      {message}
    </p>
  )
}

export function InquiryForm({ tourSlug, tourTitle, compact = false }: { tourSlug?: string; tourTitle?: string; compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      subject: tourTitle ? `Enquiry about ${tourTitle}` : '',
      message: '',
      tourSlug: tourSlug ?? '',
      travelDate: '',
      groupSize: undefined,
      website: '',
    },
  })

  async function onSubmit(values: InquiryInput) {
    setServerError(null)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = (await res.json()) as InquiryResponse
      if (data.ok) {
        setSubmitted(true)
      } else {
        setServerError(data.message)
      }
    } catch {
      setServerError('Something went wrong sending your message. Please try again, or email gihbucketlist@gmail.com.')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sage-200 bg-sage-100 p-10 text-center" role="status">
        <div aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-ochre-500 shadow-soft">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m4 12.5 5 5L20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 font-serif text-heading-3 text-charcoal">Thank you — your journey starts here!</h3>
        <p className="mx-auto mt-3 max-w-measure text-body text-charcoal-soft">
          We have received your enquiry and one of our Bhutan travel specialists will reply within 24–48 hours. A
          confirmation is on its way to your inbox.
        </p>
        <p className="mt-4 text-body-sm text-charcoal-muted">
          Need us sooner? Call <a className="font-medium text-ochre-500 underline-offset-2 hover:underline" href="tel:+97517901780">+975 17901780</a> or
          email <a className="font-medium text-ochre-500 underline-offset-2 hover:underline" href="mailto:gihbucketlist@gmail.com">gihbucketlist@gmail.com</a>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn('rounded-2xl border border-cream-200 bg-white p-6 shadow-soft sm:p-8')}
    >
      {/* Honeypot — hidden from real visitors; bots fill it and are dropped. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className={cn('grid gap-5', compact ? '' : 'sm:grid-cols-2')}>
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-charcoal">
            Full name <span aria-hidden="true" className="text-terracotta-400">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby="fullName-error"
            className={inputClass}
            {...register('fullName')}
          />
          <FieldError id="fullName-error" message={errors.fullName?.message as string} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
            Email <span aria-hidden="true" className="text-terracotta-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-error"
            className={inputClass}
            {...register('email')}
          />
          <FieldError id="email-error" message={errors.email?.message as string} />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal">
            Phone <span className="text-charcoal-muted">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+975 …"
            aria-describedby="phone-error"
            className={inputClass}
            {...register('phone')}
          />
          <FieldError id="phone-error" message={errors.phone?.message as string} />
        </div>

        <div>
          <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-charcoal">
            Country <span className="text-charcoal-muted">(optional)</span>
          </label>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            placeholder="Where you travel from"
            aria-describedby="country-error"
            className={inputClass}
            {...register('country')}
          />
          <FieldError id="country-error" message={errors.country?.message as string} />
        </div>

        {!compact ? (
          <>
            <div>
              <label htmlFor="travelDate" className="mb-1.5 block text-sm font-medium text-charcoal">
                Preferred travel date <span className="text-charcoal-muted">(optional)</span>
              </label>
              <input id="travelDate" type="date" aria-describedby="travelDate-error" className={inputClass} {...register('travelDate')} />
              <FieldError id="travelDate-error" message={errors.travelDate?.message as string} />
            </div>

            <div>
              <label htmlFor="groupSize" className="mb-1.5 block text-sm font-medium text-charcoal">
                Group size <span className="text-charcoal-muted">(optional)</span>
              </label>
              <input
                id="groupSize"
                type="number"
                min={1}
                max={100}
                placeholder="How many travellers?"
                aria-describedby="groupSize-error"
                className={inputClass}
                {...register('groupSize')}
              />
              <FieldError id="groupSize-error" message={errors.groupSize?.message as string} />
            </div>
          </>
        ) : null}

        <div className={compact ? '' : 'sm:col-span-2'}>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-charcoal">
            Subject <span className="text-charcoal-muted">(optional)</span>
          </label>
          <input
            id="subject"
            type="text"
            placeholder={tourTitle ? `Enquiry about ${tourTitle}` : 'What can we help with?'}
            aria-describedby="subject-error"
            className={inputClass}
            {...register('subject')}
          />
          <FieldError id="subject-error" message={errors.subject?.message as string} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
            Message <span aria-hidden="true" className="text-terracotta-400">*</span>
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Tell us about the journey you have in mind — dates, interests, questions…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby="message-error"
            className={cn(inputClass, 'resize-y')}
            {...register('message')}
          />
          <FieldError id="message-error" message={errors.message?.message as string} />
        </div>
      </div>

      {serverError ? (
        <p role="alert" className="mt-4 rounded-xl bg-terracotta-100 px-4 py-3 text-sm text-terracotta-500">
          {serverError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send enquiry'}
        </Button>
        <p className="text-xs text-charcoal-muted">
          By contacting us, you agree to our{' '}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-ochre-500">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  )
}
