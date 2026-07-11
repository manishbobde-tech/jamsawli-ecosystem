import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const temple = await prisma.temple.findUnique({
      where: { id: params.id },
      include: {
        poojas: true,
        _count: { select: { bookings: true, donations: true, visits: true } },
      },
    })

    if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

    return NextResponse.json({ temple })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch temple" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const temple = await prisma.temple.update({
      where: { id: params.id },
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
        isActive: body.isActive,
        isPremium: body.isPremium,
      },
    })

    return NextResponse.json({ temple })
  } catch (error) {
    return NextResponse.json({ message: "Failed to update temple" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.temple.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Temple deleted" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete temple" }, { status: 500 })
  }
}
