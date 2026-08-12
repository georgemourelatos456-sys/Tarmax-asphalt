import { BUSINESS, DIRECTORS, SITE_URL } from "@/config/business";

/**
 * LocalBusiness structured data.
 *
 * Only facts TARMAX has actually supplied appear here. There is deliberately
 * no streetAddress, no openingHours, no aggregateRating and no award — the
 * business has not published them, and inventing them would be both false and
 * a structured-data policy violation.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    url: SITE_URL,
    description: BUSINESS.tagline,
    email: BUSINESS.generalEmail,
    telephone: BUSINESS.phoneHref,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: {
      "@type": "City",
      name: BUSINESS.city,
      containedInPlace: { "@type": "State", name: BUSINESS.regionName },
    },
    // Name and role only. Structured data is published data, and neither the
    // directors' addresses nor personal numbers appear anywhere on the site —
    // putting them here would hand them to every crawler that reads the page.
    employee: DIRECTORS.map((d) => ({
      "@type": "Person",
      name: d.name,
      jobTitle: d.role,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Asphalt maintenance services",
      itemListElement: [
        "Sealcoating",
        "Hot rubber crack sealing",
        "Infrared asphalt repair",
        "Commercial parking lot maintenance",
        "Residential driveway maintenance",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name, areaServed: BUSINESS.city },
      })),
    },
  };
}
