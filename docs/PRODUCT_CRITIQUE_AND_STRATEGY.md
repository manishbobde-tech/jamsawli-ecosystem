# MandirOS / Jamsawli — Product Critique & Company Strategy

**Author lens:** Product CEO building a mass-market, revenue-generating FaithTech company  
**Date:** 2026-07-13  
**Verdict:** Strong seed of a category-defining product. Currently a **feature showcase**, not yet a **company**.

---

## 1. Executive Verdict (Brutal Honesty)

| Dimension | Score | Reality |
|-----------|-------|---------|
| Vision | 9/10 | “Faith meets innovation” + multi-temple MandirOS is real |
| Market size | 9/10 | India has 2M+ temples; digital is inevitable |
| Product depth | 4/10 | Many modules, thin implementation, hard-coded tenant |
| Competitive moat | 3/10 | Competitors already ship compliance, POS, kiosks |
| Revenue readiness | 3/10 | Pricing docs exist; product doesn’t sell or retain |
| UX for masses | 4/10 | Hindi-first good; no mobile nav, no OTP, no English parity |
| Trust layer | 6/10 | Transparency idea is gold; incomplete execution |
| Ops readiness | 2/10 | No 80G, 10BD, counter POS, priest workflow |

**Bottom line:** You built a beautiful demo of what *could* be India’s Trust Layer for temples. You have **not** yet built the product temples will pay for every month, or the funnel devotees return to weekly.

Claiming “no competitor is doing this” is **false and dangerous**. SwaDharma (3ioNetra), 3ioSetu, Grasp Temple ERP, Punnyam, Nivedyam, Temple Stack already own pieces of this market. Your job is not to invent a category that doesn’t exist — it is to **own a wedge they under-serve**.

---

## 2. What You Actually Built

### Strengths (Keep & Double Down)
1. **Multi-tenant skeleton (MandirOS)** — org → temple → bookings/donations is the right SaaS spine.
2. **Public fund transparency** — rare and emotionally powerful, especially with ₹362Cr govt development narrative.
3. **Rural-first instincts** — voice, WhatsApp, offline, QR check-in — correct for Bharat, not just India.
4. **Pilgrim ops (SOS, lost & found, crowd)** — almost no competitor leads with on-ground safety.
5. **Razorpay + Next.js + Prisma** — modern, hireable stack; can scale if tenant isolation is airtight.

### Weaknesses (Kill or Fix Immediately)
1. **Feature soup** — 14 “complete” features, none deep enough to be the reason a trust signs a cheque.
2. **Two products smashed into one UI** — devotee temple site *and* SaaS platform, with neither converting.
3. **Hard-coded `jamsawli-hanuman`** — multi-tenant is theater until defaults are gone.
4. **Homepage is a poster, not a product** — no trust signals, no how-it-works, no social proof, no English, no live data story.
5. **Missing India must-haves**:
   - 80G receipt at payment time
   - Form 10BD / donor identity (PAN)
   - Phone OTP (email is secondary in rural India)
   - Gotra / nakshatra / sankalp on pooja booking
   - Counter / hundi / offline cash reconciliation
6. **Auth gates kill conversion** — donation requires login; for mass India this is revenue suicide.
7. **No mobile navigation** — half of users on 4–6" phones can’t reach primary CTAs in nav.
8. **AI chatbot is generic OpenAI** — not a moat; every competitor can bolt this on in a weekend.
9. **Gamification of devotion** — cultural risk; use carefully (service badges OK; “leaderboard of bhakti” can backfire with trustees).
10. **Live darshan listed, not built** — empty promises destroy trust faster than missing features.

---

## 3. Competitive Landscape (2026)

| Player | Strength | Gap you can exploit |
|--------|----------|---------------------|
| **3ioSetu / SwaDharma** | Full stack, compliance, 100+ temples, ₹100Cr+ txn | Heavy enterprise; weak rural/voice/WhatsApp-first devotee UX |
| **Grasp Temple ERP** | Deep TN/HR&CE, accounting, testimonials | Regional; not modern devotee experience |
| **Punnyam** | Kerala pooja booking + websites | Light compliance; geography-bound |
| **Nivedyam** | Simple counter billing | Not a platform |
| **Temple Stack** | Free US/global nonprofit tooling | Not India compliance / UPI / vernacular |
| **Spreadsheets + Tally** | Default for most temples | Pain is your sales script |

**Your wedge is NOT “another temple ERP.”**  
They already win on accounting depth.

**Your wedge IS:**

> **Trust + Access for Bharat’s temples**  
> Public transparency · vernacular voice/WhatsApp · pilgrim safety · modern devotee funnel · SaaS multi-temple

Positioning line:

> **MandirOS — India’s Trust Layer for Temples.**  
> Where every rupee is visible, every devotee is guided, and every temple can go digital in days — not months.

---

## 4. Product Strategy: One Company, Two Surfaces

### Surface A — Jamsawli Hanuman Lok (Anchor Tenant)
**Job:** Prove product-market fit with real devotees and trustees.  
**North-star metrics (90 days):**
- ₹10L+ online donations processed
- 2,000 registered devotees
- 500 paid pooja bookings
- 50% of donations with PAN for 80G
- NPS from trustees ≥ 40

### Surface B — MandirOS (Platform SaaS)
**Job:** Sell to other temples using Jamsawli as the case study.  
**North-star metrics (12 months):**
- 50 paying temples
- ₹5L MRR
- <3% monthly churn
- LTV:CAC ≥ 10:1

**Rule:** Never ship platform features that the anchor temple doesn’t use in production.

---

## 5. The “Magnificent Product” — What We Keep / Cut / Build

### Keep (core loop)
1. Donate (with 80G-ready receipt)
2. Book pooja
3. Public transparency ledger
4. Temple admin dashboard
5. WhatsApp channel
6. Multi-tenant identity

### Deprioritize (nice-to-have theater)
- Gamification leaderboards (park until growth stage)
- Voice wake-word as flagship claim (keep as assist, not hero)
- AI chatbot as primary differentiator (make it temple-knowledge RAG later)
- Live darshan until real camera + stream infra exists

### Build next (revenue + trust)
| Priority | Feature | Why it prints money or trust |
|----------|---------|------------------------------|
| P0 | Guest donation + 80G PAN + downloadable receipt | Unlocks mass donations |
| P0 | Phone OTP login | India default auth |
| P0 | Conversion homepage + MandirOS pricing | Sales without salespeople |
| P0 | Tenant-safe data isolation audit | SaaS cannot leak |
| P1 | Self-serve temple onboarding | Scale sales |
| P1 | Embeddable donate/book widgets | Distribution via existing temple sites |
| P1 | Prasad / pooja certificate PDF | Higher AOV |
| P1 | Counter/hundi cash entry for priests | Daily ops = retention |
| P2 | Live darshan (Mux/Cloudflare) | Engagement stickiness |
| P2 | Form 10BD export | Compliance moat vs spreadsheets |
| P2 | Referral for temples (₹5K bounty) | GTM engine |

---

## 6. Revenue Model (Honest & Executable)

### Stream 1 — SaaS Subscriptions
| Plan | Price | Includes |
|------|-------|----------|
| Free | ₹0 | 1 temple page, donate, basic booking, MandirOS branding |
| Growth | ₹2,499/mo | Custom branding, WhatsApp, analytics, 2% txn fee |
| Trust Pro | ₹7,999/mo | Transparency suite, AI, API, 1% txn fee, priority support |
| Enterprise | Custom | Multi-shrine, white-label, SLA, onboarding |

### Stream 2 — Transaction Take-rate
- Donations: 1–2% platform fee (transparent to trustees)
- Bookings: ₹15–25 flat or 2%
- **Never hide fees** — trust is the brand

### Stream 3 — Value-adds (after core works)
- Live darshan add-on
- Prasad logistics commission
- Festival sponsorship marketplace
- Premium directory placement

**Path to first ₹10L ARR:** 30 Growth temples × ₹2,499 + transaction fees ≈ achievable in 6–9 months with focused GTM in MP/MH, not 400 temples fantasy.

---

## 7. Go-to-Market (What Actually Works)

1. **Anchor proof** — Jamsawli live with real money, real transparency numbers.
2. **Trustee sales motion** — WhatsApp demos, not fancy decks. Show ₹ spent → ₹ shown public.
3. **State cluster** — MP first (same language, networks, festivals), then MH/CG.
4. **Government/CSR narrative** — transparency for publicly funded temple projects.
5. **Devotee pull** — when devotees love the app, they ask *their* temple to join (viral loop).

**Do not** burn cash on national ads until 10 temples retain for 90 days.

---

## 8. Product Principles (Company DNA)

1. **Trust is the product** — every screen should increase confidence in the mandir and the platform.
2. **Bharat-first UX** — phone, Hindi/vernacular, low bandwidth, large tap targets, WhatsApp.
3. **One primary job per screen** — donate OR book OR check-in; not all features everywhere.
4. **Ship depth before breadth** — better one perfect donation flow than 14 half modules.
5. **Tenant isolation is sacred** — one data leak kills the SaaS company.
6. **No feature marketing without production truth** — if live darshan isn’t live, don’t claim it.
7. **Revenue features ship with admin ops** — every devotee action has a trustee workflow.

---

## 9. 90-Day Company Roadmap

### Days 1–30 — Make Jamsawli real money
- Guest donate + 80G fields + receipt
- Mobile nav + bilingual homepage conversion redesign
- Fix hard-coded tenant paths
- Phone OTP
- Trustee training for 32-member board

### Days 31–60 — Make MandirOS sellable
- Pricing page + self-serve application
- Temple directory + case study
- Embed widget
- Onboarding checklist for new temples
- First 5 pilot temples (free → paid conversion)

### Days 61–90 — Make retention inevitable
- Priest/counter daily ops
- Weekly transparency auto-report
- WhatsApp booking confirmations
- Churn interviews
- Raise or bootstrap based on real MRR

---

## 10. Innovation That Is Actually Innovative

Stop claiming “first AI temple assistant.” That is not defensible.

**Defensible innovation:**
1. **Public Trust Ledger** — every donation → category → project milestone, audit-grade.
2. **Pilgrim Safety OS** — SOS + crowd + lost-found + check-in as one ops system for high-footfall rural temples.
3. **Vernacular Trust Stack** — voice + WhatsApp + offline as *default*, not accessibility afterthought.
4. **Government Project Transparency** — map large grants (like ₹362Cr) to public milestones; no ERP does this as a devotee product.
5. **FaithTech Marketplace later** — prasad, priests, travel — only after trust and payments are rock solid.

---

## 11. What “Magnificent” Looks Like in 18 Months

- Jamsawli is the digital face of a major MP pilgrimage site (not a side experiment).
- MandirOS is the default “trust + devotee” layer for mid-size temples who hate spreadsheets but won’t buy heavy ERP.
- Brand association: **“If the mandir is transparent, it’s on MandirOS.”**
- Unit economics: 85%+ gross margin, <3% churn, organic temple referrals >40% of new logos.
- Cultural respect intact — technology serves faith; never the reverse.

---

## 12. Product Changes Shipped

### Pass A — Strategy & conversion
1. Full product critique & strategy (this document)
2. Conversion-redesigned Jamsawli homepage (bilingual, trust, CTAs, honesty)
3. MandirOS platform + pricing surfaces for B2B revenue
4. Navbar redesign (mobile menu, language toggle, cleaner IA)
5. Language context for EN/HI
6. Tenant-aware donate page
7. 80G-ready donation form fields + receipt UX foundation
8. Temple directory for multi-tenant discovery

### Pass B — Revenue & trust foundation (executed)
1. **Phone OTP auth** — `/api/auth/otp/send` + `phone-otp` NextAuth provider (MSG91/Twilio optional; dev OTP expose)
2. **80G printable receipts** — `/receipt/[id]` + trust config on Organization
3. **Trust settings UI** — `/dashboard/trust` (80G numbers, PAN, signatory)
4. **Form 10BD CSV export** — `/api/admin/compliance/10bd?fy=2025-26`
5. **Tenant isolation** — shared `DEFAULT_TENANT_SLUG` / `resolveTenantSlug`; no hard-coded component defaults
6. **Embed widgets** — `/embed/donate`, `/embed/book`, `/widget.js`, `/dashboard/widgets`
7. **Trustee daily ops** — checklist + hundi/counter cash (`/dashboard/ops`)
8. **Case study** — `/case-study` (sales asset)
9. **Onboarding polish** — plan select, auto-slug, success path

### Migrations to run
```bash
npx prisma migrate deploy
# includes: donation trust fields, PhoneOtp, CashEntry, OpsChecklistLog
```

---

**Jai Shri Hanuman.** Build trust first. Revenue follows faith — and product discipline.
