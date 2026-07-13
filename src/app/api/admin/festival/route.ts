import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"
import { getTempleEntitlements } from "@/lib/entitlements"
import { planHasFeature } from "@/lib/plans"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
    const dateStr = searchParams.get("date") || new Date().toISOString().slice(0, 10)

    const gate = await assertFeature(templeSlug, "festival_board")
    if (!gate.ok) {
      return NextResponse.json(
        {
          message: gate.message,
          ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId),
        },
        { status: 402 }
      )
    }

    const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    const dayStart = new Date(dateStr)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dateStr)
    dayEnd.setHours(23, 59, 59, 999)

    const entitlements = await getTempleEntitlements(temple.id)
    const useCapacity = planHasFeature(entitlements?.planId || "FREE", "slot_capacity")

    const poojas = await prisma.pooja.findMany({
      where: { templeId: temple.id, isActive: true },
      orderBy: { name: "asc" },
    })

    const bookings = await prisma.booking.findMany({
      where: {
        templeId: temple.id,
        date: { gte: dayStart, lte: dayEnd },
        status: { not: "CANCELLED" },
      },
      select: { poojaId: true, time: true, status: true, devoteeName: true },
    })

    const times = [
      "05:00-06:00",
      "06:00-07:00",
      "07:00-08:00",
      "08:00-09:00",
      "09:00-10:00",
      "16:00-17:00",
      "17:00-18:00",
      "18:00-19:00",
      "19:00-20:00",
    ]

    const board = poojas.map((p) => {
      const max = useCapacity
        ? p.maxPerSlot || 20
        : Math.min(p.maxPerSlot || 5, 5)
      const slots = times.map((time) => {
        const count = bookings.filter(
          (b) => b.poojaId === p.id && b.time === time
        ).length
        const pct = Math.min(100, Math.round((count / max) * 100))
        return {
          time,
          count,
          max,
          remaining: Math.max(0, max - count),
          full: count >= max,
          pct,
        }
      })
      const totalBooked = slots.reduce((s, x) => s + x.count, 0)
      return {
        poojaId: p.id,
        name: p.name,
        nameHi: p.nameHi,
        price: Number(p.price),
        maxPerSlot: max,
        totalBooked,
        slots,
      }
    })

    return NextResponse.json({
      date: dateStr,
      templeSlug: temple.slug,
      templeName: temple.nameHi || temple.name,
      planId: entitlements?.planId,
      board,
      totals: {
        bookings: bookings.length,
        sevas: poojas.length,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
