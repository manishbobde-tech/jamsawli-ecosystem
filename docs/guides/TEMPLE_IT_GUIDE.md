# Temple IT Guide — MandirOS

**Audience:** Temple IT volunteer, web vendor, or tech-savvy trustee  

---

## Architecture (what you manage vs we manage)

| You | MandirOS |
|-----|----------|
| Who has staff logins | Hosting, app code, DB |
| 80G numbers accuracy | Payment gateway config (shared/platform) |
| Embed on your WordPress/site | Tenant isolation, backups |
| Optional custom domain (roadmap) | Plan entitlements |

---

## URLs

| Purpose | Path |
|---------|------|
| Public temple | `/t/{slug}` |
| Donate | `/t/{slug}/donate` |
| Book | `/t/{slug}/book` |
| Embed donate | `/embed/donate?temple={slug}` |
| Embed book | `/embed/book?temple={slug}` |
| Widget script | `/widget.js` |

### Embed (Growth+)

Dashboard → **Widgets** → copy snippet:

```html
<div id="mandiros-donate"></div>
<script
  src="https://{host}/widget.js"
  data-temple="{slug}"
  data-type="donate"
  data-target="mandiros-donate"
  async
></script>
```

Allow iframe embedding (we set `frame-ancestors *` on embed routes).

---

## Staff access

1. Trustee opens **Dashboard → Team**  
2. Invite by phone or email  
3. Role: `TRUSTEE` (board) or `ADMIN` (manager/clerk)  
4. User completes OTP/password login  

Offboard: Team → deactivate/remove same day.

---

## API keys (Trust Pro)

- Dashboard / Admin API keys (if enabled for plan)  
- Scopes: prefer read-only until needed  
- Rotate if leaked  
- Never commit keys to GitHub of temple website  

Public API examples:

- `GET /api/v1/temple` (with key)  
- `GET /api/v1/poojas`  

---

## Branding

- Temple name, colors on Temple model / admin  
- Platform pages always say MandirOS  
- Tenant pages say **your temple name**  

---

## DNS / subdomain (when enabled)

Point `your-temple.yourdomain.com` CNAME to MandirOS host **only after** MandirOS confirms mapping.  
Until then use path: `/t/{slug}`.

---

## Security checklist

- [ ] HTTPS only on any embedded parent site  
- [ ] No shared SUPER_ADMIN accounts  
- [ ] Widgets only on official temple domains  
- [ ] PANs treated as sensitive PII  
- [ ] Quarterly access review with trustees  

---

## Incidents

If donate/book down: contact MandirOS CS with slug + time.  
Do not hardcode Razorpay keys on static temple HTML — use MandirOS embed.
