# Product Requirements Document (PRD)

**Product:** MandirOS multi-tenant platform (Jamsawli = anchor tenant)  
**Version:** 3.0  
**Owner:** Product / Founding team  
**Last updated:** 2026-07-13  
**Status:** Active  

**IA:** Platform at `/` · Tenants at `/t/{slug}` (or subdomain).

---

## 1. Problem

Mid-size Indian temples and trusts:

1. Lose online donation share to opaque WhatsApp PDFs and cash-only habits.  
2. Cannot answer *kitna aaya aaj?* across counter + UPI + pooja.  
3. Struggle with 80G receipts and CA exports.  
4. Face festival double-booking and paper chaos.  
5. Cannot show public fund transparency for large grants/donors.

Existing ERPs are heavy, desk-only, or regional. Spreadsheets dominate.

---

## 2. Solution

**MandirOS** — multi-tenant SaaS:

- Devotee: mobile-web donate, book (gotra/sankalp), transparency, pilgrim help  
- Trustee: money desk, weekly report, ops, 80G config, 10BD export  
- Platform: Free / Growth / Trust Pro entitlements  

**Anchor tenant:** Chamatkarik Shri Hanuman Mandir, Jamsawli (MP) at `/t/jamsawli-hanuman` — *not* the platform homepage.

---

## 3. Goals & non-goals

### Goals (90 days)
| Metric | Target |
|--------|--------|
| Online + counter money tracked | Live daily at anchor temple |
| Trustee weekly report shared | ≥ 4 consecutive weeks |
| Pooja bookings with gotra/sankalp | ≥ 50 |
| Paying temples (Growth+) | ≥ 3 pilots |
| Mobile donate completion | Usable on 4"–6.5" devices without training |

### Non-goals
- Full Tally/Busy accounting replacement  
- Physical POS hardware v1  
- Live darshan until camera infra exists  
- Native App Store apps (PWA first)  

---

## 4. Users & jobs-to-be-done

### U1 Devotee (rural + urban + NRI)
- **JTBD:** Give money / book seva / feel trust  
- **Success:** Payment + receipt in &lt; 2 minutes  

### U2 Counter clerk / pujari assistant
- **JTBD:** Record cash/UPI counter gift fast  
- **Success:** Receipt in ~10 seconds  

### U3 Trustee / admin
- **JTBD:** See totals, export for CA, run festival capacity  
- **Success:** Monday report + 10BD path  

### U4 Platform operator (MandirOS super admin)
- **JTBD:** Onboard temples, billing  
- **Success:** Self-serve apply + plan upgrade  

---

## 5. Functional requirements

### P0 — Must ship and stay green

| ID | Requirement | Acceptance |
|----|-------------|------------|
| P0-1 | Guest donate with optional 80G PAN | Completes payment; receipt URL works |
| P0-2 | Counter money desk | Staff login; cash entry creates Donation + CashEntry + receipt |
| P0-3 | Pooja booking with devotee name, gotra, sankalp, phone | Stored on Booking; capacity enforced |
| P0-4 | Weekly trustee report | Last 7 days totals; share/print |
| P0-5 | Public transparency (basic) | Totals + recent without auth |
| P0-6 | Phone OTP auth | Dev OTP when SMS unset; creates user |
| P0-7 | Multi-tenant isolation | Queries filtered by templeId |
| P0-8 | Plan feature gates | 402 on API; FeatureGate in UI |
| P0-9 | Mobile bottom navigation | Devotee + trustee patterns |
| P0-10 | Free vs Pro demo | `/demo`, `/demo-free`, `/demo-pro` |

### P1 — Should have

| ID | Requirement |
|----|-------------|
| P1-1 | Embed widgets |
| P1-2 | Form 10BD CSV (Trust Pro) |
| P1-3 | Pilgrim SOS / lost-found (Growth+) |
| P1-4 | AI assistant (Trust Pro; local fallback always) |
| P1-5 | Product tour (devotee/trustee/sales) |

### P2 — Later

| ID | Requirement |
|----|-------------|
| P2-1 | Live darshan streaming |
| P2-2 | Prasad logistics |
| P2-3 | Capacitor native apps |
| P2-4 | Full WhatsApp Business automations |

---

## 6. Pricing (productized)

| Plan | Price | Promise |
|------|-------|---------|
| Free | ₹0 | Online money + money desk + weekly report habit |
| Growth | ₹2,499/mo | Festival capacity, ops, widgets, pilgrim |
| Trust Pro | ₹7,999/mo | 10BD, full ledger, API, AI, white-label |

Txn fees: 2.5% / 2% / 1% (see `src/lib/plans.ts`).

---

## 7. UX requirements

See **[DESIGN.md](../DESIGN.md)** and **[specs/UX-SPEC.md](./specs/UX-SPEC.md)**.

Summary:

- Mobile-first 375px  
- Bilingual HI/EN  
- Primary money CTAs always full-width on phone  
- Calm upgrade walls  
- No fake dashboard numbers  

---

## 8. Technical requirements

| Layer | Choice |
|-------|--------|
| App | Next.js 14 App Router, TypeScript |
| DB | PostgreSQL + Prisma |
| Auth | NextAuth (credentials, phone-otp, Google optional) |
| Pay | Razorpay (demo order fallback when unset) |
| Host | Vercel |
| PWA | manifest + service worker |

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Trusts won’t pay for “AI” | Sell money desk + report + 80G |
| SMS OTP cost | Dev OTP; MSG91/Twilio optional |
| Compliance liability | Clear copy: CA verification required |
| Tenant data leak | Scoping audits; no default cross-tenant admin |

---

## 10. Launch checklist

- [ ] DESIGN.md followed on public + desk surfaces  
- [ ] P0 acceptance tests manual  
- [ ] Seed demo temples  
- [ ] Activate anchor Trust Pro  
- [ ] Real 80G numbers in trust settings  
- [ ] Production Razorpay keys  
- [ ] Vercel env complete  

---

## 11. Open questions

1. Legal entity for MandirOS SaaS vs temple Section 8?  
2. Who signs 80G certificates digitally?  
3. First 5 Growth pilots — named list?  

---

**Related:** AGENTS.md · DESIGN.md · HONEST_MARKET_VERDICT.md
