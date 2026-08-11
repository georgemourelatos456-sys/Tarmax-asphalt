# TARMAX Asphalt

Marketing site and lead pipeline for TARMAX Asphalt — preventative asphalt
maintenance in Calgary, Alberta.

The site has one job: get a free quote request. A visitor should understand what
TARMAX does in about five seconds and be able to send their property address in
under a minute.

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

## Generated assets

The site ships no stock photography. Imagery is generated from the material
itself and committed to the repo — regenerate only when changing the art
direction.

```bash
node scripts/generate-textures.mjs    # asphalt surfaces -> public/textures/*.svg
node scripts/rasterize-textures.mjs   # bake to JPEG (needs: npm i -D playwright)
node scripts/generate-logo.mjs        # wordmark -> public/brand/*.svg
node scripts/fetch-fonts.mjs          # refresh self-hosted fonts
```

**Textures** are layered fractal noise run through an SVG diffuse-lighting
filter, producing real aggregate relief for each surface state the business
sells against — sealed, oxidized, cracked, potholed. They are baked to JPEG so
browsers never pay filter cost at paint time. To swap in real photography later,
replace the files in `public/textures/` and update the dimensions in
`src/components/ui/Surface.tsx`; no component changes are needed.

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
