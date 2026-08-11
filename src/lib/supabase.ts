import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase surface.
 *
 * This module is imported by client components, so it must never reference the
 * service role key — not even by name. Next only inlines NEXT_PUBLIC_* values,
 * so a stray reference would not leak the secret itself, but it would ship the
 * privileged code path to the browser and leave one bundler-config change
 * between us and a real disclosure. The admin client lives in
 * `supabase-admin.ts`, which is marked server-only.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

/** Public client, safe for the browser. Used by the /admin sign-in flow. */
export function supabaseBrowser(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
