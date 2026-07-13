# DESIGN.md — MandirOS Design System

**Version:** 2.0  
**Status:** Source of truth for UI/UX  
**Inspired by:** Linear density + Stripe clarity + Indian sacred warmth (not temple kitsch)

---

## 1. Design principles

1. **Trust over ornament** — Every screen should feel accountable, not decorative.
2. **Thumb-first India** — Primary actions reachable with one hand; 44px+ targets.
3. **Bilingual by default** — Hindi first for devotees; English parity for NRI/trustees.
4. **One job per screen** — Donate *or* book *or* desk; don’t stack every feature.
5. **Progressive disclosure** — Free users see value; upgrade walls are calm, not dark patterns.
6. **Sacred modern** — Saffron + maroon as brand; white space like Stripe, not cluttered “festival poster.”

---

## 2. Brand

| Token | Value | Usage |
|-------|-------|--------|
| **Primary** | Saffron `#f97316` → `#ea580c` | CTAs, active nav, focus |
| **Sacred** | Maroon `#7f1d1d` | Headlines, trust, footer bands |
| **Surface** | `#ffffff` / cream `#fff7ed` | Cards / page bg |
| **Ink** | `#1c1917` | Body text |
| **Muted** | `#78716c` | Secondary text |
| **Success** | `#16a34a` | Completed payments |
| **Warning** | `#d97706` | Upgrade / plan gates |
| **Danger** | `#dc2626` | SOS, errors |

**Logo mark:** `ॐ` in saffron→maroon gradient rounded square.  
**Wordmark:** Temple name (Hindi preferred) + optional “MandirOS” for platform pages.

---

## 3. Typography

| Role | Font | Size (mobile → desktop) | Weight |
|------|------|-------------------------|--------|
| Display | Noto Sans Devanagari / Inter | 2rem → 3.5rem | 700 |
| Title | same | 1.5rem → 2rem | 700 |
| Body | Inter + Devanagari | 1rem | 400 |
| Label | Inter | 0.75–0.875rem | 500–600 |
| Mono | ui-monospace | 0.75rem | 500 | Receipts, IDs |

- Line height body: 1.5–1.6  
- Headlines: `text-balance`, tracking tight  
- Never use pure black `#000` on pure white for long text

---

## 4. Spacing & layout

**Scale (4px base):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64  

| Context | Rule |
|---------|------|
| Page horizontal | `px-4` mobile, `sm:px-6`, max `max-w-6xl` content |
| Card padding | `p-4` mobile, `p-6` desktop |
| Section vertical | `py-12` / `sm:py-16` |
| Stack gaps | `gap-3` tight, `gap-4` default, `gap-6` sections |

**Grid:** Mobile 1 col → sm 2 → lg 3 for cards. Dashboard: sidebar from `lg` only.

---

## 5. Radius & elevation

| Token | Value |
|-------|-------|
| `radius-sm` | 8px |
| `radius-md` | 12px |
| `radius-lg` | 16px |
| `radius-xl` | 24px |
| Card shadow | `0 8px 30px rgb(127 29 29 / 0.06)` |
| CTA shadow | Saffron glow on primary buttons |

---

## 6. Components (required patterns)

### Button
- **Primary:** saffron fill, white text, `h-12` on mobile primary CTAs  
- **Secondary:** outline, 2px soft border  
- **Ghost:** text only  
- **Destructive:** red outline/fill sparingly  
- Loading: disable + spinner or “…” label  
- Never use small buttons for primary money actions

### Input
- Height 44–48px mobile  
- `text-base` (16px) on mobile to prevent iOS zoom  
- Labels always visible (not placeholder-only)  
- Error under field in red text

### Card / Surface
- `surface-card` or `surface-elevated` utility classes  
- Border `border-border/80`  
- Prefer elevation over heavy borders

### Feature gate
- Calm amber/saffron panel  
- Explain *why* upgrade helps (time/money), not FOMO spam  
- CTA → `/dashboard/billing`

### Navigation
- **Desktop:** top glass nav, primary + secondary links  
- **Mobile public:** bottom tabs (Home, Donate, Book, Transparency, More)  
- **Mobile trustee:** bottom tabs (Dash, Desk, Report, Home)  
- Safe area insets always

### Chat / tour floats
- Sit **above** bottom nav: `bottom-[calc(5.25rem+env(safe-area-inset-bottom))]`  
- Full-width sheet on small screens for chat panel

---

## 7. Motion

- Prefer 150–250ms ease transitions  
- `active:scale-[0.98]` on primary cards/buttons  
- No gratuitous parallax  
- Respect `prefers-reduced-motion` when adding animation

---

## 8. Accessibility

- Contrast ≥ WCAG AA for text  
- Focus rings: saffron ring 2px  
- Icon-only buttons need `aria-label`  
- Forms: associate `Label` + `htmlFor`  
- Don’t convey status by color alone (use text + icon)

---

## 9. Page templates

### Marketing / devotee
```
[Nav]
[Hero: chip + h1 + body + primary/secondary CTAs]
[Optional live widgets]
[3 job cards]
[Trust/promise band]
[Footer CTA]
[Bottom nav mobile]
```

### Transaction (donate / book)
```
[Centered max-w-lg/md]
[Chip + title]
[Trust micro-row]
[Form card]
[Legal microcopy]
```

### Trustee desk
```
[Console header + horizontal pills mobile]
[Sidebar desktop]
[Page title + one-line purpose]
[Primary action form above fold]
[Today totals]
```

---

## 10. Content tone

| Context | Tone |
|---------|------|
| Devotee | Warm, respectful, short Hindi-first |
| Trustee | Direct, numeric, “kitna aaya” |
| Upgrade | Honest value; no shame |
| Errors | Actionable, bilingual if possible |

---

## 11. File map for designers/devs

| Asset | Path |
|-------|------|
| Tokens / utilities | `src/app/globals.css` |
| Tailwind theme | `tailwind.config.ts` |
| Primitives | `src/components/ui/*` |
| Shell | `src/components/layout/*` |
| Domain UI | `src/components/{donation,booking,...}` |
| UX flows | `docs/specs/UX-SPEC.md` |

---

## 12. Definition of done (UI)

A screen is done when:

1. Usable at **375px** without horizontal scroll (except intentional chips)  
2. Uses design tokens (no random hex)  
3. Primary action obvious in &lt;3 seconds  
4. Works with bottom nav / safe areas  
5. Empty, loading, and error states exist  
6. Matches PRD acceptance criteria for that flow  

---

**Jai Shri Hanuman — design for trust.**
