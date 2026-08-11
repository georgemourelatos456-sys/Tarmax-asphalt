# Going live

The site deploys and looks correct with nothing configured. What it cannot do
without configuration is **keep a quote request**. Until the steps below are
done, a submitted form validates, shows the customer a success screen, and is
written only to the server log — no dashboard row, no email.

That is deliberate, so the site is testable without accounts. It is also why a
test submission looks like it worked but nothing arrives.

Work through the three sections in order. Budget about 30 minutes.

---

## 1. Supabase — where leads are stored

### 1.1 Create the project

1. Go to <https://supabase.com> and sign in.
2. **New project**. Name it `tarmax`, choose a region close to Calgary
   (`us-west-1` is the nearest), and set a database password.
   Save that password in a password manager — it is not the same as anything
   below, and Supabase will not show it again.
3. Wait for provisioning (a minute or two).

### 1.2 Create the leads table

1. Left sidebar → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy the whole file, paste it in.
3. Click **Run**.

You should see `Success. No rows returned`. The script is safe to run more than
once, so if you are ever unsure whether it took, just run it again.

Verify: sidebar → **Table Editor** → you should see a `leads` table with no
rows. If `leads` is not there, the script did not run — re-run it and read the
error.

### 1.3 Copy the three keys

Sidebar → **Project Settings** (gear icon) → **API**.

| What you need | Where it is | Goes into |
|---|---|---|
| Project URL | "Project URL" | `NEXT_PUBLIC_SUPABASE_URL` |
| Anon / publishable key | "Project API keys" → `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Service role / secret key | "Project API keys" → `service_role` — click **Reveal** | `SUPABASE_SERVICE_ROLE_KEY` |

Newer Supabase projects name these **Publishable key** and **Secret key**
instead of `anon` and `service_role`. Either naming works — take the public one
for `ANON_KEY` and the secret one for `SERVICE_ROLE_KEY`.

> **The service role key bypasses all security on the database.** It goes only
> into the Vercel environment variable below. Never put it in the code, never
> give it a `NEXT_PUBLIC_` prefix, never paste it into a chat or a ticket. If it
> ever leaks, rotate it immediately from this same page.

### 1.4 Create the admin login

1. Sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: `admin@tarmaxasphalt.com`
3. Password: choose one and save it in the password manager.
4. **Tick "Auto Confirm User".** Miss this and the account cannot sign in —
   it will sit waiting for an email confirmation that never arrives.
5. **Create user.**

### 1.5 Turn off public sign-up

By default anyone on the internet can create a Supabase account on your
project. The dashboard also checks an email allowlist, so a stray account still
could not read leads — but there is no reason to leave the door open.

**Authentication** → **Providers** (or **Sign In / Providers**) → **Email** →
turn **Allow new users to sign up** off → **Save**.

---

## 2. Resend — the instant email to your inbox

This is the part that makes a lead land in `admin@tarmaxasphalt.com` the moment
it is submitted.

1. Go to <https://resend.com> and sign up.
2. **Domains** → **Add Domain** → `tarmaxasphalt.com`.
3. Resend shows you DNS records (a few `TXT`, sometimes `MX`). Add them where
   your domain's DNS lives — the same place you pointed the domain at Vercel.
   Verification usually takes minutes, occasionally a few hours.
4. Once the domain shows **Verified**: **API Keys** → **Create API Key**,
   permission **Sending access**. Copy it — it is shown once.

That key is `RESEND_API_KEY`, and `RESEND_FROM` becomes:

```
TARMAX Asphalt <quotes@tarmaxasphalt.com>
```

### Want it working before DNS verifies?

Resend gives every account a test sender that works immediately:

```
RESEND_FROM=TARMAX Asphalt <onboarding@resend.dev>
```

The catch: an unverified account can only send **to the address you signed up
with**. So sign up for Resend as `admin@tarmaxasphalt.com` and lead
notifications arrive right away — but customer confirmation emails will not
send until the domain is verified. Fine for testing, not for launch.

---

## 3. Vercel — putting it together

### 3.1 Add the variables

Vercel → your project → **Settings** → **Environment Variables**.

Add each of these. Tick **Production**, **Preview** and **Development** for all
of them unless noted.

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://tarmaxasphalt.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | from step 1.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from step 1.3 |
| `SUPABASE_SERVICE_ROLE_KEY` | from step 1.3 — **secret** |
| `RESEND_API_KEY` | from step 2 — **secret** |
| `RESEND_FROM` | `TARMAX Asphalt <quotes@tarmaxasphalt.com>` |

Paste values carefully. A trailing space or a newline is the single most common
cause of "I set it and it still does not work".

Optional:

- `ADMIN_EMAILS` — extra addresses allowed into `/admin`, comma separated. The
  two directors and `admin@tarmaxasphalt.com` are always allowed, so you only
  need this to add somebody else.
- `QUOTE_RATE_LIMIT_MAX` — submissions per visitor per 15 minutes. Defaults
  to 10.

### 3.2 Redeploy

**Environment variables only take effect on a new build.** Adding them does
nothing to the site already deployed.

**Deployments** → most recent → **⋯** → **Redeploy**.

From now on, every push to `main` rebuilds automatically and picks them up.

### 3.3 Check the branch settings

- GitHub → repo → **Settings** → **General** → default branch should be `main`.
- Vercel → **Settings** → **Git** → Production Branch should be `main`.

---

## 4. Verify it actually works

Do not skip this. Everything above can look right and still be wrong.

1. Open the live site → **Get a free quote**.
2. Submit a real-looking request with your own email in the email field.
3. Check all three:

| Check | Where | Expected |
|---|---|---|
| Customer sees confirmation | the page | "Quote request received / Thanks, …" |
| Lead is stored | `/admin`, sign in as `admin@tarmaxasphalt.com` | your test request is listed |
| Email arrives | `admin@tarmaxasphalt.com` | "New TARMAX Quote Request — <address>" |

Then delete the test row: Supabase → **Table Editor** → `leads` → select the
row → delete.

### If the subject line says `[NOT SAVED]`

Email is working, the database is not. The lead reached you and that email is
now its only copy. Check that `supabase/schema.sql` actually ran and that
`SUPABASE_SERVICE_ROLE_KEY` is the secret key, not the public one.

### If nothing arrives at all

Vercel → **Deployments** → the current one → **Runtime Logs**, and submit
again while watching. The log tells you which half failed:

| Log line | Meaning |
|---|---|
| `no storage or email configured` | Neither key set, or you did not redeploy after adding them |
| `[leads] insert failed: …` | Supabase reachable but rejecting the write — usually the schema was not run |
| `[email] admin notification failed: …` | Resend rejecting — usually an unverified sending domain |
| `stored but admin email failed` | Lead is safe in the dashboard; fix Resend |
| `emailed but NOT stored` | Lead is safe in your inbox; fix Supabase |
| `LEAD NOT CAPTURED` | Both failed. The full request is in that log line — copy it out. |

That last line is the safety net: even in total failure the customer's details
are recoverable from the log, and the customer is shown both directors' phone
numbers rather than a dead end.

---

## What is still not set up, on purpose

- **No customer accounts.** Customers never sign in. They fill in the form.
- **No customer-facing calendar.** Visits are scheduled by TARMAX from
  `/admin`, then pushed to your own calendar with the Google Calendar or `.ics`
  buttons. No API key or OAuth consent needed.
- **No Google Maps API key.** The admin email and dashboard link to a keyless
  Maps search for the property address.
