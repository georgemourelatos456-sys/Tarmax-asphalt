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

/**
 * Which of our own variable names the platform actually injected.
 *
 * Environment variable names are case sensitive, and a lowercase `resend_api_key`
 * is a different variable from `RESEND_API_KEY` — invisible to the code and
 * indistinguishable, from the outside, from not having set it at all. Listing
 * the names as they really are turns that into a one-glance answer.
 *
 * Names only, and only ones matching the handful this site defines. No values,
 * and nothing else in the environment is enumerated.
 */
const OURS = /^(resend_api_key|resend_from|lead_email_to|next_public_site_url|quote_rate_limit_max)$/i;

function variableNamesFound() {
  return Object.keys(process.env).filter((k) => OURS.test(k)).sort();
}

export function GET() {
  const from = process.env.RESEND_FROM ?? "";
  // "Name <local@domain.tld>" or a bare address; anything else Resend rejects.
  const fromValid = /^(.*<\s*)?[^@\s<>]+@[^@\s<>]+\.[a-z]{2,}(\s*>)?$/i.test(from.trim());
  const apiKeyPresent = Boolean(process.env.RESEND_API_KEY);

  const ready = apiKeyPresent && fromValid;
  const found = variableNamesFound();
  // Names that are ours but not spelled the way the code reads them.
  const miscased = found.filter((k) => k !== k.toUpperCase());

  return Response.json(
    {
      ready,
      diagnosis: ready
        ? "This deployment can send email. If a submission still does not arrive, the send is being rejected — check Runtime Logs for a line starting [email]."
        : miscased.length > 0
          ? `Found ${miscased.join(", ")} — environment variable names are CASE SENSITIVE, so these are different variables from the ones the code reads. Rename them to uppercase in Vercel, then redeploy.`
          : found.length === 0
            ? "None of this site's variables reached this build at all. Check you are editing the same project that serves this URL, that the environment includes production, and that you redeployed afterwards."
            : !apiKeyPresent
              ? "RESEND_API_KEY is not visible to this build. Add it in Vercel, then REDEPLOY — saving a variable does not affect a build that already happened."
              : "RESEND_FROM is missing or malformed. It must look like: TARMAX Asphalt <onboarding@resend.dev>",
      // Exactly as the platform spelled them. Names only, never values.
      variableNamesFound: found,
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
      // Whichever host is serving this. Vercel and Cloudflare expose the same
      // facts under different names, so both are read and the first hit wins.
      host: process.env.VERCEL_DEPLOYMENT_ID
        ? "vercel"
        : process.env.CF_PAGES_COMMIT_SHA || process.env.WORKERS_CI_COMMIT_SHA
          ? "cloudflare"
          : "local",
      commit:
        (
          process.env.VERCEL_GIT_COMMIT_SHA ??
          process.env.WORKERS_CI_COMMIT_SHA ??
          process.env.CF_PAGES_COMMIT_SHA
        )?.slice(0, 7) ?? "local",
      // Changes on every deployment, including a redeploy of the same commit.
      // The commit alone cannot tell you whether a redeploy actually landed;
      // this can.
      deployment: process.env.VERCEL_DEPLOYMENT_ID ?? process.env.CF_VERSION_METADATA_ID ?? "local",
      branch:
        process.env.VERCEL_GIT_COMMIT_REF ??
        process.env.WORKERS_CI_BRANCH ??
        process.env.CF_PAGES_BRANCH ??
        "local",
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
