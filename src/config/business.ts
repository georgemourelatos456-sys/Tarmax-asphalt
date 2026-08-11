/**
 * Single source of truth for every piece of TARMAX contact and business
 * information. Nothing here should be duplicated inside components — import
 * from this file instead so a phone number only ever changes in one place.
 */

export type Contact = {
  /** Full name as it should be displayed. */
  name: string;
  /** Given name, used for short button labels like "CALL NOVA". */
  firstName: string;
  role: string;
  /** Display form, e.g. "587-897-0566". */
  phone: string;
  /** E.164 form for the tel: href. */
  phoneHref: string;
  email: string;
};

export const DIRECTORS: readonly Contact[] = [
  {
    name: "Nova Sanoy",
    firstName: "Nova",
    role: "Director",
    phone: "587-897-0566",
    phoneHref: "+15878970566",
    email: "Nova@tarmaxasphalt.com",
  },
  {
    name: "George Mourelatos",
    firstName: "George",
    role: "Director",
    phone: "403-605-3511",
    phoneHref: "+14036053511",
    email: "George@tarmaxasphalt.com",
  },
] as const;

export const BUSINESS = {
  name: "TARMAX Asphalt",
  shortName: "TARMAX",
  /** City and province only — TARMAX has no published street address. */
  city: "Calgary",
  region: "AB",
  regionName: "Alberta",
  country: "CA",
  serviceArea: "Calgary and surrounding communities",
  generalEmail: "admin@tarmaxasphalt.com",
  directors: DIRECTORS,
  /** Primary phone used for single-number contexts such as schema.org. */
  primaryPhone: DIRECTORS[0].phone,
  primaryPhoneHref: DIRECTORS[0].phoneHref,
  tagline:
    "Preventative asphalt maintenance for Calgary driveways and parking lots.",
} as const;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tarmaxasphalt.com"
).replace(/\/$/, "");

/** `tel:` href for a contact. */
export const telHref = (c: Contact) => `tel:${c.phoneHref}`;

/** `mailto:` href, optionally with a prefilled subject. */
export const mailtoHref = (email: string, subject?: string) =>
  subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;

/**
 * Google Maps search link for an arbitrary address string. Uses the public
 * search endpoint so no Maps API key is required anywhere in the stack.
 */
export const mapsSearchUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

/** Top-level navigation. Homepage anchors plus the two standalone pages. */
export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Why Maintenance Matters", href: "/#freeze-thaw" },
  { label: "Commercial", href: "/commercial" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;
