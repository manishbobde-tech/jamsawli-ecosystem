"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { PLANS, PlanId, FEATURE_LABELS } from "@/lib/plans"

const ORDER: PlanId[] = ["FREE", "GROWTH", "TRUST_PRO"]

export default function PricingPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <p className="text-saffron-600 font-semibold text-sm uppercase tracking-wide mb-2">
          MandirOS
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-sacred-maroon">
          {hi ? "सरल, पारदर्शी मूल्य" : "Simple, transparent pricing"}
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
          {hi
            ? "जो अधिक भुगतान करते हैं, उन्हें अधिक उन्नत सुविधाएँ मिलती हैं — AI, API, 10BD, पूर्ण ट्रस्ट लेजर।"
            : "Pay more, unlock more — AI, API, Form 10BD, full trust ledger, and white-label options."}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {ORDER.map((id) => {
          const plan = PLANS[id]
          return (
            <div
              key={id}
              className={`rounded-2xl bg-white border p-6 flex flex-col ${
                plan.highlight
                  ? "border-saffron-400 shadow-xl ring-2 ring-saffron-200 scale-[1.02]"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlight && (
                <span className="text-xs font-semibold uppercase tracking-wide text-saffron-700 bg-saffron-50 self-start px-2 py-1 rounded-full mb-3">
                  {hi ? "सबसे लोकप्रिय" : "Most popular"}
                </span>
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {hi ? plan.nameHi : plan.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {hi ? plan.taglineHi : plan.tagline}
              </p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold text-sacred-maroon">
                  {plan.priceLabel}
                </span>
                <span className="text-gray-500 mb-1">/mo</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {(plan.transactionFeeRate * 100).toFixed(1)}% txn fee
                {plan.maxPoojas == null
                  ? " · unlimited sevas"
                  : ` · max ${plan.maxPoojas} sevas`}
              </p>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {hi ? FEATURE_LABELS[f].hi : FEATURE_LABELS[f].en}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/billing" className="mt-8">
                <Button
                  className={`w-full ${
                    plan.highlight ? "bg-saffron-500 hover:bg-saffron-600" : ""
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {id === "FREE"
                    ? hi
                      ? "मुफ़्त शुरू करें"
                      : "Start free"
                    : hi
                      ? `${plan.nameHi} चुनें`
                      : `Choose ${plan.name}`}
                </Button>
              </Link>
            </div>
          )
        })}
      </div>

      <div className="max-w-3xl mx-auto mt-16 rounded-2xl border bg-white p-6 text-center">
        <h3 className="text-xl font-semibold text-sacred-maroon">
          {hi ? "सुविधाएँ प्लान से जुड़ी हैं" : "Features unlock by plan"}
        </h3>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          {hi
            ? "Free: दान + बुकिंग + रसीद। Growth: ops, widgets, WhatsApp, gamification। Trust Pro: AI, voice, 10BD, API, full transparency।"
            : "Free: donate + book + receipts. Growth: ops, widgets, WhatsApp, gamification. Trust Pro: AI, voice, 10BD, API, full transparency."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link
            href="/features"
            className="text-saffron-700 font-medium hover:underline"
          >
            {hi ? "सभी सुविधाएँ →" : "All features →"}
          </Link>
          <Link
            href="/demo"
            className="text-indigo-700 font-medium hover:underline"
          >
            {hi ? "Free vs Pro लाइव डेमो →" : "Live Free vs Pro demo →"}
          </Link>
        </div>
      </div>
    </main>
  )
}
