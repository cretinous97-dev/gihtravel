# GIH Tour and Travel setup

This application uses Next.js App Router, TypeScript, Tailwind CSS, Payload CMS 3, Neon PostgreSQL, Stripe Checkout, Resend, Vercel Blob, and Vercel. No production or test credentials were supplied or added to this repository.

## 1. Local setup

1. Install Node.js 20 or newer and npm.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the values described below. Keep `.env.local` private; it is ignored by Git.
4. Create a Neon database and set `DATABASE_URL` to its connection string. Use the pooled connection string recommended for serverless use, and retain Neon’s TLS settings.
5. Apply the committed Payload migration with `npm run payload:migrate`. Run migrations before starting the application or seeding content. When collection schemas change later, generate a new migration, review it, and apply it before deployment.
6. Start the site locally with `npm run dev`.
7. Visit `/admin/create-first-user` to create the first staff account. The first user receives the Administrator role. Later staff accounts can be created by an administrator and assigned the Editor role in the Users collection.
8. Run `npm run seed` once to import the bundled GIH content and images into Payload. The seed is additive: existing records are not overwritten, so running it again will not replace editorial changes.
9. Open `/admin` to manage the site.

For commands that read environment variables, the seed script loads `.env.local` and `.env`. Do not commit either file.

## 2. Environment variables

Keep these variable names unchanged. `.env.example` contains the names with empty values.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string used by Payload. |
| `PAYLOAD_SECRET` | A long, random secret used to sign Payload authentication tokens and protect the CMS. Generate a fresh value for each environment. |
| `STRIPE_SECRET_KEY` | Stripe secret key for the current environment. Both test and live keys are accepted; use a test key until the owner has approved real payments. |
| `STRIPE_PUBLISHABLE_KEY` | Matching Stripe publishable key. The hosted Checkout redirect does not currently expose or require it in the browser. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the Stripe webhook in the same mode as `STRIPE_SECRET_KEY`. |
| `RESEND_API_KEY` | Resend API key for contact inquiries, booking notifications, and password reset email. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token. Set this in production so Payload media uploads persist outside Vercel’s temporary filesystem. |
| `NEXT_PUBLIC_SITE_URL` | Canonical absolute URL for the current environment, including protocol and without a trailing slash. It is used for metadata, account emails, and Stripe return URLs. |

Do not add credentials to source files, command history, or the committed example file. Vercel environment variables should be configured separately for Development, Preview, and Production.

## 3. Payload, database, and content

The Payload admin is at `/admin`. It is backed by Neon and includes:

- Travel content: Packages, Itineraries, Destinations
- Editorial content: Pages, Blog Posts, FAQs, Testimonials
- Company content: Team Members, Site Settings, Media
- Customer and booking records: Customers, Bookings
- Staff and payment audit records: Users, Stripe Events

The first staff account is created at `/admin/create-first-user`. Only that initial account can be created without an existing administrator. Administrators can create editors and manage roles; editors can update published site content and bookings but cannot manage staff roles or remove records.

Payload schema changes should be made through migrations. Use `npm run payload:migrate:create` to generate a migration after changing collection schemas, inspect the generated migration, then apply it with `npm run payload:migrate`. Run and review migrations before production deployments. Do not run destructive schema pushes against production data.

Run `npm run seed` after the schema has been applied. It imports the bundled package descriptions and itineraries, seven dedicated destination pages plus the separately flagged Phobjikha Valley mention, six static pages, FAQs, team records, testimonials, Site Settings, and local editorial images. It does not import any passwords, customer data, Stripe records, or blog posts.

All package, destination, blog, and homepage imagery can be replaced through Media and the relevant relationship fields in Payload. The owner-supplied logo is expected at `/public/logo.png`; Site Settings already references `/logo.png`. Add the file before seeding if it should also be added to the Media library, or upload it in Payload and set the Site Settings logo relation.

## 4. Booking and Stripe

The booking flow is intentionally conservative because the previous website displayed several prices without saying whether they were per traveler or for the whole group. Those source amounts are shown as listed rates, not represented as confirmed per-traveler prices.

Before a package can use online checkout, an administrator must verify its current price and basis, enter the confirmed amount in Payload, and enable **Price is confirmed per traveler**. This checkbox is off for the imported packages. Packages without a listed price, and packages whose basis is still uncertain, remain inquiry-only. Optional extras without confirmed prices are not included in Stripe totals.

To test checkout:

1. Configure `STRIPE_SECRET_KEY` with a Stripe test secret and set `NEXT_PUBLIC_SITE_URL` to the current site origin.
2. Confirm the selected package price and per-traveler basis in Payload, then enable the package checkbox. Do not enable this for an unverified price.
3. Create a customer account, sign in, and submit a preferred date and traveler count on the booking page. The selected date is a request only; the site does not claim to hold availability.
4. Use Stripe’s test card `4242 4242 4242 4242`, a future expiration date, and any CVC to complete a test payment.
5. Register `POST /api/stripe/webhook` as a Stripe test-mode webhook. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`. Copy the test signing secret to `STRIPE_WEBHOOK_SECRET`.
6. For local webhook testing, run the Stripe CLI and forward events to `http://localhost:3000/api/stripe/webhook`; use the CLI’s test signing secret locally.

The webhook verifies Stripe’s signature, records event IDs to reduce duplicate processing, updates the booking, and sends booking notices through Resend when configured. A successful payment marks a booking **Paid**; GIH still needs to confirm travel availability and trip details before changing it to **Confirmed**. No inventory or departure dates are published from the old site because the repeated October 4–6, 2026 “Available” labels were not verified as live inventory.

The API accepts live Stripe keys, so do not configure them until the owner has approved the live pricing basis, refund and cancellation terms, tax treatment, availability process, verified Resend sender, and production webhook. The current booking flow does not calculate tax or add unpriced services. Keep test keys in Preview; use live keys only in Production after the owner’s sign-off.

## 5. Resend email

Set `RESEND_API_KEY` and verify the sending identity used by GIH with Resend before production. The current sender uses the GIH business email listed on the previous site; Resend may require a verified domain or sending identity. Contact inquiries are sent to the current Site Settings email, and replies go to the traveler. Customer password reset messages use a custom link to `/reset-password`.

If the Resend key is missing or the sender is not verified, the contact form and password reset email cannot deliver messages. Confirm both flows in a test environment before launch.

## 6. Vercel deployment

1. Import the repository into Vercel and configure the project for this Next.js application.
2. Add the required environment variables in Vercel. Use the site’s canonical production origin for Production and the appropriate origin for Preview. Keep Stripe in test mode until the owner approves a live launch.
3. Provision Neon PostgreSQL and Vercel Blob. Add the Neon connection string and `BLOB_READ_WRITE_TOKEN` to Vercel.
4. Apply Payload migrations before the first deployment that needs the schema. Seed content once after the schema exists.
5. Configure the Stripe test webhook URL as `https://<your-site-origin>/api/stripe/webhook` and set its signing secret.
6. Deploy and verify `/`, `/packages`, `/admin`, account registration and reset email, the contact form, and a test checkout/webhook cycle.

Vercel’s function filesystem is temporary. Do not rely on local Payload uploads for production media; configure Vercel Blob before staff upload replacement imagery. The bundled `/public/images` files are committed editorial assets and remain available without Blob.

## 7. Content To Import Manually

The imported content is a first pass from `https://gihtourtravel.com`; it is not a substitute for the owner’s final review. Preserve the original copy when editing unless GIH approves a change.

- **Blog posts:** no post records were bundled. Import approved posts and their images through Blog Posts and Media if the previous site has journal content to retain.
- **Package prices and price bases:** the previous site’s public cards displayed prices for 11 of the 13 bundled packages, but the source did not establish whether those amounts were per traveler or for a group. Two packages had no confirmed listed price: *Bhutan Adventure Quest* and *Hidden Kingdom Heritage Trail*. Verify all current prices, group rates, inclusions, exclusions, and optional-extra prices with GIH before enabling checkout.
- **Package dates and availability:** no departure inventory was imported. Repeated October 4–6, 2026 “Available” labels appeared in trip archives but were not treated as verified inventory.
- **Phobjikha Valley:** the old site mentioned the valley but did not provide a dedicated destination page. Its entry is explicitly marked as lacking a source destination page; replace or expand it with owner-approved copy before treating it as a full destination guide.
- **Policy and regulatory information:** the imported Visa, Sustainable Development Fee, FAQ, and related travel guidance may have changed. The SDF page contains figures labeled “As of 2025.” Confirm visa eligibility, fees, SDF rates, insurance requirements, and travel rules with current official Bhutan sources.
- **Legal pages:** review the imported Privacy Policy and Terms and Conditions with the owner or legal advisor, and confirm that the site’s contact, data-retention, payment, cancellation, refund, and booking-confirmation practices match the final operation.
- **Team biographies:** two source bios were not clear enough to present, so those team entries are shown without biographies. Add owner-approved copy and photos before launch.
- **Company details:** verify the phone, address, contact email, social accounts, current team biographies, testimonials, copyright line, and every company or destination fact before launch.
- **Source imagery:** source-image URLs are stored separately from the local editorial images. Check copyright and usage permission before using any image from the previous website; replace images in Media with owner-approved assets where needed.

The current lockfile reports 14 npm audit findings (5 moderate and 9 high; 11 findings remain with development dependencies omitted), mostly in transitive Payload database and Blob adapter dependencies. Re-run `npm audit` before launch and review upstream fixes. Avoid `npm audit fix --force`: its suggested major-version changes are not compatible with this Next.js and Payload setup.

The website must not be treated as ready for live payment until the owner has reviewed the items above, the dependency findings have been assessed, the test-mode booking path works end to end, and the live Stripe webhook has been verified in Production.
