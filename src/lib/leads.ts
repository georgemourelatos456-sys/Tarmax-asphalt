import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import type { QuoteData } from "@/lib/validation";
import type { Lead, LeadStatus } from "@/types/lead";

/**
 * Lead persistence. All access goes through the service-role client, which is
 * server-only — the browser never touches the leads table directly.
 */

export type SaveResult =
  | { ok: true; lead: Lead | null }
  /** `skipped` means storage is not configured, not that the write failed. */
  | { ok: false; reason: "skipped" | "error" };

export async function saveLead(input: QuoteData): Promise<SaveResult> {
  const db = supabaseAdmin();
  if (!db) return { ok: false, reason: "skipped" };

  const { data, error } = await db
    .from("leads")
    .insert({
      full_name: input.fullName,
      phone: input.phone ?? null,
      email: input.email ?? null,
      property_address: input.propertyAddress,
      property_type: input.propertyType ?? null,
      service: input.service ?? null,
      message: input.message ?? null,
      status: "new" satisfies LeadStatus,
    })
    .select()
    .single();

  if (error) {
    // Logged for the operator; never surfaced to the customer.
    console.error("[leads] insert failed:", error.message);
    return { ok: false, reason: "error" };
  }

  return { ok: true, lead: data as Lead };
}

export async function listLeads(): Promise<Lead[]> {
  const db = supabaseAdmin();
  if (!db) return [];

  const { data, error } = await db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[leads] list failed:", error.message);
    return [];
  }
  return (data ?? []) as Lead[];
}

/**
 * Sets or clears the planned site-visit time. Pass null to unschedule.
 */
export async function updateLeadSchedule(id: string, scheduledAt: string | null): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return false;

  const { error } = await db.from("leads").update({ scheduled_at: scheduledAt }).eq("id", id);
  if (error) {
    console.error("[leads] schedule update failed:", error.message);
    return false;
  }
  return true;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return false;

  const { error } = await db.from("leads").update({ status }).eq("id", id);
  if (error) {
    console.error("[leads] status update failed:", error.message);
    return false;
  }
  return true;
}
