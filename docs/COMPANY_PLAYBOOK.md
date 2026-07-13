# MandirOS Company Playbook

**Version:** 1.0  
**Purpose:** How MandirOS runs as a real product company — not a demo.  
**Audience:** Founders, employees, contractors, AI agents, temple operators (links out).

---

## 1. What we are

**MandirOS** is a multi-tenant SaaS for Indian temples:

| Layer | URL pattern | Owner |
|-------|-------------|--------|
| Platform | `/` pricing, demo, directory | MandirOS company |
| Tenant | `/t/{slug}/…` | Temple trust |
| Console | `/dashboard/*` | Temple trustees + MandirOS support |
| Super admin | `/admin/*` | MandirOS staff only |

**Jamsawli** is the **anchor tenant** (`/t/jamsawli-hanuman`), not the company brand.

---

## 2. Document map (read by role)

| Role | Start here | Then |
|------|------------|------|
| **New employee** | [handbook/EMPLOYEE_ONBOARDING.md](./handbook/EMPLOYEE_ONBOARDING.md) | Roles, sales, support playbooks |
| **Engineer / AI agent** | [../AGENTS.md](../AGENTS.md) | DESIGN.md, PRD, runbooks |
| **Sales** | [playbooks/SALES_AND_DEMO.md](./playbooks/SALES_AND_DEMO.md) | Pricing, demo URLs |
| **Customer success / support** | [playbooks/SUPPORT_TRIAGE.md](./playbooks/SUPPORT_TRIAGE.md) | Temple guides |
| **Temple trustee** | [guides/TEMPLE_TRUSTEE_GUIDE.md](./guides/TEMPLE_TRUSTEE_GUIDE.md) | Daily ops, money desk |
| **Temple IT** | [guides/TEMPLE_IT_GUIDE.md](./guides/TEMPLE_IT_GUIDE.md) | Domains, widgets, API keys |
| **Counter clerk** | [guides/COUNTER_CLERK_GUIDE.md](./guides/COUNTER_CLERK_GUIDE.md) | Money desk only |
| **On-call / devops** | [runbooks/DEPLOY_AND_ENV.md](./runbooks/DEPLOY_AND_ENV.md) | Incidents, payments |

**In-app:** `/help` mirrors these for operators without Git access.

---

## 3. Operating cadence (weekly)

| Day | Ritual | Owner |
|-----|--------|--------|
| **Mon** | Pull weekly report for each paying temple; ping CS if zero activity | CS |
| **Tue** | Demo pipeline review; schedule trustee calls | Sales |
| **Wed** | Product / bug triage (P0 first) | Eng + Product |
| **Thu** | Temple onboarding check-ins (new tenants &lt; 30 days) | CS |
| **Fri** | Metrics snapshot: donations, bookings, desk entries, churn risk | Founder / CS |
| **Daily** | Money desk used at anchor? Support queue empty? | CS |

---

## 4. North-star metrics

| Metric | Why |
|--------|-----|
| Temples with **≥1 money desk entry / day** (weekday) | Habit = retention |
| Online + counter GMV | Revenue story for boards |
| Weekly report opens / shares | Trustee engagement |
| Paying temples (Growth+) | SaaS health |
| P0 incidents open &gt; 24h | Trust risk |

Do **not** optimize for “features shipped” or AI chat volume.

---

## 5. Roles inside MandirOS company

| Role | Can do | Cannot do |
|------|--------|-----------|
| **Founder / Super Admin** | All `/admin`, billing overrides, approve temples | N/A |
| **Engineer** | Code, deploys, runbooks | Change production 80G numbers without temple OK |
| **Sales** | Demos, pricing, applications | Access other temples’ donor PANs casually |
| **CS / Support** | Help temples, read dashboards (with access) | Share secrets, refund without process |
| **Temple Trustee** | Own temple dashboard, team, trust config | Other tenants, platform pricing |
| **Temple Clerk** | Money desk, view bookings | Billing, team, API keys |
| **Temple IT** | Widgets, API keys, branding (plan-gated) | Super-admin |

Details: [handbook/ROLES_AND_PERMISSIONS.md](./handbook/ROLES_AND_PERMISSIONS.md)

---

## 6. Golden paths (must always work)

1. Platform home → Add temple → Application received  
2. `/t/{slug}/donate` → payment/demo → receipt  
3. Money desk → entry → print receipt  
4. Book seva (gotra/sankalp) → capacity respected  
5. Weekly report → WhatsApp share text  
6. Free vs Pro demo `/demo` + `/t/demo-free` + `/t/demo-pro`  
7. OTP login (dev OTP if SMS unset)

If any golden path breaks → **P0 incident** ([runbooks/INCIDENT_RESPONSE.md](./runbooks/INCIDENT_RESPONSE.md)).

---

## 7. How work gets done

### Engineers / agents
1. Read AGENTS.md + PRD acceptance for the ticket  
2. Follow DESIGN.md for UI  
3. Feature gates via `src/lib/plans.ts`  
4. `npm run build` before merge  
5. Update playbook if operator workflow changed  

### CS / sales (non-code)
1. Use playbooks, never invent pricing  
2. Log temple issues in shared tracker (Linear/Notion/Sheets)  
3. Escalate P0 with runbook severity  

### Temples
1. Trustee guide for money + team  
2. IT guide for embed + API  
3. Clerk guide for counter only  

---

## 8. Environments

| Env | URL | Data |
|-----|-----|------|
| Production | https://jamsawli-ecosystem.vercel.app | Real |
| Local | http://localhost:3000 | Dev DB |
| Demo tenants | `/t/demo-free`, `/t/demo-pro` | Sandbox |

Never demo using production PANs or real donor lists in screenshots without consent.

---

## 9. Definition of “full product company ready”

- [x] Multi-tenant platform vs tenant split  
- [x] Docs for employees + temples + agents  
- [x] In-app help center  
- [x] Role model documented  
- [x] Onboarding + sales + support playbooks  
- [x] Deploy + incident runbooks  
- [x] Legal (ToS, privacy, DPA) — public pages at `/legal/*` (templates; counsel review for large deals)  
- [x] SLA for paid temples — `/legal/sla` + support triage  
- [x] Ticket path — Help intake + CS internal queue (Linear/email); no customer-facing Zendesk required yet  

---

**Jai Shri Hanuman — run the company like the product: clear, accountable, daily.**
