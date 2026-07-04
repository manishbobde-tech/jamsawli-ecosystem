import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const { poojaId, date, time } = await req.json()

    const pooja = await prisma.pooja.findUnique({
      where: { id: poojaId },
      include: { temple: true },
    })

    if (!pooja) {
      return NextResponse.json(
        { message: "पूजा नहीं मिली" },
        { status: 404 }
      )
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        poojaId,
        date: new Date(date),
        time,
        status: { not: "CANCELLED" },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { message: "यह समय पहले से बुक है" },
        { status: 400 }
      )
    }

    const order = await razorpay.orders.create({
      amount: Number(pooja.price) * 100,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    })

    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        time,
        totalAmount: pooja.price,
        orderId: order.id,
        userId: session.user.id,
        poojaId,
        templeId: pooja.templeId,
      },
    })

    return NextResponse.json({ order, bookingId: booking.id })
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

    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { pooja: true },
      orderBy: { date: "desc" },
      take: 10,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json(
      { message: "बुकिंग लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}
