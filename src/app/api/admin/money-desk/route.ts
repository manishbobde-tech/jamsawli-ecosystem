import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"

/**
 * Counter Money Desk — the feature temples actually open every day.
 * Logs cash/UPI counter donation + creates a receipt-ready Donation row.
 */
function makeReceiptNumber() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CTR-${y}${m}-${rand}`
}

async function requireStaff() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN" &&
      user.role !== "DEVOTEE") // allow demo login; real deploy: restrict
  ) {
    // Still require login; role DEVOTEE blocked below for production safety via staff check
  }
  if (!user) return null
  if (
    user.role !== "ADMIN" &&
    user.role !== "TRUSTEE" &&
    user.role !== "SUPER_ADMIN"
  ) {
    return null
  }
  return { session, user }
}

export async function GET(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const gate = await assertFeature(templeSlug, "money_desk")
  if (!gate.ok) {
    return NextResponse.json(
      { message: gate.message, ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId) },
      { status: 402 }
    )
  }

  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const [cashToday, onlineToday, recentCash, recentDonations] = await Promise.all([
    prisma.cashEntry.aggregate({
      where: { templeId: temple.id, collectedAt: { gte: start } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.donation.aggregate({
      where: {
        templeId: temple.id,
        status: "COMPLETED",
        createdAt: { gte: start },
        paymentId: { not: null },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.cashEntry.findMany({
      where: { templeId: temple.id },
      orderBy: { collectedAt: "desc" },
      take: 15,
    }),
    prisma.donation.findMany({
      where: { templeId: temple.id, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        amount: true,
        purpose: true,
        donorName: true,
        receiptNumber: true,
        createdAt: true,
        paymentId: true,
      },
    }),
  ])

  const cash = Number(cashToday._sum.amount || 0)
  const online = Number(onlineToday._sum.amount || 0)

  return NextResponse.json({
    templeId: temple.id,
    templeSlug: temple.slug,
    today: {
      cash,
      online,
      total: cash + online,
      cashCount: cashToday._count,
      onlineCount: onlineToday._count,
    },
    recentCash: recentCash.map((e) => ({ ...e, amount: Number(e.amount) })),
    recentDonations: recentDonations.map((d) => ({
      ...d,
      amount: Number(d.amount),
    })),
  })
}

export async function POST(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const templeSlug = body.templeSlug || getDefaultTempleSlug()
  const gate = await assertFeature(templeSlug, "money_desk")
  if (!gate.ok) {
    return NextResponse.json(
      { message: gate.message, ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId) },
      { status: 402 }
    )
  }

  const amount = Number(body.amount)
  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Valid amount required" }, { status: 400 })
  }

  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const mode = (body.mode || "CASH") as string // CASH | UPI_COUNTER | CARD_COUNTER
  const purpose = body.purpose || "काउंटर दान / Counter donation"
  const donorName = body.donorName || "Counter devotee"
  const panNumber = body.panNumber || null
  const want80G = Boolean(body.want80G && panNumber)
  const receiptNumber = makeReceiptNumber()

  // Cash entry for hundi/counter reconciliation
  const cashType =
    mode === "CASH" ? "COUNTER" : mode === "UPI_COUNTER" ? "COUNTER" : "COUNTER"

  const [cashEntry, donation] = await prisma.$transaction([
    prisma.cashEntry.create({
      data: {
        amount,
        type: cashType,
        note: `${mode} · ${donorName} · ${purpose}`,
        templeId: temple.id,
        recordedById: staff.user.id,
      },
    }),
    prisma.donation.create({
      data: {
        amount,
        purpose,
        status: "COMPLETED",
        templeId: temple.id,
        userId: staff.user.id,
        donorName,
        panNumber: want80G ? String(panNumber).toUpperCase() : null,
        want80G,
        receiptNumber,
        paymentId: mode === "CASH" ? `CASH-${receiptNumber}` : `CTR-${mode}-${Date.now()}`,
        orderId: `counter_${receiptNumber}`,
      },
    }),
  ])

  return NextResponse.json(
    {
      message: "Counter entry recorded",
      cashEntry: { ...cashEntry, amount: Number(cashEntry.amount) },
      donation: {
        id: donation.id,
        receiptNumber: donation.receiptNumber,
        amount: Number(donation.amount),
      },
      receiptUrl: `/receipt/${donation.id}`,
    },
    { status: 201 }
  )
}
