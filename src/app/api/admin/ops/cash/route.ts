import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"

async function requireStaff() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return null
  }
  return { session, user }
}

export async function GET(req: Request) {
  const gate = await requireStaff()
  if (!gate) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const featureGate = await assertFeature(templeSlug, "daily_ops")
  if (!featureGate.ok) {
    return NextResponse.json(
      { message: featureGate.message, ...featureDeniedPayload(featureGate.requiredPlan, featureGate.entitlements?.planId) },
      { status: 402 }
    )
  }
  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const entries = await prisma.cashEntry.findMany({
    where: { templeId: temple.id },
    orderBy: { collectedAt: "desc" },
    take: 50,
    include: { recordedBy: { select: { name: true } } },
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todaySum = await prisma.cashEntry.aggregate({
    where: { templeId: temple.id, collectedAt: { gte: todayStart } },
    _sum: { amount: true },
  })

  return NextResponse.json({
    templeId: temple.id,
    templeSlug: temple.slug,
    todayTotal: Number(todaySum._sum.amount || 0),
    entries: entries.map((e) => ({
      ...e,
      amount: Number(e.amount),
    })),
  })
}

export async function POST(req: Request) {
  const gate = await requireStaff()
  if (!gate) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const amount = Number(body.amount)
  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Valid amount required" }, { status: 400 })
  }

  const templeSlug = body.templeSlug || getDefaultTempleSlug()
  const featureGate = await assertFeature(templeSlug, "daily_ops")
  if (!featureGate.ok) {
    return NextResponse.json(
      { message: featureGate.message, ...featureDeniedPayload(featureGate.requiredPlan, featureGate.entitlements?.planId) },
      { status: 402 }
    )
  }
  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const entry = await prisma.cashEntry.create({
    data: {
      amount,
      type: body.type || "HUNDI",
      note: body.note || null,
      collectedAt: body.collectedAt ? new Date(body.collectedAt) : new Date(),
      templeId: temple.id,
      recordedById: gate.user.id,
    },
  })

  return NextResponse.json({ entry: { ...entry, amount: Number(entry.amount) } }, { status: 201 })
}
