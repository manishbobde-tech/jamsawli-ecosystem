/**
 * In-app help center content — keep in sync with docs/ playbooks.
 * Operators without Git access use /help.
 */

export type HelpAudience =
  | "all"
  | "employee"
  | "trustee"
  | "clerk"
  | "it"
  | "sales"
  | "cs"

export interface HelpArticle {
  id: string
  title: string
  audience: HelpAudience[]
  summary: string
  body: string[]
  links?: { label: string; href: string }[]
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "platform-vs-tenant",
    title: "Platform vs temple tenant",
    audience: ["all", "employee", "trustee", "it"],
    summary: "MandirOS is the company product. Each temple is a tenant.",
    body: [
      "MandirOS platform lives at the site root (/): pricing, demo, directory, onboarding.",
      "Each temple has its own site at /t/{slug} — for example /t/jamsawli-hanuman.",
      "Jamsawli is the anchor tenant (proof), not the brand of the whole product.",
      "Staff console for temples is /dashboard. Super-admin platform tools are /admin.",
    ],
    links: [
      { label: "Platform home", href: "/" },
      { label: "Jamsawli tenant", href: "/t/jamsawli-hanuman" },
      { label: "Temple directory", href: "/temples" },
    ],
  },
  {
    id: "employee-onboarding",
    title: "Employee onboarding (Day 1–3)",
    audience: ["employee", "sales", "cs"],
    summary: "How new MandirOS staff become productive.",
    body: [
      "Day 1: Walk / → /demo → /t/jamsawli-hanuman → money desk → weekly report → /help.",
      "Day 2: Personally complete money desk entry, seva booking, temple application form.",
      "Day 3: Shadow sales or support; take one ticket with a playbook link.",
      "Never invent pricing — only /pricing and plan definitions.",
      "Never browse donor PANs without a support reason.",
    ],
    links: [
      { label: "Sales demo script", href: "/help#sales-demo" },
      { label: "Support triage", href: "/help#support" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    id: "sales-demo",
    title: "Sales demo script (30–40 min)",
    audience: ["sales", "employee"],
    summary: "Lead with money desk and Free vs Pro — not AI.",
    body: [
      "Open platform home: explain multi-tenant MandirOS.",
      "Open /demo: toggle Free vs Trust Pro; open demo-free vs demo-pro pilgrim locks.",
      "Open anchor tenant donate + transparency.",
      "Login staff: Money desk ₹101 cash → print receipt; Weekly report → share text.",
      "Close: apply at /admin/temples/new; send /for-trustees and /help.",
      "Pricing only: Free ₹0 · Growth ₹2,499 · Trust Pro ₹7,999 (+ transparent txn fees).",
    ],
    links: [
      { label: "Demo hub", href: "/demo" },
      { label: "For trustees", href: "/for-trustees" },
    ],
  },
  {
    id: "support",
    title: "Support triage",
    audience: ["cs", "employee"],
    summary: "Severity, intake, macros.",
    body: [
      "P0: payments down / data leak / site down → 15 min ack, incident runbook.",
      "P1: major feature broken with workaround → 4h.",
      "P2/P3: minor or how-to → 2 business days.",
      "Always capture: slug, plan, URL, steps, screenshot.",
      "Feature locked → billing + pricing. Tax advice → temple CA only.",
    ],
    links: [{ label: "Billing", href: "/dashboard/billing" }],
  },
  {
    id: "trustee",
    title: "Trustee daily / weekly ops",
    audience: ["trustee", "employee"],
    summary: "How temple boards should use MandirOS every week.",
    body: [
      "Morning: Money desk for any unlogged counter cash/UPI.",
      "Day: log counter gifts immediately; process bookings.",
      "Monday: Weekly report → WhatsApp board group.",
      "Monthly: review Team access, 80G settings, plan fit.",
      "Do not expect MandirOS to replace Tally or file taxes for you.",
    ],
    links: [
      { label: "Money desk", href: "/dashboard/money-desk" },
      { label: "Weekly report", href: "/dashboard/report" },
      { label: "Trust / 80G", href: "/dashboard/trust" },
      { label: "Team", href: "/dashboard/team" },
    ],
  },
  {
    id: "clerk",
    title: "Counter clerk — money desk only",
    audience: ["clerk", "trustee"],
    summary: "10-second counter receipts.",
    body: [
      "Login → Dashboard → Money desk.",
      "Enter amount, mode (Cash/UPI/Card), optional name & purpose.",
      "80G only with valid PAN if devotee asks.",
      "Record → Print receipt.",
      "Never invent PAN; never share OTP; escalate billing/trust settings to trustee.",
    ],
    links: [{ label: "Open money desk", href: "/dashboard/money-desk" }],
  },
  {
    id: "it",
    title: "Temple IT — embed, team, API",
    audience: ["it", "trustee"],
    summary: "Technical controls for temple web/IT.",
    body: [
      "Public URLs under /t/{slug}/…",
      "Embed: /embed/donate?temple={slug} or Dashboard → Widgets (Growth+).",
      "Team: invite trustees/admins by phone or email; remove leavers same day.",
      "API keys only on Trust Pro; rotate if leaked.",
      "Custom domains require MandirOS mapping — until then use path tenants.",
    ],
    links: [
      { label: "Widgets", href: "/dashboard/widgets" },
      { label: "Team", href: "/dashboard/team" },
    ],
  },
  {
    id: "onboarding-temple",
    title: "Temple onboarding checklist (CS)",
    audience: ["cs", "employee", "trustee"],
    summary: "From approval to first value in 7 days.",
    body: [
      "Tenant URL works; trustee can login.",
      "Team: clerk + trustee added.",
      "Trust settings filled with CA-approved numbers.",
      "First money desk entry; first donate test.",
      "At least one pooja; plan selected.",
      "Weekly report opened once.",
      "30-day health: desk used, GMV non-zero, report shared.",
    ],
    links: [{ label: "Apply temple", href: "/admin/temples/new" }],
  },
  {
    id: "incident",
    title: "Incidents (P0)",
    audience: ["employee", "cs"],
    summary: "When money or site is broken.",
    body: [
      "Acknowledge in team chat immediately.",
      "Check Vercel deploy, DB, Razorpay status.",
      "Bad deploy → promote previous Vercel deployment.",
      "CS updates temples with factual status.",
      "Postmortem within 48h for P0.",
    ],
  },
  {
    id: "golden-paths",
    title: "Golden paths (must always work)",
    audience: ["all", "employee"],
    summary: "If these fail, it is P0/P1.",
    body: [
      "Platform home and add-temple application.",
      "Tenant donate → receipt.",
      "Money desk → receipt.",
      "Book seva with capacity.",
      "Weekly report share.",
      "Demo Free vs Pro tenants.",
      "OTP login (dev OTP when SMS not configured).",
    ],
  },
  {
    id: "feature-money",
    title: "Feature guide: Money desk, 80G, weekly report",
    audience: ["trustee", "clerk", "all"],
    summary: "Core value — why boards pay.",
    body: [
      "Money desk: Dashboard → Money desk → amount + Cash/UPI → Record → Print receipt (~10s).",
      "80G: Tick on donate/desk with PAN; configure trust numbers under Trust settings; open /receipt/{id}.",
      "Weekly report: Dashboard → Report → Share WhatsApp Monday for board “kitna aaya”.",
      "Value: daily habit + board trust without Excel.",
    ],
    links: [
      { label: "Money desk", href: "/dashboard/money-desk" },
      { label: "Weekly report", href: "/dashboard/report" },
      { label: "Trust 80G", href: "/dashboard/trust" },
    ],
  },
  {
    id: "feature-booking",
    title: "Feature guide: Seva booking, capacity, certificate",
    audience: ["trustee", "all"],
    summary: "Gotra, sankalp, seats left, printable certificate.",
    body: [
      "Devotee opens /t/{slug}/book → seva → name, gotra, sankalp, phone → date/slot (seats shown).",
      "Growth+ enforces real maxPerSlot capacity; Free soft-caps.",
      "After confirm: seva certificate at /certificate/{bookingId} for print/share.",
      "Trustees watch fill rates on Festival board (Growth+).",
      "Value: less festival chaos; pujari has sankalp data; devotee keepsake.",
    ],
    links: [
      { label: "Festival board", href: "/dashboard/festival" },
      { label: "Bookings", href: "/dashboard/bookings" },
    ],
  },
  {
    id: "feature-qr-posters",
    title: "Feature guide: QR posters",
    audience: ["it", "trustee", "all"],
    summary: "Print gate posters for donate / book / check-in.",
    body: [
      "Dashboard → QR posters → pick Donate / Book / Check-in / Home.",
      "Print A4, laminate at hundi / parking / entrance.",
      "Scan opens correct /t/{slug}/… URL — no typing.",
      "Value: zero design cost; higher conversion at physical temple.",
    ],
    links: [{ label: "QR posters", href: "/dashboard/posters" }],
  },
  {
    id: "feature-campaigns",
    title: "Feature guide: Donation campaigns",
    audience: ["trustee", "all"],
    summary: "Public progress bars for drives.",
    body: [
      "Growth+: Dashboard → Campaigns → title + target ₹.",
      "Appears on transparency page with % funded.",
      "Value: social proof for bhandara / construction drives.",
    ],
    links: [
      { label: "Campaigns", href: "/dashboard/campaigns" },
    ],
  },
  {
    id: "feature-pilgrim",
    title: "Feature guide: Pilgrim safety suite",
    audience: ["trustee", "all"],
    summary: "SOS, lost & found, crowd, check-in.",
    body: [
      "Growth+: /t/{slug}/pilgrim — SOS, lost & found, crowd heatmap.",
      "Check-in: /t/{slug}/checkin for darshan QR.",
      "Value: safety + ops goodwill on high-footfall days.",
    ],
  },
  {
    id: "feature-catalog",
    title: "Full feature catalog (all innovations)",
    audience: ["all", "employee", "sales"],
    summary: "Every feature: value, plan, how-to.",
    body: [
      "Complete catalog lives in the repo: docs/FEATURE_CATALOG.md",
      "Sections: Platform, Money, Booking, Transparency, Pilgrim, AI, Distribution, Team.",
      "Sales: use catalog + /demo Free vs Pro for objections.",
      "Eng: when shipping features, update FEATURE_CATALOG.md and this help entry.",
    ],
    links: [
      { label: "Public features page", href: "/features" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    id: "weekly-report-autosend",
    title: "Weekly report: email, Slack, Monday auto-send",
    audience: ["trustee", "it", "employee", "cs"],
    summary: "Board-ready kitna aaya — manual send or Monday cron.",
    body: [
      "Dashboard → Weekly report (plan feature: weekly_report on Growth+).",
      "Open Email / Slack settings: add trustee emails (comma-separated) and optional Slack incoming webhook URL.",
      "Send now: posts one-liner + totals via Resend email and/or Slack.",
      "Auto-send every Monday: enable checkbox; requires CRON_SECRET + Vercel cron hitting /api/cron/weekly-reports (03:00 UTC).",
      "Env for ops: RESEND_API_KEY, RESEND_FROM, optional SLACK_WEBHOOK_URL, WEEKLY_REPORT_EMAIL fallback.",
      "Without RESEND_API_KEY, email is dry-run logged (demo-safe).",
      "Privacy: only notify addresses/webhooks the temple controls — see /legal/privacy.",
    ],
    links: [
      { label: "Weekly report", href: "/dashboard/report" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
  {
    id: "legal",
    title: "Terms, Privacy, DPA & SLA",
    audience: ["all", "trustee", "employee", "it"],
    summary: "Platform legal + service levels for MandirOS multi-tenant use.",
    body: [
      "Terms: /legal/terms — accounts, plans, temple obligations, donations, liability.",
      "Privacy: /legal/privacy — data collected, processors (payments, email, Slack), weekly report notifications, DPDP-aware rights.",
      "DPA: /legal/dpa — temple as controller, MandirOS as processor (paid/free tenants).",
      "SLA: /legal/sla — uptime targets, support response by plan, ticket path.",
      "Footer on platform shell links to legal pages.",
      "Temples remain responsible for accurate 80G/tax claims and lawful use of devotee data.",
      "Templates are commercial drafts — large trusts may request counsel review.",
    ],
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "DPA", href: "/legal/dpa" },
      { label: "SLA", href: "/legal/sla" },
    ],
  },
]

export function articlesFor(audience: HelpAudience | "all") {
  if (audience === "all") return HELP_ARTICLES
  return HELP_ARTICLES.filter(
    (a) => a.audience.includes("all") || a.audience.includes(audience)
  )
}
