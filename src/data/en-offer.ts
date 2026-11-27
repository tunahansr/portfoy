/**
 * /en — small-business offer (English). Single source for packages, steps and FAQ.
 * Rules: prices in USD, no invented testimonials or statistics.
 * To change a price or a delivery time, edit only this file.
 */

export type PackageId = "qr-menu" | "starter" | "business" | "booking" | "store" | "redesign" | "care";

export interface OfferPackage {
  id: PackageId;
  name: string;
  /** Number only, shown with "$" */
  price: number;
  /** Small text next to the price */
  priceNote: string;
  /** Shown before the price, e.g. "From" */
  pricePrefix?: string;
  summary: string;
  delivery: string;
  includes: string[];
  popular?: boolean;
  /** Who it suits — short line under the title */
  idealFor: string;
}

export const packages: OfferPackage[] = [
  {
    id: "qr-menu",
    name: "QR Menu",
    price: 99,
    priceNote: "one-time",
    idealFor: "Cafés, restaurants, bars",
    summary: "A digital menu your guests open by scanning a QR code at the table.",
    delivery: "Ready in 2 days",
    includes: [
      "Mobile-friendly digital menu with your items and prices",
      "Categories, photos and dietary / allergen labels",
      "Print-ready QR code files (PDF + PNG) for tables, windows and flyers",
      "Menu page hosted for the first 12 months",
      "Price changes by email or WhatsApp",
    ],
  },
  {
    id: "starter",
    name: "Starter Website",
    price: 249,
    priceNote: "one-time",
    idealFor: "Salons, shops, local services",
    summary: "A clean one-page website that tells people who you are and how to reach you.",
    delivery: "Ready in 5 days",
    includes: [
      "One-page website, built mobile-first",
      "About, services or menu, opening hours and photos",
      "Google Maps location and directions",
      "WhatsApp chat button and click-to-call",
      "Contact form that sends to your email",
    ],
  },
  {
    id: "business",
    name: "Business Website",
    price: 449,
    priceNote: "one-time",
    popular: true,
    idealFor: "Restaurants, pet shops, estate agents",
    summary: "A complete website with a QR menu, your own domain and a year of hosting.",
    delivery: "Ready in 7 days",
    includes: [
      "Up to 5 pages (e.g. Home, About, Menu or Services, Gallery, Contact)",
      "QR menu included",
      "Domain name + 1 year of hosting included",
      "Basic SEO: page titles, descriptions, sitemap, Google Business Profile link",
      "Google Maps, WhatsApp button and contact form",
    ],
  },
  {
    id: "booking",
    name: "Booking Website",
    price: 599,
    priceNote: "one-time",
    idealFor: "Hair salons, barbers, groomers, restaurants",
    summary: "A website where customers book an appointment or a table online.",
    delivery: "Ready in 10 days",
    includes: [
      "Online appointment or table booking",
      "Your services, prices, staff and opening hours",
      "Email confirmation for you and your customer",
      "Simple dashboard to see and manage bookings",
      "Mobile-friendly website with WhatsApp button",
    ],
  },
  {
    id: "store",
    name: "Online Store",
    price: 799,
    priceNote: "one-time",
    idealFor: "Pet shops, bakeries, gift shops",
    summary: "Sell your products online with a cart and secure card payments.",
    delivery: "Ready in 14 days",
    includes: [
      "Product catalogue with photos, prices and options",
      "Shopping cart and checkout",
      "Card payment setup with your chosen payment provider",
      "Order notifications by email",
      "Delivery and pick-up options",
      "Add and edit products yourself",
    ],
  },
  {
    id: "redesign",
    name: "Website Redesign / Fix",
    price: 199,
    pricePrefix: "From",
    priceNote: "one-time",
    idealFor: "Businesses with an old or broken site",
    summary: "Bring an outdated or broken website back to life.",
    delivery: "Usually 5–7 days",
    includes: [
      "Free review of your current website",
      "Modern, mobile-friendly redesign",
      "Fix broken pages, forms and slow loading",
      "Your content moved over, your domain kept",
      "Fixed quote before any work starts",
    ],
  },
];

export const carePlan: OfferPackage = {
  id: "care",
  name: "Care Plan",
  price: 29,
  priceNote: "/ month",
  idealFor: "Any website I build",
  summary: "I look after your website so you can look after your business.",
  delivery: "Starts the day your site goes live. Cancel anytime.",
  includes: [
    "Small changes: prices, opening hours, photos, text",
    "Regular backups",
    "Security and software updates",
    "Uptime monitoring",
  ],
};

export const allPackageOptions = [...packages, carePlan].map((p) => ({ id: p.id, label: p.name }));

export const steps = [
  {
    title: "Free demo",
    text: "Tell me about your business and send what you have: logo, menu, photos. I build a working demo of your website, free and with no obligation.",
  },
  {
    title: "Your feedback",
    text: "Open the demo on your phone and tell me what to change. You only pay once you're happy with it.",
  },
  {
    title: "Launch in 7 days",
    text: "I finish the site, connect your domain and put it live. Most websites are online within 7 days.",
  },
];

export const faq = [
  {
    q: "How do I pay?",
    a: "All prices are in US dollars. Payment is by bank transfer (SWIFT) to my Garanti BBVA account: 50% when you approve your demo, 50% before launch. Every payment is invoiced.",
  },
  {
    q: "Do I need my own hosting or domain?",
    a: "No. The Business Website includes your domain name and the first year of hosting. For other packages I can host the site for you, or set it up on the hosting and domain you already have. Hosting after the first year renews at cost, with no markup.",
  },
  {
    q: "Can I ask for changes?",
    a: "Yes. Before launch you can ask for changes to the demo until it feels right for your business, within the scope of the package. After launch, small changes are included in the Care Plan, or I quote them up front.",
  },
  {
    q: "How do we communicate?",
    a: "In writing, by email or WhatsApp. Everything we agree is written down, nothing gets lost, and time zones don't get in the way. No calls or meetings needed.",
  },
  {
    q: "What do you need from me?",
    a: "Your business name, logo (if you have one), menu or services with prices, opening hours, address and a few photos. If you don't have good photos, I can use properly licensed stock photos.",
  },
  {
    q: "Is the demo really free?",
    a: "Yes. I build the demo first so you can see exactly what you're getting. If it's not for you, you don't pay anything.",
  },
];
