import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("x-razorpay-signature")!

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex")

  if (signature !== expectedSignature) {
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 400 }
    )
  }

  const event = JSON.parse(body)

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity

    await prisma.donation.updateMany({
      where: { orderId: payment.order_id },
      data: {
        paymentId: payment.id,
        status: "COMPLETED",
      },
    })
  }

  return NextResponse.json({ received: true })
}
