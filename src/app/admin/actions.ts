"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { updateLeadSchedule, updateLeadStatus } from "@/lib/leads";
import { BUSINESS, DIRECTORS } from "@/config/business";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

/**
 * Admin actions.
 *
 * Every mutation re-checks the session server-side. The dashboard rendering a
 * page is not authorization — a mutation has to prove it too.
 */

async function client(canWriteCookies: boolean) {
  const store = await cookies();
  return createSupabaseServerClient({
    getAll: () => store.getAll(),
    setAll: (items) => {
      if (!canWriteCookies) return;
      try {
        items.forEach(({ name, value, options }) => store.set(name, value, options));
      } catch {
        // Called during a Server Component render; middleware refreshes instead.
      }
    },
  });
}

/**
 * Who is allowed into the dashboard.
 *
 * Being signed in is NOT sufficient. Supabase projects permit public sign-up
 * by default, so "has a session" would let anyone who registered an account
 * read every customer's name, address and phone number. Access is restricted
 * to a known set of addresses instead.
 *
 * Defaults to the two directors and the general mailbox. ADMIN_EMAILS (comma
 * separated) adds others without a code change.
 */
function allowedEmails(): Set<string> {
  const configured = [
    ...DIRECTORS.map((d) => d.email),
    BUSINESS.generalEmail,
    ...(process.env.ADMIN_EMAILS ?? "").split(","),
  ];
  return new Set(
    configured.map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0),
  );
}

/**
 * Returns the signed-in director, or null. Null covers both "not signed in"
 * and "signed in but not authorised" — the dashboard treats them identically,
 * so an unauthorised account learns nothing from the difference.
 */
export async function getSession() {
  const supabase = await client(false);
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  if (!allowedEmails().has(user.email.toLowerCase())) {
    console.warn(`[admin] rejected sign-in from unauthorised address: ${user.email}`);
    return null;
  }
  return user;
}

export type AuthState =
  | { status: "anonymous" }
  /** A valid Supabase account that is not on the allow-list. */
  | { status: "forbidden"; email: string }
  | { status: "ok"; email: string };

/**
 * Distinguishes "not signed in" from "signed in but not a director", purely so
 * the page can explain itself. Authorisation decisions still go through
 * getSession(); this never grants anything.
 */
export async function getAuthState(): Promise<AuthState> {
  const supabase = await client(false);
  if (!supabase) return { status: "anonymous" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { status: "anonymous" };

  return allowedEmails().has(user.email.toLowerCase())
    ? { status: "ok", email: user.email }
    : { status: "forbidden", email: user.email };
}

export async function setLeadStatus(id: string, status: string) {
  const user = await getSession();
  if (!user) return { ok: false as const, error: "Not signed in." };

  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    return { ok: false as const, error: "Unknown status." };
  }

  const ok = await updateLeadStatus(id, status as LeadStatus);
  if (!ok) return { ok: false as const, error: "Couldn't update that lead." };

  revalidatePath("/admin");
  return { ok: true as const };
}

/**
 * Books or clears a site visit. Internal only — this never notifies the
 * customer, because a director confirms the time with them by phone first.
 */
export async function setLeadSchedule(id: string, isoOrNull: string | null) {
  const user = await getSession();
  if (!user) return { ok: false as const, error: "Not signed in." };

  let value: string | null = null;
  if (isoOrNull) {
    const when = new Date(isoOrNull);
    if (Number.isNaN(when.getTime())) {
      return { ok: false as const, error: "That date and time couldn't be read." };
    }
    value = when.toISOString();
  }

  const ok = await updateLeadSchedule(id, value);
  if (!ok) return { ok: false as const, error: "Couldn't save that visit time." };

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function signOut() {
  const supabase = await client(true);
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/admin");
}
