"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { Check, Sparkles, Zap } from "lucide-react"
import { PLANS, PlanId, FEATURE_LABELS, FeatureKey } from "@/lib/plans"

export default function BillingPage() {
  const { toast } = useToast()
  const [current, setCurrent] = useState<PlanId>("FREE")
  const [templeId, setTempleId] = useState<string | null>(null)
  const [features, setFeatures] = useState<FeatureKey[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`
      )
      if (res.ok) {
        const data = await res.json()
        setCurrent(data.planId)
        setTempleId(data.templeId)
        setFeatures(data.features || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function upgrade(plan: PlanId) {
    if (!templeId) return
    setUpgrading(plan)
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templeId, plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Upgrade failed")

      if (data.shortUrl) {
        window.open(data.shortUrl, "_blank")
        toast({
          title: "Complete payment",
          description: "Razorpay subscription opened in a new tab",
        })
      } else {
        toast({
          title: "Plan updated",
          description: data.message || `Now on ${plan}`,
        })
        load()
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      })
    } finally {
      setUpgrading(null)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Loading billing…</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
          <Zap className="h-7 w-7" />
          Plan & billing
        </h1>
        <p className="text-gray-500 mt-1">
          Current plan:{" "}
          <span className="font-semibold text-sacred-maroon">{PLANS[current].name}</span>
          {" · "}
          Platform fee {((PLANS[current].transactionFeeRate) * 100).toFixed(1)}% on
          transactions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {(Object.keys(PLANS) as PlanId[]).map((id) => {
          const plan = PLANS[id]
          const isCurrent = current === id
          return (
            <div
              key={id}
              className={`rounded-2xl border bg-white p-6 flex flex-col ${
                plan.highlight
                  ? "border-saffron-400 ring-2 ring-saffron-100 shadow-lg"
                  : "border-gray-200 shadow-sm"
              } ${isCurrent ? "bg-saffron-50/40" : ""}`}
            >
              {plan.highlight && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-saffron-700 mb-2">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-sm text-gray-500">{plan.nameHi}</p>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold text-sacred-maroon">
                  {plan.priceLabel}
                </span>
                <span className="text-gray-500 mb-1 text-sm">/mo</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.tagline}</p>
              <p className="text-xs text-gray-400 mt-1">
                Txn fee {(plan.transactionFeeRate * 100).toFixed(1)}% ·{" "}
                {plan.maxPoojas == null ? "Unlimited sevas" : `${plan.maxPoojas} sevas max`}
              </p>

              <ul className="mt-4 space-y-1.5 flex-1 text-sm">
                {plan.features.slice(0, 8).map((f) => (
                  <li key={f} className="flex gap-2 text-gray-700">
                    <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {FEATURE_LABELS[f].en}
                  </li>
                ))}
                {plan.features.length > 8 && (
                  <li className="text-xs text-gray-400 pl-6">
                    +{plan.features.length - 8} more features
                  </li>
                )}
              </ul>

              <Button
                className={`mt-6 w-full ${
                  isCurrent
                    ? ""
                    : plan.highlight
                      ? "bg-saffron-500 hover:bg-saffron-600"
                      : ""
                }`}
                variant={isCurrent ? "outline" : plan.highlight ? "default" : "outline"}
                disabled={isCurrent || upgrading === id}
                onClick={() => upgrade(id)}
              >
                {isCurrent
                  ? "Current plan"
                  : upgrading === id
                    ? "Updating…"
                    : id === "FREE"
                      ? "Downgrade to Free"
                      : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          )
        })}
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-saffron-600" />
          Features unlocked on your plan
        </h2>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <span
              key={f}
              className="text-xs bg-green-50 text-green-800 border border-green-100 px-2.5 py-1 rounded-full"
            >
              {FEATURE_LABELS[f].en}
            </span>
          ))}
          {features.length === 0 && (
            <p className="text-sm text-gray-500">No features loaded</p>
          )}
        </div>
      </section>
    </div>
  )
}
