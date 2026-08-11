# Going live

There is one thing to set up: **email**. No database, no accounts, no sign-in.

A quote request is emailed to `admin@tarmaxasphalt.com` and both directors the
moment it is submitted, and that email is the lead record. Until Resend is
configured, a submitted form validates, shows the customer a success screen,
and is written only to the server log — no email arrives.

That is deliberate, so the site is testable without accounts. It is also why a
test submission looks like it worked and nothing turns up.

Budget about 15 minutes.

---

## 1. Resend — the email that carries the lead

1. Go to <https://resend.com> and sign up. **Use `admin@tarmaxasphalt.com`
   as the account address** — it makes the testing step below work immediately.
2. **Domains** → **Add Domain** → `tarmaxasphalt.com`.
3. Resend shows DNS records (a few `TXT`, sometimes `MX`). Add them where your
   domain's DNS lives — the same place you pointed the domain at Vercel.
   Verification usually takes minutes, occasionally a few hours.
4. Once the domain shows **Verified**: **API Keys** → **Create API Key**,
   permission **Sending access**. Copy it — it is shown once.

That key is `RESEND_API_KEY`, and `RESEND_FROM` becomes:

```
TARMAX Asphalt <quotes@tarmaxasphalt.com>
```

### Want it working before DNS verifies?

Resend gives every account a test sender that works straight away:

```
RESEND_FROM=TARMAX Asphalt <onboarding@resend.dev>
```

**There is a catch that will otherwise cost you an afternoon.** An unverified
Resend account may only send to the address the account was registered with,
and it rejects the **entire message** if any other recipient is on it. This
site emails three addresses by default — admin, Nova and George — so on an
unverified account *nothing arrives at all*. Not a partial delivery. Nothing.

So while you are testing, also set:

```
LEAD_EMAIL_TO=admin@tarmaxasphalt.com
```

(or whichever address your Resend account is registered to). That narrows the
send to one permitted recipient and proves the pipeline works today. It also
suppresses the customer confirmation, which would fail for the same reason.

**Delete `LEAD_EMAIL_TO` once your domain is verified** — leaving it set means
Nova and George never get copies and customers never get a receipt.

---

## 2. Vercel

### 2.1 Add the variables

Vercel → your project → **Settings** → **Environment Variables**. Tick
**Production**, **Preview** and **Development** for each.

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://tarmaxasphalt.com` |
| `RESEND_API_KEY` | from step 1 — **secret** |
| `RESEND_FROM` | `TARMAX Asphalt <onboarding@resend.dev>` until your domain verifies, then `TARMAX Asphalt <quotes@tarmaxasphalt.com>` |
| `LEAD_EMAIL_TO` | your Resend account address — **temporary**, delete once the domain verifies |

Optional: `QUOTE_RATE_LIMIT_MAX` — submissions per visitor per 15 minutes,
defaults to 10.

Paste carefully. A trailing space or newline is the most common cause of "I set
it and it still does not work".

### 2.2 Redeploy

**Environment variables only take effect on a new build.** Adding them does
nothing to the site already deployed.

**Deployments** → most recent → **⋯** → **Redeploy**.

From then on every push to `main` rebuilds automatically and picks them up.

### 2.3 Check the branch settings

- GitHub → repo → **Settings** → **General** → default branch should be `main`.
- Vercel → **Settings** → **Git** → Production Branch should be `main`.

---

## 3. Verify it actually works

Do not skip this.

**First, check the deployment can see the key.** Open:

```
https://<your-site>/api/health
```

It answers in one line whether the running build is configured, without you
having to submit anything:

- `"ready": true` — the key and sender reached this build. Go submit a test.
- `"ready": false` — read the `diagnosis` field; it names the missing piece.

The most common cause of `false` is a variable that was saved in Vercel but
never redeployed. Environment variables are read at build time, so a build that
already happened will never see them.

Then:

1. Open the live site → **Get a free quote**.
2. Submit a real-looking request with your own email in the email field.
3. Check both:

| Check | Where | Expected |
|---|---|---|
| Customer sees confirmation | the page | "Quote request received / Thanks, …" |
| Lead arrives | `admin@tarmaxasphalt.com` | "New TARMAX Quote Request — <address>" |

Open the email and try both buttons — **Open in Google Maps** should land on
the property, **Book the estimate** should open a prefilled calendar event.

### If nothing arrives

Vercel → **Deployments** → the current one → **Runtime Logs**, and submit again
while watching:

| Log line | Meaning |
|---|---|
| `email not configured` | Key not set, or you did not redeploy after adding it |
| `[email] admin notification failed: …` | Resend rejected it — usually an unverified sending domain |
| `customer confirmation failed` | Your copy is fine; only the customer's receipt failed |
| `LEAD NOT CAPTURED` | The send failed. The full request is in that log line — copy it out. |

That last line is the safety net: even in total failure the customer's details
are recoverable from the log, and the customer is shown both directors' phone
numbers rather than a dead end.

---

## How a lead is handled

```
customer submits  →  validated  →  emailed to 3 inboxes  →  worked from the inbox
                                         ↓ (if that fails)
                                   written to the server log
                                         ↓
                        customer shown both directors' phone numbers
```

Every request goes to `admin@tarmaxasphalt.com`, `Nova@tarmaxasphalt.com` and
`George@tarmaxasphalt.com`. Three inboxes, so a lead being missed means three
people missed it.

The email carries every field the customer submitted, a plain-text block that
survives copy-paste into a phone or a job sheet, a Google Maps link to measure
the property from, and a **Book the estimate** button that opens a prefilled
calendar event with the time left blank for whoever takes the job.

**One honest caveat.** With no database, that email is the only copy. If Resend
is down at the moment a customer submits, the request exists only in the Vercel
runtime log until someone reads it. Adding a second channel later — a webhook
into a spreadsheet, or a database — would remove that single point of failure.

---

## What is deliberately not here

- **No accounts, for anyone.** Not customers, not directors. Nothing to sign
  into, nothing to lock anyone out of, no password to lose.
- **No database.** The inbox is the pipeline.
- **No customer-facing calendar.** Customers never pick a slot. A director
  books the visit from the email after looking at the property.
- **No Google Maps API key.** The map link uses the public search endpoint.
