import { prisma } from "./prisma"
import {
  FeatureKey,
  PlanId,
  getPlan,
  minPlanForFeature,
  normalizePlanId,
  planHasFeature,
  PLANS,
} from "./plans"
import { getDefaultTempleSlug } from "./tenant"

export interface TempleEntitlements {
  templeId: string
  templeSlug: string
  planId: PlanId
  planName: string
  status: string
  features: FeatureKey[]
  transactionFeeRate: number
  maxPoojas: number | null
  isPremium: boolean
}

export async function getTempleEntitlements(
  templeIdOrSlug: string
): Promise<TempleEntitlements | null> {
  const temple = await prisma.temple.findFirst({
    where: {
      OR: [{ id: templeIdOrSlug }, { slug: templeIdOrSlug }],
      isActive: true,
    },
    include: { subscription: true },
  })
  if (!temple) return null

  // Prefer TempleSubscription.plan, fall back to temple.subscriptionPlan
  const rawPlan =
    temple.subscription?.status === "ACTIVE" || temple.subscription?.status === "active"
      ? temple.subscription.plan
      : temple.subscriptionPlan || temple.subscription?.plan || "FREE"

  const planId = normalizePlanId(rawPlan)
  // If subscription cancelled/expired, demote to FREE unless temple still marked paid
  let effective = planId
  const subStatus = (
    temple.subscription?.status ||
    temple.subscriptionStatus ||
    "active"
  ).toUpperCase()
  if (
    (subStatus === "CANCELLED" || subStatus === "EXPIRED") &&
    planId !== "FREE"
  ) {
    effective = "FREE"
  }

  const plan = getPlan(effective)
  return {
    templeId: temple.id,
    templeSlug: temple.slug,
    planId: effective,
    planName: plan.name,
    status: subStatus,
    features: plan.features,
    transactionFeeRate: plan.transactionFeeRate,
    maxPoojas: plan.maxPoojas,
    isPremium: effective !== "FREE" || temple.isPremium,
  }
}

export async function getEntitlementsBySlug(
  slug?: string | null
): Promise<TempleEntitlements | null> {
  return getTempleEntitlements(slug || getDefaultTempleSlug())
}

export async function assertFeature(
  templeIdOrSlug: string,
  feature: FeatureKey
): Promise<
  | { ok: true; entitlements: TempleEntitlements }
  | { ok: false; status: 402 | 404; message: string; requiredPlan: PlanId; entitlements?: TempleEntitlements }
> {
  const entitlements = await getTempleEntitlements(templeIdOrSlug)
  if (!entitlements) {
    return {
      ok: false,
      status: 404,
      message: "Temple not found",
      requiredPlan: minPlanForFeature(feature),
    }
  }
  if (!planHasFeature(entitlements.planId, feature)) {
    const required = minPlanForFeature(feature)
    return {
      ok: false,
      status: 402,
      message: `This feature requires the ${PLANS[required].name} plan or higher. Your plan: ${entitlements.planName}.`,
      requiredPlan: required,
      entitlements,
    }
  }
  return { ok: true, entitlements }
}

export function featureDeniedPayload(
  requiredPlan: PlanId,
  currentPlan?: PlanId
) {
  return {
    error: "PLAN_UPGRADE_REQUIRED",
    requiredPlan,
    requiredPlanName: PLANS[requiredPlan].name,
    currentPlan: currentPlan || "FREE",
    upgradePath: "/dashboard/billing",
    pricingPath: "/pricing",
  }
}
