-- TARMAX Asphalt — leads table
--
-- Run once in the Supabase SQL editor.
--
-- Row level security is on with no public policies, so the anon key cannot
-- read or write leads. All access goes through the service role key, which
-- lives only on the server (see src/lib/supabase.ts). The dashboard reads
-- through that same server path after checking the director's session.

create extension if not exists "pgcrypto";

create type lead_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text not null,
  phone            text,
  email            text,
  property_address text not null,
  property_type    text,
  service          text,
  message          text,
  status           lead_status not null default 'new',

  -- Mirrors the form rule: an address is useless without a way to reply.
  constraint leads_contact_present check (phone is not null or email is not null)
);

-- The dashboard lists newest first and filters by status.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- No policies are defined on purpose. With RLS enabled and no policy, the anon
-- and authenticated roles are denied everything; the service role bypasses RLS.
-- If you later want the directors' browsers to query leads directly, add an
-- explicit policy here rather than loosening the server path.
