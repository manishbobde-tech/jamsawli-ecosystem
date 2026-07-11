import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const payout = await prisma.payout.findUnique({
      where: { id: params.id },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!payout) {
      return NextResponse.json(
        { message: "Payout not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ payout })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch payout" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const existing = await prisma.payout.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { message: "Payout not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const {
      status,
      transactionRef,
      processedBy,
      notes,
      bankAccountNo,
      bankIfsc,
      bankName,
      accountHolder,
    } = body

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (transactionRef !== undefined) data.transactionRef = transactionRef
    if (processedBy !== undefined) data.processedBy = processedBy
    if (notes !== undefined) data.notes = notes
    if (bankAccountNo !== undefined) data.bankAccountNo = bankAccountNo
    if (bankIfsc !== undefined) data.bankIfsc = bankIfsc
    if (bankName !== undefined) data.bankName = bankName
    if (accountHolder !== undefined) data.accountHolder = accountHolder

    if (status === "PAID" || status === "PROCESSING") {
      data.processedAt = new Date()
    }

    const payout = await prisma.payout.update({
      where: { id: params.id },
      data,
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ payout })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update payout" },
      { status: 500 }
    )
  }
}
