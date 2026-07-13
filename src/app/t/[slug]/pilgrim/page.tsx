"use client"

import { useEffect, useState } from "react"
import { EmergencySOS } from "@/components/pilgrim/emergency-sos"
import { LostFound } from "@/components/pilgrim/lost-found"
import { CrowdHeatmap } from "@/components/pilgrim/crowd-heatmap"
import { FeatureGate } from "@/components/billing/feature-gate"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { PlanId } from "@/lib/plans"

export default function PilgrimPage() {
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [features, setFeatures] = useState<string[]>([])

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

  const has = (f: string) => features.includes(f)

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-4">
          🙏 तीर्थयात्री सेवाएं
        </h1>
        <p className="text-center text-gray-600 mb-8">
          मंदिर में आपकी सुरक्षा और सुविधा के लिए · Smart pilgrim services
        </p>

        <div className="space-y-6">
          <FeatureGate
            feature="crowd_heatmap"
            allowed={has("crowd_heatmap")}
            currentPlan={planId}
          >
            <CrowdHeatmap />
          </FeatureGate>

          <FeatureGate
            feature="pilgrim_sos"
            allowed={has("pilgrim_sos")}
            currentPlan={planId}
          >
            <EmergencySOS />
          </FeatureGate>

          <FeatureGate
            feature="lost_found"
            allowed={has("lost_found")}
            currentPlan={planId}
          >
            <LostFound />
          </FeatureGate>
        </div>
      </div>
    </div>
  )
}
