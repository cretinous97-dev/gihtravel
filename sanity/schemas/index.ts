import { tour } from './tour'
import { destination } from './destination'
import { testimonial } from './testimonial'
import { inquiry } from './inquiry'
import { homePage } from './homePage'
import { aboutBhutanPage } from './aboutBhutanPage'
import { aboutPage } from './aboutPage'
import { contactPage } from './contactPage'
import { siteSettings } from './siteSettings'
import { legalPage } from './legalPage'

/**
 * All content types for the GIH Tour and Travel Studio.
 * Singletons (homePage, aboutBhutanPage, aboutPage, contactPage, siteSettings)
 * are pinned in the desk structure so editors cannot duplicate them.
 */
export const schemaTypes = [
  // Documents
  tour,
  destination,
  testimonial,
  inquiry,
  legalPage,
  // Singletons
  homePage,
  aboutBhutanPage,
  aboutPage,
  contactPage,
  siteSettings,
]

export {
  tour,
  destination,
  testimonial,
  inquiry,
  legalPage,
  homePage,
  aboutBhutanPage,
  aboutPage,
  contactPage,
  siteSettings,
}
