"use client"

import { useEffect, useState } from "react"
import { FundTracker } from "@/components/transparency/fund-tracker"
import { ProjectTracker } from "@/components/transparency/project-tracker"
import { FeatureGate } from "@/components/billing/feature-gate"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { PlanId } from "@/lib/plans"

export default function TransparencyPage() {
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [features, setFeatures] = useState<string[]>(["basic_transparency"])

  useEffect(() => {
    fetch(`/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setPlanId(d.planId)
          setFeatures(d.features || [])
        }
      })
      .catch(() => {})
  }, [])

  const hasBasic = features.includes("basic_transparency")
  const hasAdvanced = features.includes("advanced_transparency")

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-4">
          पारदर्शिता डैशबोर्ड
        </h1>
        <p className="text-center text-gray-600 mb-2">
          हर रुपये का हिसाब - Trust through Transparency
        </p>
        <p className="text-center text-xs text-gray-400 mb-8">
          Plan: {planId}
          {hasAdvanced ? " · Full trust ledger" : " · Basic totals"}
        </p>

        <FeatureGate
          feature="basic_transparency"
          allowed={hasBasic}
          currentPlan={planId}
        >
          <FundTracker />
        </FeatureGate>

        <div className="mt-8">
          <FeatureGate
            feature="advanced_transparency"
            allowed={hasAdvanced}
            currentPlan={planId}
          >
            <ProjectTracker />
          </FeatureGate>
        </div>
      </div>
    </div>
  )
}
