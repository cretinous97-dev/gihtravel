import { trips, type Trip } from './seed-content/trips'
import {
  destinations as rawDestinations,
  testimonials as rawTestimonials,
  siteSettings as rawSiteSettings,
} from './seed-content/site'
import { contentPages } from './seed-content/pages'
import { firstSentence, heading, listItem, paragraph, quote, textToBlocks } from './pt'
import type {
  AboutBhutanPage,
  AboutPage,
  ActivityType,
  ContactPage,
  Destination,
  Difficulty,
  FourPillar,
  HomePage,
  ImageRef,
  ItineraryDay,
  LegalPage,
  Season,
  SiteSettings,
  Testimonial,
  Tour,
  TrustPoint,
} from '@/lib/types'

/**
 * Seed documents built from the REAL content of https://gihtourtravel.com
 * (extracted word-for-word into ./seed-content/). Nothing here is invented:
 * every traveller-facing sentence is copied from the live site.
 *
 * These documents power two things:
 *   1. `scripts/seed.ts` — uploads them into Sanity (images included)
 *   2. the app's fallback data layer — so the site renders complete, real
 *      content even before the Sanity project exists
 *
 * Anything the old site never listed (group sizes, star ratings, office
 * hours …) is left empty and catalogued in README → CONTENT TO REPLACE.
 */

// ---------------------------------------------------------------------------
// Tours
// ---------------------------------------------------------------------------

/** Hero image URL: prefer the real photo from the old site's trip page.
 * (Generic WP-travel-engine placeholder images are treated as unusable.) */

function isUsableImage(url: string | undefined): url is string {
  return typeof url === 'string' && url.length > 0 && !url.includes('plugins/wp-travel-engine')
}

function heroImageFor(trip: Trip): ImageRef | null {
  const remote = trip.sourceImages.find(isUsableImage)
  if (remote) return { src: remote, alt: trip.imageAlt }
  if (trip.image) return { src: trip.image, alt: trip.imageAlt }
  return null
}

function galleryFor(trip: Trip): ImageRef[] {
  return trip.sourceImages.filter(isUsableImage).map((src) => ({ src, alt: trip.imageAlt }))
}

function nightsFrom(trip: Trip): number {
  const stated = trip.durationLabel.match(/(\d+)\s*nights?/i)
  if (stated?.[1]) return Number(stated[1])
  return Math.max(trip.durationDays - 1, 0)
}

function difficultyFrom(value: string | undefined): Difficulty | undefined {
  if (!value) return undefined
  const v = value.toLowerCase()
  if (/challeng|strenuous|demanding/.test(v)) return 'Challenging'
  if (/moderate/.test(v)) return 'Moderate'
  if (/easy|gentle|relax/.test(v)) return 'Easy'
  return undefined
}

function seasonsFrom(value: string | undefined): Season[] {
  if (!value) return []
  const v = value.toLowerCase()
  if (v.includes('year-round') || v.includes('year round')) return ['Spring', 'Summer', 'Autumn', 'Winter']
  const out: Season[] = []
  if (v.includes('spring')) out.push('Spring')
  if (v.includes('summer')) out.push('Summer')
  if (v.includes('autumn')) out.push('Autumn')
  if (
    v.includes('winter') ||
    v.includes('november to february') ||
    v.includes('december') ||
    v.includes('drubchen')
  ) {
    out.push('Winter')
  }
  return out
}

/** Best-fit activity type for the /tours filters (derived from trip types). */
const ACTIVITY_BY_SLUG: Record<string, ActivityType> = {
  'bhutan-adventure-quest': 'Trekking',
  'hidden-kingdom-heritage-trail': 'Cultural',
  'genz-bhutan-adventure-package': 'Custom',
  'royal-bhutan-experience-package': 'Custom',
  'vip-bhutan-experience-package': 'Custom',
  'friendly-package': 'Cultural',
  'elder-bliss-bhutan-tour-2-nights-3-days-senior-friendly-bhutan-tour-package-designed-for-elderly-travellers':
    'Cultural',
  'bhutan-luxury-festival-experience': 'Festival',
  'bhutan-offbeat-explorer': 'Cultural',
  'soulful-bhutan-wellness-mindfulness-retreat': 'Wellness',
  'honeymoon-in-the-clouds': 'Custom',
  'happy-himalayas-anniversary-happy-himalayas-anniversary-3n-4d-paro-thimphuhappy-himalayas-anniversary':
    'Custom',
  'bhutan-sacred-harmony-pilgrimage': 'Cultural',
}

const DESTINATION_SLUG_BY_NAME: Record<string, string> = {
  Paro: 'paro',
  Punakha: 'punakha',
  Thimphu: 'thimphu',
  Wangdue: 'wangdue',
  Trongsa: 'trongsa',
  Bumthang: 'bumthang',
  Haa: 'haa',
  'Phobjikha Valley': 'phobjikha',
  Phobjikha: 'phobjikha',
}

function itineraryFrom(trip: Trip): ItineraryDay[] {
  return trip.itinerary.map((day, index) => {
    const meals = day.description.match(/Meals?:\s*([^.]+)/i)?.[1]?.trim()
    const accommodation = day.description.match(/Overnight:?\s*([^.]+)/i)?.[1]?.trim()
    return {
      _key: `day-${index + 1}`,
      dayNumber: day.day,
      dayTitle: day.title,
      // The full description is preserved word-for-word (incl. any
      // "Overnight: …" / "Meals: …" notes).
      dayDescription: day.description,
      mealsIncluded: meals,
      accommodation,
    }
  })
}

export const tours: Tour[] = trips.map((trip) => {
  const shortDescription = firstSentence(trip.description, 160)
  return {
    _id: `tour-${trip.slug}`,
    title: trip.title,
    slug: trip.slug,
    shortDescription,
    heroImage: heroImageFor(trip),
    gallery: galleryFor(trip),
    overview: textToBlocks(trip.description),
    itinerary: itineraryFrom(trip),
    inclusions: trip.inclusions,
    exclusions: trip.exclusions,
    durationDays: trip.durationDays,
    durationNights: nightsFrom(trip),
    difficulty: difficultyFrom(trip.difficulty),
    activityType: ACTIVITY_BY_SLUG[trip.slug] ?? 'Custom',
    destinations: trip.destinations
      .map((name) => {
        const slug = DESTINATION_SLUG_BY_NAME[name]
        return slug ? { _id: `destination-${slug}`, name, slug } : null
      })
      .filter((d): d is { _id: string; name: string; slug: string } => d !== null),
    priceFrom: trip.priceUsd ?? undefined,
    bestSeason: seasonsFrom(trip.bestSeason),
    featured: trip.featured ?? false,
    seo: {
      metaTitle: trip.seoTitle ?? `${trip.title} | GIH Tour and Travel`,
      metaDescription: trip.seoDescription ?? shortDescription,
    },
  }
})

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

/** Real archive-page photos from the old site where one exists. */
const DESTINATION_IMAGE_URLS: Record<string, string> = {
  paro: 'https://gihtourtravel.com/wp-content/uploads/2025/12/paro-town-1521541076_850_400.jpg',
  bumthang: 'https://gihtourtravel.com/wp-content/uploads/2025/12/bumthang-dzongkhag-consists.jpg',
  haa: 'https://gihtourtravel.com/wp-content/uploads/2025/12/haa-valley-bnnr-990x480.jpg',
  phobjikha: 'https://gihtourtravel.com/wp-content/uploads/2025/12/Phobjikha-Valley-1024x387.jpg',
  punakha: 'https://gihtourtravel.com/wp-content/uploads/2025/12/punakha.jpg',
  thimphu: 'https://gihtourtravel.com/wp-content/uploads/2025/12/tphucity.jpg',
}

export const destinations: Destination[] = rawDestinations.map((d) => ({
  _id: `destination-${d.slug}`,
  name: d.name,
  slug: d.slug,
  description: textToBlocks(d.description),
  image: {
    src: DESTINATION_IMAGE_URLS[d.slug] ?? d.image,
    alt: d.imageAlt,
  },
  highlights: [],
  seo: {
    metaTitle: d.seoTitle ?? `${d.name} | GIH Tour and Travel`,
    metaDescription: d.seoDescription ?? d.shortDescription,
  },
}))

// ---------------------------------------------------------------------------
// Testimonials (real quotes only — never invented)
// ---------------------------------------------------------------------------

/** Decorative photos shown next to each quote on the old home page, in order. */
const TESTIMONIAL_PHOTO_URLS: Record<string, string> = {
  'Sophie L.': 'https://gihtourtravel.com/wp-content/uploads/2025/12/istockphoto-839413542-612x612-1-272x316.jpg',
  'The Rodriguez Family':
    'https://gihtourtravel.com/wp-content/uploads/2025/12/irene-strong-v2aKnjMbP_k-unsplash-272x316.jpg',
  'Sarah & James': 'https://gihtourtravel.com/wp-content/uploads/2025/12/charlie-green-3JmfENcL24M-unsplash-272x316.jpg',
  'Priya K.': 'https://gihtourtravel.com/wp-content/uploads/2025/12/istockphoto-1395880805-612x612-1-272x316.jpg',
  'David Chen': 'https://gihtourtravel.com/wp-content/uploads/2025/12/istockphoto-1019065958-612x612-1-272x316.jpg',
  'Elena & Marco': 'https://gihtourtravel.com/wp-content/uploads/2025/12/download-272x316.jpg',
  'The Park Family': 'https://gihtourtravel.com/wp-content/uploads/2025/12/istockphoto-482679934-612x612-1-272x316.jpg',
  'Arjun M.': 'https://gihtourtravel.com/wp-content/uploads/2025/12/amitav-hira-a0QnEHM_MG4-unsplash-272x316.jpg',
  'Lisa W.': 'https://gihtourtravel.com/wp-content/uploads/2025/12/download-272x316.jpg',
}

export const testimonials: Testimonial[] = rawTestimonials.map((t, index) => {
  const photoUrl = TESTIMONIAL_PHOTO_URLS[t.name]
  return {
    _id: `testimonial-${index + 1}`,
    name: t.name,
    country: t.country,
    quote: t.quote,
    // Ratings were never shown on the old site — left empty (see README).
    photo: photoUrl ? { src: photoUrl, alt: `${t.name}, ${t.country}` } : null,
    tour: null,
    featured: true,
    order: index + 1,
  }
})

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

const trustPoints: TrustPoint[] = [
  {
    _key: 'trust-authenticity',
    icon: 'compass',
    title: 'Authenticity',
    description: 'At GIH Tour and Travel, we don’t just show you Bhutan—we help you feel its soul.',
  },
  {
    _key: 'trust-sustainability',
    icon: 'leaf',
    title: 'Sustainability',
    description:
      'We work closely with local communities, support eco-friendly practices, and ensure every journey leaves a positive footprint.',
  },
  {
    _key: 'trust-service',
    icon: 'heart',
    title: 'Heartfelt service',
    description:
      'Your happiness is our purpose, and your journey with us is our story—a story of connection, discovery, and joy.',
  },
  {
    _key: 'trust-experts',
    icon: 'users',
    title: 'Seasoned local experts',
    description:
      'While our brand is fresh, our team is composed of seasoned local experts—guides, storytellers, and cultural enthusiasts who have spent decades exploring every valley, monastery, and mountain trail.',
  },
]

export const homePage: HomePage = {
  heroHeadline: rawSiteSettings.heroHeadline,
  heroSubheadline: rawSiteSettings.heroSubheadline,
  heroImage: {
    src: '/images/bhutan-himalayan-hero.jpg',
    alt: 'Mist rising over forested Himalayan valleys in Bhutan',
  },
  heroCtaLabel: 'Plan Your Trip',
  heroCtaLink: '/contact',
  featuredTours: tours.filter((t) => t.featured),
  featuredDestinations: ['paro', 'punakha', 'thimphu', 'bumthang', 'phobjikha', 'haa']
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => d !== null),
  featuredTestimonials: testimonials,
  trustSectionTitle: 'Why travel with GIH?',
  trustPoints,
}

// ---------------------------------------------------------------------------
// About Bhutan page
// ---------------------------------------------------------------------------

const fourPillars: FourPillar[] = [
  {
    _key: 'pillar-1',
    pillarName: 'Sustainable & Equitable Socio-Economic Development',
    description:
      'Tourism carefully managed through the Sustainable Development Fee\n100% organic farming target by 2035\nLocal entrepreneurship prioritized over foreign investment',
    icon: 'compass',
  },
  {
    _key: 'pillar-2',
    pillarName: 'Preservation & Promotion of Culture',
    description:
      'National dress (gho for men, kira for women) worn daily\nTraditional architecture mandated for all buildings\nDzongkha language preserved alongside English education',
    icon: 'flags',
  },
  {
    _key: 'pillar-3',
    pillarName: 'Conservation of the Environment',
    description:
      'Constitutional mandate: Minimum 60% forest coverage forever (currently 72%)\nCarbon-negative since 2015: Absorbs 3x more CO₂ than it produces\nPlastic banned nationwide since 1999\nHydroelectric power exports clean energy to neighbors',
    icon: 'leaf',
  },
  {
    _key: 'pillar-4',
    pillarName: 'Good Governance',
    description:
      'Constitutional monarchy established 2008\nCorruption perception index among Asia’s best\nDirect democracy with regular public consultations',
    icon: 'shield',
  },
]

export const aboutBhutanPage: AboutBhutanPage = {
  heroTitle: 'Bhutan: The Last Shangri-La',
  heroSubtitle:
    'Nestled in the eastern Himalayas, the Kingdom of Bhutan (Druk Yul, “Land of the Thunder Dragon”) is the world’s only carbon-negative country.',
  heroImage: {
    src: '/images/tigers-nest.jpg',
    alt: 'Tiger’s Nest Monastery (Paro Taktsang) clinging to a forested cliff',
  },
  gnhIntroduction: [
    paragraph(
      'Nestled in the eastern Himalayas, the Kingdom of Bhutan (Druk Yul, “Land of the Thunder Dragon”) is the world’s only carbon-negative country and the sole nation that measures progress through Gross National Happiness (GNH) rather than Gross Domestic Product (GDP). This isn’t just a travel destination—it’s a living experiment in conscious development, where ancient Buddhist traditions thrive alongside carefully managed modernity, and where 72% forest coverage is constitutionally protected.',
    ),
    paragraph(
      'Thus, Bhutan offers a truly unique and compelling travel experience, defined by its breathtaking natural beauty, unwavering commitment to environmental conservation, and a deeply rooted, living cultural heritage found nowhere else in the world. From pristine Himalayan landscapes and untouched forests to ancient monasteries, vibrant festivals, and time-honored traditions, the Kingdom seamlessly blends spirituality, sustainability, and authenticity. Guided by the philosophy of Gross National Happiness, Bhutan invites travelers not just to visit a destination, but to experience a way of life that values harmony with nature, cultural preservation, and meaningful human connection.',
    ),
    paragraph(
      'Population: ~800,000 | Area: 38,394 km² (Never Colonized) | Capital: Thimphu | Official Language: Dzongkha',
    ),
    heading('The Gross National Happiness Philosophy: Bhutan’s Guiding Light'),
    paragraph(
      'Born from the visionary wisdom of the Fourth King, His Majesty Jigme Singye Wangchuck, GNH represents a revolutionary approach to development.',
    ),
  ],
  fourPillars,
  geography: [
    heading('Bhutan’s Extraordinary Geography: A Vertical Kingdom'),
    paragraph('Key Valleys & Their Characters:'),
    listItem('Thimphu Valley: World’s only capital with no traffic lights (instead, elegant police direction)'),
    listItem('Paro Valley: Home to international airport and Tiger’s Nest Monastery'),
    listItem('Punakha Valley: Ancient capital with spectacular dzong at river confluence'),
    listItem('Bumthang Valley: Spiritual heartland with sacred temples'),
    listItem('Phobjikha Valley: Winter home of endangered black-necked cranes'),
    listItem('Haa Valley: Recently opened, pristine alpine region'),
  ],
  seasons: [
    {
      _key: 'season-spring',
      seasonName: 'Spring (March–May)',
      months: 'March – May',
      description:
        'Temperature: 10°C to 25°C\nHighlights: Rhododendron blooms (46 species), Paro Tshechu festival\nPerfect for: Photography, nature walks, cultural immersion\nSpecial: National flower (Blue Poppy) blooms at higher elevations',
      image: null,
    },
    {
      _key: 'season-summer',
      seasonName: 'Summer (June–August)',
      months: 'June – August',
      description:
        'Temperature: 15°C to 30°C\nHighlights: Lush greenery, fewer tourists, monsoon festivals\nPerfect for: Birdwatching, river activities, spiritual retreats\nNote: Some high passes may close; lower regions ideal',
      image: null,
    },
    {
      _key: 'season-autumn',
      seasonName: 'Autumn (September–November)',
      months: 'September – November',
      description:
        'Temperature: 10°C to 22°C\nHighlights: Crystal-clear mountain views, major tshechus, harvest season\nPerfect for: Trekking, festival participation, mountain photography\nPeak season: Book 6+ months in advance',
      image: null,
    },
    {
      _key: 'season-winter',
      seasonName: 'Winter (December–February)',
      months: 'December – February',
      description:
        'Temperature: -5°C to 15°C\nHighlights: Snow-capped peaks, intimate experiences, Punakha Drubchen\nPerfect for: Cultural immersion, lower valley exploration, hot stone baths\nSpecial: Black-necked crane festival in Phobjikha',
      image: null,
    },
  ],
  culturalInsights: [
    heading('Cultural Tapestry: Living Traditions'),
    heading('Architecture as Identity', 'h3'),
    paragraph('Every structure in Bhutan follows traditional design principles:'),
    listItem('Dzongs: Fortress-monasteries serving as administrative and religious centers'),
    listItem('Lhakhangs: Village temples with exquisite murals'),
    listItem('Farmhouses: Three-story structures with animal quarters below, living areas middle, shrine rooms top'),
    listItem('Prayer Flags: Five colors representing elements, carrying mantras on wind'),
    heading('Festivals: Where Gods Dance Among People', 'h3'),
    paragraph('Tshechus are not performances but religious ceremonies open to public participation:'),
    listItem('Masked Cham Dances: Each mask and movement tells Buddhist stories'),
    listItem('Social Gathering: Communities reunite, dressed in finest attire'),
    listItem('Blessing Reception: Thongdrol (giant thangka) unveiling grants liberation by sight'),
    listItem('Major Festivals: Paro Tshechu (spring), Thimphu Tshechu (autumn), Punakha Drubchen (winter)'),
    heading('Arts & Crafts: 13 Traditional Practices', 'h3'),
    paragraph('Formalized as Zorig Chusum, these arts are taught in specialized schools:'),
    listItem('Painting (thangka, murals)', true),
    listItem('Sculpting (clay, wood, bronze)', true),
    listItem('Calligraphy (for sacred texts)', true),
    listItem('Paper-making (from daphne bark)', true),
    listItem('Silk & cotton weaving (intricate kiras)', true),
    listItem('Embroidery (appliqué thangkas)', true),
    listItem('Masonry (traditional architecture)', true),
    listItem('Blacksmithing (tools, knives)', true),
    listItem('Bamboo work (arrows, containers)', true),
    listItem('Gold/silversmithing (ritual objects)', true),
    listItem('Cane work (mats, baskets)', true),
    listItem('Woodturning (bowls, cups)', true),
    listItem('Leatherwork (boots, bags)', true),
    heading('Spiritual Landscape: Buddhism in Daily Life', 'h3'),
    paragraph('Sacred Sites & Pilgrimage:'),
    listItem(
      'Taktsang Monastery (Tiger’s Nest): Cliffside monastery where Guru Rinpoche meditated in 8th century',
    ),
    listItem('Punakha Dzong: Most beautiful dzong at river confluence'),
    listItem('Kurjey Lhakhang: Temple with body imprint of Guru Rinpoche'),
    listItem('Chimi Lhakhang: Fertility temple dedicated to Divine Madman'),
    paragraph('Daily Spiritual Practices:'),
    listItem('Morning Prayer Flags: Households raise new flags on auspicious days'),
    listItem('Water Offerings: Placed on altars each morning'),
    listItem('Circumambulation: Walking clockwise around sacred sites'),
    listItem('Prayer Wheels: Spun to send mantras into the world'),
    heading('Cultural Etiquette Essentials', 'h3'),
    listItem('Circumambulate religious sites clockwise'),
    listItem('Remove shoes before entering temples and homes'),
    listItem('Dress modestly: Covered shoulders and knees at religious sites'),
    listItem('Receive/give with right hand or both hands'),
    listItem('Ask permission before photographing people'),
    listItem('Respect monks: Don’t touch their robes or interrupt meditation'),
  ],
  whyBhutan: [
    heading('Why Bhutan Changes Travelers'),
    paragraph(
      'Visitors often describe Bhutan not as a vacation but as a transformative experience. Here, you’ll discover:',
    ),
    listItem('Slower Rhythms: Where time moves with seasons, not deadlines', true),
    listItem('Genuine Smiles: Uncommercialized human warmth', true),
    listItem('Sacred Landscapes: Where every mountain is considered divine', true),
    listItem('Conscious Consumption: Where “enough” is valued over “more”', true),
    listItem('Integrated Spirituality: Not separate from daily life', true),
  ],
  whyGih: [
    heading('Your Invitation to Experience'),
    paragraph(
      'Bhutan isn’t merely a place to visit—it’s a different way of seeing the world. In a globalized age where destinations increasingly resemble each other, Bhutan remains profoundly authentic. It offers not just beautiful scenery, but beautiful values; not just ancient temples, but living wisdom; not just environmental policies, but a sacred relationship with nature.',
    ),
    paragraph(
      'As the world’s last remaining Himalayan kingdom pursuing Gross National Happiness, Bhutan invites you to experience what happens when a nation consciously chooses wellbeing over wealth, sustainability over short-term gain, and cultural preservation over homogenization.',
    ),
    quote(
      'In Bhutan, you don’t just cross borders—you cross into a different consciousness, where happiness is nurtured as both personal practice and national policy.',
    ),
    paragraph(
      'GIH Tour and Travel specializes in crafting journeys that honor both the magnificence and the mindfulness of Bhutan. Contact us to design your authentic Bhutanese experience.',
    ),
  ],
}

// ---------------------------------------------------------------------------
// About page
// ---------------------------------------------------------------------------

export const aboutPage: AboutPage = {
  foundingStory: textToBlocks(
    contentPages.find((p) => p.slug === 'about')?.body ??
      'Welcome to Glide Into Happiness (GIH) Tours & Travel, your dedicated gateway to the mystical and serene kingdom of Bhutan.',
  ),
  // The old site lists Mission, Vision and Value with this exact line
  // (typos preserved from the source).
  mission: [paragraph('Providing best travel experince to anyone from any corner.')],
  vision: [paragraph('Providing best travel experince to anyone from any corner.')],
  // Not listed on the old site — add your team via Sanity Studio (see README).
  teamMembers: [],
  sustainabilityCommitment: [
    paragraph(
      'What sets us apart is our commitment to authenticity, sustainability, and heartfelt service. We work closely with local communities, support eco-friendly practices, and ensure every journey leaves a positive footprint.',
    ),
  ],
}

// ---------------------------------------------------------------------------
// Contact page
// ---------------------------------------------------------------------------

export const contactPage: ContactPage = {
  heroTitle: 'Contact Us',
  heroSubtitle: 'Get in touch',
  addressLine: 'Paro, Bhutan',
  city: 'Paro',
  country: 'Bhutan',
  phone: rawSiteSettings.phone,
  email: rawSiteSettings.email,
  // No map embed exists on the old site — add one in Sanity Studio (see README).
  mapEmbedUrl: '',
  // Not published on the old site — add via Sanity Studio (see README).
  officeHours: '',
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export const siteSettings: SiteSettings = {
  siteName: rawSiteSettings.name,
  siteTagline: rawSiteSettings.tagline,
  logo: { src: '/logo.png', alt: 'GIH Tour and Travel — Glide Into Happiness' },
  socialLinks: rawSiteSettings.socialLinks.map((link, index) => ({
    _key: `social-${index + 1}`,
    platform: link.label === 'X' ? 'X' : link.label,
    url: link.url,
  })),
  footerText: [paragraph(rawSiteSettings.footerText.replace('{year}', '2025'))],
  footerColumns: [
    {
      _key: 'footer-explore',
      heading: 'Explore',
      links: [
        { label: 'Tours', href: '/tours' },
        { label: 'Destinations', href: '/destinations' },
        { label: 'About Bhutan', href: '/about-bhutan' },
        { label: 'About GIH', href: '/about' },
      ],
    },
    {
      _key: 'footer-plan',
      heading: 'Plan Your Trip',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
      ],
    },
    {
      _key: 'footer-contact',
      heading: 'Get in Touch',
      links: [
        { label: rawSiteSettings.phone, href: rawSiteSettings.phoneLink },
        { label: rawSiteSettings.email, href: `mailto:${rawSiteSettings.email}` },
        { label: rawSiteSettings.location, href: '/contact' },
      ],
    },
  ],
  defaultSeo: {
    metaTitle: rawSiteSettings.seoTitle,
    metaDescription: rawSiteSettings.seoDescription,
    ogImage: { src: '/images/bhutan-himalayan-hero.jpg', alt: 'Bhutan Himalayan landscape' },
  },
  inquiryNotificationEmail: rawSiteSettings.email,
}

// ---------------------------------------------------------------------------
// Legal pages (verbatim from the old site)
// ---------------------------------------------------------------------------

export const legalPages: LegalPage[] = [
  {
    _id: 'legalPage-privacy-policy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    body: textToBlocks(contentPages.find((p) => p.slug === 'privacy-policy')?.body ?? ''),
    lastUpdated: '2025-12-15',
  },
  {
    _id: 'legalPage-terms',
    title: 'Terms & Conditions of Service',
    slug: 'terms',
    body: textToBlocks(contentPages.find((p) => p.slug === 'terms-and-conditions')?.body ?? ''),
    lastUpdated: '',
  },
]

/**
 * Extra content preserved from the old site (/visa/ and /the-sdf/). These
 * pages are outside the master page list, so they are NOT seeded as routed
 * pages — the copy is kept here so nothing is ever lost. See README →
 * CONTENT TO REPLACE → "Visa & SDF pages" if you want them published.
 */
export const preservedContentPages = contentPages.filter((p) => p.slug === 'visa' || p.slug === 'the-sdf')
