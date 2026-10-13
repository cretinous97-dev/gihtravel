import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * POST /api/revalidate — Sanity webhook target for on-demand ISR.
 *
 * Setup (see README): create a Sanity webhook on the `production` dataset
 * pointing at https://<your-domain>/api/revalidate with the header
 * `x-webhook-secret: <SANITY_REVALIDATE_SECRET>`.
 *
 * The webhook body is a Sanity mutation payload; we map the document `_type`
 * to revalidate the affected paths/tags. Anything unknown revalidates the
 * whole catalogue (safe default).
 */

const TYPE_TO_PATHS: Record<string, string[]> = {
  tour: ['/tours', '/'],
  destination: ['/destinations', '/'],
  testimonial: ['/'],
  homePage: ['/'],
  aboutPage: ['/about'],
  aboutBhutanPage: ['/about-bhutan'],
  contactPage: ['/contact'],
  siteSettings: ['/'],
  legalPage: ['/privacy-policy', '/terms'],
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    console.warn('[revalidate] SANITY_REVALIDATE_SECRET is not set — rejecting webhook.')
    return NextResponse.json({ ok: false, message: 'Revalidation is not configured.' }, { status: 503 })
  }

  const provided = request.headers.get('x-webhook-secret')
  if (provided !== secret) {
    return NextResponse.json({ ok: false, message: 'Invalid secret.' }, { status: 401 })
  }

  let payload: { _type?: string; slug?: { current?: string } } = {}
  try {
    payload = await request.json()
  } catch {
    // Empty body is fine — revalidate everything below.
  }

  const type = payload._type
  const slug = payload.slug?.current

  if (type && TYPE_TO_PATHS[type]) {
    for (const path of TYPE_TO_PATHS[type]) {
      revalidatePath(path)
    }
    // Also revalidate the detail page when we know the slug.
    if (slug && (type === 'tour' || type === 'destination')) {
      revalidatePath(`/${type === 'tour' ? 'tours' : 'destinations'}/${slug}`)
    }
  } else {
    revalidatePath('/')
    revalidatePath('/tours')
    revalidatePath('/destinations')
  }

  revalidateTag('tour')
  revalidateTag('destination')
  revalidateTag('testimonial')
  revalidateTag('homePage')
  revalidateTag('aboutPage')
  revalidateTag('aboutBhutanPage')
  revalidateTag('contactPage')
  revalidateTag('siteSettings')
  revalidateTag('legalPage')

  return NextResponse.json({ ok: true, revalidated: true, type: type ?? 'all', timestamp: Date.now() })
}
