# AGENTS.md — MandirOS / Jamsawli Ecosystem

> Instructions for AI coding agents (Grok, Claude, Cursor, Codex) working in this repo.

## Product in one sentence

**MandirOS** is a multi-tenant FaithTech platform: devotee payments + counter money desk + trust transparency for Indian temples. **Jamsawli Hanuman Lok** is the anchor tenant.

## North star

Ship features that answer: *Does this help a trustee sleep better about money or a festival queue?*

If no → demote, hide behind higher plan, or delete.

## Source of truth (read these first)

| Doc | Path | Purpose |
|-----|------|---------|
| **Design system** | [`DESIGN.md`](./DESIGN.md) | Visual language, components, mobile rules |
| **PRD** | [`docs/PRD.md`](./docs/PRD.md) | Product requirements, users, success metrics |
| **UX spec** | [`docs/specs/UX-SPEC.md`](./docs/specs/UX-SPEC.md) | Flows, IA, interaction patterns |
| **Plans / tiers** | [`src/lib/plans.ts`](./src/lib/plans.ts) | Feature gates (code is law) |
| **Market honesty** | [`docs/HONEST_MARKET_VERDICT.md`](./docs/HONEST_MARKET_VERDICT.md) | What temples pay for |
| **Strategy** | [`docs/PRODUCT_CRITIQUE_AND_STRATEGY.md`](./docs/PRODUCT_CRITIQUE_AND_STRATEGY.md) | Competitive wedge |
| **Company playbook** | [`docs/COMPANY_PLAYBOOK.md`](./docs/COMPANY_PLAYBOOK.md) | How the company operates |
| **Employee onboarding** | [`docs/handbook/EMPLOYEE_ONBOARDING.md`](./docs/handbook/EMPLOYEE_ONBOARDING.md) | Day 1–7 for staff |
| **Temple guides** | [`docs/guides/`](./docs/guides/) | Trustee / IT / clerk |
| **Runbooks** | [`docs/runbooks/`](./docs/runbooks/) | Deploy, incidents, payments |
| **In-app help** | `/help` | Same content for operators without Git |

## Architecture map

```
src/app/           → Next.js App Router pages + API routes
src/components/    → UI (ui/ = primitives; domain folders = features)
src/lib/           → Domain logic: plans, entitlements, auth, otp, tenant
prisma/            → Schema + migrations (never edit prod DB by hand)
docs/              → PRD, specs, strategy
public/            → PWA, widget.js, icons
```

## Multi-tenant rules

1. **Platform** = MandirOS at `/` (marketing, pricing, demo, directory).
2. **Tenant** = temple site at `/t/{slug}/...` (or subdomain rewrite).
3. Resolve temple via middleware (`x-tenant-slug`, `x-shell`) → `TenantProvider` → `useOptionalTemple()`.
4. Build tenant links with `tenantPath(slug, "/donate")` from `src/lib/tenant-path.ts`.
5. Client fallback slug only: `DEFAULT_TENANT_SLUG` (Jamsawli as anchor example, not the platform).
6. Every money query must be scoped by `templeId`.
7. **Never** make the platform homepage Jamsawli-branded.

## Feature gates

```ts
import { assertFeature } from "@/lib/entitlements"
// API: return 402 + featureDeniedPayload()
// UI: <FeatureGate feature="money_desk" allowed={...} />
```

Plan definitions live only in `src/lib/plans.ts`. Update labels there when changing pricing copy.

## Coding standards

- **TypeScript** strict; no `any` unless justified.
- **Server components** by default; `"use client"` only for interactivity.
- **Mobile-first**: design at 375px, then `sm`/`md`/`lg`.
- **Touch**: min 44px targets; `font-size: 16px` on mobile inputs.
- **i18n**: Hindi + English via `useI18n()` / dual copy where public-facing.
- **No fake metrics** in dashboards — use live APIs.
- **No claim** of live darshan / production features that do not exist.

## Do / Don't

| Do | Don't |
|----|-------|
| Prefer depth on money desk, booking, 80G, reports | Add more half-finished “innovation” modules |
| Follow DESIGN.md tokens and components | One-off hex colors scattered in pages |
| Add migrations for schema changes | Push breaking schema without migration |
| Gate premium features by plan | Ship Pro-only features free without decision |
| Keep embed shell chrome-free | Put navbar inside `/embed/*` |

## Critical user journeys (must stay green)

1. **Guest donate** → Razorpay/demo → receipt  
2. **Book pooja** → gotra/sankalp → slot capacity → pay/confirm  
3. **Money desk** (staff) → counter entry → print receipt  
4. **Weekly report** → share WhatsApp text  
5. **Free vs Pro demo** `/demo` + `/demo-free` + `/demo-pro`  
6. **OTP login** (dev OTP when SMS not configured)

## Commands

```bash
npm run dev
npm run build
npx prisma migrate deploy
npm run db:seed-demo
npm run db:activate-pro
vercel --prod
```

## Security

- Never commit secrets; use `.env` / Vercel env.
- Staff routes: ADMIN | TRUSTEE | SUPER_ADMIN.
- Guest donate/book allowed; never leak other tenants’ data.
- OTP hashes with `NEXTAUTH_SECRET`; do not log OTP in production.

## PR checklist for agents

- [ ] DESIGN.md compliance (spacing, type, components)
- [ ] Plan/feature gates if premium
- [ ] Mobile layout checked mentally at 375px
- [ ] `npm run build` clean
- [ ] Docs updated if user-facing behavior changed

## Voice of product

Sacred, clear, practical. Prefer “kitna aaya?” over “MRR.” Prefer “counter receipt in 10s” over “AI-powered ecosystem.”
