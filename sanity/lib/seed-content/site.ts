export const siteSettings = {
  name: 'GIH Tour and Travel',
  legalName: 'Glide Into Happiness Tour and Travel',
  tagline: 'Expand Your Comfort Zone',
  heroHeadline: 'Expand Your Comfort Zone',
  heroSubheadline: 'Grab your stuff and let’s see happiness',
  introductionHeading: 'Welcome to Glide Into Happiness Tour and Travel',
  introduction: 'Welcome to GIH Tour and Travel, your trusted guide to experiencing the mystical Kingdom of Bhutan—the world’s only carbon-negative country where happiness is measured as Gross National Happiness. Founded in the heart of the Himalayas, we are more than a travel company; we are custodians of authentic experiences and ambassadors of Bhutan’s unique philosophy of mindful travel. A new name, but a team whose roots run deep in the Himalayan soil. We are a fresh chapter in Bhutanese travel, written by guides and experts with decades of experience crafting journeys across the Dragon Kingdom. Our passion is old; our approach is new.',
  whyHeading: 'Why Bhutan? Why GIH?',
  whyText: 'Bhutan isn’t just a destination; it’s a different state of consciousness. In a world rushing toward modernity, Bhutan walks the Middle Path—cherishing ancient traditions while embracing sustainable progress. Here, prayer flags flutter in mountain passes, monks chant in ancient fortresses, and forests are protected by constitutional mandate. At GIH Tour and Travel, we don’t just show you Bhutan—we help you feel its soul. We believe travel should transform both the visitor and the visitee. That’s why every journey we design aligns with Bhutan’s high-value, low-impact tourism policy, ensuring your visit contributes positively to conservation, culture, and community.',
  location: 'Paro, Bhutan',
  address: 'Tshendona, Lamgong gewog, Paro, Bhutan',
  phone: '+975 17901780',
  phoneLink: 'tel:+97517901780',
  email: 'gihbucketlist@gmail.com',
  logoPath: '/logo.png',
  footerText: '© {year} GIH Tour and Travel. All rights reserved.',
  currency: 'USD',
  seoTitle: 'GIH Tour and Travel | Bhutan journeys, guided by local knowledge',
  seoDescription: 'Plan a Bhutan journey with GIH Tour and Travel. Explore cultural tours, festivals, trekking, wellness and private experiences with a local team in Paro.',
  socialLinks: [
    { label: 'WhatsApp', url: 'https://wa.me/+97517901780' },
    { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61584735564864&sk=followers' },
    { label: 'X', url: 'https://x.com/GIHtourTravel?t=A9U2TwSmAC-Qq1A3VRRrpA&s=07' },
    { label: 'Instagram', url: 'https://www.instagram.com/glideintohappiness/?igsh=MTAxMG53ZjJkazNvMg%3D%3D#' },
  ],
  heroImage: '/images/bhutan-himalayan-hero.jpg',
  featureImage: '/images/bhutanese-farm-meal.jpg',
}

export type Destination = {
  name: string
  slug: string
  description: string
  shortDescription: string
  image: string
  imageAlt: string
  sourceUrl: string
  pageFound: boolean
  seoTitle?: string
  seoDescription?: string
}

export const destinations: Destination[] = [
  {
    name: 'Paro', slug: 'paro',
    description: 'Paro is a picturesque valley town in Bhutan, known as the gateway to the kingdom, home to its only international airport and iconic sites like the Tiger’s Nest Monastery, set amidst fertile fields and Himalayan peaks, rich with ancient monasteries, traditional farmhouses, and vibrant cultural heritage, offering a blend of stunning natural beauty and deep spirituality',
    shortDescription: 'Paro is a historic town in the Paro Valley of Bhutan, known primarily as the location of the country’s sole international airport and as the gateway to the famous Paro Taktsang (Tiger’s Nest) monastery',
    image: '/images/tigers-nest.jpg', imageAlt: 'Tiger’s Nest Monastery in a forested cliff valley', sourceUrl: 'https://gihtourtravel.com/destinations/paro/', pageFound: true,
  },
  {
    name: 'Punakha', slug: 'punakha',
    description: 'Punakha is a historic and fertile valley in west-central Bhutan, renowned for its stunning natural beauty and significant cultural heritage. It served as the capital of Bhutan until 1955 and remains the winter residence for the Je Khenpo (Chief Abbot) and the central monastic body due to its lower, warmer elevation.',
    shortDescription: 'Punakha is a fertile and historic valley that was the former capital of Bhutan until 1955.',
    image: '/images/punakha-dzong.jpg', imageAlt: 'Punakha Dzong beside the river confluence', sourceUrl: 'https://gihtourtravel.com/destinations/punakha/', pageFound: true,
  },
  {
    name: 'Thimphu', slug: 'thimphu',
    description: 'Thimphu is the capital and largest city of Bhutan, serving as the political, economic, and cultural heart of the kingdom. It is unique for being the only national capital in the world without any traffic lights, relying instead on a central point manned by police officers to direct traffic.',
    shortDescription: 'Thimphu is the capital and largest city of Bhutan, notable as the world’s only capital city without traffic lights.',
    image: '/images/bhutanese-farm-meal.jpg', imageAlt: 'A Bhutanese meal in a traditional timber home', sourceUrl: 'https://gihtourtravel.com/destinations/tphu/', pageFound: true,
  },
  {
    name: 'Haa', slug: 'haa',
    description: 'Haa is one of the most picturesque and isolated districts in southwestern Bhutan, often referred to as the “Hidden-Land Rice Valley”. It was only opened to foreign tourism in 2002, allowing it to retain a pristine, untouched traditional charm.',
    shortDescription: 'Haa is a secluded, picturesque valley and district in southwestern Bhutan known for its pristine alpine scenery and untouched traditional culture.',
    image: '/images/bhutan-trekking.jpg', imageAlt: 'A high mountain path through the Bhutanese Himalaya', sourceUrl: 'https://gihtourtravel.com/destinations/haa/', pageFound: true,
  },
  {
    name: 'Bumthang', slug: 'bumthang',
    description: 'Bumthang is often referred to as the “spiritual heartland” or “cultural cradle” of Bhutan, a region deeply steeped in history, legend, and natural beauty. It is a collection of four broad, glacier-carved mountain valleys—Choekhor, Chumey, Tang, and Ura—that provide a stunning backdrop of pine forests, lush fields, and snow-capped peaks.',
    shortDescription: 'Bumthang is recognized as the spiritual heartland of Bhutan, comprising four scenic mountain valleys rich in ancient history and Buddhist mythology.',
    image: '/images/bumthang-temple.jpg', imageAlt: 'A traditional Buddhist temple in Bumthang', sourceUrl: 'https://gihtourtravel.com/destinations/bumthang/', pageFound: true,
  },
  {
    name: 'Trongsa', slug: 'trongsa',
    description: 'Trongsa is a historic town in central Bhutan, best known for its immense Trongsa Dzong, the largest fortress in the country and the ancestral seat of the ruling Wangchuck dynasty. The name “Trongsa” means “new village” in Dzongkha',
    shortDescription: 'Trongsa is a central and historically vital district in Bhutan, known as the ancestral seat of the ruling Wangchuck dynasty.',
    image: '/images/bumthang-temple.jpg', imageAlt: 'A Bhutanese temple and the forested central valleys', sourceUrl: 'https://gihtourtravel.com/destinations/trongsa/', pageFound: true,
  },
  {
    name: 'Wangdue', slug: 'wangdue',
    description: 'Wangdue is a large and historically significant district (dzongkhag) in central Bhutan, known for its strategic location, dramatic landscapes, and the important Phobjikha Valley, a major conservation area.',
    shortDescription: 'Wangdue is a large district in central Bhutan known for its strategic fortress, diverse ecosystems, and as the gateway to the environmentally sensitive Phobjikha Valley',
    image: '/images/phobjikha-valley.jpg', imageAlt: 'The open wetlands and forested hills of Phobjikha Valley', sourceUrl: 'https://gihtourtravel.com/destinations/wangdue/', pageFound: true,
  },
  {
    name: 'Phobjikha Valley', slug: 'phobjikha',
    description: 'Phobjikha Valley: Winter home of endangered black-necked cranes. The Phobjikha Valley is a wide, glacial valley and the protected winter home of the endangered Black-necked Cranes (Nov-Feb).',
    shortDescription: 'Winter home of endangered black-necked cranes.',
    image: '/images/phobjikha-valley.jpg', imageAlt: 'Black-necked cranes in the highland wetlands of Phobjikha Valley', sourceUrl: 'https://gihtourtravel.com/trip/bhutan-offbeat-explorer/', pageFound: false,
  },
]

export const testimonials = [
  { title: 'Curated With Care', quote: 'From the Tiger’s Nest hike to the quiet monastery blessings, every moment was curated with care. Heartfelt thanks to the entire GIH team.', name: 'Sophie L.', country: 'France' },
  { title: 'Transformative Experiences', quote: 'GIH showed us the soul of Bhutan. Not just the sights, but the heart behind them. An unforgettable journey.', name: 'The Rodriguez Family', country: 'USA' },
  { title: 'Guides Who Feel Like Family', quote: 'Our guide, Tashi, felt like family. His knowledge and warmth made every temple, every mountain pass, come alive with meaning.', name: 'Sarah & James', country: 'Australia' },
  { title: 'Solo Travel, Perfectly Supported', quote: 'As a solo female traveler, I felt incredibly safe and deeply welcomed. GIH crafted the perfect balance of adventure and peace.', name: 'Priya K.', country: 'India' },
  { title: 'Flawless Planning & Execution', quote: 'The attention to detail was flawless. From the visa process to our last goodbye, everything was seamless. True professionals.', name: 'David Chen', country: 'Singapore' },
  { title: 'More Than A Vacation', quote: 'We came for the landscapes but left with so much more—a new perspective. Thank you, GIH, for a transformative experience.', name: 'Elena & Marco', country: 'Italy' },
  { title: 'Perfect Family Adventure', quote: 'Our family adventure was perfectly paced. The kids loved the farm visit and archery, while we soaked in the spiritual serenity. Perfect for all ages.', name: 'The Park Family', country: 'South Korea' },
  { title: 'A Photographer’s Dream', quote: 'A photography dream. GIH knew all the hidden vantage points and arranged genuine cultural moments to capture. Stunning portfolio.', name: 'Arjun M.', country: 'Photographer, India' },
  { title: 'Travel That Gives Back', quote: 'The most sustainable and mindful trip I’ve ever taken. It felt good knowing our visit supported local communities and conservation.', name: 'Lisa W.', country: 'Canada' },
]

export const teamMembers = [
  { name: 'Thinley Yoezer', role: 'Founder, CEO', bio: 'A visionary with deep roots in Bhutan’s tourism landscape, Thinley founded Glide Into Happiness with a simple belief: travel should uplift both the visitor and the host. With years of experience, his leadership ensures every journey is designed with authenticity, integrity, and that signature touch of Bhutanese warmth.' },
  { name: 'Pema', role: 'Head of Guest Experience', bio: 'Your journey’s guardian from the first hello to the final farewell. Pema meticulously orchestrates every detail, ensuring seamless logistics, personalized surprises, and that you always feel cared for, supported, and inspired.' },
  { name: 'Karma', role: 'Senior Cultural Guide & Storyteller', bio: 'With a guide’s license and a historian’s heart, Karma brings Bhutan’s legends, dzongs, and traditions to life. His insightful storytelling turns every visit into a meaningful conversation with the soul of the Himalayas.' },
  { name: 'Sonam', role: 'Wellness & Special Interest Curator', bio: 'A certified yoga instructor and herbal wellness practitioner, Sonam designs our rejuvenating retreats and special interest tours. She connects guests with authentic healing traditions, mindful activities, and serene natural sanctuaries.' },
  { name: 'Sangay', role: 'Transport & Special Access Coordinator', bio: 'A logistics expert with an extensive network, Sangay manages our fleet of premium vehicles and drivers. He specializes in securing special access and permits for remote regions, ensuring comfort, safety, and exclusive experiences even in the most secluded valleys.' },
  { name: 'Tandin', role: 'Adventure & Trekking Lead', bio: 'An avid mountaineer and certified trekking guide, Tandin maps out thrilling yet safe adventures across Bhutan’s pristine trails. His passion for the outdoors ensures every quest is exhilarating, secure, and deeply rewarding.' },
  { name: 'Jigme', role: 'Photography & Digital Experience Specialist', bio: '' },
  { name: 'Dechen', role: 'Operations & Sustainability Lead', bio: '' },
  { name: 'Yeshi', role: 'Culinary & Hospitality Liaison', bio: 'With a background in hospitality management and a love for Bhutanese cuisine, Yeshi designs our unique culinary experiences. From private farm-to-table dinners to cooking classes with local chefs, she ensures every meal is a memorable discovery of flavor and culture.' },
]

export const faqs = [
  { question: 'Do I need a visa to enter Bhutan?', answer: 'Yes. All foreign travelers—except Indian nationals—require a Bhutan visa. To process your visa, we need: • A clear passport scan (valid for at least 6 months) • Recent passport-size photo • Confirmed travel itinerary • SDF + visa fee payment Glide Into Happiness Tour & Travel completes the entire visa application on your behalf once the documents are submitted.' },
  { question: 'How much is the Bhutan visa fee?', answer: 'The visa fee is USD 40 per person, payable once per trip. This is separate from the Sustainable Development Fee (SDF).' },
  { question: 'What is the Sustainable Development Fee (SDF)?', answer: 'The SDF is Bhutan’s mandatory environmental and cultural preservation tax. • International tourists: USD 100 per night • Indian nationals: Nu./INR 1,200 per night This fee contributes to free education, healthcare, and conservation projects in Bhutan.' },
  { question: 'How long does visa approval take?', answer: 'Visa approval usually takes: • 3–5 working days during regular seasons • 5–10 days during peak months or festival seasons We recommend applying early to avoid delays.' },
  { question: 'Can Indian tourists travel without a visa?', answer: 'Indian nationals do not require a visa but must: • Pay the SDF • Show a valid passport or voter ID • Complete an entry permit at the border or airport We assist with all required formalities.' },
  { question: 'What documents do I need to travel to Bhutan?', answer: 'For international tourists: • Passport (valid for 6+ months) • Travel insurance • Visa approval letter For Indian tourists: • Passport or voter ID • Passport-size photo • Travel insurance (recommended)' },
  { question: 'When is the best time to visit Bhutan?', answer: 'Bhutan is year-round, but each season offers something special: • Spring (Mar–May): Festivals, flowers, best trekking • Summer (Jun–Aug): Lush green landscapes, good for photography • Autumn (Sep–Nov): Clear skies, best views, major festivals • Winter (Dec–Feb): Snow, peaceful travel, perfect for hot stone baths' },
  { question: 'What types of tours do you offer?', answer: 'Glide Into Happiness provides: • Cultural tours • Luxury & VIP tours • Honeymoon & romantic escapes • Adventure & trekking • Nature & wildlife trips • Wellness & mindfulness retreats • Family-friendly tours • Corporate or group tours • Custom-designed itineraries' },
  { question: 'Are Bhutan travel prices all-inclusive?', answer: 'Most packages include: • Hotels • Breakfast/lunch/dinner (optional) • Transportation • English-speaking guide • Sightseeing & entry fees • Airport pickup/drop • On-ground support We also offer custom budgets based on hotel category and travel style.' },
  { question: 'What types of hotels are available?', answer: 'Bhutan offers: • 3-star comfort hotels • Premium boutique stays • Luxury resorts (Amankora, COMO Uma, Le Méridien, Zhiwa Ling, etc.) • Farmstay experiences You can choose your preference, and we will book accordingly.' },
  { question: 'Is Bhutan safe for solo, group, or female travelers?', answer: 'Yes. Bhutan is one of the safest countries in the world with very low crime rates. Solo travelers, families, and women can travel comfortably.' },
  { question: 'What should I pack for Bhutan?', answer: 'Essentials include: • Layered clothing (weather changes quickly) • Warm jacket • Comfortable walking/hiking shoes • Umbrella/rain jacket (especially June–Aug) • Sunscreen, lip balm, sunglasses • Scarf/shawl for temple visits • Power adapter (Type D & F)' },
  { question: 'What food is available in Bhutan? Will I get vegetarian/vegan options?', answer: 'Yes. Bhutan offers a variety of dishes, including: • Bhutanese cuisine • Indian, continental, Chinese food • Vegan & vegetarian meals are widely available We can also inform hotels/restaurants about dietary restrictions.' },
  { question: 'Can I drink tap water in Bhutan?', answer: 'Tap water is not recommended. Hotels provide boiled or filtered water. We also supply bottled water during tours.' },
  { question: 'How is transportation arranged in Bhutan?', answer: 'We provide comfortable and clean vehicles based on group size: • SUVs • Luxury Prados • Family vans (Hiace) • Coaster buses for groups All packages include a private driver and guide.' },
  { question: 'Is altitude sickness common?', answer: 'Most tourist destinations in Bhutan are moderate in altitude: • Paro: 2,200 m • Thimphu: 2,300 m • Phobjikha: 3,000 m Most visitors feel completely fine. We recommend staying hydrated and taking it slow the first day.' },
  { question: 'Can I use mobile data and Wi-Fi?', answer: 'Yes. • Most hotels offer free Wi-Fi • You can purchase a local SIM card (B-Mobile or TashiCell) We assist in setup upon arrival.' },
  { question: 'What is the usual method of payment?', answer: 'Booking confirmation usually requires: • Bank transfer • International payment gateway • Cash for small expenses We provide official invoices, receipts, and confirmation letters.' },
  { question: 'Do I need travel insurance?', answer: 'Yes, it is mandatory for international tourists and recommended for all travelers. Insurance must cover: • Medical emergencies • Accidents • Trip delays • Lost baggage' },
  { question: 'Are drones allowed in Bhutan?', answer: 'Drone usage requires special permission from: • Bhutan Civil Aviation Authority • Local government in specific areas Unauthorized drone usage is not permitted. We can assist with permits.' },
  { question: 'Can I take photos inside monasteries and temples?', answer: 'Photography rules vary by location: • Outside temples: Allowed • Inside temples & sacred interiors: Usually NOT allowed Your guide will inform you at every site.' },
  { question: 'How far in advance should I book my travel?', answer: 'For smooth planning: • General travel: 2–4 weeks in advance • Peak season or festivals: 1–3 months in advance • Luxury hotels: Early booking recommended' },
  { question: 'What happens if my flight is delayed or cancelled?', answer: 'We will: • Track your updated flight status • Adjust your itinerary • Rebook hotel nights if needed • Assist with airline communication Your tour runs smoothly even with changes.' },
  { question: 'Do you offer emergency assistance during the trip?', answer: 'Yes, we provide 24/7 customer support for: • Medical help • Lost items • Missed flights • Itinerary changes • Any travel concerns You are never alone while traveling with us.' },
  { question: 'How do I book a tour with Glide Into Happiness Tour & Travel?', answer: 'Simply contact us through: • WhatsApp • Facebook / Instagram • Email • Website inquiry form We handle the entire process—from planning to visa—so your Bhutan experience becomes effortless and joyful.' },
]
