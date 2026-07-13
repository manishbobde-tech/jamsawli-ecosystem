import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"
import { PlanId, PLANS, normalizePlanId } from "@/lib/plans"

/**
 * Create / switch temple plan.
 * - With Razorpay plan IDs: creates real subscription link
 * - Without: activates plan immediately (demo / bootstrap mode)
 * Temple ADMIN / TRUSTEE / SUPER_ADMIN can upgrade their temple.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "TRUSTEE" &&
        user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const planId = normalizePlanId(body.plan)
    const templeId = body.templeId as string | undefined
    const templeSlug = body.templeSlug as string | undefined

    if (!PLANS[planId]) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 })
    }

    const temple = await prisma.temple.findFirst({
      where: templeId
        ? { id: templeId }
        : templeSlug
          ? { slug: templeSlug }
          : user.organizationId
            ? { organizationId: user.organizationId }
            : undefined,
      include: { subscription: true },
    })

    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    // Org isolation (super admin can do any)
    if (
      user.role !== "SUPER_ADMIN" &&
      user.organizationId &&
      temple.organizationId !== user.organizationId
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    if (planId === "FREE") {
      await activatePlan(temple.id, "FREE", "ACTIVE")
      return NextResponse.json({
        mode: "activated",
        plan: planId,
        message: "Switched to Free plan",
      })
    }

    const planDef = PLANS[planId]
    const razorpayPlanId = planDef.razorpayEnvKey
      ? process.env[planDef.razorpayEnvKey]
      : undefined

    // Bootstrap / demo: activate without Razorpay when plan IDs not configured
    if (!razorpayPlanId || !process.env.RAZORPAY_KEY_ID) {
      await activatePlan(temple.id, planId, "ACTIVE")
      return NextResponse.json({
        mode: "activated",
        plan: planId,
        message: `${planDef.name} activated (configure Razorpay plan IDs for live billing)`,
        demo: true,
      })
    }

    try {
      const subscription = await razorpay.subscriptions.create({
        plan_id: razorpayPlanId,
        total_count: 12,
        customer_notify: 1,
        notes: {
          templeId: temple.id,
          organizationId: temple.organizationId,
          plan: planId,
        },
      })

      await prisma.templeSubscription.upsert({
        where: { templeId: temple.id },
        create: {
          templeId: temple.id,
          plan: planId,
          status: "PENDING",
          platformFee: planDef.priceInr,
          startDate: new Date(),
          razorpaySubscriptionId: subscription.id,
          nextBillingAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          plan: planId,
          status: "PENDING",
          platformFee: planDef.priceInr,
          razorpaySubscriptionId: subscription.id,
        },
      })

      await prisma.temple.update({
        where: { id: temple.id },
        data: {
          subscriptionPlan: planId,
          subscriptionStatus: "pending",
          isPremium: true,
        },
      })

      return NextResponse.json({
        mode: "razorpay",
        plan: planId,
        subscriptionId: subscription.id,
        shortUrl: subscription.short_url,
      })
    } catch (rzErr) {
      console.error("Razorpay subscription failed, falling back to activate", rzErr)
      await activatePlan(temple.id, planId, "ACTIVE")
      return NextResponse.json({
        mode: "activated",
        plan: planId,
        message: `${planDef.name} activated (Razorpay subscription unavailable)`,
        demo: true,
      })
    }
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ message: "Failed to update plan" }, { status: 500 })
  }
}

async function activatePlan(templeId: string, plan: PlanId, status: string) {
  const planDef = PLANS[plan]
  const end = new Date()
  end.setMonth(end.getMonth() + 1)

  await prisma.templeSubscription.upsert({
    where: { templeId },
    create: {
      templeId,
      plan,
      status,
      platformFee: planDef.priceInr,
      startDate: new Date(),
      endDate: end,
      nextBillingAt: end,
      lastPaidAt: new Date(),
    },
    update: {
      plan,
      status,
      platformFee: planDef.priceInr,
      endDate: end,
      nextBillingAt: end,
      lastPaidAt: new Date(),
    },
  })

  await prisma.temple.update({
    where: { id: templeId },
    data: {
      subscriptionPlan: plan,
      subscriptionStatus: status.toLowerCase(),
      subscriptionEndDate: end,
      isPremium: plan !== "FREE",
    },
  })
}
