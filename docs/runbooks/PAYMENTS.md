# Runbook: Payments (Razorpay)

## Modes

| Mode | When |
|------|------|
| **Live** | `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` + `NEXT_PUBLIC_RAZORPAY_KEY_ID` set |
| **Unconfigured** | Keys missing → `POST /api/donations` returns **503** with `code: RAZORPAY_NOT_CONFIGURED` (honest failure, not fake success) |
| **Money desk** | Always available — cash/counter UPI **does not** use Razorpay |

Check: `GET /api/health/payments`

## Donate path

1. `POST /api/donations` creates order + Donation PENDING  
2. Client Razorpay checkout  
3. `POST /api/donations/verify` marks COMPLETED  
4. Receipt `/receipt/{id}`  

## Money desk path

- No Razorpay — cash/UPI counter logged as COMPLETED donation + CashEntry  

## Common failures

| Symptom | Check |
|---------|-------|
| Checkout doesn’t open | `NEXT_PUBLIC_RAZORPAY_KEY_ID`, script load |
| Verify fails | `RAZORPAY_KEY_SECRET`, signature |
| Order create 500 | Server keys, amount &gt; 0 |
| Webhook not firing | `/api/webhooks/razorpay` + webhook secret |

## Refunds

Manual via Razorpay dashboard + mark donation REFUNDED in DB (eng).  
CS never refunds without trustee + founder policy.

## Test

Use Razorpay test keys on staging only.  
Never use real PAN in test screenshots.
