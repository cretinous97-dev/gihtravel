/**
 * Centralised GROQ queries + the image projections used by every query.
 * All images project to `{ src, alt }` so the frontend has one image shape
 * whether the value comes from Sanity or the bundled fallback dataset.
 */

const imageProjection = /* groq */ `'src': asset->url, 'alt': coalesce(alt, '')`

export const imageField = (field: string) => /* groq */ `'${field}': ${field} { ${imageProjection} }`
export const imageFieldOptional = (field: string) => /* groq */ `'${field}': ${field} { ${imageProjection} }`

const tourProjection = /* groq */ `{
  _id,
  title,
  'slug': slug.current,
  shortDescription,
  ${imageField('heroImage')},
  'gallery': gallery[] { ${imageProjection} },
  overview,
  itinerary[]{
    _key,
    dayNumber,
    dayTitle,
    dayDescription,
    mealsIncluded,
    accommodation
  },
  inclusions,
  exclusions,
  durationDays,
  durationNights,
  difficulty,
  activityType,
  'destinations': destinations[]-> { _id, name, 'slug': slug.current },
  priceFrom,
  groupSizeMin,
  groupSizeMax,
  bestSeason,
  featured,
  'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
}`

const destinationProjection = /* groq */ `{
  _id,
  name,
  'slug': slug.current,
  description,
  ${imageField('image')},
  region,
  altitude,
  highlights,
  'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
}`

const testimonialProjection = /* groq */ `{
  _id,
  name,
  country,
  quote,
  rating,
  ${imageField('photo')},
  'tour': tour-> { _id, title, 'slug': slug.current },
  featured,
  order
}`

export const queries = {
  tours: /* groq */ `*[_type == "tour"] | order(featured desc, title asc) ${tourProjection}`,
  tourSlugs: /* groq */ `*[_type == "tour"]{ 'slug': slug.current }`,
  tourBySlug: /* groq */ `*[_type == "tour" && slug.current == $slug][0] ${tourProjection}`,
  featuredTours: /* groq */ `*[_type == "tour" && featured == true] | order(title asc) [0...8] ${tourProjection}`,

  destinations: /* groq */ `*[_type == "destination"] | order(name asc) ${destinationProjection}`,
  destinationSlugs: /* groq */ `*[_type == "destination"]{ 'slug': slug.current }`,
  destinationBySlug: /* groq */ `*[_type == "destination" && slug.current == $slug][0] ${destinationProjection}`,

  testimonials: /* groq */ `*[_type == "testimonial"] | order(order asc) ${testimonialProjection}`,

  homePage: /* groq */ `*[_type == "homePage"][0]{
    heroHeadline,
    heroSubheadline,
    ${imageField('heroImage')},
    heroCtaLabel,
    heroCtaLink,
    'featuredTours': featuredTours[]-> ${tourProjection},
    'featuredDestinations': featuredDestinations[]-> ${destinationProjection},
    'featuredTestimonials': featuredTestimonials[]-> ${testimonialProjection},
    trustSectionTitle,
    trustPoints[]{ _key, icon, title, description },
    'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
  }`,

  aboutBhutanPage: /* groq */ `*[_type == "aboutBhutanPage"][0]{
    heroTitle,
    heroSubtitle,
    ${imageField('heroImage')},
    gnhIntroduction,
    fourPillars[]{ _key, pillarName, description, icon },
    geography,
    seasons[]{ _key, seasonName, months, description, ${imageField('image')} },
    culturalInsights,
    whyBhutan,
    whyGih,
    'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
  }`,

  aboutPage: /* groq */ `*[_type == "aboutPage"][0]{
    foundingStory,
    mission,
    vision,
    teamMembers[]{ _key, name, role, bio, ${imageField('photo')} },
    sustainabilityCommitment,
    'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
  }`,

  contactPage: /* groq */ `*[_type == "contactPage"][0]{
    heroTitle,
    heroSubtitle,
    addressLine,
    city,
    country,
    phone,
    email,
    mapEmbedUrl,
    officeHours,
    'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
  }`,

  siteSettings: /* groq */ `*[_type == "siteSettings"][0]{
    siteName,
    siteTagline,
    ${imageField('logo')},
    socialLinks[]{ _key, platform, url },
    footerText,
    footerColumns[]{ _key, heading, links[]{ _key, label, href } },
    'defaultSeo': defaultSeo { metaTitle, metaDescription, ${imageField('ogImage')} },
    inquiryNotificationEmail,
    analyticsId
  }`,

  legalPageBySlug: /* groq */ `*[_type == "legalPage" && slug.current == $slug][0]{
    _id,
    title,
    'slug': slug.current,
    body,
    'lastUpdated': coalesce(lastUpdated, ''),
    'seo': seo { metaTitle, metaDescription, ${imageField('ogImage')} }
  }`,
}

export type QueryMap = typeof queries
