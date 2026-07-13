# Runbook: Deploy & Environment

**Owner:** Engineering  

---

## Stack

- App: Next.js on **Vercel**  
- DB: PostgreSQL (Supabase) via `DATABASE_URL`  
- Auth: NextAuth  
- Pay: Razorpay  
- Email: Resend (weekly reports)  
- Cron: Vercel Cron → `/api/cron/weekly-reports`  

## Production URL

https://jamsawli-ecosystem.vercel.app  

## Deploy

```bash
# From repo root, after PR merge or intentional ship:
npm run build          # must pass
vercel --prod --yes
```

Migrations:

```bash
npx prisma migrate deploy
```

Demo data (safe-ish sandboxes):

```bash
npm run db:seed-demo
npm run db:activate-pro   # anchor tenant plan
npm run db:seed-staff     # staff users for demos
```

## Required env (production)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres |
| `NEXTAUTH_URL` | Canonical URL (e.g. `https://jamsawli-ecosystem.vercel.app`) |
| `NEXTAUTH_SECRET` | Sessions + OTP hash |
| `NEXT_PUBLIC_APP_URL` | Public site URL (metadata, links) |
| `NEXT_PUBLIC_DEFAULT_TENANT` | Legacy redirect target (`jamsawli-hanuman`) |

## Payments (required for live donate / billing)

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Server |
| `RAZORPAY_KEY_SECRET` | Server |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client checkout |

## Weekly report email / Slack / cron

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Send real emails via Resend |
| `RESEND_FROM` | From header, e.g. `MandirOS <noreply@yourdomain.com>` |
| `WEEKLY_REPORT_EMAIL` | Optional fallback recipient if temple has no emails |
| `SLACK_WEBHOOK_URL` | Optional platform-wide Slack fallback |
| `CRON_SECRET` | Protect `/api/cron/weekly-reports` (`Authorization: Bearer …` or `x-cron-secret`) |

Vercel cron schedule (see `vercel.json`): **Monday 03:00 UTC**.

Temples enable auto-send in **Dashboard → Weekly report → Email / Slack**.

Without `RESEND_API_KEY`, email is dry-run (logged) for demos.

## Optional

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | AI chatbot |
| `MSG91_*` or `TWILIO_*` | SMS OTP (else OTP logs in server / dev) |
| `GOOGLE_CLIENT_ID` / `SECRET` | OAuth login |
| `WHATSAPP_*` | WhatsApp Business API |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | If used by tooling |

See `.env.example` for the full list.

### Set secrets on Vercel (non-interactive example)

```bash
# Generate once and store in password manager
openssl rand -hex 32   # → use as CRON_SECRET

vercel env add CRON_SECRET production --value "$CRON_SECRET" --sensitive -y
vercel env add RESEND_API_KEY production --value "$RESEND_API_KEY" --sensitive -y
vercel env add RESEND_FROM production --value "MandirOS <noreply@yourdomain.com>" -y
# Redeploy after adding env so serverless picks them up
vercel --prod --yes
```

## Smoke test after deploy

1. `/` loads MandirOS platform + footer legal links  
2. `/legal/terms`, `/legal/privacy`, `/legal/dpa`, `/legal/sla` load  
3. `/t/jamsawli-hanuman` loads tenant  
4. `/t/demo-free` and `/t/demo-pro` load  
5. `/login` OTP send returns 200  
6. `/api/temple/entitlements?templeSlug=jamsawli-hanuman` 200  
7. Money desk requires auth  
8. Weekly report: settings save; Send now (dry-run OK without Resend)  

### Cron smoke (after `CRON_SECRET` is set)

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://jamsawli-ecosystem.vercel.app/api/cron/weekly-reports"
```

## Rollback

- Vercel → previous deployment **Promote**  
- DB migrations: forward-only preferred; never drop donor tables casually  

## Who can deploy

Founder + designated eng only.  
CS/Sales never deploy production.
