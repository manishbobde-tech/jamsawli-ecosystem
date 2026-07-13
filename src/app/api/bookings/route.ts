import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"
import { getTempleEntitlements } from "@/lib/entitlements"
import { planHasFeature } from "@/lib/plans"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const {
      poojaId,
      date,
      time,
      devoteeName,
      gotra,
      nakshatra,
      sankalp,
      phone,
    } = body

    if (!poojaId || !date || !time) {
      return NextResponse.json(
        { message: "पूजा, तारीख और समय आवश्यक हैं" },
        { status: 400 }
      )
    }

    if (!session?.user && !devoteeName) {
      return NextResponse.json(
        { message: "नाम आवश्यक है (या लॉगिन करें)" },
        { status: 400 }
      )
    }

    const pooja = await prisma.pooja.findUnique({
      where: { id: poojaId },
      include: { temple: true },
    })

    if (!pooja || !pooja.isActive) {
      return NextResponse.json({ message: "पूजा नहीं मिली" }, { status: 404 })
    }

    const entitlements = await getTempleEntitlements(pooja.templeId)
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    // Capacity: Growth+ uses maxPerSlot; Free allows 1 exclusive-style (or soft limit 5)
    const maxPerSlot = planHasFeature(entitlements?.planId || "FREE", "slot_capacity")
      ? pooja.maxPerSlot || 20
      : Math.min(pooja.maxPerSlot || 5, 5)

    const slotCount = await prisma.booking.count({
      where: {
        poojaId,
        date: { gte: dayStart, lte: dayEnd },
        time,
        status: { not: "CANCELLED" },
      },
    })

    if (slotCount >= maxPerSlot) {
      return NextResponse.json(
        {
          message: `यह स्लॉट भर चुका है (${slotCount}/${maxPerSlot}). दूसरा समय चुनें।`,
          code: "SLOT_FULL",
          slotCount,
          maxPerSlot,
        },
        { status: 409 }
      )
    }

    let order: { id: string; amount: number } | null = null
    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const created = await razorpay.orders.create({
          amount: Math.round(Number(pooja.price) * 100),
          currency: "INR",
          receipt: `booking_${Date.now()}`.slice(0, 40),
        })
        order = { id: created.id, amount: Number(created.amount) }
      }
    } catch (e) {
      console.error("Razorpay order failed", e)
    }

    // Demo-safe: allow booking without Razorpay (PENDING, mark note)
    if (!order) {
      order = {
        id: `demo_order_${Date.now()}`,
        amount: Math.round(Number(pooja.price) * 100),
      }
    }

    const booking = await prisma.booking.create({
      data: {
        date: dayStart,
        time,
        totalAmount: pooja.price,
        orderId: order.id,
        userId: session?.user?.id || null,
        poojaId,
        templeId: pooja.templeId,
        devoteeName: devoteeName || session?.user?.name || null,
        gotra: gotra || null,
        nakshatra: nakshatra || null,
        sankalp: sankalp || null,
        phone: phone || null,
        status: order.id.startsWith("demo_") ? "CONFIRMED" : "PENDING",
      },
    })

    return NextResponse.json({
      order: {
        id: order.id,
        amount: order.amount,
        currency: "INR",
      },
      bookingId: booking.id,
      slot: { count: slotCount + 1, max: maxPerSlot },
      demo: order.id.startsWith("demo_"),
      message: order.id.startsWith("demo_")
        ? "Booking confirmed (demo mode — configure Razorpay for live pay)"
        : undefined,
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      { message: "बुकिंग प्रक्रिया में त्रुटि" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    const date = searchParams.get("date")
    const poojaId = searchParams.get("poojaId")
    const time = searchParams.get("time")

    // Slot availability (public)
    if (poojaId && date && time) {
      const pooja = await prisma.pooja.findUnique({ where: { id: poojaId } })
      if (!pooja) {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
      }
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      const entitlements = await getTempleEntitlements(pooja.templeId)
      const maxPerSlot = planHasFeature(entitlements?.planId || "FREE", "slot_capacity")
        ? pooja.maxPerSlot || 20
        : Math.min(pooja.maxPerSlot || 5, 5)
      const count = await prisma.booking.count({
        where: {
          poojaId,
          date: { gte: dayStart, lte: dayEnd },
          time,
          status: { not: "CANCELLED" },
        },
      })
      return NextResponse.json({
        count,
        maxPerSlot,
        remaining: Math.max(0, maxPerSlot - count),
        full: count >= maxPerSlot,
      })
    }

    if (!session?.user) {
      return NextResponse.json({ message: "कृपया लॉगिन करें" }, { status: 401 })
    }

    const where =
      templeSlug &&
      (session.user as { role?: string }).role &&
      ["ADMIN", "TRUSTEE", "SUPER_ADMIN"].includes(
        (session.user as { role?: string }).role || ""
      )
        ? { temple: { slug: templeSlug } }
        : { userId: session.user.id }

    const bookings = await prisma.booking.findMany({
      where,
      include: { pooja: true },
      orderBy: { date: "desc" },
      take: 30,
    })

    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json(
      { message: "बुकिंग लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}
