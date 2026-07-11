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

    const configs = await prisma.commissionConfig.findMany({
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ configs })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch pricing configs" },
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
    const { templeId, platformFee, premiumListingFee, premiumListingActive } = body

    if (!templeId) {
      return NextResponse.json(
        { message: "templeId is required" },
        { status: 400 }
      )
    }

    const existing = await prisma.commissionConfig.findUnique({
      where: { templeId },
    })

    if (existing) {
      return NextResponse.json(
        { message: "Commission config already exists for this temple. Use PATCH to update." },
        { status: 409 }
      )
    }

    const config = await prisma.commissionConfig.create({
      data: {
        templeId,
        platformFee: platformFee ?? 0,
        premiumListingFee: premiumListingFee ?? 0,
        premiumListingActive: premiumListingActive ?? false,
      },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ config }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create pricing config" },
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
    const { templeId, platformFee, premiumListingFee, premiumListingActive } = body

    if (!templeId) {
      return NextResponse.json(
        { message: "templeId is required" },
        { status: 400 }
      )
    }

    const config = await prisma.commissionConfig.update({
      where: { templeId },
      data: {
        ...(platformFee !== undefined && { platformFee }),
        ...(premiumListingFee !== undefined && { premiumListingFee }),
        ...(premiumListingActive !== undefined && { premiumListingActive }),
      },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    return NextResponse.json({ config })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update pricing config" },
      { status: 500 }
    )
  }
}
