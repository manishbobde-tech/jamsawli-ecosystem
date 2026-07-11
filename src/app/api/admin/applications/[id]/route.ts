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

    const application = await prisma.templeApplication.findUnique({ where: { id: params.id } })
    if (!application) return NextResponse.json({ message: "Application not found" }, { status: 404 })

    return NextResponse.json({ application })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch application" }, { status: 500 })
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
    const { status, adminNotes } = body

    const application = await prisma.templeApplication.findUnique({ where: { id: params.id } })
    if (!application) return NextResponse.json({ message: "Application not found" }, { status: 404 })

    let templeId = application.templeId

    if (status === "APPROVED" && !templeId) {
      const temple = await prisma.temple.create({
        data: {
          name: application.templeName,
          slug: application.templeSlug,
          description: application.description,
          address: application.address,
          city: application.city,
          state: application.state,
          pincode: application.pincode,
          phone: application.phone || application.contactPhone,
          email: application.email || application.contactEmail,
          website: application.website,
          isActive: true,
          organizationId: user.organizationId,
        },
      })
      templeId = temple.id
    }

    const updated = await prisma.templeApplication.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        templeId,
      },
    })

    return NextResponse.json({ application: updated })
  } catch (error) {
    return NextResponse.json({ message: "Failed to update application" }, { status: 500 })
  }
}
