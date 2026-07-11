import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const [temples, total] = await Promise.all([
      prisma.temple.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { poojas: true, bookings: true, donations: true } } },
      }),
      prisma.temple.count(),
    ])

    return NextResponse.json({ temples, total, page, limit })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch temples" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const temple = await prisma.temple.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        phone: body.phone,
        email: body.email,
        website: body.website,
        isActive: true,
        organizationId: user.organizationId,
      },
    })

    return NextResponse.json({ temple }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create temple" }, { status: 500 })
  }
}
