# MandirOS · जामसावली हनुमान लोक

**Daily rupee control for temples** — donate, book sevas, counter money desk, weekly trustee reports, public transparency.

> **AI-native repo:** start at [`AGENTS.md`](./AGENTS.md) · design law [`DESIGN.md`](./DESIGN.md) · product [`docs/PRD.md`](./docs/PRD.md)

## Live

Production: **https://jamsawli-ecosystem.vercel.app**

## Documentation map (big-tech style)

| Doc | Why it exists |
|-----|----------------|
| [`AGENTS.md`](./AGENTS.md) | Rules for AI coding agents |
| [`CLAUDE.md`](./CLAUDE.md) | Claude/Cursor entry pointer |
| [`DESIGN.md`](./DESIGN.md) | Design system (tokens, components, mobile) |
| [`docs/PRD.md`](./docs/PRD.md) | Product requirements & acceptance |
| [`docs/specs/UX-SPEC.md`](./docs/specs/UX-SPEC.md) | IA + user flows |
| [`docs/AI_NATIVE_PRODUCT.md`](./docs/AI_NATIVE_PRODUCT.md) | How agents + humans ship together |
| [`docs/FEATURE_CATALOG.md`](./docs/FEATURE_CATALOG.md) | **Every feature: value + how-to + plan** |
| [`docs/COMPANY_PLAYBOOK.md`](./docs/COMPANY_PLAYBOOK.md) | **Company OS** — cadence, roles, golden paths |
| [`docs/handbook/`](./docs/handbook/) | Employee onboarding + permissions |
| [`docs/playbooks/`](./docs/playbooks/) | Sales, support, temple onboarding, daily ops |
| [`docs/guides/`](./docs/guides/) | Trustee / IT / counter clerk |
| [`docs/runbooks/`](./docs/runbooks/) | Deploy, incidents, payments |
| **In-app** | [`/help`](https://jamsawli-ecosystem.vercel.app/help) | Playbooks for staff & temples |
| [`src/lib/plans.ts`](./src/lib/plans.ts) | Feature entitlements (code is law) |

## Product surfaces (MandirOS multi-tenant)

| Surface | Paths |
|---------|--------|
| **Platform (MandirOS)** | `/` pricing features demo temples onboarding |
| **Tenant (e.g. Jamsawli)** | `/t/jamsawli-hanuman` · `/t/{slug}/donate` · book · transparency |
| **Demo tenants** | `/t/demo-free` · `/t/demo-pro` |
| **Trustee** | `/dashboard` · money-desk · report |
| **Subdomain** | `{slug}.yourdomain.com` → `/t/{slug}` |

## Quick start

```bash
npm install
cp .env.example .env   # fill DATABASE_URL, NEXTAUTH_*, RAZORPAY_*
npx prisma migrate deploy
npm run db:seed-demo
npm run db:activate-pro
npm run dev
```

## Design principles (summary)

1. Trust over ornament  
2. Thumb-first India (bottom nav, 44px targets)  
3. Hindi + English  
4. One job per screen  
5. Money desk + weekly report before “AI”  

Full rules: **DESIGN.md**

## Stack

Next.js 14 · TypeScript · Prisma · PostgreSQL · NextAuth · Razorpay · Tailwind · PWA · Vercel

## Scripts

```bash
npm run build
npm run db:seed-demo      # Free + Pro demo temples
npm run db:activate-pro   # Anchor → Trust Pro
npm run db:seed-staff     # Super admin + trustee + clerk logins
vercel --prod
```

### Staff logins (after `db:seed-staff`)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@mandiros.local | MandirOS@Admin1 |
| Trustee | trustee@jamsawli.local | Temple@Trustee1 |
| Clerk | clerk@jamsawli.local | Temple@Clerk1 |

Change immediately in production. Phone OTP also works in dev.


## License

Private — temple trust / MandirOS

🕉️ **Jai Shri Hanuman**
