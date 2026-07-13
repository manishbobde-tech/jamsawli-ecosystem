import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"

async function requireStaff() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return null
  }
  return user
}

export async function GET(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      nameHi: true,
      description: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      phone: true,
      email: true,
      website: true,
      primaryColor: true,
      secondaryColor: true,
      isActive: true,
    },
  })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json({ temple })
}

export async function PUT(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const slug = body.templeSlug || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({ where: { slug } })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const updated = await prisma.temple.update({
    where: { id: temple.id },
    data: {
      ...(body.name != null ? { name: String(body.name) } : {}),
      ...(body.nameHi != null ? { nameHi: String(body.nameHi) } : {}),
      ...(body.description != null ? { description: String(body.description) } : {}),
      ...(body.address != null ? { address: String(body.address) } : {}),
      ...(body.city != null ? { city: String(body.city) } : {}),
      ...(body.state != null ? { state: String(body.state) } : {}),
      ...(body.pincode != null ? { pincode: String(body.pincode) } : {}),
      ...(body.phone != null ? { phone: String(body.phone) } : {}),
      ...(body.email != null ? { email: String(body.email) } : {}),
      ...(body.website != null ? { website: String(body.website) } : {}),
      ...(body.primaryColor != null ? { primaryColor: String(body.primaryColor) } : {}),
      ...(body.secondaryColor != null
        ? { secondaryColor: String(body.secondaryColor) }
        : {}),
    },
  })

  return NextResponse.json({ temple: updated })
}
