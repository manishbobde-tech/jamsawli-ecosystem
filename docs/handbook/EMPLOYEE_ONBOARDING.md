# Employee Onboarding — MandirOS

**Time to productive:** Day 1 basics · Day 3 independent on golden paths · Week 2 own tickets  

---

## Day 0 (before start)

- [ ] Laptop, GitHub/Git access, Vercel (eng only), production DB read policy  
- [ ] Accounts: email, Slack/WhatsApp work group, password manager  
- [ ] Read: [COMPANY_PLAYBOOK.md](../COMPANY_PLAYBOOK.md) (30 min)  
- [ ] Bookmark production: https://jamsawli-ecosystem.vercel.app  

---

## Day 1 — Product immersion (everyone)

### 1. Walk the product (90 min)

| Step | URL | What to notice |
|------|-----|----------------|
| 1 | `/` | MandirOS is the **platform** |
| 2 | `/pricing` | Free / Growth / Trust Pro promises |
| 3 | `/demo` | Free vs Pro feeling |
| 4 | `/t/jamsawli-hanuman` | Anchor **tenant** (not the company) |
| 5 | `/t/jamsawli-hanuman/donate` | Guest donate + 80G fields |
| 6 | `/t/demo-free/pilgrim` | Locks / upgrade walls |
| 7 | `/t/demo-pro/pilgrim` | Unlocks on Pro |
| 8 | `/for-trustees` | How we sell to boards |
| 9 | `/help` | In-app playbooks |

### 2. Role tracks

**If Sales** → [../playbooks/SALES_AND_DEMO.md](../playbooks/SALES_AND_DEMO.md)  
**If CS** → [../playbooks/SUPPORT_TRIAGE.md](../playbooks/SUPPORT_TRIAGE.md)  
**If Eng** → [../../AGENTS.md](../../AGENTS.md) + [../runbooks/DEPLOY_AND_ENV.md](../runbooks/DEPLOY_AND_ENV.md)  
**If Product** → [../PRD.md](../PRD.md) + [../../DESIGN.md](../../DESIGN.md)  

### 3. Accounts checklist

| Access | Sales | CS | Eng | Founder |
|--------|:-----:|:--:|:---:|:-------:|
| Production app | ✓ | ✓ | ✓ | ✓ |
| Demo login (staff) | ✓ | ✓ | ✓ | ✓ |
| Super-admin `/admin` | | limited | | ✓ |
| Vercel | | | ✓ | ✓ |
| DB (Supabase) | | | read | ✓ |
| GitHub | | | ✓ | ✓ |
| Customer WhatsApp | ✓ | ✓ | | ✓ |

---

## Day 2 — Operate the golden paths

Do **yourself** (use demo tenants; never fake production money):

1. **Money desk** (staff login): record ₹101 cash → open receipt  
2. **Weekly report**: open → copy WhatsApp text  
3. **Book seva** on demo-pro with gotra + sankalp  
4. **Temple application**: `/admin/temples/new` as if you were a trust  
5. **Upgrade path**: `/dashboard/billing` (sandbox activate if allowed)

Write notes: where you got stuck → give to CS for FAQ.

---

## Day 3 — Shadow + first ticket

- Shadow one sales demo or one support chat  
- Take **one** ticket from backlog with a playbook link  
- Eng: ship a docs or UI fix with PR following AGENTS.md  
- Sales: complete one outbound temple list (10 temples) using sales playbook  

---

## Week 1 exit criteria

You can explain without notes:

1. Platform vs tenant  
2. What Free vs Growth vs Pro unlock  
3. Why temples pay (money desk + report + 80G, not AI)  
4. How to escalate P0  
5. Where docs live (`/help` + `docs/`)  

---

## Tools & conventions

| Topic | Convention |
|-------|------------|
| Pricing | Only from `/pricing` + `src/lib/plans.ts` — never invent |
| Screenshots | Prefer demo tenants |
| Donor data | PAN/PII = confidential |
| Commits | Clear sentences; no secrets |
| Hindi | Public devotee UX bilingual; internal docs English OK |

---

## Who to ask

| Question | Who |
|----------|-----|
| Pricing exception | Founder |
| Production outage | Eng on-call + INCIDENT runbook |
| Temple unhappy | CS lead |
| Legal / 80G claims | Founder + temple CA (never MandirOS invents tax advice) |

---

**Welcome. Ship trust.**
