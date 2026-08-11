# TARMAX Asphalt

Marketing site and lead pipeline for TARMAX Asphalt — preventative asphalt
maintenance in Calgary, Alberta.

The site has one job: get a free quote request. A visitor should understand what
TARMAX does in about five seconds and be able to send their property address in
under a minute.

**Going live?** Follow [`SETUP.md`](SETUP.md). Until Supabase and Resend are
configured, a submitted quote is validated and logged but not stored or
emailed — the form looks like it worked and nothing arrives.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Supabase (Postgres + Auth) ·
Resend

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in, or leave blank for local development
npm run dev
```

The site builds and runs with **no credentials configured**. Supabase and Resend
degrade gracefully: quote submissions are validated and logged to the server
console instead of being stored or emailed, so the whole flow is testable
without accounts.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
```

## Environment

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are server
only and must never be prefixed with `NEXT_PUBLIC_`.

## Database

Run `supabase/schema.sql` once in the Supabase SQL editor. It creates the
`leads` table and enables row level security **with no public policies**, so the
anon key cannot read or write leads. All access goes through the service role
key on the server.

To give the directors dashboard access, create their users in Supabase Auth
(Authentication → Users → Add user). There is no public sign-up.

Already running an earlier version? The scheduling column is additive:

```sql
alter table public.leads add column if not exists scheduled_at timestamptz;
```

## How a lead is protected

A quote request is written to the database **first**, then emailed. That order
matters: a notification never arrives for a lead that was not recorded, and the
email can state whether it made it to the dashboard.

Every submission therefore ends up in two independent places — the `leads`
table and `admin@tarmaxasphalt.com`. Losing one still leaves the other.

If the database write fails, the email is sent anyway, with `[NOT SAVED]` in
the subject line and a warning at the top of the message. It is then the only
record, and it says so.

If both the database and the email fail, the complete request is written to the
server log as JSON, tagged `LEAD NOT CAPTURED`, so it can still be recovered
from the host's log viewer. Only then does the customer see an error — and that
error carries both directors' phone numbers, so the enquiry has somewhere to go.

A note on why there is no local file fallback: on Vercel and similar hosts the
filesystem is ephemeral and per-instance, so a file written during a request can
vanish with the container. The email inbox is the durable second copy instead.

## Scheduling estimates

Customers never pick a slot. The flow stays: customer sends an address →
TARMAX reviews the property → a director makes contact → the visit is booked
from the dashboard.

Each lead in `/admin` has a **Schedule visit** control. Once a time is set the
lead shows it inline, an **Upcoming visits** filter lists everything still
ahead in date order, and two buttons hand the event to whatever calendar you
already use:

- **Add to Google Calendar** — opens a prefilled event on Google's public
  template endpoint.
- **Download .ics** — a standards-compliant calendar file that imports into
  Google, Apple Calendar or Outlook.

Both carry the customer's name, phone, email, requested service, notes and a
Google Maps link to the property.

Neither needs an API key, OAuth consent, or any third-party access to the
directors' calendars — which is why scheduling works the day you deploy. If you
later want events written directly into a shared TARMAX calendar, the visit
time already lives on the lead; only the delivery step in `src/lib/calendar.ts`
changes.

## Project layout

```
src/
  app/
    page.tsx                    homepage
    free-quote/                 quote form + call/email
    services/                   all five services
    commercial/                 parking lot maintenance
    driveway-sealcoating/       homeowner guide (lifespan, Black Mac, FAQ)
    about/                      why the company was started
    admin/                      protected lead dashboard
    actions/submit-quote.ts     server action for the quote form
  components/
    layout/                     nav, footer, mobile action bar, wordmark
    sections/                   homepage sections
    forms/                      quote form
    ui/                         primitives (Surface, Seam, Reveal, Labels)
  config/
    business.ts                 all contact details — single source of truth
    content.ts                  service and condition copy
  lib/
    validation.ts               one Zod schema, client and server
    leads.ts                    lead storage
    email.ts                    Resend notifications
    schema.ts                   LocalBusiness structured data
scripts/                        asset generation (see below)
supabase/schema.sql             database setup
```

### Contact details

Every phone number and email address lives in `src/config/business.ts`. Nothing
is hard-coded in components. Change a number there and it updates the nav,
footer, contact section, quote page, mobile call sheet and transactional email
together.

## Security

Headers are set in `next.config.ts`. The Content Security Policy is the part
that matters: every resource is pinned to this origin, so no external script
can run, no iframe can load and no injected form can post off-site. That closes
the routes injected ads and pop-ups arrive through. Alongside it: HSTS,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`, `frame-ancestors 'none'`
and `nosniff`.

**This is a browser-side control, not a server firewall.** WAF rules, bot
filtering and DDoS absorption come from the host (Vercel, Cloudflare) and need
enabling there as well.

Other measures:

- **Lead table.** RLS on with no public policies, so the anon key cannot read
  or write it. All access is through the service-role key, which lives only in
  `src/lib/supabase-admin.ts` behind a `server-only` import.
- **Rate limiting.** Ten quote submissions per client per 15 minutes
  (`QUOTE_RATE_LIMIT_MAX`). Deliberately generous — blocking a real customer is
  the expensive mistake — and a throttled visitor is still shown both
  directors' phone numbers.
- **Honeypot.** A hidden `company` field. Filled values are accepted and
  discarded silently rather than rejected, so neither a bot nor a customer
  whose password manager autofills it ever sees an error.
- **Escaping.** No user-supplied HTML is ever rendered. React escapes form
  input; the transactional email templates escape it explicitly.

## Generated assets

The site ships no stock photography. Imagery is generated from the material
itself and committed to the repo — regenerate only when changing the art
direction.

```bash
node scripts/generate-textures.mjs    # asphalt surfaces -> public/textures/*.svg
node scripts/rasterize-textures.mjs   # bake to JPEG (needs: npm i -D playwright)
node scripts/fetch-fonts.mjs          # refresh self-hosted fonts
```

**Textures** are layered fractal noise run through an SVG diffuse-lighting
filter. They are placeholders only — good enough as abstract material, but they
do not pass as photographs, and no amount of further tuning will make them.
Anything dropped into `public/photos/` overrides them automatically; see the
README in that folder.

**The wordmark** in `public/brand/tarmax-logo.png` is the supplied artwork.

**Fonts** (Manrope and Inter, both OFL) are self-hosted in `src/fonts/` rather
than fetched by `next/font/google`. That removes a network dependency from
`next build` and a third-party request from every page load.

## Notes for future work

- **Google Places autocomplete** can be added to the address field later. The
  site deliberately works with no Google API credentials; `mapsSearchUrl()` in
  `business.ts` builds a keyless Maps search link for the admin email and
  dashboard.
- **Google Calendar** is intentionally not integrated. The workflow is: customer
  submits an address → TARMAX reviews the property → TARMAX makes contact →
  TARMAX schedules internally.
- **Square footage** is not collected. TARMAX measures from the map or on site.
