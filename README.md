# TARMAX Asphalt

Marketing site and lead pipeline for TARMAX Asphalt — preventative asphalt
maintenance in Calgary, Alberta.

The site has one job: get a free quote request. A visitor should understand what
TARMAX does in about five seconds and be able to send their property address in
under a minute.

**Going live?** Follow [`SETUP.md`](SETUP.md). Until Resend is configured, a
submitted quote is validated and logged but never emailed — the form looks like
it worked and nothing arrives.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Resend

No database, no accounts, no sign-in. A quote request is emailed to the shared
mailbox and both directors, and that email is the lead record.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in, or leave blank for local development
npm run dev
```

The site builds and runs with **no credentials configured**. Email degrades
gracefully: quote submissions are validated and logged to the server console
instead of being sent, so the whole flow is testable without an account.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
```

## Environment

See `.env.example`. `RESEND_API_KEY` is server only and must never be prefixed
with `NEXT_PUBLIC_`.

## How a lead is protected

There is no database. A validated request is emailed to
`admin@tarmaxasphalt.com`, `Nova@tarmaxasphalt.com` and
`George@tarmaxasphalt.com` — three inboxes, so a missed lead means three people
missed it.

That email is written to be worked from directly: every submitted field, a
Google Maps link to measure the property from, a plain-text block that survives
copy-paste into a phone, and a **Book the estimate** button.

If the send fails, the complete request is written to the server log as JSON,
tagged `LEAD NOT CAPTURED`, so it can still be recovered from the host's log
viewer. Only then does the customer see an error — and that error carries both
directors' phone numbers, so the enquiry has somewhere to go.

**The trade-off, stated plainly:** with no database that email is the only
copy. If the email provider is down at the moment a customer submits, the
request exists only in the runtime log until someone reads it. A second channel
— a webhook into a spreadsheet, or a database — would remove that single point
of failure. It was dropped on purpose, to remove every account and login from
the system.

## Scheduling estimates

Customers never pick a slot. The flow is: customer sends an address → TARMAX
reviews the property → a director makes contact → the visit is booked.

The notification email carries a **Book the estimate** button. It opens Google
Calendar's public template endpoint with the customer, address and notes
prefilled and **the time left blank**, so whoever takes the job sets it against
their own availability rather than against a guess made by this code.

No API key, no OAuth consent, no third-party access to anyone's calendar — it
is a URL, built in `src/lib/calendar.ts`.

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
    email.ts                    the lead pipeline — Resend notifications
    calendar.ts                 "Book the estimate" link for the email
    rate-limit.ts               per-client submission throttle
    schema.ts                   LocalBusiness structured data
scripts/                        asset generation (see below)
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

- **No stored data and no accounts.** There is no database to breach, no
  password to steal and no session to hijack. Leads live in email, protected by
  whatever protects the directors' mailboxes.
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
  `business.ts` builds a keyless Maps search link for the notification email.
- **A second copy of each lead** is the one thing worth adding if the business
  grows. A Resend webhook into a spreadsheet, or a database behind the same
  `sendQuoteEmails()` call site, would end the reliance on a single send.
- **Square footage** is not collected. TARMAX measures from the map or on site.
