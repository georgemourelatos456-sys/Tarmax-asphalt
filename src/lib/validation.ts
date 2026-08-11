import { z } from "zod";

/**
 * One schema, used by the browser form and the server route.
 *
 * The rule that matters: TARMAX needs an address and a way to reach you.
 * Everything else is optional, because every extra required field costs
 * submissions.
 */

/**
 * Loose on purpose. Canadians write phone numbers a dozen ways and none of
 * them should be rejected: 403-605-3511, (403) 605 3511, +1 403.605.3511.
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
    phone: z
      .string()
      .trim()
      .max(40)
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .refine((v) => v === undefined || (PHONE.test(v) && digitsOf(v).length >= 10 && digitsOf(v).length <= 11), {
        message: "Enter a phone number we can reach you on, or leave it blank.",
      }),
    email: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
        message: "Enter a valid email address, or leave it blank.",
      }),
    propertyType: optionalEnum(PROPERTY_TYPES),
    service: optionalEnum(SERVICE_OPTIONS),
    message: optionalText(2000),
    /** Hidden field. Real people leave it empty; bots fill it in. */
    company: z.string().max(0).optional(),
  })
  .refine((data) => Boolean(data.phone) || Boolean(data.email), {
    message: "Add a phone number or an email so we can send your quote.",
    path: ["phone"],
  });

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteData = z.output<typeof quoteSchema>;
