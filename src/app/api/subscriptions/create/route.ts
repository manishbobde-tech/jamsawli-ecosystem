import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"

const PLAN_PRICES: Record<string, number> = {
  basic: 250000,
  pro: 500000,
  enterprise: 1000000,
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { templeId, plan } = await req.json()
    if (!PLAN_PRICES[plan]) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 })
    }

    const temple = await prisma.temple.findUnique({
      where: { id: templeId },
    })
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env[`RAZORPAY_${plan.toUpperCase()}_PLAN_ID`] || "",
      total_count: 12,
      customer_notify: 1,
      notes: {
        templeId,
        organizationId: temple.organizationId,
      },
    })

    await prisma.templeSubscription.create({
      data: {
        templeId,
        plan,
        status: "PENDING",
        startDate: new Date(),
        razorpaySubscriptionId: subscription.id,
      },
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
    })
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
