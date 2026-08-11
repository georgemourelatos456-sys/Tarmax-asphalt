"use server";

import { headers } from "next/headers";

import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { sendQuoteEmails } from "@/lib/email";
import { quoteSchema, type QuoteInput } from "@/lib/validation";

export type QuoteResult =
  | { ok: true; firstName: string; propertyAddress: string }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

/**
 * The one thing this site exists to do.
 *
 * There is no database and no dashboard. A validated request is emailed to the
 * shared mailbox and both directors, and that email is the lead record. So the
 * send is the only thing standing between a customer and a lost enquiry — if
 * it fails, the request is written to the server log in full and the customer
 * is given phone numbers rather than a dead end.
 *
 * Validation runs again here regardless of what the browser did. Nothing the
 * customer sees on failure comes from the email provider — the detail is
 * logged and one plain sentence is returned.
 */
export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  // Throttle before doing any work, so a flood costs nothing downstream.
  const limit = checkRateLimit(clientKey(await headers()));
  if (!limit.allowed) {
    return {
      ok: false,
      formError:
        "That's a few requests in a short time. Please wait a few minutes, or contact TARMAX directly.",
    };
  }

  const parsed = quoteSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      // Keep the first message per field; later ones are usually noise.
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const lead = parsed.data;
  const accepted = {
    ok: true as const,
    firstName: lead.fullName.split(" ")[0],
    propertyAddress: lead.propertyAddress,
  };

  // A filled honeypot is a bot. Return success so it learns nothing.
  if (lead.company) return accepted;

  const emailed = await sendQuoteEmails(lead).catch((e) => {
    console.error("[quote] email threw:", e);
    return { admin: false, customer: false, skipped: false as const };
  });

  if (emailed.admin) {
    if (!emailed.customer && lead.email) {
      // The lead is safe; only the courtesy confirmation failed.
      console.warn("[quote] customer confirmation failed for:", lead.email);
    }
    return accepted;
  }

  if (emailed.skipped) {
    // Local development with no credentials: log it so the flow is testable.
    console.warn("[quote] email not configured — lead logged only:", {
      ...lead,
      company: undefined,
    });
    return accepted;
  }

  // Last line of defence. The notification did not go out, so the full request
  // goes to the server log where it can still be recovered from the host's log
  // viewer. Better an awkward copy-paste than a lost customer.
  console.error(
    "[quote] LEAD NOT CAPTURED — recover this manually:",
    JSON.stringify({ ...lead, company: undefined, receivedAt: new Date().toISOString() }),
  );
  return {
    ok: false,
    formError: "We couldn't submit your request right now. Please contact TARMAX directly.",
  };
}
