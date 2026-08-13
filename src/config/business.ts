/**
 * Single source of truth for every piece of TARMAX contact and business
 * information. Nothing here should be duplicated inside components — import
 * from this file instead so a phone number only ever changes in one place.
 */

/**
 * A director. Names and roles appear on /about; the email addresses are how
 * leads reach them and are not published anywhere on the site.
 *
 * No phone numbers. TARMAX has one business line and every "call us" on the
 * site points at it, so a customer never has to choose which person to ring
 * and a number can change without touching a component.
 */
export type Contact = {
  /** Full name as it should be displayed. */
  name: string;
  /** Given name, for short labels. */
  firstName: string;
  role: string;
  email: string;
};

export const DIRECTORS: readonly Contact[] = [
  {
    name: "Nova Sanoy",
    firstName: "Nova",
    role: "Director",
    email: "Nova@tarmaxasphalt.com",
  },
  {
    name: "George Mourelatos",
    firstName: "George",
    role: "Director",
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
  /**
   * The only email address published on the site. One public address means a
   * customer never has to guess who to write to, and TARMAX can change who
   * actually reads it without the website going stale.
   *
   * Every quote request is delivered here. Who reads it is a mail-forwarding
   * decision, not a code change — adding or removing a director never requires
   * a redeploy, and a lead can never be lost to a mailbox that was never
   * created.
   */
  generalEmail: "sales@tarmaxasphalt.com",
  directors: DIRECTORS,
  /** The one number published anywhere on the site. Display form. */
  phone: "403-902-1416",
  /** E.164 form, for tel: hrefs and structured data. */
  phoneHref: "+14039021416",
  tagline:
    "Preventative asphalt maintenance for Calgary driveways and parking lots.",
} as const;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tarmaxasphalt.com"
).replace(/\/$/, "");

/**
 * The sealer TARMAX applies.
 *
 * `sdsUrl` is intentionally empty. It previously pointed at McAsphalt's SDS for
 * a solvent-cutback Blackmac — a different product from the emulsion actually
 * used here. Publishing the wrong safety sheet is worse than publishing none:
 * a customer following that link would have read a hazard profile for
 * something that never touches their driveway.
 *
 * To restore the link, put the URL of the *Blackmac Emulsion Sealer* sheet
 * here. The FAQ switches from "available on request" to a direct link on its
 * own once this is set. Link to McAsphalt's copy rather than a saved one, so
 * visitors always get the current revision.
 */
export const SEALER = {
  product: "Blackmac Emulsion Sealer",
  manufacturer: "McAsphalt Industries",
  sdsUrl: "",
} as const;

/**
 * `tel:` href. Takes the E.164 string rather than a person, because there is
 * one number and nothing should be able to introduce a second by accident.
 */
export const telHref = (phoneHref: string = BUSINESS.phoneHref) => `tel:${phoneHref}`;

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
