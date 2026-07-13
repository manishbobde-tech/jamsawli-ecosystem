import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const admins = await prisma.userOrganization.findMany({
      where: {
        organization: { temples: { some: { id: params.id } } },
        role: { in: ["TEMPLE_ADMIN", "SUPER_ADMIN"] },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ admins })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { userId } = await req.json()
    const temple = await prisma.temple.findUnique({
      where: { id: params.id },
      select: { organizationId: true },
    })
    if (!temple) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    const membership = await prisma.userOrganization.upsert({
      where: {
        userId_organizationId: {
          userId,
          organizationId: temple.organizationId,
        },
      },
      update: { role: "TEMPLE_ADMIN" },
      create: {
        userId,
        organizationId: temple.organizationId,
        role: "TEMPLE_ADMIN",
      },
    })

    return NextResponse.json({ success: true, membership })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
