import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client. Server only.
 *
 * The service role key bypasses row level security, which is the entire reason
 * the leads table can have RLS enabled with no public policies. The
 * `server-only` import above turns any accidental client import into a build
 * error rather than a silent bundle inclusion.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminConfigured = Boolean(url && serviceKey);

/** Returns null when unconfigured, so callers can degrade rather than throw. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
