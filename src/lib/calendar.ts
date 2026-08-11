import { mapsSearchUrl } from "@/config/business";
import type { QuoteData } from "@/lib/validation";

/**
 * Turns a quote request into a calendar event a director can accept.
 *
 * There is no database and no stored visit time — the link goes in the
 * notification email and opens Google Calendar's public template endpoint with
 * everything filled in except the time. Whoever picks up the lead chooses when
 * to attend, in the calendar they already use.
 *
 * Deliberately credential-free: no OAuth, no API key, no third-party access to
 * anyone's calendar. It is a URL.
 */

/** Human summary of who and where, for the event body. */
function details(lead: QuoteData) {
  return [
    `Customer: ${lead.fullName}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.email ? `Email: ${lead.email}` : null,
    lead.propertyType ? `Property: ${lead.propertyType}` : null,
    lead.service ? `Requested: ${lead.service}` : null,
    lead.message ? `Notes: ${lead.message}` : null,
    "",
    `Map: ${mapsSearchUrl(lead.propertyAddress)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function eventTitle(lead: QuoteData) {
  return `Estimate — ${lead.fullName}`;
}

/**
 * Google Calendar's public "add event" endpoint.
 *
 * No `dates` parameter is sent on purpose. Google then opens the event editor
 * with the customer, address and notes prefilled and the time left blank, so
 * the director sets it against their real availability rather than against a
 * guess made by this code.
 */
export function googleCalendarUrl(lead: QuoteData) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(lead),
    details: details(lead),
    location: lead.propertyAddress,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
