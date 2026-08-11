import "server-only";

import { Resend } from "resend";
import { BUSINESS, DIRECTORS, mapsSearchUrl } from "@/config/business";
import { googleCalendarUrl } from "@/lib/calendar";
import type { QuoteData } from "@/lib/validation";

/**
 * Transactional email for quote requests.
 *
 * There is no database. This email IS the lead record, which changes what it
 * has to carry: every field the customer submitted, a map link to the property
 * and a one-click calendar event, so the whole job can be worked from the
 * inbox without opening anything else.
 *
 * It goes to the shared mailbox and to both directors, so a lead is sitting in
 * three inboxes rather than one.
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || `TARMAX Asphalt <onboarding@resend.dev>`;

export const emailConfigured = Boolean(apiKey);

const client = apiKey ? new Resend(apiKey) : null;

/**
 * Everyone who should receive a new lead. Deduplicated and lowercased because
 * some providers treat a repeated recipient as an error.
 */
const RECIPIENTS = Array.from(
  new Set([BUSINESS.generalEmail, ...DIRECTORS.map((d) => d.email)].map((e) => e.toLowerCase())),
);

/** Escapes interpolated values so customer input cannot inject markup. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const shell = (body: string) => `<!doctype html>
<html><body style="margin:0;background:#f4f2ed;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0b0b0c">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2ded4">
${body}
</div>
</body></html>`;

const header = (title: string) => `
<div style="background:#0b0b0c;padding:22px 24px">
  <div style="color:#c8171e;font-size:20px;font-weight:800;letter-spacing:-0.02em;font-style:italic">TARMAX</div>
  <div style="color:#9c9da0;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;margin-top:2px">Asphalt</div>
</div>
<div style="padding:24px">
  <h1 style="margin:0 0 18px;font-size:18px;line-height:1.3">${esc(title)}</h1>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;border-bottom:1px solid #eeebe3;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#77787b;width:38%;vertical-align:top">${esc(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eeebe3;font-size:14px;vertical-align:top">${esc(value)}</td>
  </tr>`;

const button = (href: string, label: string, primary = true) => `
  <a href="${esc(href)}" style="display:inline-block;margin:0 8px 10px 0;background:${
    primary ? "#b51f24" : "#0b0b0c"
  };color:#ffffff;text-decoration:none;padding:13px 20px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">${esc(label)}</a>`;

/**
 * Notifies TARMAX. Without a database this is the lead's only durable copy, so
 * it is written to be worked from directly: contact details, a plain-text block
 * that survives copy-paste, and the two actions that follow a new enquiry.
 */
async function sendAdminEmail(lead: QuoteData) {
  if (!client) return false;

  const plain = [
    `Name: ${lead.fullName}`,
    `Phone: ${lead.phone ?? "Not provided"}`,
    `Email: ${lead.email ?? "Not provided"}`,
    `Address: ${lead.propertyAddress}`,
    `Property: ${lead.propertyType ?? "Not specified"}`,
    `Service: ${lead.service ?? "Not specified"}`,
    `Message: ${lead.message ?? "None"}`,
  ].join("\n");

  const body =
    header(`New quote request — ${lead.propertyAddress}`) +
    `<table style="width:100%;border-collapse:collapse">
      ${row("Customer name", lead.fullName)}
      ${row("Phone", lead.phone ?? "Not provided")}
      ${row("Email", lead.email ?? "Not provided")}
      ${row("Property address", lead.propertyAddress)}
      ${row("Property type", lead.propertyType ?? "Not specified")}
      ${row("Requested service", lead.service ?? "Not specified")}
      ${row("Message", lead.message ?? "None")}
    </table>

    <div style="margin-top:24px">
      ${button(mapsSearchUrl(lead.propertyAddress), "Open in Google Maps")}
      ${button(googleCalendarUrl(lead), "Book the estimate", false)}
    </div>

    <p style="margin:14px 0 0;font-size:12px;color:#77787b;line-height:1.6">
      Measure the property from the map view, then contact the customer.
      &ldquo;Book the estimate&rdquo; opens a prefilled calendar event &mdash; pick the time
      that suits you.
    </p>

    <p style="margin:22px 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#77787b">Plain text copy</p>
    <pre style="margin:0;padding:14px 16px;background:#f4f2ed;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-word">${esc(plain)}</pre>
  </div>`;

  const { error } = await client.emails.send({
    from,
    to: RECIPIENTS,
    replyTo: lead.email ?? undefined,
    subject: `New TARMAX Quote Request — ${lead.propertyAddress}`,
    html: shell(body),
    text: `New quote request\n\n${plain}\n\nMap: ${mapsSearchUrl(lead.propertyAddress)}`,
  });

  if (error) {
    console.error("[email] admin notification failed:", error.message);
    return false;
  }
  return true;
}

/** Confirms receipt to the customer. Deliberately promises no timeframe. */
async function sendCustomerEmail(lead: QuoteData) {
  if (!client || !lead.email) return false;

  const firstName = lead.fullName.split(" ")[0];
  const contacts = DIRECTORS.map(
    (d) =>
      `<li style="margin-bottom:6px">${esc(d.name)}, ${esc(d.role)} — <a href="tel:${d.phoneHref}" style="color:#b51f24">${esc(d.phone)}</a></li>`,
  ).join("");

  const body =
    header("We've received your quote request") +
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">Thanks, ${esc(firstName)}.</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">We have your property information and will review:</p>
    <p style="margin:0 0 18px;padding:14px 16px;background:#f4f2ed;font-size:15px;font-weight:600">${esc(lead.propertyAddress)}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">TARMAX will contact you using the details you provided. If you'd rather reach us first:</p>
    <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.6">${contacts}</ul>
  </div>`;

  const { error } = await client.emails.send({
    from,
    to: lead.email,
    subject: "TARMAX Asphalt — we've received your quote request",
    html: shell(body),
  });

  if (error) {
    console.error("[email] customer confirmation failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Sends both messages. The admin notification is the one that matters — it is
 * the lead record — so a failed customer confirmation is logged and ignored.
 */
export async function sendQuoteEmails(lead: QuoteData) {
  if (!client) return { admin: false, customer: false, skipped: true as const };

  const [admin, customer] = await Promise.all([sendAdminEmail(lead), sendCustomerEmail(lead)]);
  return { admin, customer, skipped: false as const };
}
