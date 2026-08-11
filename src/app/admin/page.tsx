import type { Metadata } from "next";
import { listLeads } from "@/lib/leads";
import { supabaseConfigured } from "@/lib/supabase";
import { getAuthState, getSession, signOut } from "@/app/admin/actions";
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
  const auth = await getAuthState();
  // Leads are only ever fetched behind the authorisation gate, never on the
  // strength of the auth state alone.
  const user = auth.status === "ok" ? await getSession() : null;
  const leads = user ? await listLeads() : [];

  return (
    <div className="on-dark min-h-screen bg-ink">
      <div className="shell section-tight pt-32 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>TARMAX</Eyebrow>
            <h1 className="display-lg mt-3">Leads</h1>
          </div>

          {auth.status !== "anonymous" && (
            <form action={signOut}>
              <p className="mb-2 text-right text-xs text-muted">{auth.email}</p>
              <button type="submit" className="admin-action">
                Sign out
              </button>
            </form>
          )}
        </div>

        <div className="mt-12">
          {user ? (
            <LeadTable leads={leads} />
          ) : auth.status === "forbidden" ? (
            <div className="max-w-md border border-alert/45 p-6">
              <h2 className="display-sm">This account can&rsquo;t open the dashboard</h2>
              <p className="mt-3 text-sm text-muted">
                {auth.email} is signed in but is not a TARMAX director. Sign out and use a
                director address, or ask for this one to be added.
              </p>
            </div>
          ) : (
            <SignIn configured={supabaseConfigured} />
          )}
        </div>
      </div>
    </div>
  );
}
