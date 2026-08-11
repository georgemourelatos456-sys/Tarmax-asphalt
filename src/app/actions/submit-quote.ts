"use server";

import { headers } from "next/headers";

import { saveLead } from "@/lib/leads";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { sendQuoteEmails } from "@/lib/email";
import { quoteSchema, type QuoteInput } from "@/lib/validation";

export type QuoteResult =
  | { ok: true; firstName: string; propertyAddress: string }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

/**
 * The one thing this site exists to do.
 *
 * Validation runs again here regardless of what the browser did. Nothing the
 * customer sees on failure comes from a database driver or an email provider —
 * the route logs the detail and returns one plain sentence.
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

  // A filled honeypot is a bot. Return success so it learns nothing.
  if (lead.company) {
    return { ok: true, firstName: lead.fullName.split(" ")[0], propertyAddress: lead.propertyAddress };
  }

  const [saved, emailed] = await Promise.all([
    saveLead(lead).catch((e) => {
      console.error("[quote] save threw:", e);
      return { ok: false as const, reason: "error" as const };
    }),
    sendQuoteEmails(lead).catch((e) => {
      console.error("[quote] email threw:", e);
      return { admin: false, customer: false, skipped: false as const };
    }),
  ]);

  // The request is captured if it reached storage or reached TARMAX's inbox.
  // Only when both fail has the lead genuinely been lost.
  const captured = saved.ok || emailed.admin;

  if (!captured) {
    const storageDown = !saved.ok && saved.reason === "error";
    const nothingConfigured = !saved.ok && saved.reason === "skipped" && emailed.skipped;

    if (nothingConfigured) {
      // Local development with no credentials: log it so the flow is testable.
      console.warn("[quote] no storage or email configured — lead logged only:", {
        ...lead,
        company: undefined,
      });
      return {
        ok: true,
        firstName: lead.fullName.split(" ")[0],
        propertyAddress: lead.propertyAddress,
      };
    }

    console.error("[quote] lead not captured", { storageDown, emailSkipped: emailed.skipped });
    return {
      ok: false,
      formError: "We couldn't submit your request right now. Please contact TARMAX directly.",
    };
  }

  return {
    ok: true,
    firstName: lead.fullName.split(" ")[0],
    propertyAddress: lead.propertyAddress,
  };
}
