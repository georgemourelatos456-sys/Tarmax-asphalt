import { BUSINESS, mapsSearchUrl } from "@/config/business";
import type { Lead } from "@/types/lead";

/**
 * Turns a scheduled estimate into something a calendar can accept.
 *
 * Deliberately credential-free: a Google Calendar template URL and a generated
 * .ics file both work with no OAuth, no API key and no third-party access to
 * the directors' calendars. That covers Google, Apple and Outlook. If TARMAX
 * later wants events written directly into a shared calendar, the scheduling
 * data is already on the lead — only the delivery step changes.
 */

/** Default length of a site visit, in minutes. */
export const VISIT_MINUTES = 30;

/** Calendar timestamps are basic-format UTC: 20260811T150000Z */
function stamp(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function endOf(start: Date, minutes: number) {
  return new Date(start.getTime() + minutes * 60_000);
}

/** Human summary of who and where, shared by both formats. */
function details(lead: Lead) {
  return [
    `Customer: ${lead.full_name}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.email ? `Email: ${lead.email}` : null,
    lead.property_type ? `Property: ${lead.property_type}` : null,
    lead.service ? `Requested: ${lead.service}` : null,
    lead.message ? `Notes: ${lead.message}` : null,
    "",
    `Map: ${mapsSearchUrl(lead.property_address)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function eventTitle(lead: Lead) {
  return `Estimate — ${lead.full_name}`;
}

/**
 * Google Calendar's public "add event" endpoint. No API key involved; it just
 * opens a prefilled event the director confirms.
 */
export function googleCalendarUrl(lead: Lead, start: Date, minutes = VISIT_MINUTES) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(lead),
    dates: `${stamp(start)}/${stamp(endOf(start, minutes))}`,
    details: details(lead),
    location: lead.property_address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** RFC 5545 escaping: backslash, semicolon, comma and newline. */
function esc(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds long lines at 75 octets, as the spec requires. */
function fold(line: string) {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) parts.push(` ${rest}`);
  return parts.join("\r\n");
}

/** A single-event calendar file, importable by any calendar application. */
export function buildIcs(lead: Lead, start: Date, minutes = VISIT_MINUTES) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${BUSINESS.name}//Estimates//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:lead-${lead.id}@tarmaxasphalt.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(endOf(start, minutes))}`,
    `SUMMARY:${esc(eventTitle(lead))}`,
    `LOCATION:${esc(lead.property_address)}`,
    `DESCRIPTION:${esc(details(lead))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // CRLF throughout, per the spec.
  return lines.map(fold).join("\r\n");
}

export function icsFilename(lead: Lead) {
  const safe = lead.full_name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return `tarmax-estimate-${safe || "lead"}.ics`;
}
