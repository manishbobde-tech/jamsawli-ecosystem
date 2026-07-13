import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case "subscription.activated":
        await prisma.templeSubscription.updateMany({
          where: { razorpaySubscriptionId: event.payload.subscription.id },
          data: { status: "ACTIVE" },
        })
        await prisma.temple.updateMany({
          where: {
            subscription: {
              razorpaySubscriptionId: event.payload.subscription.id,
            },
          },
          data: {
            subscriptionStatus: "active",
            subscriptionEndDate: new Date(event.payload.subscription.end_at * 1000),
          },
        })
        break

      case "subscription.charged":
        break

      case "subscription.cancelled":
        await prisma.templeSubscription.updateMany({
          where: { razorpaySubscriptionId: event.payload.subscription.id },
          data: { status: "CANCELLED" },
        })
        await prisma.temple.updateMany({
          where: {
            subscription: {
              razorpaySubscriptionId: event.payload.subscription.id,
            },
          },
          data: { subscriptionStatus: "cancelled" },
        })
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
