"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Lock, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  FEATURE_LABELS,
  FeatureKey,
  PlanId,
  PLANS,
  minPlanForFeature,
} from "@/lib/plans"

interface FeatureGateProps {
  feature: FeatureKey
  currentPlan?: PlanId | string
  /** If true, children render; if false, upgrade wall */
  allowed: boolean
  children?: ReactNode
  /** compact = inline banner; full = large card */
  variant?: "full" | "inline" | "overlay"
  className?: string
}

export function FeatureGate({
  feature,
  currentPlan = "FREE",
  allowed,
  children,
  variant = "full",
  className = "",
}: FeatureGateProps) {
  if (allowed) return <>{children}</>

  const required = minPlanForFeature(feature)
  const meta = FEATURE_LABELS[feature]
  const plan = PLANS[required]

  if (variant === "inline") {
    return (
      <div
        className={`flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3.5 text-sm shadow-sm ${className}`}
      >
        <Lock className="h-4 w-4 text-amber-700 shrink-0" />
        <span className="text-amber-950 flex-1 leading-snug">
          <strong>{meta.en}</strong> needs{" "}
          <strong>{plan.name}</strong> ({plan.priceLabel}/mo)
        </span>
        <Link href="/dashboard/billing">
          <Button size="sm">Upgrade</Button>
        </Link>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-3xl border border-saffron-100 bg-gradient-to-br from-white via-saffron-50/40 to-white p-8 sm:p-10 text-center shadow-soft ${className}`}
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-100 text-saffron-700 shadow-sm">
        <Lock className="h-6 w-6" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-saffron-600 mb-2">
        {plan.name} plan
      </p>
      <h3 className="text-xl sm:text-2xl font-bold text-sacred-maroon">{meta.en}</h3>
      <p className="text-sm text-stone-500 mt-1">{meta.hi}</p>
      <p className="mt-3 text-stone-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        {meta.description}
      </p>
      <p className="mt-4 text-xs sm:text-sm text-stone-500">
        Your plan: <strong className="text-stone-800">{String(currentPlan)}</strong>
        {" · "}
        From <strong className="text-stone-800">{plan.priceLabel}</strong>/mo
      </p>
      <div className="mt-7 flex flex-col sm:flex-row gap-2 justify-center">
        <Link href="/dashboard/billing">
          <Button size="lg" className="gap-1 w-full sm:w-auto">
            <Sparkles className="h-4 w-4" />
            Upgrade to {plan.name}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Compare plans
          </Button>
        </Link>
      </div>
    </div>
  )
}
