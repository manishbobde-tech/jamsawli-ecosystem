"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import {
  FEATURE_LABELS,
  FeatureKey,
  PLANS,
  PlanId,
  minPlanForFeature,
} from "@/lib/plans"
import { Check, Lock, Sparkles, BookOpen, ArrowRight } from "lucide-react"

/** Curated showcase with value props (see docs/FEATURE_CATALOG.md for full text) */
const SHOWCASE: {
  key: FeatureKey
  valueEn: string
  valueHi: string
}[] = [
  {
    key: "money_desk",
    valueEn: "Counter receipt in ~10s — daily habit boards love",
    valueHi: "काउंटर रसीद ~10 सेकंड — रोज़ की आदत",
  },
  {
    key: "weekly_report",
    valueEn: "Monday WhatsApp “kitna aaya” without Excel",
    valueHi: "सोमवार kitna aaya — बिना Excel",
  },
  {
    key: "donate",
    valueEn: "UPI/cards for remote + NRI devotees",
    valueHi: "UPI/कार्ड — दूरस्थ और NRI दान",
  },
  {
    key: "eighty_g_receipts",
    valueEn: "PAN + printable receipt for tax-capable giving",
    valueHi: "PAN + प्रिंट रसीद — 80G तैयार",
  },
  {
    key: "book",
    valueEn: "Seva booking with gotra & sankalp",
    valueHi: "गोत्र और संकल्प के साथ बुकिंग",
  },
  {
    key: "slot_capacity",
    valueEn: "No silent double-booking on festival days",
    valueHi: "त्योहार पर डबल-बुकिंग रोकें",
  },
  {
    key: "festival_board",
    valueEn: "Live fill % per slot — run the day",
    valueHi: "हर स्लॉट की भरने की दर — लाइव",
  },
  {
    key: "seva_certificate",
    valueEn: "Printable keepsake after booking",
    valueHi: "बुकिंग के बाद सेवा प्रमाणपत्र",
  },
  {
    key: "qr_posters",
    valueEn: "Print gate QR for donate/check-in — no designer",
    valueHi: "गेट QR पोस्टर — बिना डिज़ाइनर",
  },
  {
    key: "donation_campaigns",
    valueEn: "Public progress bars for drives",
    valueHi: "भंडारा/निर्माण अभियान प्रगति",
  },
  {
    key: "basic_transparency",
    valueEn: "Public fund totals build donor trust",
    valueHi: "सार्वजनिक फंड — भरोसा",
  },
  {
    key: "advanced_transparency",
    valueEn: "Project milestones for grant narrative",
    valueHi: "परियोजना माइलस्टोन",
  },
  {
    key: "form_10bd",
    valueEn: "CSV for CA / IT workflows",
    valueHi: "CA के लिए 10BD CSV",
  },
  {
    key: "pilgrim_sos",
    valueEn: "One-tap emergency at the temple",
    valueHi: "एक टैप आपातकाल",
  },
  {
    key: "lost_found",
    valueEn: "Recover bags/phones faster",
    valueHi: "खोया-पाया जल्दी",
  },
  {
    key: "crowd_heatmap",
    valueEn: "Pick less crowded zones",
    valueHi: "कम भीड़ वाले क्षेत्र",
  },
  {
    key: "checkin",
    valueEn: "QR darshan visit tracking",
    valueHi: "QR दर्शन चेक-इन",
  },
  {
    key: "embed_widgets",
    valueEn: "Keep WordPress — still collect money",
    valueHi: "पुरानी साइट पर दान विजेट",
  },
  {
    key: "ai_chatbot",
    valueEn: "24/7 temple Q&A (Pro)",
    valueHi: "24/7 मंदिर सहायक",
  },
  {
    key: "developer_api",
    valueEn: "Integrate kiosks & partners",
    valueHi: "कियोस्क / API एकीकरण",
  },
]

export default function FeaturesPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  return (
    <main className="gradient-hero py-12 sm:py-16">
      <div className="page-container max-w-5xl">
        <div className="chip mb-4">
          <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
          {hi ? "सुविधा + मूल्य + प्लान" : "Feature · value · plan"}
        </div>
        <h1 className="section-title max-w-2xl">
          {hi
            ? "हर सुविधा · क्या मूल्य · कौन से प्लान"
            : "Every capability · the value · which plan"}
        </h1>
        <p className="mt-3 text-stone-600 max-w-2xl text-sm sm:text-base">
          {hi
            ? "पूर्ण कैटलॉग: docs/FEATURE_CATALOG.md · उपयोग गाइड: /help"
            : "Full catalog: docs/FEATURE_CATALOG.md · How-to guides: /help"}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(PLANS) as PlanId[]).map((id) => (
            <span
              key={id}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-white"
            >
              {PLANS[id].name}: {PLANS[id].priceLabel}/mo
            </span>
          ))}
          <Link href="/help">
            <Button size="sm" variant="outline" className="gap-1 h-8">
              <BookOpen className="h-3.5 w-3.5" />
              {hi ? "कैसे उपयोग करें" : "How to use"}
            </Button>
          </Link>
        </div>

        <div className="mt-10 space-y-3">
          {SHOWCASE.map(({ key, valueEn, valueHi }) => {
            const meta = FEATURE_LABELS[key]
            const min = minPlanForFeature(key)
            return (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-soft"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-stone-900">
                    {hi ? meta.hi : meta.en}
                  </h2>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {hi ? valueHi : valueEn}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{meta.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {(["FREE", "GROWTH", "TRUST_PRO"] as PlanId[]).map((p) => {
                    const on = PLANS[p].features.includes(key)
                    return (
                      <span
                        key={p}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                          on
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-stone-50 text-stone-300 border border-stone-100"
                        }`}
                        title={PLANS[p].name}
                      >
                        {on ? (
                          <Check className="h-3 w-3 inline" />
                        ) : (
                          <Lock className="h-3 w-3 inline" />
                        )}{" "}
                        {p === "TRUST_PRO" ? "PRO" : p === "GROWTH" ? "GRW" : "FREE"}
                      </span>
                    )
                  })}
                </div>
                <span className="text-xs text-saffron-700 font-semibold whitespace-nowrap">
                  {hi ? "से" : "From"} {PLANS[min].name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-12 surface-elevated p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold text-sacred-maroon">
            {hi ? "आज़माएँ · तुलना करें · ऑनबोर्ड" : "Try · compare · onboard"}
          </h2>
          <p className="text-sm text-stone-500 mt-2 max-w-lg mx-auto">
            {hi
              ? "Free vs Pro डेमो, मूल्य, या अपना मंदिर जोड़ें।"
              : "Free vs Pro demo, pricing, or list your temple."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo">
              <Button className="gap-1">
                Demo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">Pricing</Button>
            </Link>
            <Link href="/help">
              <Button variant="ghost">Help & playbooks</Button>
            </Link>
            <Link href="/admin/temples/new">
              <Button variant="sacred">Add temple</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
