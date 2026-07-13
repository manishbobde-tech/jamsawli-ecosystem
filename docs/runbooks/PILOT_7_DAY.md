# Runbook: 7-day temple pilot (real value)

**Goal:** Prove one temple uses MandirOS for money control — then decide plan.  
**Do not:** create more demo temples until Day 7 decision.

**Primary pilot temple:** `jamsawli-hanuman`  
**In-app checklist:** `/dashboard/pilot`  
**Default staff temple:** header switcher (stored in browser)

---

## What is real value (this pilot only)

| Must work | Optional later |
|-----------|----------------|
| Money desk daily (cash / counter UPI) | AI chatbot |
| Weekly report shared once | More demos |
| One booking with gotra | Full 10BD CA process |
| Transparency shown to a trustee | Multi-temple switcher polish |

Online **Razorpay donate** is valuable but **not required** for Days 1–2. Counter path has no gateway dependency.

---

## Day 0 — Setup (founder / eng)

1. Confirm DB has temple `jamsawli-hanuman` active  
2. `npm run db:activate-pro` (or Trust Pro subscription row)  
3. `npm run db:seed-staff` — clerk + trustee passwords  
4. **Razorpay (when ready for online):**
   - Vercel env: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Redeploy
   - Check `/api/health/payments` → `onlineDonateReady: true`
5. Login clerk → staff temple = **jamsawli-hanuman**  
6. Open `/dashboard/pilot` — start checklist  

### Demo staff (change in production)

| Role | Email | Password |
|------|--------|----------|
| Clerk | clerk@jamsawli.local | Temple@Clerk1 |
| Trustee | trustee@jamsawli.local | Temple@Trustee1 |

---

## Days 1–7 — Clerk + trustee

| Day | Action | Pass if |
|-----|--------|---------|
| 1 | Money desk ₹101 cash → print receipt | Receipt opens |
| 2 | Morning + evening counter totals | ≥2 cash entries that day |
| 3 | Online donate **or** document “Razorpay not live yet” on pilot page | Honest status |
| 4 | One seva booking (gotra + sankalp) | Booking CONFIRMED |
| 5 | Weekly report → WhatsApp/print | Trustee receives one-liner |
| 6 | Share `/t/jamsawli-hanuman/transparency` | Trustee opens URL |
| 7 | Board call: Free stay / Growth / pause | Written decision |

Mark each day in `/dashboard/pilot` (tap row).

---

## Success criteria (pilot passing)

In-app score uses:

- ≥5 of 7 checklist days done  
- Some money activity (cash today **or** donations in 7d)  
- Online ready **or** Day 3 documented  

**Business success** (stronger): clerk uses money desk **without being asked** on Day 6–7.

---

## Fail criteria — stop shipping features

- Nobody logs cash after Day 2  
- Board only wants “more features” without daily use  
- Online donate promised but keys never set (overclaim)

---

## After pilot

| Outcome | Next |
|---------|------|
| Keep Free | Money desk + donate only; no Pro sales pressure |
| Growth | Turn on festival capacity, campaigns, ops |
| Pause | Keep demo for sales; no new temples |

---

## Related

- Payments: [PAYMENTS.md](./PAYMENTS.md)  
- Deploy env: [DEPLOY_AND_ENV.md](./DEPLOY_AND_ENV.md)  
- Health: `GET /api/health/payments`
