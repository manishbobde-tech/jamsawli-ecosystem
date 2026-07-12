import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const orgId = (session.user as any).organizationId
    if (!orgId) {
      return NextResponse.json(
        { message: "No organization" },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const subscriptions = await prisma.templeSubscription.findMany({
      where: { temple: { organizationId: orgId } },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch subscriptions" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      templeId,
      plan,
      platformFee,
      billingCycle,
      startDate,
      endDate,
      autoRenew,
      status,
      paymentMethod,
      nextBillingAt,
    } = body

    if (!templeId) {
      return NextResponse.json(
        { message: "templeId is required" },
        { status: 400 }
      )
    }

    const existing = await prisma.templeSubscription.findUnique({
      where: { templeId },
    })

    if (existing) {
      return NextResponse.json(
        { message: "Subscription already exists for this temple. Use PATCH to update." },
        { status: 409 }
      )
    }

    const subscription = await prisma.templeSubscription.create({
      data: {
        templeId,
        plan: plan ?? "FREE",
        platformFee: platformFee ?? 0,
        billingCycle: billingCycle ?? "MONTHLY",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        autoRenew: autoRenew ?? true,
        status: status ?? "ACTIVE",
        paymentMethod: paymentMethod ?? null,
        nextBillingAt: nextBillingAt ? new Date(nextBillingAt) : null,
      },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ subscription }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create subscription" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { templeId, ...updates } = body

    if (!templeId) {
      return NextResponse.json(
        { message: "templeId is required" },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = {}
    if (updates.plan !== undefined) data.plan = updates.plan
    if (updates.platformFee !== undefined) data.platformFee = updates.platformFee
    if (updates.billingCycle !== undefined) data.billingCycle = updates.billingCycle
    if (updates.startDate !== undefined) data.startDate = new Date(updates.startDate)
    if (updates.endDate !== undefined) data.endDate = updates.endDate ? new Date(updates.endDate) : null
    if (updates.autoRenew !== undefined) data.autoRenew = updates.autoRenew
    if (updates.status !== undefined) data.status = updates.status
    if (updates.paymentMethod !== undefined) data.paymentMethod = updates.paymentMethod
    if (updates.nextBillingAt !== undefined) data.nextBillingAt = updates.nextBillingAt ? new Date(updates.nextBillingAt) : null

    const subscription = await prisma.templeSubscription.update({
      where: { templeId },
      data,
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update subscription" },
      { status: 500 }
    )
  }
}
