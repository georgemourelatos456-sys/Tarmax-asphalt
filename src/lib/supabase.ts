import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients.
 *
 * Every integration on this site is optional at runtime: the marketing pages
 * must build and serve with no credentials configured, and a missing key must
 * never take down the quote form. Callers check `isConfigured` and degrade.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && anonKey);
export const supabaseAdminConfigured = Boolean(url && serviceKey);

/**
 * Server-only client. The service role key bypasses row level security, so
 * this must never be imported into a client component — importing it from the
 * browser would not even have the key, but the guard below makes the mistake
 * loud rather than silent.
 */
export function supabaseAdmin(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin() is server-only.");
  }
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public client, safe for the browser. Used by the /admin sign-in flow. */
export function supabaseBrowser(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
