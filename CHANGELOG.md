# Changelog

All notable changes to the GIH Tour and Travel website are documented here.

## [1.0.0] — 2026-10-13

### Added

- **Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS** website
  for GIH Tour and Travel, branded around the "Expand Your Comfort Zone"
  identity with the Bhutanese-inspired design system (ochre, Himalayan blue,
  terracotta, sage, warm off-white; Playfair Display + Inter).
- **Sanity v3 CMS** embedded at `/studio` with a non-technical editor
  experience: plain-English field descriptions, grouped fieldsets, and a
  singleton desk structure (Home Page, About Bhutan Page, About Page,
  Contact Page, Site Settings) that cannot be duplicated or deleted.
- Content model: `tour` (itinerary, inclusions/exclusions, pricing,
  difficulty, activity type, seasons, SEO), `destination`, `testimonial`,
  `inquiry`, `legalPage`.
- Public pages: Home, Tours listing (URL-shareable filters, sorting,
  pagination), Tour detail (day-by-day accordion, gallery lightbox,
  pre-filled enquiry CTA), Destinations, Destination detail, About,
  About Bhutan (GNH pillars, geography, seasons, culture), Contact,
  Privacy Policy, Terms — plus custom 404 and error pages.
- Enquiry pipeline: Zod + React Hook Form with inline errors, honeypot
  spam trap, per-IP rate limiting, server-side re-validation, Sanity
  persistence, Gmail SMTP notification + traveller auto-acknowledgement
  (email failures are logged, never surfaced; the inquiry is always saved).
- SEO: Next.js Metadata API on every route, JSON-LD (TravelAgency,
  TouristTrip, TouristAttraction, BreadcrumbList), dynamic `sitemap.xml` and
  `robots.txt`, canonical URLs.
- Accessibility: semantic landmarks, skip link, visible focus states,
  keyboard-navigable filters/accordion/gallery/carousel, ARIA labels,
  `prefers-reduced-motion` support.
- Resilient data layer: serves real bundled fallback content when Sanity is
  unconfigured or unreachable; ISR (60s) plus on-demand revalidation via
  Sanity webhook (`/api/revalidate`).
- Idempotent seed script (`npm run seed`) that populates Sanity with the
  complete, verbatim content extracted from the previous
  https://gihtourtravel.com website (13 tours, 8 destinations, 9 real
  testimonials, page singletons, legal pages) and uploads imagery into the
  Sanity asset store.
- Jest + React Testing Library suites for the inquiry form, tour
  filter/sort/pagination logic, Sanity fail-soft behaviour and rate limiter.
- Owner documentation in README, including
  "MANUAL SETUP — YOUR PART (DO THIS AFTER THE BUILD)" (Sanity, Vercel,
  Gmail App Password, webhooks) and a detailed "CONTENT TO REPLACE" list.
