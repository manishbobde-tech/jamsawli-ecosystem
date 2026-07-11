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

    const applications = await prisma.templeApplication.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const existing = await prisma.templeApplication.findUnique({ where: { templeSlug: body.templeSlug } })
    if (existing) {
      return NextResponse.json({ error: "यह स्लग पहले से उपयोग में है" }, { status: 409 })
    }

    const application = await prisma.templeApplication.create({
      data: {
        templeName: body.templeName,
        templeSlug: body.templeSlug,
        description: body.description,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        phone: body.phone,
        email: body.email,
        website: body.website,
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        status: "PENDING",
      },
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "आवेदन जमा करने में त्रुटि" }, { status: 500 })
  }
}
