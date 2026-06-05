# Polaris Consulting — Website

Marketing site + applicant portal + admin CMS for Polaris Consulting (UK).

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind 4** for styling, **Manrope** typeface
- **Prisma 7** with `@prisma/adapter-pg` against **Supabase Postgres** (eu-west-2)
- **HMAC cookie auth** for `/admin` (HMAC-signed session tokens, bcrypt password hashes)
- **Resend** transactional email — applicant receipt + staff alert
- **Reed Jobseeker API** — live opportunities feed (7 sectors)

## Modules

| Area | Routes |
|---|---|
| Public | `/`, `/opportunities`, `/events`, `/advice`, `/about`, `/services`, `/contact`, `/join` |
| Admin (gated) | `/admin`, `/admin/applications`, `/admin/events`, `/admin/advice` |

The staff login link is hidden behind the `© <year>` text in the public footer.

## Deployment

Deployed on **Vercel** (Hobby plan). Custom domain `polarisconsulting.uk` cut over from a 123-reg WordPress site.

## Local development

```bash
npm install               # also runs `prisma generate` (postinstall hook)
npm run dev               # http://localhost:3000
npm run seed              # populate DB with mock applications + events + articles
npm run reed:sync         # one-off Reed sync
```

Required env vars (see `.env.local`):

| Var | Purpose |
|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Supabase pooler + direct connection |
| `SESSION_SECRET` | HMAC key for admin session cookies |
| `REED_API_KEY` | Reed Jobseeker API |
| `RESEND_API_KEY`, `RESEND_FROM`, `STAFF_INBOX` | Transactional email |

## Scripts

| Script | Purpose |
|---|---|
| `scripts/seed.ts` | Create the initial admin user (safe on live DB; no sample data) |
| `scripts/seed-content.ts` | Seed editorial content — articles + events (`npm run seed:content`) |
| `scripts/reed-sync.ts` | Pull all 6 sectors from Reed |
| `scripts/db-test.ts` | Print row counts per table (smoke test) |
| `scripts/auth-test.ts` | Generate a valid session token for a given admin |
| `scripts/email-test.ts` | Send a test email via Resend |

