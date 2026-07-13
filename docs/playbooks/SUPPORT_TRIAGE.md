# Playbook: Support Triage

**Owner:** Customer Success  
**Channels:** WhatsApp / email / Dashboard → Messages · public SLA: `/legal/sla`  

**Ticket queue (internal):** CS inbox or Linear project `mandiros-support` (create if missing); paste intake template as description. Customers do not need a separate ticketing login.  
**First response SLA:** See `/legal/sla` — Growth &lt; 4 business hours (P1) · Trust Pro faster · Free best-effort  


---

## Severity

| Sev | Definition | Response | Examples |
|-----|------------|----------|----------|
| **P0** | Money or trust broken for live temple | 15 min acknowledge · continuous | Payments fail all, wrong tenant data, site down |
| **P1** | Major feature broken, workaround exists | 4 hours | Money desk error for one user, report empty wrongly |
| **P2** | Minor / cosmetic | 2 business days | UI glitch, copy typo |
| **P3** | Question / how-to | 2 business days | “How do I add clerk?” |

P0 → [../runbooks/INCIDENT_RESPONSE.md](../runbooks/INCIDENT_RESPONSE.md)

---

## Intake template

```
Temple slug:
Plan:
Contact:
URL of problem:
What they tried:
Screenshot?:
Since when?:
Sev guess:
```

---

## Decision tree

1. **Can’t login** → OTP resend; check phone format 10-digit; try email password; reset via eng if needed  
2. **Payment failed** → Razorpay status; keys in env; demo mode vs live; [PAYMENTS runbook](../runbooks/PAYMENTS.md)  
3. **Wrong temple data** → Confirm slug `/t/{slug}`; never edit another tenant  
4. **Feature locked** → Explain plan; send `/dashboard/billing` + `/pricing`  
5. **80G / tax question** → “We store PAN + receipt; CA validates registration. We don’t give tax advice.”  
6. **Want custom domain** → IT guide; eng backlog for custom domain mapping  

---

## Macros (WhatsApp)

### How to money desk
```
1) Login → Dashboard → Money desk
2) Amount + Cash/UPI
3) Record → Print receipt
Guide: {host}/help#clerk
```

### Upgrade
```
Feature needs Growth or Trust Pro.
Compare: {host}/pricing
Upgrade: {host}/dashboard/billing
Demo: {host}/demo
```

### Escalation to eng
```
Sev:
Slug:
URL:
Repro steps:
Expected vs actual:
```

---

## CS do-nots

- Promise refunds without process  
- Share production `.env`  
- Browse donor PANs “out of curiosity”  
- Speak as the temple’s CA  
