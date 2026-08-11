import type { Metadata } from "next";
import { listLeads } from "@/lib/leads";
import { supabaseConfigured } from "@/lib/supabase";
import { getSession, signOut } from "@/app/admin/actions";
import { SignIn } from "@/app/admin/SignIn";
import { LeadTable } from "@/app/admin/LeadTable";
import { Eyebrow } from "@/components/ui/Labels";

export const metadata: Metadata = {
  title: "Leads",
  // Never index the dashboard.
  robots: { index: false, follow: false },
};

// Always render fresh — a cached lead list is a missed job.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSession();
  const leads = user ? await listLeads() : [];

  return (
    <div className="on-dark min-h-screen bg-ink">
      <div className="shell section-tight pt-32 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>TARMAX</Eyebrow>
            <h1 className="display-lg mt-3">Leads</h1>
          </div>

          {user && (
            <form action={signOut}>
              <p className="mb-2 text-right text-xs text-muted">{user.email}</p>
              <button type="submit" className="admin-action">
                Sign out
              </button>
            </form>
          )}
        </div>

        <div className="mt-12">
          {user ? <LeadTable leads={leads} /> : <SignIn configured={supabaseConfigured} />}
        </div>
      </div>
    </div>
  );
}
