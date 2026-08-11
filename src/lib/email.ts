import "server-only";

import { Resend } from "resend";
import { BUSINESS, DIRECTORS, mapsSearchUrl } from "@/config/business";
import type { QuoteData } from "@/lib/validation";

/**
 * Transactional email for quote requests.
 *
 * Two messages go out: a work order to TARMAX and a confirmation to the
 * customer (only if they supplied an email). Both are plain and table-free
 * beyond what email clients handle reliably — this is an operational notice,
 * not a newsletter.
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || `TARMAX Asphalt <onboarding@resend.dev>`;

export const emailConfigured = Boolean(apiKey);

const client = apiKey ? new Resend(apiKey) : null;

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

/**
 * Notifies TARMAX. This is the message the business actually works from, and
 * the second durable copy of a lead — so it is sent even when the database
 * write failed, carrying a warning that says exactly that.
 */
async function sendAdminEmail(lead: QuoteData, stored: boolean) {
  if (!client) return false;

  const mapsUrl = mapsSearchUrl(lead.propertyAddress);
  const warning = stored
    ? ""
    : `<p style="margin:0 0 18px;padding:14px 16px;background:#fdecec;border-left:4px solid #b51f24;font-size:14px;line-height:1.5">
        <strong>This lead was not saved to the dashboard.</strong> The database
        did not accept it, so this email is the only record. Copy the details
        below somewhere safe before replying.
      </p>`;

  const body =
    header(
      `${stored ? "" : "[NOT SAVED] "}New quote request — ${lead.propertyAddress}`,
    ) +
    warning +
    `<table style="width:100%;border-collapse:collapse">
      ${row("Customer name", lead.fullName)}
      ${row("Phone", lead.phone ?? "Not provided")}
      ${row("Email", lead.email ?? "Not provided")}
      ${row("Property address", lead.propertyAddress)}
      ${row("Property type", lead.propertyType ?? "Not specified")}
      ${row("Requested service", lead.service ?? "Not specified")}
      ${row("Message", lead.message ?? "None")}
    </table>
    <a href="${esc(mapsUrl)}" style="display:inline-block;margin-top:22px;background:#b51f24;color:#ffffff;text-decoration:none;padding:14px 22px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">Open in Google Maps</a>
    <p style="margin:18px 0 0;font-size:12px;color:#77787b">Measure the property from the map view, then contact the customer using the details above.</p>
  </div>`;

  const { error } = await client.emails.send({
    from,
    to: BUSINESS.generalEmail,
    replyTo: lead.email ?? undefined,
    // The prefix makes an unsaved lead obvious in the inbox list, before
    // the message is even opened.
    subject: `${stored ? "" : "[NOT SAVED] "}New TARMAX Quote Request — ${lead.propertyAddress}`,
    html: shell(body),
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
 * Sends both messages. The admin notification is the one that matters; a
 * failed customer confirmation is logged but never fails the submission.
 */
export async function sendQuoteEmails(
  lead: QuoteData,
  { stored }: { stored: boolean } = { stored: true },
) {
  if (!client) return { admin: false, customer: false, skipped: true as const };

  const [admin, customer] = await Promise.all([
    sendAdminEmail(lead, stored),
    sendCustomerEmail(lead),
  ]);
  return { admin, customer, skipped: false as const };
}
