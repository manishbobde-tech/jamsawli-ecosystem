import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"
import { DEFAULT_OPS_ITEMS } from "@/lib/ops-checklist"

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
  return { session, user }
}

function todayDateOnly() {
  const d = new Date()
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

export async function GET(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const featureGate = await assertFeature(templeSlug, "daily_ops")
  if (!featureGate.ok) {
    return NextResponse.json(
      { message: featureGate.message, ...featureDeniedPayload(featureGate.requiredPlan, featureGate.entitlements?.planId) },
      { status: 402 }
    )
  }
  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const date = todayDateOnly()
  const log = await prisma.opsChecklistLog.findUnique({
    where: { templeId_date: { templeId: temple.id, date } },
  })

  const items =
    (log?.items as Record<string, boolean> | null) ||
    Object.fromEntries(DEFAULT_OPS_ITEMS.map((i) => [i.key, false]))

  return NextResponse.json({
    templeId: temple.id,
    date: date.toISOString().slice(0, 10),
    items,
    notes: log?.notes || "",
    completed: log?.completed || false,
    definitions: DEFAULT_OPS_ITEMS,
  })
}

export async function POST(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const templeSlug = body.templeSlug || getDefaultTempleSlug()
  const featureGate = await assertFeature(templeSlug, "daily_ops")
  if (!featureGate.ok) {
    return NextResponse.json(
      { message: featureGate.message, ...featureDeniedPayload(featureGate.requiredPlan, featureGate.entitlements?.planId) },
      { status: 402 }
    )
  }
  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Temple not found" }, { status: 404 })

  const date = todayDateOnly()
  const items = body.items || {}
  const allDone = DEFAULT_OPS_ITEMS.every((i) => items[i.key] === true)

  const log = await prisma.opsChecklistLog.upsert({
    where: { templeId_date: { templeId: temple.id, date } },
    create: {
      templeId: temple.id,
      date,
      items,
      notes: body.notes || null,
      completed: allDone,
      userId: staff.user.id,
    },
    update: {
      items,
      notes: body.notes || null,
      completed: allDone,
      userId: staff.user.id,
    },
  })

  return NextResponse.json({
    ...log,
    date: date.toISOString().slice(0, 10),
  })
}
