import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-backed Supabase clients for the App Router.
 *
 * Server components, server actions and middleware all need the same client
 * with different cookie plumbing, so the shape is defined once here.
 */

export type CookieToSet = { name: string; value: string; options: CookieOptions };

export type CookieBridge = {
  getAll: () => { name: string; value: string }[];
  setAll: (cookies: CookieToSet[]) => void;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Returns null when Supabase isn't configured, so callers can degrade. */
export function createSupabaseServerClient(cookies: CookieBridge): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createServerClient(url, anonKey, { cookies });
}
