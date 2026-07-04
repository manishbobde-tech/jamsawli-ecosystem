import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const org = await prisma.organization.findUnique({
      where: { slug: "jamsawli" },
    })

    if (!org) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      )
    }

    const temple = await prisma.temple.findFirst({
      where: { organizationId: org.id },
    })

    if (!temple) {
      return NextResponse.json(
        { message: "Temple not found" },
        { status: 404 }
      )
    }

    const poojas = await prisma.pooja.findMany({
      where: {
        templeId: temple.id,
        isActive: true,
      },
      orderBy: { price: "asc" },
    })

    return NextResponse.json({ poojas })
  } catch (error) {
    console.error("Fetch poojas error:", error)
    return NextResponse.json(
      { message: "Failed to fetch poojas" },
      { status: 500 }
    )
  }
}
