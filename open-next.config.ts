import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cloudflare build configuration for the Next.js app.
 *
 * Deliberately bare. The site has no database, no sessions and no incremental
 * static regeneration — every page is either prerendered at build time or, in
 * the case of the quote submission and /api/health, computed per request. So
 * there is no cache backend to wire up, no KV namespace, no R2 bucket, and
 * nothing here that needs provisioning before a deploy will work.
 *
 * If ISR is ever introduced, this is where the incremental cache would be
 * configured.
 */
export default defineCloudflareConfig();
