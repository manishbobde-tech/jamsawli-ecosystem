# UX Specification — MandirOS

**Companion to:** DESIGN.md · PRD.md  
**Version:** 2.0

---

## 1. Information architecture

```
Platform — MandirOS (no temple branding)
├── /                      MandirOS home
├── /pricing · /features · /demo · /for-trustees
├── /platform · /case-study · /temples
├── /login · /register
├── /admin/*               Platform ops
└── /dashboard/*           Trustee console (cross-tenant later)

Tenant — temple site (path or subdomain)
├── /t/{slug}              Temple home
├── /t/{slug}/donate
├── /t/{slug}/book
├── /t/{slug}/transparency
├── /t/{slug}/pilgrim
├── /t/{slug}/checkin
└── {slug}.mandiros.com/*  → rewrites to /t/{slug}/*

Examples
├── /t/jamsawli-hanuman    Anchor temple
├── /t/demo-free           Free sandbox
└── /t/demo-pro            Trust Pro sandbox

Embed
├── /embed/donate?temple=slug
└── /embed/book?temple=slug

Legacy
├── /donate → 308 → /t/{default}/donate
```

---

## 2. Key flows

### F1 Guest donate
1. Land `/donate` (or embed)  
2. Pick amount / purpose  
3. Optional name, phone, 80G+PAN  
4. Pay (Razorpay or demo path)  
5. Success → receipt link `/receipt/[id]`  

**Errors:** invalid PAN, gateway fail, temple not found  

### F2 Book pooja
1. Select seva  
2. Name, phone, gotra, nakshatra, sankalp  
3. Date + time; show seats left  
4. Pay / demo confirm  

**Errors:** slot full (409), missing name  

### F3 Money desk (staff)
1. Login staff  
2. Open money desk  
3. Amount + mode (cash/UPI/card)  
4. Optional 80G  
5. Record → print receipt  

**Latency target:** &lt; 10s perceived  

### F4 Weekly report
1. Staff opens report  
2. Sees 7-day totals  
3. Share WhatsApp text or print  

### F5 Free vs Pro demo
1. `/demo` hub  
2. Toggle Free/Pro iframe  
3. Open full tenant paths  
4. Upgrade CTA → billing / apply  

### F6 OTP login
1. Phone → send OTP  
2. Enter OTP (+ name if new)  
3. Session → dashboard if staff else home  

---

## 3. Navigation patterns

| Viewport | Pattern |
|----------|---------|
| &lt; lg public | Bottom tabs + hamburger for secondary |
| ≥ lg public | Top glass nav |
| &lt; lg trustee | Pill scroll + bottom desk tabs |
| ≥ lg trustee | Sidebar + top console bar |

---

## 4. States

Every list/form must define:

| State | UI |
|-------|-----|
| Loading | Skeleton or centered “Loading…” |
| Empty | Illustration optional + next action |
| Error | Inline message + retry |
| Success | Toast + optional deep link |
| Upgrade | FeatureGate component |

---

## 5. Responsive breakpoints

| Name | Width | Notes |
|------|-------|-------|
| base | 0–639 | Phone-first |
| sm | 640+ | Larger phones / small tablet |
| md | 768+ | Tablet |
| lg | 1024+ | Desktop nav/sidebar |
| xl | 1280+ | Wide marketing |

---

## 6. Accessibility checklist (per screen)

- [ ] Focus order logical  
- [ ] Labels on inputs  
- [ ] Contrast AA  
- [ ] Aria on icon buttons  
- [ ] No info by color alone  

---

## 7. Copy templates

**Donate success (HI):** दान सफल। रसीद देखें / प्रिंट करें।  
**Slot full (HI):** यह स्लॉट भर चुका है। दूसरा समय चुनें।  
**Upgrade (EN):** This feature needs Growth. Upgrade to unlock festival capacity.  

---

## 8. Out of scope UX (v2)

- Desktop-only dense ERP tables as default mobile UI  
- Infinite marketing carousels  
- Dark mode (evaluate later)  
