# Playbook: Temple Onboarding

**Owner:** Customer Success  
**SLA:** First value (donate live or money desk used) within **7 days** of approval  

---

## Stages

```
Lead → Demo → Application → Approval → Setup → Go-live → 30-day health
```

### Stage 1 — Lead
- Source: referral, trustee network, inbound `/admin/temples/new`  
- Capture: temple name, city, contact, current digital tools  
- Qualify: donations &gt; ₹0 intent, someone who can login weekly  

### Stage 2 — Demo (30–40 min)
Follow [SALES_AND_DEMO.md](./SALES_AND_DEMO.md).  
**Do not** lead with AI. Lead with money desk + weekly report + Free vs Pro.

### Stage 3 — Application
- Temple submits `/admin/temples/new`  
- CS verifies: real temple, contact reachable, slug sensible  
- Super Admin approves in `/admin` applications  

### Stage 4 — Setup checklist (CS + Temple)

| # | Task | Who | Done |
|---|------|-----|:----:|
| 1 | Tenant URL works `/t/{slug}` | CS | ☐ |
| 2 | Trustee login works (OTP/password) | Temple | ☐ |
| 3 | Team: add 1 clerk + 1 trustee | Temple | ☐ |
| 4 | Trust settings: legal name, 80G, PAN | Trustee + CA | ☐ |
| 5 | Money desk: first ₹1–101 test entry | Clerk | ☐ |
| 6 | Donate page test (demo or ₹101 real) | CS + Temple | ☐ |
| 7 | At least 1 pooja configured | Admin | ☐ |
| 8 | Plan selected (Free → Growth if ready) | Trustee | ☐ |
| 9 | Widget embed (optional Growth+) | IT | ☐ |
| 10 | Weekly report opened once | Trustee | ☐ |

### Stage 5 — Go-live communication

Send WhatsApp/email:

```
Your MandirOS temple is live:
Public site: https://{host}/t/{slug}
Donate: .../donate
Staff dashboard: https://{host}/dashboard
Help: https://{host}/help

Daily: Money desk for counter cash
Monday: Weekly report → share with board
```

### Stage 6 — 30-day health

| Signal | Healthy | At risk |
|--------|---------|---------|
| Money desk entries | ≥ 10 weekdays | 0 for 7 days |
| Online donations | &gt; 0 | 0 after go-live week |
| Report opened | ≥ 2 | 0 |
| Support tickets | &lt; 3 open | Angry board |

At risk → CS call within 48h using support playbook.

---

## Handoffs

| From | To | Artifact |
|------|-----|----------|
| Sales | CS | Demo notes + contact |
| CS | Eng | Bug with URL + repro |
| CS | Temple IT | Widget snippet + API doc |

---

## Forbidden

- Promising Form 10BD auto-filing to Income Tax (we export CSV; CA files)  
- Promising live darshan without cameras  
- Creating SUPER_ADMIN for temple staff  
