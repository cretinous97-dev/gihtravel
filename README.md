# GIH Tour and Travel — Website

**Gross International Happiness Tour & Travel** (branded **GIH Tour and Travel**) —
a production-ready marketing + enquiry website for a Bhutan travel agency,
built with **Next.js (App Router) + TypeScript + Tailwind CSS**, managed through
**Sanity CMS** (embedded Studio at `/studio`), with **Gmail SMTP** enquiry
notifications, and deployed on **Vercel Hobby (free tier)**.

> Tagline: **Expand Your Comfort Zone** · Based in **Paro, Bhutan** ·
> Currency **USD** · Language **English**

---

## Contents

- [What this site includes](#what-this-site-includes)
- [Quick start (local)](#quick-start-local)
- [Project structure](#project-structure)
- [Content model (Sanity)](#content-model-sanity)
- [Where the seed content came from](#where-the-seed-content-came-from)
- [CONTENT TO REPLACE](#content-to-replace)
- [MANUAL SETUP — YOUR PART (DO THIS AFTER THE BUILD)](#manual-setup--your-part-do-this-after-the-build)
- [Editing content in Sanity Studio](#editing-content-in-sanity-studio)
- [Commands reference](#commands-reference)
- [Tests](#tests)
- [Design system](#design-system)
- [Technical notes](#technical-notes)
- [Troubleshooting](#troubleshooting)

---

## What this site includes

| Route | What it shows |
| --- | --- |
| `/` | Hero, welcome story, featured tours, popular destinations, "Why Bhutan? Why GIH?", trust points, testimonials carousel, CTA band |
| `/tours` | Filterable tour listing — filters (destination, activity, difficulty, duration, season) live in the **URL query string** so results are shareable; sortable by price & duration; numbered pagination |
| `/tours/[slug]` | Tour detail — hero, overview, day-by-day itinerary accordion, inclusions/exclusions, pricing sidebar, gallery with lightbox, related tours, pre-filled enquiry form |
| `/destinations` | Destination grid |
| `/destinations/[slug]` | Destination detail + tours that visit it |
| `/about` | Company story, mission, vision, team, sustainability |
| `/about-bhutan` | GNH philosophy, four pillars, geography, seasons, cultural insights, "Why Bhutan? Why GIH?" |
| `/contact` | Enquiry form (Zod + React Hook Form), contact details, optional map embed |
| `/privacy-policy`, `/terms` | Rendered from CMS `legalPage` documents |
| `/studio` | **Sanity Studio** — the non-technical admin CMS |
| `/api/inquiry` | Form endpoint — validates, rate-limits, saves to Sanity, emails via Gmail SMTP |
| `/api/revalidate` | Sanity webhook target for on-demand revalidation |
| `/sitemap.xml`, `/robots.txt` | Generated dynamically |

**Always-on:** header with logo + "Plan Your Trip" CTA, footer with contact
details / quick links / socials, sticky mobile CTA, skip link, WCAG 2.1 AA
focus states, JSON-LD (`TravelAgency`, `TouristTrip`, `TouristAttraction`,
`BreadcrumbList`), `prefers-reduced-motion` respected.

---

## Quick start (local)

The site runs **immediately with zero configuration** — before Sanity exists,
it serves the real seed content as a bundled fallback so you can see every
page fully rendered.

```bash
npm install
npm run dev          # http://localhost:3000
```

When you are ready to connect the CMS, copy `.env.example` → `.env.local`,
fill in the values (see [MANUAL SETUP](#manual-setup--your-part-do-this-after-the-build)),
and run `npm run seed`. From that moment the site reads live content from
Sanity; if Sanity is ever unreachable, it falls back gracefully instead of
crashing.

---

## Project structure

```
app/
  (site)/                 # Public pages (home, tours, destinations, about…)
  studio/[[...tool]]/     # Embedded Sanity Studio
  api/inquiry/            # Enquiry form endpoint
  api/revalidate/         # Sanity webhook → on-demand ISR
  layout.tsx, sitemap.ts, robots.ts, not-found.tsx, error.tsx
components/               # Button, Card, Section, Accordion, FilterBar,
                          # InquiryForm, TourCard, Gallery, RichText, SEO…
sanity/
  schemas/                # Content types (tour, destination, …)
  lib/                    # Client, GROQ queries, seed content + documents
  sanity.config.ts        # Studio config (singleton desk structure)
lib/                      # Types, Zod validation, filters, mailer, rate-limit
scripts/seed.ts           # Idempotent Sanity seed (real content + images)
public/                   # logo.png, favicon, curated photography
__tests__/                # Jest + Testing Library suites
```

---

## Content model (Sanity)

**Documents:** `tour` · `destination` · `testimonial` · `inquiry` · `legalPage`

**Singletons** (one copy each, pinned in the Studio sidebar):
`homePage` · `aboutBhutanPage` · `aboutPage` · `contactPage` · `siteSettings`

Every field in the Studio has a plain-English description, so a
non-technical editor knows exactly what to type. See
`sanity/schemas/` for the full field list.

---

## Where the seed content came from

All seed content is extracted **word-for-word** from the live site
**https://gihtourtravel.com** (the source of truth for tours, destinations,
testimonials, About Bhutan, About, contact details and legal copy). The raw
extraction is preserved in `sanity/lib/seed-content/` and mapped into CMS
documents by `sanity/lib/seed-docs.ts`. Nothing was paraphrased and **no
testimonial, tour or fact about Bhutan was invented**.

Real photos from the old site are referenced as fallback image URLs and are
uploaded into your Sanity asset library by `npm run seed`; curated local
photography in `public/images/` covers tours/destinations where the old site
had no usable image.

---

## CONTENT TO REPLACE

Items the old site never published. Each one is left empty or clearly
derived, and must be filled in via Sanity Studio after launch.

### Tours (/tours) — <https://gihtourtravel.com/trip-types/>

| Item | Tours affected | Notes |
| --- | --- | --- |
| **Price (USD)** | *Bhutan Adventure Quest*, *Hidden Kingdom Heritage Trail* | No price is shown on the old site for these two. In Studio → Tour → "Price from (USD)". All other tours show the real old-site price. |
| **Group size (min/max)** | All 13 tours | Never published on the old site. Studio → Tour → "Minimum/Maximum group size". |
| **Best seasons** | *Bhutan Adventure Quest*, *GenZ Bhutan Adventure Package*, *Royal Bhutan Experience*, *VIP Bhutan Experience*, *Friendly Package*, *Elder Bliss*, *Honeymoon in the Clouds*, *Happy Himalayas Anniversary* | The old site only states seasons for the Festival, Offbeat (crane season) and Pilgrimage tours — those were mapped to Spring/Autumn, Winter, and year-round respectively. Fill in "Best seasons" for the rest. |
| **Difficulty** | *Bhutan Adventure Quest*, *Hidden Kingdom Heritage Trail*, *Royal/VIP Experiences*, *Friendly Package*, *Bhutan Luxury & Festival Experience*, *Bhutan Offbeat Explorer*, *Honeymoon in the Clouds*, *Happy Himalayas Anniversary* | Only three tours published a difficulty. Others show no badge until you choose Easy/Moderate/Challenging in Studio. |
| **Per-day meals & accommodation** | All tours | The full day descriptions are preserved verbatim (including any "Overnight: … / Meals: …" notes, which were auto-extracted into the dedicated fields where present). Fill the structured fields for the remaining days. |
| **Hero/gallery photos** | *GenZ Bhutan Adventure*, *Royal Bhutan Experience*, *VIP Bhutan Experience*, *Happy Himalayas Anniversary* | The old site had no trip photos for these; curated stand-in photography is used. Replace in Studio → Tour → "Hero image" / "Photo gallery". |
| **Druk Path trek & standalone Tiger's Nest trek packages** | — | The master brief listed these as desired tour types, but **no such packages exist on the old site**, so none were invented. If you offer them, create new Tours in Studio. |

### Testimonials — <https://gihtourtravel.com/> (home page)

- **Star ratings** — the old site shows none. Add 1–5 in Studio if the
  traveller gave one. All nine real quotes, names and countries are seeded
  as-is.
- **Related tour** — not stated on the old site; link each testimonial to a
  tour in Studio if known.

### About page — <https://gihtourtravel.com/about-us/>

- **Team members** — not listed on the old site. Studio → About Page →
  "Team members" (name, role, bio, photo).
- **Mission / Vision / Value** — the old site repeats one line for all three
  ("Providing best travel experince to anyone from any corner." — typos are
  in the source). Replace with your preferred wording in Studio → About Page.

### Contact page — <https://gihtourtravel.com/contact-us/>

- **Office hours** — never published. Studio → Contact Page → "Office hours".
- **Map embed URL** — not on the old site. Studio → Contact Page →
  "Map embed URL" (Google Maps → Share → Embed a map → copy the `src` URL).
- The old site lists only "Paro, Bhutan"; the owner-provided address is used.
  A more detailed address ("Tshendona, Lamgong gewog, Paro, Bhutan") appears
  in the Privacy Policy — update the Contact Page fields if you want it shown.

### Legal pages

- **Terms & Conditions** — full text is seeded from
  <https://gihtourtravel.com/terms-conditions-of-service/>. The old site does
  not display a "last updated" date for it — set "Last updated" in Studio.
- **Privacy Policy** — seeded verbatim (Last Updated 15/12/2025).

### Extra pages preserved but not routed

The old site also has **/visa/** (<https://gihtourtravel.com/visa/>) and
**/the-sdf/** (<https://gihtourtravel.com/the-sdf/>). Their full copy is
preserved in `sanity/lib/seed-content/pages.ts` (field: `preservedContentPages`
in `sanity/lib/seed-docs.ts`) but the master page list did not include routes
for them. If you want them live: create `legalPage` documents with slugs
`visa` / `the-sdf`, or ask for two new routes.

### Imagery

All images are replaceable in Studio. The seed uses real photos from the old
site where available (uploaded to your Sanity library by `npm run seed`) and
curated local photography otherwise. The header logo is `public/logo.png`
(the circular emblem); if that file is removed, the header automatically
falls back to a text wordmark.

---

## MANUAL SETUP — YOUR PART (DO THIS AFTER THE BUILD)

> Everything below is done by **you**, in a browser — no coding required.
> Budget about 60–90 minutes end to end. Each phase lists exactly what to
> click and where to find each value.

### Phase 1 — GitHub repository

1. Go to <https://github.com> and sign in (username: **cretinous97**).
2. The project files are ready in this working copy. If you were given a
   repository URL for this build (e.g. `cretinous97/gihtravel`), the code is
   already there. Otherwise create a new **private** repository named
   `gih-tour-travel` and upload the project (Add file → Upload files), or
   keep using the provided repository.
3. Confirm `public/logo.png` is present (your circular GIH logo). If it is
   missing, upload your `logo.png` into the `public/` folder.

### Phase 2 — Create your Sanity account

1. Go to <https://sanity.io> and click **Get started** — sign up with your
   Google account (ideally the `gihbucketlist@gmail.com` account).
2. The **Free plan** (Sanity Free) is enough: 20 seats, 2 datasets, 10,000
   documents, 1M CDN requests/month, 100GB bandwidth/assets. No credit card.

### Phase 3 — Create the Sanity project

1. After signup open the project manager: <https://www.sanity.io/manage>
2. Click **Create project** → name it **GIH Tour and Travel**.
3. Accept the default dataset name **production** (or rename to `production`).
4. Open the project → **API** → **Project details**. Copy:
   - **Project ID** (looks like `abc12345`)
   - **Dataset** (`production`)
5. Still under **API** → **Tokens** → **Add API token**:
   - Name: `gih-seed-and-inquiries`
   - Permissions: **Editor**
   - Copy the token now (it is shown only once). This becomes
     `SANITY_API_WRITE_TOKEN`.
6. On your computer: in the project folder, copy `.env.example` to
   `.env.local` and paste:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=paste-your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=paste-your-token
   ```

### Phase 4 — Seed the content

1. In a terminal, in the project folder:

   ```bash
   npm install
   npm run seed
   ```

2. The script uploads all tours, destinations, testimonials, pages and
   photos (it is safe to run twice — no duplicates). It prints a summary
   such as `Tours: 13 · Destinations: 8 · Testimonials: 9 …`.
3. Check <https://www.sanity.io/manage> → your project → **Vision** or open
   the Studio after Phase 6.

### Phase 5 — Sanity CORS origins & revalidation webhook

1. **CORS**: <https://www.sanity.io/manage> → project → **API** →
   **CORS origins** → **Add origin**:
   - `http://localhost:3000` (local development)
   - `https://gihtourtravel.vercel.app` (your Vercel URL — add it after
     Phase 6 if it does not exist yet)
   - Tick **Allow credentials** for each.
2. **Webhook (auto-refresh content on the site)**: project → **API** →
   **Webhooks** → **Create webhook**:
   - Name: `Vercel revalidation`
   - URL: `https://gihtourtravel.vercel.app/api/revalidate`
   - Trigger on: **Create**, **Update**, **Delete** (all document types)
   - Projection: leave empty
   - HTTP headers: add `x-webhook-secret` with a long random value you
     invent (e.g. a mix of letters and numbers, 20+ characters).
   - Set that same value as `SANITY_REVALIDATE_SECRET` in Vercel
     (Phase 6, step 6).

### Phase 6 — Deploy to Vercel

1. Go to <https://vercel.com> → **Sign up** → **Continue with GitHub**.
2. Click **Add New…** → **Project** → find `gih-tour-travel` (or
   `gihtravel`) → **Import**.
3. **Project Name**: `gihtourtravel` (this produces
   `gihtourtravel.vercel.app`). If the name is taken, use
   `gihtourtravel-bhutan` instead.
4. Under **Environment Variables**, add every variable from `.env.example`
   that you have values for now:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | your Sanity project ID |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `SANITY_API_WRITE_TOKEN` | your Sanity Editor token |
   | `SANITY_REVALIDATE_SECRET` | the same value as the webhook header |
   | `NEXT_PUBLIC_SITE_URL` | `https://gihtourtravel.vercel.app` (or your chosen domain) |

   (SMTP variables come in Phase 7 — you can add them now if you already
   have the App Password, or add them later and redeploy.)
5. Click **Deploy**. Wait 2–4 minutes; when it finishes, open
   `https://gihtourtravel.vercel.app` — the site should be live with all
   content.
6. If the domain name differs from the one in Phase 5, update:
   - the Sanity CORS origin (Phase 5.1),
   - the webhook URL (Phase 5.2),
   - `NEXT_PUBLIC_SITE_URL` in Vercel (Project → Settings → Environment
     Variables) and redeploy.

### Phase 7 — Gmail App Password (for enquiry emails)

> Enquiries are saved to Sanity even without this — email is the
> notification layer. Gmail requires a **16-character App Password** (your
> normal Gmail password will NOT work).

1. Sign in at <https://myaccount.google.com> as **gihbucketlist@gmail.com**.
2. **Security** → make sure **2-Step Verification** is ON (App Passwords
   only appear after this).
3. Still under Security, search for **App passwords** (or open
   <https://myaccount.google.com/apppasswords>).
4. Create one: app = **Mail**, device = **Other** → name it `GIH website` →
   **Generate**.
5. Google shows a **16-character password** with spaces — copy it.
6. In **Vercel** → Project → Settings → Environment Variables, add:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=gihbucketlist@gmail.com
   SMTP_PASS=paste-16-char-app-password
   SMTP_FROM="GIH Tour and Travel <gihbucketlist@gmail.com>"
   ```

7. **Redeploy** (Deployments → latest → ⋯ → Redeploy) so the variables take
   effect.
8. Test: open your live site → Contact → send a test enquiry. You should get
   an auto-reply at the address you used, and the notification at
   `gihbucketlist@gmail.com`. Also check Studio → **Inquiries** — the
   message must be there.

### Phase 8 — Post-launch checklist

- [ ] Home page shows your logo and hero headline "Expand Your Comfort Zone"
- [ ] `/studio` opens the CMS (log in with your Sanity account)
- [ ] Edit at least one Tour in Studio → Publish → within ~1 minute the
      public page updates (webhook) or within 60 seconds (ISR)
- [ ] Test enquiry form on mobile
- [ ] Fill in the [CONTENT TO REPLACE](#content-to-replace) items
- [ ] Set your own `NEXT_PUBLIC_SITE_URL` if you add a custom domain later
      (e.g. `gihtourtravel.com` — add the domain in Vercel → Settings →
      Domains, and repoint DNS at your registrar)

---

## Editing content in Sanity Studio

1. Go to `https://gihtourtravel.vercel.app/studio` (or `localhost:3000/studio`
   locally) and log in with your Sanity account.
2. The left sidebar groups everything: **Tours**, **Destinations**,
   **Testimonials**, the five **page singletons**, **Legal Pages** and
   **Inquiries**.
3. **Inquiries** is where every website enquiry lands (status: New →
   In Progress → Closed). Add internal notes per enquiry; travellers never
   see them.
4. Singletons cannot be duplicated or deleted — just open, edit, **Publish**.

---

## Commands reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server (binds 0.0.0.0) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run seed` | Populate Sanity (idempotent) |
| `npm test` | Jest + Testing Library suites |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm run zip` | Package the project (excludes node_modules, .git, secrets) |

---

## Tests

```bash
npm test
```

Covers: the enquiry form (validation, success, server errors, honeypot,
tour pre-fill), the tour filter/sort/pagination logic (URL round-trips), and
the Sanity client's fail-soft behaviour + inquiry rate limiting.

---

## Design system

- **Palette** — ochre `#D98E04` (primary), Himalayan blue `#1B3A5C`
  (secondary), terracotta `#C1502E` (accent), sage `#7C8B6F` (neutral),
  warm off-white `#FAF7F2`, charcoal `#22201C` text (never pure black).
- **Type** — headings **Playfair Display** (serif), body **Inter**
  (16–18px, comfortable measure). Tokens live in `tailwind.config.ts`.
- **Motion** — subtle fade/translate on scroll (Framer Motion), disabled
  automatically for `prefers-reduced-motion`.

---

## Technical notes

- **Fallback content** — `sanity/lib/content.ts` serves the bundled seed
  data whenever Sanity is unconfigured or unreachable, so the site never
  crashes and never shows an empty shell. Once the CMS is connected, live
  content takes over.
- **ISR** — public pages revalidate every 60s; Sanity webhooks additionally
  call `/api/revalidate` for instant updates.
- **Rate limiting** — `/api/inquiry` uses a per-instance in-memory sliding
  window (5 requests/minute/IP) plus a honeypot field and server-side Zod
  validation. If spam ever becomes an issue, swap `lib/rate-limit.ts` for a
  KV-backed implementation (the exported API is intentionally tiny).
- **Email failure policy** — the inquiry is always saved to Sanity first;
  email errors are logged and never shown to the traveller.
- **Images** — served unoptimized from their source CDN (old-site URLs and
  Sanity assets) which keeps builds hermetic and the free tier happy. To
  switch on Vercel's image optimisation, set `images.unoptimized: false` in
  `next.config.ts` (the `remotePatterns` are already configured).
- **Fonts** — loaded with a Google Fonts stylesheet link so builds work
  offline/CI. On Vercel you may switch to `next/font/google` for self-hosted
  performance.
- **Internationalisation** — not enabled, but all copy lives in CMS fields
  and `lib/types.ts`, so adding a locale layer later does not require a
  rewrite.
- **Security** — no secrets in the repo (`.env*` git-ignored), server-side
  re-validation of every input, honeypot + rate limiting on the form,
  `/studio` kept out of `robots.txt`.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `npm run seed` says "Sanity is not configured" | `.env.local` is missing `NEXT_PUBLIC_SANITY_PROJECT_ID` or `SANITY_API_WRITE_TOKEN` (Phase 3/4). |
| Studio shows "project not configured" | Open the site via `npm run dev` with `.env.local` filled in; hard-refresh. |
| Site shows content but edits in Studio don't appear | Add the deployed URL to Sanity **CORS origins** (Phase 5.1); check the webhook (Phase 5.2); or wait 60s for ISR. |
| Enquiry saves but no email | Phase 7 not completed — SMTP variables missing in Vercel, or the App Password is wrong (must be 16 characters, spaces removed). The inquiry is still in Studio → Inquiries. |
| Form says "try again later" | Rate limit — wait a minute. |
| Images don't load after seeding | Re-run `npm run seed` (uploads are skipped if already present) and check the console for `could not download image` warnings. |

---

© GIH Tour and Travel · Expand Your Comfort Zone
