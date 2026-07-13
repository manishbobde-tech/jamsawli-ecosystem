import { NextResponse } from "next/server"
import { getEntitlementsBySlug, getTempleEntitlements } from "@/lib/entitlements"
import { PLANS, FEATURE_LABELS } from "@/lib/plans"
import { getDefaultTempleSlug } from "@/lib/tenant"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeId = searchParams.get("templeId")
    const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()

    const entitlements = templeId
      ? await getTempleEntitlements(templeId)
      : await getEntitlementsBySlug(templeSlug)

    if (!entitlements) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    const plan = PLANS[entitlements.planId]
    const featureDetails = entitlements.features.map((f) => ({
      key: f,
      ...FEATURE_LABELS[f],
    }))

    return NextResponse.json({
      ...entitlements,
      plan,
      featureDetails,
      allPlans: Object.values(PLANS).map((p) => ({
        id: p.id,
        name: p.name,
        priceInr: p.priceInr,
        priceLabel: p.priceLabel,
        transactionFeeRate: p.transactionFeeRate,
        features: p.features,
        highlight: p.highlight,
      })),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
