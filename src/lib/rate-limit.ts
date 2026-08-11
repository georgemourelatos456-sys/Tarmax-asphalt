import "server-only";

/**
 * Submission throttling for the quote form.
 *
 * Nothing else on the site writes data, so this is the only endpoint worth
 * flooding. A fixed window per client is enough to stop a script hammering the
 * form and filling the directors' inbox.
 *
 * Scope and honesty about it: this counter lives in the memory of one server
 * instance. On a single long-running server that is exactly right. On
 * serverless, each instance keeps its own counter, so a determined attacker
 * spread across instances gets a higher effective ceiling. It raises the cost
 * of abuse considerably; it is not a substitute for the host's WAF or DDoS
 * protection. Swap the two functions below for Vercel KV or Upstash if the
 * volume ever justifies shared state.
 */

/**
 * Tuned to be generous to people and still hostile to scripts.
 *
 * The expensive mistake here is blocking a real customer, not letting a bot
 * through — a property manager, a condo office or a household behind one NAT
 * can legitimately send several requests. Ten in fifteen minutes is far more
 * than any genuine visitor needs and far less than a flood.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.QUOTE_RATE_LIMIT_MAX ?? 10);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Drops expired buckets so the map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client identity from proxy headers. Spoofable in principle, but
 * the hosting proxy sets the leftmost X-Forwarded-For entry it observed.
 */
export function clientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
