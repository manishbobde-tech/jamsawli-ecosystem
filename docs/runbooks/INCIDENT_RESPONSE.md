# Runbook: Incident Response

## Severity

| Sev | Example |
|-----|---------|
| P0 | Site down, payments broken for all, data leak |
| P1 | Single-tenant outage, desk broken for one temple |
| P2 | Degraded UX |

## P0 steps (first 15 minutes)

1. **Acknowledge** in team chat: “P0 investigating”  
2. Check Vercel status + latest deploy time  
3. Check Supabase/DB connectivity  
4. Check Razorpay status page if payment-related  
5. If bad deploy → **rollback** previous Vercel deployment  
6. Update status for CS to tell temples  

## Comms template

```
P0: {one line}
Impact: {who}
Status: Investigating | Identified | Monitoring | Resolved
Next update: {time}
```

## Data leak suspected

1. Revoke API keys / sessions if possible  
2. Preserve logs  
3. Founder + legal  
4. Notify affected temples factually  

## Postmortem (within 48h for P0)

- Timeline  
- Root cause  
- Blast radius  
- Fix  
- Prevention  
- Playbook update if needed  

## Never during P0

- Big refactors  
- Unrelated deploys  
- Silence for &gt; 30 min without update  
