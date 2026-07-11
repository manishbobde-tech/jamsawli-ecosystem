import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { templeId: string } }
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

    const config = await prisma.commissionConfig.findUnique({
      where: { templeId: params.templeId },
      include: {
        temple: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!config) {
      return NextResponse.json(
        { message: "Commission config not found for this temple" },
        { status: 404 }
      )
    }

    return NextResponse.json({ config })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch pricing config" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { templeId: string } }
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

    const body = await req.json()
    const { platformFee, premiumListingFee, premiumListingActive } = body

    const config = await prisma.commissionConfig.upsert({
      where: { templeId: params.templeId },
      update: {
        ...(platformFee !== undefined && { platformFee }),
        ...(premiumListingFee !== undefined && { premiumListingFee }),
        ...(premiumListingActive !== undefined && { premiumListingActive }),
      },
      create: {
        templeId: params.templeId,
        platformFee: platformFee ?? 0,
        premiumListingFee: premiumListingFee ?? 0,
        premiumListingActive: premiumListingActive ?? false,
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
