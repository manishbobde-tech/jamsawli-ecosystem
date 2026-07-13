# MandirOS Feature Catalog

**Version:** 3.0  
**How to use this doc:** Each feature has **Value**, **Who**, **Plan**, **How to use**, **Where in product**.  
**In-app:** `/help` · Public matrix: `/features` · Plans: `src/lib/plans.ts`

---

## Legend

| Plan | Price |
|------|-------|
| Free | ₹0 |
| Growth | ₹2,499/mo |
| Trust Pro | ₹7,999/mo |

---

## A. Platform (MandirOS company)

### A1. Multi-tenant temple sites
| | |
|--|--|
| **Value** | One product, many temples. Your brand stays MandirOS; each trust gets `/t/{slug}`. |
| **Who** | Platform team, every temple |
| **Plan** | Free+ |
| **How** | Onboard → slug assigned → public site at `/t/{slug}`. Subdomain can rewrite to same path. |
| **Where** | `/` platform · `/t/{slug}` tenant |

### A2. Free vs Pro live demo
| | |
|--|--|
| **Value** | Prospects *feel* upgrade without a sales call. |
| **Who** | Sales, trustees evaluating |
| **Plan** | Public |
| **How** | Open `/demo` → toggle Free/Pro → open `/t/demo-free` vs `/t/demo-pro`. |
| **Where** | `/demo` |

### A3. Temple directory & application
| | |
|--|--|
| **Value** | Self-serve lead capture; discoverability for temples. |
| **Who** | New temples, devotees browsing |
| **Plan** | Public |
| **How** | `/temples` browse · `/admin/temples/new` apply · Super Admin approves. |
| **Where** | `/temples`, `/admin/temples/new` |

### A4. Help & company playbooks
| | |
|--|--|
| **Value** | Employees and temples operate without calling founders. |
| **Who** | All roles |
| **Plan** | Public + staff |
| **How** | Open `/help`, filter by role. Repo: `docs/COMPANY_PLAYBOOK.md`. |
| **Where** | `/help` |

### A5. Plan billing & entitlements
| | |
|--|--|
| **Value** | Pay more → unlock more. Clear ROI for boards. |
| **Who** | Trustees |
| **Plan** | All |
| **How** | Dashboard → Billing → upgrade/downgrade. Features gate via API 402 + FeatureGate UI. |
| **Where** | `/dashboard/billing`, `/pricing` |

---

## B. Money & compliance (why temples pay)

### B1. Online donations (UPI / cards)
| | |
|--|--|
| **Value** | Capture remote + NRI giving; less cash handling risk. |
| **Who** | Devotees |
| **Plan** | Free+ |
| **How** | `/t/{slug}/donate` → amount → purpose → optional guest details → pay. |
| **Where** | Tenant donate |

### B2. 80G-ready receipts
| | |
|--|--|
| **Value** | Donors get tax-capable receipts; trust looks professional. |
| **Who** | Donors, CA, trustees |
| **Plan** | Free+ |
| **How** | Tick 80G + PAN on donate/desk → after success open `/receipt/{id}` → Print PDF. Configure trust numbers in Trust settings. |
| **Where** | Donate, Money desk, `/receipt/[id]`, `/dashboard/trust` |

### B3. Counter Money Desk
| | |
|--|--|
| **Value** | **Core habit.** Cash/UPI at counter → receipt in ~10s. Daily “kitna aaya”. |
| **Who** | Clerk, admin, trustee |
| **Plan** | Free+ |
| **How** | Login → Dashboard → Money desk → amount + mode → Record → Print. Guide: `/help` → clerk. |
| **Where** | `/dashboard/money-desk` |

### B4. Weekly trustee report
| | |
|--|--|
| **Value** | Monday board WhatsApp without Excel. Online + counter + poojas. |
| **Who** | Trustees |
| **Plan** | Free+ (gated by `weekly_report` entitlement) |
| **How** | Dashboard → Weekly report → Share WhatsApp / Print. **Send now** via Resend email + Slack webhook. Settings: trustee emails, Slack URL, **Auto-send every Monday** (Vercel cron `0 3 * * 1` UTC → `/api/cron/weekly-reports` + `CRON_SECRET`). |
| **Where** | `/dashboard/report` · APIs: `/api/admin/reports/weekly`, `/send`, `/api/admin/notifications`, `/api/cron/weekly-reports` |


### B5. Form 10BD CSV export
| | |
|--|--|
| **Value** | CA-ready export for income-tax workflows (not auto-filing). |
| **Who** | Trustee + CA |
| **Plan** | Trust Pro |
| **How** | Dashboard → Trust → FY → Download CSV. |
| **Where** | `/dashboard/trust` |

### B6. Trust / 80G configuration
| | |
|--|--|
| **Value** | Legal name, 80G no., PAN on every receipt. |
| **Who** | Trustee (with CA) |
| **Plan** | Free+ |
| **How** | Dashboard → Trust → fill numbers → Save. Never invent tax numbers. |
| **Where** | `/dashboard/trust` |

### B7. Donation campaign goals ✨
| | |
|--|--|
| **Value** | Public progress bars for bhandara / construction drives → social proof. |
| **Who** | Devotees (view), trustees (set) |
| **Plan** | Growth+ to manage; Free shows if configured |
| **How** | Dashboard → Campaigns → add goal + target ₹ → appears on transparency. |
| **Where** | `/dashboard/campaigns`, `/t/{slug}/transparency` |

---

## C. Seva booking & festivals

### C1. Pooja / seva booking
| | |
|--|--|
| **Value** | Less queue chaos; prepaid sevas; data for pujaris. |
| **Who** | Devotees |
| **Plan** | Free (max 3 sevas listed) · Growth unlimited |
| **How** | `/t/{slug}/book` → select seva → name, gotra, sankalp, phone → date/slot → pay. |
| **Where** | Tenant book |

### C2. Gotra / nakshatra / sankalp capture
| | |
|--|--|
| **Value** | Real temple workflow — sankalp needs identity details. |
| **Who** | Pujari ops, devotees |
| **Plan** | Free+ |
| **How** | Filled on booking form; visible in bookings table. |
| **Where** | Book form, dashboard bookings |

### C3. Festival slot capacity
| | |
|--|--|
| **Value** | Prevent double-booking / overcrowd per slot. |
| **Who** | Devotees (see seats left), trustees |
| **Plan** | Growth+ (Free soft-capped) |
| **How** | Book flow shows seats left. Trustees use Festival board. |
| **Where** | Book form, `/dashboard/festival` |

### C4. Festival capacity board ✨
| | |
|--|--|
| **Value** | Live view of today’s slots filling — run the day, not guess. |
| **Who** | Trustees, festival desk |
| **Plan** | Growth+ |
| **How** | Dashboard → Festival board → pick date → see fill % per seva/slot. |
| **Where** | `/dashboard/festival` |

### C5. Printable seva certificate ✨
| | |
|--|--|
| **Value** | Devotee keeps a sacred keepsake; shareable proof of booking. |
| **Who** | Devotees |
| **Plan** | Free+ (with booking) |
| **How** | After booking → `/certificate/{bookingId}` → Print. Also link from dashboard bookings. |
| **Where** | Certificate page |

### C6. Seva catalogue admin ✨
| | |
|--|--|
| **Value** | Temples add/edit/deactivate sevas without calling eng. Free plan capped. |
| **Who** | Temple admin/trustee |
| **Plan** | Free+ (limit 3 active on Free) |
| **How** | Dashboard → Sevas → add name/price/max per slot. |
| **Where** | `/dashboard/poojas` |

### C7. Temple profile & branding
| | |
|--|--|
| **Value** | Name, address, colors for tenant site. |
| **Who** | Trustee / IT |
| **Plan** | Free+ |
| **How** | Dashboard → Settings. |
| **Where** | `/dashboard/settings` |

### C8. WhatsApp copy templates
| | |
|--|--|
| **Value** | One-tap copy for status/groups — no designer. |
| **Who** | Trustees, clerks |
| **Plan** | Free+ |
| **How** | Dashboard → WhatsApp texts → Copy. |
| **Where** | `/dashboard/messages` |

---

## D. Trust & transparency

### D1. Public fund totals
| | |
|--|--|
| **Value** | Donor confidence; grant narrative. |
| **Who** | Public |
| **Plan** | Free+ |
| **How** | Open `/t/{slug}/transparency`. |
| **Where** | Transparency |

### D2. Advanced project tracker
| | |
|--|--|
| **Value** | Map donations to construction / seva categories & milestones. |
| **Who** | Public, government narrative |
| **Plan** | Trust Pro |
| **How** | Auto on transparency when plan allows; upgrade wall if Free/Growth. |
| **Where** | Transparency (Pro) |

---

## E. On-site pilgrim innovation

### E1. QR darshan check-in
| | |
|--|--|
| **Value** | Visit history, footfall signal, future prasadam linking. |
| **Who** | Devotees, ops |
| **Plan** | Free+ |
| **How** | `/t/{slug}/checkin` → generate/scan QR. |
| **Where** | Check-in |

### E2. QR poster generator ✨
| | |
|--|--|
| **Value** | Print A4 posters for gates: Donate / Check-in / Temple home. No designer needed. |
| **Who** | Temple IT, trustees |
| **Plan** | Free+ |
| **How** | Dashboard → QR posters → pick type → Print. |
| **Where** | `/dashboard/posters` |

### E3. Emergency SOS
| | |
|--|--|
| **Value** | Safety at high-footfall rural temples. |
| **Who** | Devotees → temple security |
| **Plan** | Growth+ |
| **How** | `/t/{slug}/pilgrim` → SOS. |
| **Where** | Pilgrim |

### E4. Lost & found
| | |
|--|--|
| **Value** | Reduce distress; operational goodwill. |
| **Who** | Devotees, desk |
| **Plan** | Growth+ |
| **How** | Pilgrim → Lost & found → report/search. |
| **Where** | Pilgrim |

### E5. Crowd awareness heatmap
| | |
|--|--|
| **Value** | Help families pick less crowded zones. |
| **Who** | Devotees |
| **Plan** | Growth+ |
| **How** | Pilgrim page heatmap. |
| **Where** | Pilgrim |

### E6. Live devotee counter
| | |
|--|--|
| **Value** | Social proof + ops signal. |
| **Who** | Public |
| **Plan** | Free+ |
| **How** | Shown on tenant home. |
| **Where** | Tenant home |

---

## F. Engagement & AI

### F1. AI temple assistant
| | |
|--|--|
| **Value** | 24/7 answers on history, timings, how to donate. |
| **Who** | Devotees |
| **Plan** | Trust Pro full AI; others get local knowledge answers + upgrade note |
| **How** | Chat bubble bottom-right on tenant. |
| **Where** | Premium shell |

### F2. Voice navigation
| | |
|--|--|
| **Value** | Accessibility for low-literacy / hands-busy users. |
| **Who** | Devotees |
| **Plan** | Trust Pro |
| **How** | Voice control when plan unlocks. |
| **Where** | Tenant chrome |

### F3. Daily wisdom
| | |
|--|--|
| **Value** | Daily return habit; spiritual continuity. |
| **Who** | Devotees |
| **Plan** | Free+ |
| **How** | On tenant home. |
| **Where** | Tenant home |

### F4. Gamification (badges / streaks)
| | |
|--|--|
| **Value** | Light engagement; use carefully with trustees (service not “bhakti ranking”). |
| **Who** | Logged-in devotees |
| **Plan** | Growth+ |
| **How** | Dashboard gamification section when unlocked. |
| **Where** | Dashboard |

---

## G. Distribution & integration

### G1. Embed widgets
| | |
|--|--|
| **Value** | Keep WordPress site; still collect donate/book. |
| **Who** | Temple IT |
| **Plan** | Growth+ |
| **How** | Dashboard → Widgets → copy script. |
| **Where** | `/dashboard/widgets` |

### G2. Developer API
| | |
|--|--|
| **Value** | Custom apps, kiosks, partner integrations. |
| **Who** | Temple IT |
| **Plan** | Trust Pro |
| **How** | API keys admin; `GET /api/v1/temple`, `/api/v1/poojas`. |
| **Where** | Admin API keys |

### G3. WhatsApp channel (bot hooks)
| | |
|--|--|
| **Value** | Meet India where it already chats. |
| **Who** | Devotees via WhatsApp Business |
| **Plan** | Growth+ (integration keys required) |
| **How** | Configure WhatsApp env; webhook `/api/whatsapp`. |
| **Where** | Backend + env |

### G4. Offline / PWA indicators
| | |
|--|--|
| **Value** | Rural 2G resilience for core UI. |
| **Who** | All |
| **Plan** | Free+ |
| **How** | Install PWA; offline indicator when network drops. |
| **Where** | App shell |

---

## H. Team & security

### H1. Team invites & roles
| | |
|--|--|
| **Value** | Trustees control access without calling MandirOS. |
| **Who** | Trustees |
| **Plan** | Free+ |
| **How** | Dashboard → Team → invite ADMIN/TRUSTEE → remove leavers same day. |
| **Where** | `/dashboard/team` |

### H2. Role-based dashboard
| | |
|--|--|
| **Value** | Clerks ≠ super-admins. |
| **Who** | All staff |
| **Plan** | Free+ |
| **How** | Roles: DEVOTEE, ADMIN, TRUSTEE, SUPER_ADMIN. See handbook. |
| **Where** | Auth + dashboard |

### H3. Phone OTP login
| | |
|--|--|
| **Value** | Bharat-first auth; no email required. |
| **Who** | Everyone |
| **Plan** | Free+ |
| **How** | `/login` → Phone OTP (dev shows OTP if SMS unset). |
| **Where** | Login |

---

## I. Ops for MandirOS company

| Feature | Value | Doc |
|---------|-------|-----|
| Employee onboarding | New hire productive in days | `docs/handbook/EMPLOYEE_ONBOARDING.md` |
| Sales demo script | Consistent demos | `docs/playbooks/SALES_AND_DEMO.md` |
| Support triage | P0–P3 | `docs/playbooks/SUPPORT_TRIAGE.md` |
| Deploy runbook | Safe ship | `docs/runbooks/DEPLOY_AND_ENV.md` |
| Incident response | Trust under fire | `docs/runbooks/INCIDENT_RESPONSE.md` |
| Terms of Service | Platform contract | `/legal/terms` |
| Privacy Policy | Data / DPDP-aware notice | `/legal/privacy` |
| DPA | Controller / processor addendum | `/legal/dpa` |
| SLA | Uptime + support targets by plan | `/legal/sla` |
| Weekly auto-send ops | Resend + Slack + cron | `.env.example`, `vercel.json`, `docs/runbooks/DEPLOY_AND_ENV.md` |


---

## Quick “value ladder” for boards

1. **Free:** Online donate + money desk + weekly report → *habit*  
2. **Growth:** Festival capacity + pilgrim safety + widgets → *run the mandir*  
3. **Trust Pro:** 10BD + full ledger + API + AI → *audit & scale*  

---

**Update rule:** When you ship a feature, add a row here *and* a card in `/help` feature section *and* plan key in `plans.ts` if gated.
