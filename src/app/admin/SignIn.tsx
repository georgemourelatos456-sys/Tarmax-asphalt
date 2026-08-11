"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

/** Email + password sign-in for the two directors. No public sign-up. */
export function SignIn({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Sign-in isn't available right now.");
      setBusy(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    // Deliberately vague: never reveal whether the address exists.
    if (authError) {
      setError("That email and password don't match.");
      return;
    }
    router.refresh();
  }

  if (!configured) {
    return (
      <div className="border border-white/14 p-6">
        <h2 className="display-sm">Dashboard not configured</h2>
        <p className="mt-3 text-sm text-muted">
          Add the Supabase environment variables from <code>.env.example</code> to enable the lead
          dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm flex-col gap-5 border border-white/14 p-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="admin-email" className="label text-[0.6875rem] text-muted">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          className="field-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="label text-[0.6875rem] text-muted">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          className="field-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
