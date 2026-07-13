"use client"

import Link from "next/link"
import {
  IndianRupee,
  FileBarChart,
  CalendarHeart,
  ShieldCheck,
  QrCode,
  Users,
  Sparkles,
  Building2,
  ArrowRight,
  ExternalLink,
  Lock,
  CheckCircle2,
  Printer,
  Megaphone,
  HeartHandshake,
  LayoutDashboard,
  KeyRound,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

const DEMO = "demo-full"
const t = (path = "") => (path ? `/t/${DEMO}${path}` : `/t/${DEMO}`)

type Step = {
  id: string
  phase: "pilgrim" | "money" | "ops" | "trust" | "platform"
  icon: typeof IndianRupee
  title: string
  titleHi?: string
  value: string
  valueHi?: string
  plan: string
  href: string
  doThis: string[]
  proof: string
}

const STEPS: Step[] = [
  {
    id: "home",
    phase: "pilgrim",
    icon: Building2,
    title: "Temple home (tenant site)",
    titleHi: "मंदिर होम",
    value:
      "Every temple is a branded mini-site — not a generic form. Devotees land on the mandir, not MandirOS marketing.",
    plan: "All plans",
    href: t(),
    doThis: [
      "Open the showcase home — saffron branding, Hindi name, CTAs",
      "Note multi-tenant URL pattern /t/demo-full",
      "Compare with Free sandbox /t/demo-free (fewer unlocks)",
    ],
    proof: "Public tenant shell = distribution channel for QR posters & WhatsApp links",
  },
  {
    id: "donate",
    phase: "pilgrim",
    icon: HeartHandshake,
    title: "Online donate + 80G fields",
    value:
      "UPI/card path with purpose + optional PAN for 80G-style receipts. Money hits digital rails; trust gets a receipt trail.",
    plan: "Free+",
    href: t("/donate"),
    doThis: [
      "Try amounts 501 / 1101 — purpose chips",
      "Toggle 80G / PAN if shown (demo may dry-run without Razorpay keys)",
      "After success (or sample): /receipt/{id} is the shareable proof",
    ],
    proof: "Seeded: 24 completed donations across Annadan, Construction, Festival…",
  },
  {
    id: "book",
    phase: "pilgrim",
    icon: CalendarHeart,
    title: "Seva booking (gotra + sankalp + slots)",
    value:
      "Pujari needs gotra & sankalp — not just a payment. Capacity per slot stops festival chaos (Growth+ enforces hard caps).",
    plan: "Free book · Growth+ capacity",
    href: t("/book"),
    doThis: [
      "Pick Sunderkand / Abhishek — see price + duration",
      "Enter devotee name, gotra, sankalp, phone",
      "Confirm → certificate at /certificate/{bookingId}",
    ],
    proof: "Seeded: 18 bookings with real gotra/sankalp for festival board fill",
  },
  {
    id: "transparency",
    phase: "trust",
    icon: ShieldCheck,
    title: "Public fund transparency",
    value:
      "Boards publish totals so donors stop asking “paise kahan gaye?”. Campaign progress bars create social proof.",
    plan: "Free basic · Pro advanced",
    href: t("/transparency"),
    doThis: [
      "Open transparency — totals from sample donations",
      "See campaign bars: Bhandara, Renovation, Gaushala",
      "Share this URL in trustee WhatsApp groups",
    ],
    proof: "Live progress vs target on 3 demo campaigns",
  },
  {
    id: "checkin",
    phase: "pilgrim",
    icon: QrCode,
    title: "Darshan check-in",
    value: "QR at gate → visit log for crowd awareness and gamification streaks.",
    plan: "Free+",
    href: t("/checkin"),
    doThis: ["Open check-in page", "Scan/generate flow for darshan", "Visits feed weekly report volume"],
    proof: "Seeded: 40 check-ins this week on showcase temple",
  },
  {
    id: "pilgrim",
    phase: "ops",
    icon: AlertTriangle,
    title: "Pilgrim safety (SOS + lost & found + crowd)",
    value:
      "High-footfall days need more than donations — SOS and lost items reduce chaos and liability perception.",
    plan: "Growth / Trust Pro",
    href: t("/pilgrim"),
    doThis: [
      "Open pilgrim suite",
      "See demo SOS (medical at entrance)",
      "Lost bag + found bottle samples",
    ],
    proof: "Trust Pro unlock — locked on Free demo temple",
  },
  {
    id: "login",
    phase: "money",
    icon: KeyRound,
    title: "Staff login (trustee / clerk)",
    value: "Same product, two jobs: clerk records cash in 10s; trustee sees Monday totals.",
    plan: "All",
    href: "/login",
    doThis: [
      "Login: trustee@demo-full.local / Demo@Temple1",
      "Or clerk@demo-full.local / Demo@Temple1",
      "Also: trustee@jamsawli.local / Temple@Trustee1 (if staff seed ran)",
    ],
    proof: "Password auth for demos; OTP available when SMS env set",
  },
  {
    id: "money-desk",
    phase: "money",
    icon: IndianRupee,
    title: "Money desk (counter / hundi)",
    value:
      "THE habit loop. Cash/UPI at counter → print receipt in ~10 seconds. Without this, software dies after festival.",
    plan: "Free+",
    href: "/dashboard/money-desk",
    doThis: [
      "After login → Money desk",
      "Enter ₹101 Cash → Record → Print",
      "See today's list of counter entries",
    ],
    proof: "Seeded hundi + counter rows — weekly report includes them",
  },
  {
    id: "report",
    phase: "money",
    icon: FileBarChart,
    title: "Weekly trustee report + email/Slack",
    value:
      "Monday board message without Excel: online + counter + poojas, Hindi one-liner, Send now / auto-send.",
    plan: "Free+",
    href: "/dashboard/report",
    doThis: [
      "Open Weekly report — kitna aaya one-liner",
      "WhatsApp share / Print",
      "Email / Slack settings → Send now (dry-run without Resend key)",
    ],
    proof: "Cron ready Mon 03:00 UTC when auto-send + CRON_SECRET set",
  },
  {
    id: "festival",
    phase: "ops",
    icon: CalendarHeart,
    title: "Festival board (slot fill)",
    value: "See which sevas/slots fill first — plan pujaris and cut walk-in chaos.",
    plan: "Growth+",
    href: "/dashboard/festival",
    doThis: ["Open Festival board", "Scan bookings by day/slot", "Tie back to maxPerSlot on sevas"],
    proof: "Bookings with gotra make pujari sheets useful",
  },
  {
    id: "posters",
    phase: "ops",
    icon: Printer,
    title: "QR posters (donate / book / check-in)",
    value: "Print A4 at hundi and parking — zero design agency. Scan opens correct /t/slug path.",
    plan: "Free+",
    href: "/dashboard/posters",
    doThis: ["Generate Donate / Book / Check-in posters", "Print preview", "Scan with phone camera"],
    proof: "Physical → digital conversion loop",
  },
  {
    id: "campaigns",
    phase: "trust",
    icon: Megaphone,
    title: "Donation campaigns",
    value: "Named drives with targets — public % funded on transparency page.",
    plan: "Growth+",
    href: "/dashboard/campaigns",
    doThis: ["List Bhandara / Renovation campaigns", "Edit target or add a drive", "Public mirror on /transparency"],
    proof: "Social proof for big construction asks",
  },
  {
    id: "team",
    phase: "ops",
    icon: Users,
    title: "Team invites & roles",
    value: "Clerk ≠ trustee. Role gates protect donor PANs and trust settings.",
    plan: "Free+",
    href: "/dashboard/team",
    doThis: ["See staff model", "Invite pattern for temple IT"],
    proof: "SUPER_ADMIN / TRUSTEE / ADMIN separation",
  },
  {
    id: "poojas-admin",
    phase: "ops",
    icon: Sparkles,
    title: "Seva catalogue admin",
    value: "Price, duration, capacity — Free caps catalogue size; Growth unlocks unlimited.",
    plan: "All (limits by plan)",
    href: "/dashboard/poojas",
    doThis: ["Edit prices", "Note maxPerSlot for festivals"],
    proof: "Showcase has 8 sevas including Abhishek & Annadan",
  },
  {
    id: "ops",
    phase: "ops",
    icon: CheckCircle2,
    title: "Daily ops checklist + cash log",
    value: "Morning aarti / hundi / CCTV checklist so trustees know the day opened cleanly.",
    plan: "Growth+",
    href: "/dashboard/ops",
    doThis: ["Tick checklist items", "Log cash side panel if present"],
    proof: "Seeded completed ops log for today",
  },
  {
    id: "trust",
    phase: "trust",
    icon: ShieldCheck,
    title: "80G config + Form 10BD export",
    value: "CA-ready fields on receipts + CSV for 10BD workflows (not auto-filing).",
    plan: "80G Free+ · 10BD Trust Pro",
    href: "/dashboard/trust",
    doThis: ["Confirm legal name / 80G / PAN", "Download 10BD CSV for FY"],
    proof: "Donations with want80G + PAN seeded for export",
  },
  {
    id: "widgets",
    phase: "platform",
    icon: LayoutDashboard,
    title: "Embed widgets",
    value: "Drop donate/book on existing temple WordPress site — no full migration day-1.",
    plan: "Growth+",
    href: "/dashboard/widgets",
    doThis: ["Copy embed snippet", "Preview /embed/donate?temple=demo-full"],
    proof: "Distribution for temples with old websites",
  },
  {
    id: "billing",
    phase: "platform",
    icon: IndianRupee,
    title: "Plans & billing",
    value: "Free habit → Growth festival ops → Trust Pro compliance. Pay more, unlock more.",
    plan: "—",
    href: "/dashboard/billing",
    doThis: ["See current plan", "Compare on /pricing and /demo Free vs Pro"],
    proof: "Showcase + anchor seeded as TRUST_PRO",
  },
  {
    id: "legal",
    phase: "platform",
    icon: FileBarChart,
    title: "Legal & SLA (company layer)",
    value: "ToS, Privacy, DPA, SLA — table-stakes for paid temple SaaS.",
    plan: "Platform",
    href: "/legal/terms",
    doThis: [
      "Terms · Privacy · DPA · SLA in footer",
      "Help center playbooks at /help",
    ],
    proof: "Company-ready, not only temple UI",
  },
]

const PHASE_LABEL: Record<Step["phase"], string> = {
  pilgrim: "1 · Devotee / pilgrim",
  money: "2 · Money (why they pay)",
  ops: "3 · Temple ops",
  trust: "4 · Trust & compliance",
  platform: "5 · Platform & company",
}

export default function DemoWalkthroughPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  const phases: Step["phase"][] = ["pilgrim", "money", "ops", "trust", "platform"]

  return (
    <main className="gradient-hero min-h-screen pb-20">
      <div className="page-container py-10 sm:py-14">
        <div className="max-w-3xl">
          <div className="chip mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            {hi ? "पूर्ण डेमो वॉकथ्रू" : "Full product walkthrough"}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sacred-maroon tracking-tight">
            {hi
              ? "एक मंदिर में पूरी उत्पाद कीमत"
              : "Every feature, with the real value it earns"}
          </h1>
          <p className="mt-4 text-stone-600 text-base sm:text-lg leading-relaxed">
            Showcase temple{" "}
            <strong className="text-sacred-maroon">Shri Ram Darbar</strong> (
            <code className="text-xs bg-white px-1.5 py-0.5 rounded border">/t/{DEMO}</code>
            ) is seeded with donations, counter cash, sevas, campaigns, visits, and pilgrim
            data. Follow the path in order — pilgrim → money desk → board report → trust.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link href={t()}>
              <Button size="lg" className="w-full sm:w-auto gap-2 h-12 rounded-xl">
                Open showcase mandir
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 rounded-xl">
                Staff login
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                Free vs Pro compare
              </Button>
            </Link>
          </div>
        </div>

        {/* Credentials card */}
        <div className="mt-8 max-w-3xl rounded-2xl border border-saffron-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-sacred-maroon">Demo credentials</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700 font-mono">
            <li>
              <span className="text-stone-400 font-sans not-italic">Trustee</span>{" "}
              trustee@demo-full.local · Demo@Temple1
            </li>
            <li>
              <span className="text-stone-400 font-sans">Clerk</span> clerk@demo-full.local ·
              Demo@Temple1
            </li>
            <li className="text-xs text-stone-500 font-sans pt-1">
              Staff console uses the platform default tenant (jamsawli-hanuman) — also seeded
              with sample money so Money desk & Weekly report show real totals after login.
            </li>
          </ul>
        </div>

        {/* Still pending honesty */}
        <div className="mt-4 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-sm text-amber-950">
          <p className="font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4" />
            What still needs live keys (not bugs)
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-amber-900/90">
            <li>
              <strong>Razorpay</strong> — real UPI capture (donate may dry-run without keys)
            </li>
            <li>
              <strong>Resend</strong> — real weekly emails (Send now is dry-run without key)
            </li>
            <li>
              <strong>SMS OTP</strong> — phone login without console OTP
            </li>
            <li>
              <strong>OpenAI</strong> — AI chatbot / voice on Trust Pro
            </li>
          </ul>
        </div>

        {/* Phases */}
        {phases.map((phase) => {
          const items = STEPS.filter((s) => s.phase === phase)
          return (
            <section key={phase} className="mt-12">
              <h2 className="text-sm font-bold uppercase tracking-wide text-saffron-700 mb-4">
                {PHASE_LABEL[phase]}
              </h2>
              <div className="space-y-4">
                {items.map((step, idx) => (
                  <article
                    key={step.id}
                    id={step.id}
                    className="rounded-2xl border bg-white p-5 sm:p-6 shadow-sm scroll-mt-24"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-50 text-saffron-700">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 gap-y-1">
                          <h3 className="text-lg font-bold text-sacred-maroon">
                            {idx + 1}. {step.title}
                          </h3>
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                            {step.plan}
                          </span>
                        </div>
                        <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
                          {step.value}
                        </p>
                        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-stone-50 border p-3">
                            <p className="text-xs font-semibold text-stone-500 uppercase mb-1.5">
                              Do this
                            </p>
                            <ul className="space-y-1 text-stone-700">
                              {step.doThis.map((d) => (
                                <li key={d} className="flex gap-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-xl bg-saffron-50/60 border border-saffron-100 p-3">
                            <p className="text-xs font-semibold text-saffron-800 uppercase mb-1.5">
                              Value proof
                            </p>
                            <p className="text-stone-700">{step.proof}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link href={step.href}>
                            <Button className="gap-2">
                              Open live
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        {/* Value ladder recap */}
        <section className="mt-14 max-w-3xl rounded-3xl bg-gradient-to-br from-sacred-maroon to-saffron-700 text-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Value ladder (what to say to a trustee)</h2>
          <ol className="mt-4 space-y-3 text-sm sm:text-base text-white/90">
            <li>
              <strong className="text-white">1. Free:</strong> Online donate + money desk +
              weekly report → daily habit (“kitna aaya?”).
            </li>
            <li>
              <strong className="text-white">2. Growth:</strong> Festival capacity, pilgrim
              safety, campaigns, widgets → run the mandir on busy days.
            </li>
            <li>
              <strong className="text-white">3. Trust Pro:</strong> 10BD, full ledger, API, AI
              → audit, CA, multi-site trust boards.
            </li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/pricing">
              <Button className="bg-white text-sacred-maroon hover:bg-saffron-50">Pricing</Button>
            </Link>
            <Link href="/for-trustees">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                For trustees
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Help playbooks
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
