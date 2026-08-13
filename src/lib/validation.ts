import { z } from "zod";

/**
 * One schema, used by the browser form and the server route.
 *
 * Required: the property address, a name, a phone number and an email. Every
 * required field costs submissions, so nothing else is mandatory — the
 * property type, the service checkboxes and the message are all optional.
 */

/**
 * Loose on purpose. Canadians write phone numbers a dozen ways and none of
 * them should be rejected: 403-555-0142, (403) 555 0142, +1 403.555.0142.
 * Anything with 10 or 11 digits passes; correctness is settled by calling it.
 */
const PHONE = /^[+]?[\d\s().-]{7,}$/;
const digitsOf = (value: string) => value.replace(/\D/g, "");

export const PROPERTY_TYPES = ["Residential", "Commercial", "Condo / Apartment", "Other"] as const;

export const SERVICE_OPTIONS = [
  "Sealcoating",
  "Crack Sealing",
  "Infrared / Pothole Repair",
  "Parking Lot Maintenance",
  "Not Sure",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

/**
 * An unselected `<select>` submits "", which `z.enum().optional()` rejects as
 * an invalid value rather than treating as absent. Left unhandled that fails
 * the whole form for anyone who ignores the optional dropdowns — which is most
 * people — so empty is normalised to undefined before the enum sees it.
 */
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), z.enum(values).optional());

/**
 * A checkbox group, where a customer may want several things at once — a
 * driveway can need crack sealing *and* sealcoating, and forcing a single
 * choice hides half the job from the quote.
 *
 * React Hook Form gives an array when several are ticked, a bare string when
 * the markup collapses to one, and `false` or undefined when none are. All of
 * those normalise to "absent" or "a clean list of strings" before the enum
 * sees them, so an untouched group never fails the form.
 */
const optionalMultiEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess((v) => {
    if (v === undefined || v === null || v === "" || v === false) return undefined;
    const list = (Array.isArray(v) ? v : [v]).filter(
      (item): item is string => typeof item === "string" && item !== "",
    );
    return list.length > 0 ? list : undefined;
  }, z.array(z.enum(values)).optional());

export const quoteSchema = z
  .object({
    propertyAddress: z
      .string()
      .trim()
      .min(5, "Enter the property address so we can look it up.")
      .max(300, "That address is longer than we can accept."),
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your name.")
      .max(120, "That name is longer than we can accept."),
    // Both required. TARMAX wants to be able to call and to write, so the form
    // asks for both rather than either.
    phone: z
      .string()
      .trim()
      .min(1, "Enter a phone number so we can reach you.")
      .max(40)
      .refine((v) => PHONE.test(v) && digitsOf(v).length >= 10 && digitsOf(v).length <= 11, {
        message: "Enter a phone number we can reach you on.",
      }),
    email: z
      .string()
      .trim()
      .min(1, "Enter an email address so we can send your quote.")
      .max(200)
      .refine((v) => z.string().email().safeParse(v).success, {
        message: "Enter a valid email address.",
      }),
    propertyType: optionalEnum(PROPERTY_TYPES),
    services: optionalMultiEnum(SERVICE_OPTIONS),
    message: optionalText(2000),
    /**
     * Honeypot. Real people leave it empty; bots fill it in.
     *
     * Deliberately NOT validated as empty. Rejecting a filled value here would
     * surface a validation error the bot can learn from, and — more seriously —
     * would hard-block a real customer whose password manager autofills a field
     * named "company". The value is accepted and quietly discarded in
     * submitQuote instead.
     */
    company: z.string().max(200).optional(),
  });

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteData = z.output<typeof quoteSchema>;
