"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Check,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  FlaskConical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import {
  FEATURE_LABELS,
  FeatureKey,
  PLANS,
  planHasFeature,
} from "@/lib/plans"
import { startProductTour } from "@/components/tour/product-tour"

const COMPARE: FeatureKey[] = [
  "donate",
  "book",
  "eighty_g_receipts",
  "basic_transparency",
  "analytics",
  "unlimited_poojas",
  "embed_widgets",
  "daily_ops",
  "pilgrim_sos",
  "lost_found",
  "gamification",
  "whatsapp",
  "ai_chatbot",
  "voice_assistant",
  "advanced_transparency",
  "form_10bd",
  "developer_api",
]

const DEMO_FREE = "demo-free"
const DEMO_PRO = "demo-pro"

export default function DemoHubPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"
  const [active, setActive] = useState<"FREE" | "TRUST_PRO">("FREE")
  const [path, setPath] = useState("/donate")
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const slug = active === "FREE" ? DEMO_FREE : DEMO_PRO
  const previewSrc = path === "/" ? `/t/${slug}` : `/t/${slug}${path}`

  const paths = [
    { path: "/", label: hi ? "होम" : "Home" },
    { path: "/donate", label: hi ? "दान" : "Donate" },
    { path: "/book", label: hi ? "बुकिंग" : "Book" },
    { path: "/transparency", label: hi ? "पारदर्शिता" : "Transparency" },
    { path: "/pilgrim", label: hi ? "तीर्थयात्री" : "Pilgrim" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-saffron-50">
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-semibold mb-4">
          <FlaskConical className="h-3.5 w-3.5" />
          {hi ? "बिना सेल्स कॉल के आज़माएँ" : "Try without a sales call"}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-sacred-maroon max-w-3xl leading-tight">
          {hi
            ? "Free बनाम Trust Pro — खुद महसूस करें"
            : "Free vs Trust Pro — feel the difference"}
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          {hi
            ? "दो लाइव डेमो मंदिर। एक Free प्लान पर, एक Trust Pro पर। वही स्क्रीन, अलग ताकत — अपग्रेड क्यों चाहिए, स्पष्ट।"
            : "Two live demo temples. One on Free, one on Trust Pro. Same screens, different power — the upgrade becomes obvious."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/demo/walkthrough">
            <Button className="bg-saffron-500 hover:bg-saffron-600 gap-1">
              <Sparkles className="h-4 w-4" />
              {hi ? "पूर्ण वॉकथ्रू (सभी सुविधाएँ)" : "Full walkthrough (all features)"}
            </Button>
          </Link>
          <Link href="/t/demo-full">
            <Button variant="outline" className="gap-1">
              <Building2 className="h-4 w-4" />
              {hi ? "शोकेस मंदिर" : "Showcase mandir"}
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => startProductTour("sales")}
          >
            {hi ? "सेल्स टूर" : "Sales tour"}
          </Button>
          <Link href="/pricing">
            <Button variant="ghost">{hi ? "मूल्य" : "Pricing"}</Button>
          </Link>
        </div>
      </section>

      {/* Plan switcher + live preview */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row border-b">
            <button
              type="button"
              onClick={() => setActive("FREE")}
              className={`flex-1 p-5 text-left transition-colors ${
                active === "FREE" ? "bg-gray-50 border-b-2 border-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <p className="text-xs font-semibold uppercase text-gray-500">Free plan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹0</p>
              <p className="text-sm text-gray-500 mt-1">{PLANS.FREE.tagline}</p>
            </button>
            <button
              type="button"
              onClick={() => setActive("TRUST_PRO")}
              className={`flex-1 p-5 text-left transition-colors ${
                active === "TRUST_PRO"
                  ? "bg-saffron-50 border-b-2 border-saffron-500"
                  : "hover:bg-saffron-50/50"
              }`}
            >
              <p className="text-xs font-semibold uppercase text-saffron-700">Trust Pro</p>
              <p className="text-2xl font-bold text-sacred-maroon mt-1">₹7,999/mo</p>
              <p className="text-sm text-gray-600 mt-1">{PLANS.TRUST_PRO.tagline}</p>
            </button>
          </div>

          <div className="p-4 border-b flex flex-wrap gap-2 items-center justify-between bg-gray-50">
            <div className="flex flex-wrap gap-1">
              {paths.map((p) => (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => setPath(p.path)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    path === p.path
                      ? "bg-sacred-maroon text-white"
                      : "bg-white border text-gray-700 hover:border-saffron-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Link href={previewSrc} target="_blank">
              <Button size="sm" variant="outline" className="gap-1">
                {hi ? "नए टैब में खोलें" : "Open full page"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="bg-gray-100 p-2 md:p-4">
            <div className="rounded-xl overflow-hidden border bg-white shadow-inner">
              <div className="bg-gray-200 px-3 py-1.5 text-xs text-gray-600 font-mono flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
                {origin}
                {previewSrc}
              </div>
              <iframe
                key={previewSrc}
                src={previewSrc}
                title="MandirOS demo preview"
                className="w-full h-[560px] md:h-[640px] border-0"
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              {active === "FREE"
                ? hi
                  ? "Free: दान/बुकिंग काम करते हैं। Pilgrim/AI गहरी सुविधाएँ लॉक या सीमित।"
                  : "Free: donate/book work. Pilgrim/AI deep features locked or limited."
                : hi
                  ? "Trust Pro: पूर्ण ट्रस्ट लेजर, AI, pilgrim सुरक्षा — सब अनलॉक।"
                  : "Trust Pro: full trust ledger, AI, pilgrim safety — fully unlocked."}
            </p>
          </div>
        </div>
      </section>

      {/* Side by side cards */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-sacred-maroon mb-6 text-center">
          {hi ? "एक नज़र में अंतर" : "Difference at a glance"}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {(
            [
              { id: "FREE" as const, slug: DEMO_FREE, accent: "border-gray-200" },
              {
                id: "TRUST_PRO" as const,
                slug: DEMO_PRO,
                accent: "border-saffron-300 ring-2 ring-saffron-100",
              },
            ] as const
          ).map((col) => (
            <div
              key={col.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${col.accent}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-5 w-5 text-saffron-600" />
                <h3 className="text-xl font-bold">{PLANS[col.id].name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {PLANS[col.id].priceLabel}/mo · demo temple{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">{col.slug}</code>
              </p>
              <ul className="space-y-2 mb-6">
                {COMPARE.slice(0, 10).map((f) => {
                  const on = planHasFeature(col.id, f)
                  return (
                    <li key={f} className="flex gap-2 text-sm">
                      {on ? (
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <span className={on ? "text-gray-800" : "text-gray-400"}>
                        {hi ? FEATURE_LABELS[f].hi : FEATURE_LABELS[f].en}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <Link href={`/t/${col.slug}`}>
                <Button
                  className={`w-full ${
                    col.id === "TRUST_PRO"
                      ? "bg-saffron-500 hover:bg-saffron-600"
                      : ""
                  }`}
                  variant={col.id === "TRUST_PRO" ? "default" : "outline"}
                >
                  {hi ? `${PLANS[col.id].nameHi} डेमो खोलें` : `Enter ${PLANS[col.id].name} demo`}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Full matrix */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1fr_80px_80px] md:grid-cols-[1fr_100px_100px] gap-0 text-sm font-semibold bg-gray-50 border-b px-4 py-3">
            <span>{hi ? "सुविधा" : "Feature"}</span>
            <span className="text-center">Free</span>
            <span className="text-center text-saffron-700">Pro</span>
          </div>
          {COMPARE.map((f) => (
            <div
              key={f}
              className="grid grid-cols-[1fr_80px_80px] md:grid-cols-[1fr_100px_100px] gap-0 px-4 py-3 border-b last:border-0 items-center"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {hi ? FEATURE_LABELS[f].hi : FEATURE_LABELS[f].en}
                </p>
                <p className="text-xs text-gray-500">{FEATURE_LABELS[f].description}</p>
              </div>
              <div className="flex justify-center">
                {planHasFeature("FREE", f) ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-300" />
                )}
              </div>
              <div className="flex justify-center">
                {planHasFeature("TRUST_PRO", f) ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            {hi
              ? "समझ आ गया? Growth ₹2,499 बीच का रास्ता है — ops + widgets बिना full Pro के।"
              : "Convinced? Growth at ₹2,499 is the middle path — ops + widgets without full Pro."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/billing">
              <Button className="bg-saffron-500 hover:bg-saffron-600">
                {hi ? "प्लान चुनें" : "Choose a plan"}
              </Button>
            </Link>
            <Link href="/case-study">
              <Button variant="outline">{hi ? "जामसावली केस स्टडी" : "Jamsawli case study"}</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
