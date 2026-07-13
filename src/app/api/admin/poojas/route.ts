import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { getTempleEntitlements } from "@/lib/entitlements"

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

async function resolveTempleId(slug?: string | null) {
  const s = slug || getDefaultTempleSlug()
  return prisma.temple.findFirst({ where: { slug: s, isActive: true } })
}

export async function GET(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const temple = await resolveTempleId(searchParams.get("templeSlug"))
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const entitlements = await getTempleEntitlements(temple.id)
  const poojas = await prisma.pooja.findMany({
    where: { templeId: temple.id },
    orderBy: { price: "asc" },
  })

  return NextResponse.json({
    poojas: poojas.map((p) => ({
      ...p,
      price: Number(p.price),
    })),
    maxPoojas: entitlements?.maxPoojas,
    planId: entitlements?.planId,
    activeCount: poojas.filter((p) => p.isActive).length,
  })
}

export async function POST(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const temple = await resolveTempleId(body.templeSlug)
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const entitlements = await getTempleEntitlements(temple.id)
  const activeCount = await prisma.pooja.count({
    where: { templeId: temple.id, isActive: true },
  })
  const max = entitlements?.maxPoojas
  if (max != null && activeCount >= max && body.isActive !== false) {
    return NextResponse.json(
      {
        message: `Free plan allows max ${max} active sevas. Upgrade to Growth for unlimited.`,
        code: "PLAN_LIMIT",
        upgradePath: "/dashboard/billing",
      },
      { status: 402 }
    )
  }

  const name = String(body.name || "").trim()
  const nameHi = String(body.nameHi || body.name || "").trim()
  const price = Number(body.price)
  if (!name || !price || price < 0) {
    return NextResponse.json({ message: "name and price required" }, { status: 400 })
  }

  const pooja = await prisma.pooja.create({
    data: {
      name,
      nameHi: nameHi || name,
      description: body.description || null,
      descriptionHi: body.descriptionHi || null,
      duration: Number(body.duration) || 30,
      price,
      maxPerSlot: Number(body.maxPerSlot) || 20,
      isActive: body.isActive !== false,
      templeId: temple.id,
    },
  })

  return NextResponse.json({ pooja: { ...pooja, price: Number(pooja.price) } }, { status: 201 })
}

export async function PATCH(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  if (!body.id) return NextResponse.json({ message: "id required" }, { status: 400 })

  const existing = await prisma.pooja.findUnique({ where: { id: body.id } })
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const pooja = await prisma.pooja.update({
    where: { id: body.id },
    data: {
      ...(body.name != null ? { name: String(body.name) } : {}),
      ...(body.nameHi != null ? { nameHi: String(body.nameHi) } : {}),
      ...(body.description != null ? { description: body.description } : {}),
      ...(body.descriptionHi != null ? { descriptionHi: body.descriptionHi } : {}),
      ...(body.duration != null ? { duration: Number(body.duration) } : {}),
      ...(body.price != null ? { price: Number(body.price) } : {}),
      ...(body.maxPerSlot != null ? { maxPerSlot: Number(body.maxPerSlot) } : {}),
      ...(body.isActive != null ? { isActive: Boolean(body.isActive) } : {}),
    },
  })

  return NextResponse.json({ pooja: { ...pooja, price: Number(pooja.price) } })
}

export async function DELETE(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ message: "id required" }, { status: 400 })

  // Soft-delete: deactivate (keep booking history)
  const pooja = await prisma.pooja.update({
    where: { id },
    data: { isActive: false },
  })

  return NextResponse.json({ pooja: { ...pooja, price: Number(pooja.price) } })
}
