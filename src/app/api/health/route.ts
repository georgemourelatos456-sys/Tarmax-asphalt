import { RECIPIENTS } from "@/lib/email";
import { SITE_URL } from "@/config/business";

/**
 * Configuration check for the lead pipeline.
 *
 * Answers one question without needing a test submission: does the running
 * deployment actually have what it needs to email a quote request? Environment
 * variables only take effect on a new build, so "I saved it in Vercel" and
 * "the live site can see it" are different facts, and this is the one that
 * matters.
 *
 * Deliberately leaks nothing. It reports whether values are present and
 * whether they are shaped correctly — never the API key, not even its length
 * or prefix. The recipient addresses are already published in the site footer.
 */

export const dynamic = "force-dynamic";

export function GET() {
  const from = process.env.RESEND_FROM ?? "";
  // "Name <local@domain.tld>" or a bare address; anything else Resend rejects.
  const fromValid = /^(.*<\s*)?[^@\s<>]+@[^@\s<>]+\.[a-z]{2,}(\s*>)?$/i.test(from.trim());
  const apiKeyPresent = Boolean(process.env.RESEND_API_KEY);

  const ready = apiKeyPresent && fromValid;

  return Response.json(
    {
      ready,
      diagnosis: ready
        ? "This deployment can send email. If a submission still does not arrive, the send is being rejected — check Runtime Logs for a line starting [email]."
        : !apiKeyPresent
          ? "RESEND_API_KEY is not visible to this build. Add it in Vercel, then REDEPLOY — saving a variable does not affect a build that already happened."
          : "RESEND_FROM is missing or malformed. It must look like: TARMAX Asphalt <onboarding@resend.dev>",
      email: {
        apiKeyPresent,
        fromSet: from.length > 0,
        fromValid,
        // Not a secret: it appears in the header of every message sent.
        from: from || null,
        // Already public in the site footer.
        recipients: RECIPIENTS,
        overrideActive: Boolean(process.env.LEAD_EMAIL_TO),
      },
      siteUrl: SITE_URL,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      deployedAt: process.env.VERCEL_DEPLOYMENT_ID ? "vercel" : "local",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
