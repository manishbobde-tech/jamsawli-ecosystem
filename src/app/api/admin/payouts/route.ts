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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const payouts = await prisma.payout.findMany({
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ payouts })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch payouts" },
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
      amount,
      periodStart,
      periodEnd,
      bankAccountNo,
      bankIfsc,
      bankName,
      accountHolder,
      notes,
    } = body

    if (!templeId || !amount || !periodStart || !periodEnd) {
      return NextResponse.json(
        { message: "templeId, amount, periodStart, and periodEnd are required" },
        { status: 400 }
      )
    }

    const payout = await prisma.payout.create({
      data: {
        templeId,
        amount,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        bankAccountNo: bankAccountNo ?? null,
        bankIfsc: bankIfsc ?? null,
        bankName: bankName ?? null,
        accountHolder: accountHolder ?? null,
        notes: notes ?? null,
      },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ payout }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create payout" },
      { status: 500 }
    )
  }
}
