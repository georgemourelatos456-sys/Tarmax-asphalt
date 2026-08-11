"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { updateLeadSchedule, updateLeadStatus } from "@/lib/leads";
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

export async function getSession() {
  const supabase = await client(false);
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
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
