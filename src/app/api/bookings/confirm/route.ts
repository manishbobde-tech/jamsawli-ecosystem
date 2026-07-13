import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

/** Confirm booking after Razorpay payment (or force for staff). */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    if (!bookingId) {
      return NextResponse.json({ message: "bookingId required" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const secret = process.env.RAZORPAY_KEY_SECRET
      if (secret) {
        const expected = crypto
          .createHmac("sha256", secret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex")
        if (expected !== razorpay_signature) {
          return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
        }
      }
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        paymentId: razorpay_payment_id || booking.paymentId,
        orderId: razorpay_order_id || booking.orderId,
      },
    })

    return NextResponse.json({
      booking: updated,
      certificateUrl: `/certificate/${updated.id}`,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
