-- TARMAX Asphalt — leads table
--
-- Paste this whole file into the Supabase SQL editor and run it.
--
-- Safe to run more than once. Every statement is guarded, so re-running after
-- an upgrade (or because you are not sure whether it took) will not error and
-- will not touch existing rows.
--
-- Security model: row level security is ON with no policies, so the anon key
-- — the one shipped to browsers — can neither read nor write this table. All
-- access goes through the service role key, which lives only on the server in
-- src/lib/supabase-admin.ts behind a `server-only` import. The dashboard reads
-- through that same server path, after checking the signed-in director.

-- gen_random_uuid() is built into Postgres 13+, so this is belt and braces.
create extension if not exists "pgcrypto";

-- `create type` has no IF NOT EXISTS, and an error here would abort the rest
-- of the script, so it is guarded explicitly.
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'lead_status' and n.nspname = 'public'
  ) then
    create type public.lead_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');
  end if;
end
$$;

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
  status           public.lead_status not null default 'new',

  -- When TARMAX plans to attend the property. Set from the dashboard only;
  -- customers never choose a slot.
  scheduled_at     timestamptz,

  -- Mirrors the form rule: an address is useless without a way to reply.
  constraint leads_contact_present check (phone is not null or email is not null)
);

-- Upgrade path for a leads table created before scheduling existed. No-op on
-- a fresh install.
alter table public.leads add column if not exists scheduled_at timestamptz;

-- The dashboard lists newest first, filters by status, and shows upcoming
-- visits in date order.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_scheduled_at_idx on public.leads (scheduled_at)
  where scheduled_at is not null;

alter table public.leads enable row level security;

-- No policies are defined, on purpose. With RLS enabled and no policy, the
-- anon and authenticated roles are denied everything; the service role bypasses
-- RLS. If you ever want the directors' browsers to query leads directly, add an
-- explicit policy here rather than loosening the server path.

-- Confirms the table is in place and shows how many leads it holds.
select
  (select count(*) from public.leads) as lead_count,
  (select relrowsecurity from pg_class where oid = 'public.leads'::regclass) as rls_enabled;
