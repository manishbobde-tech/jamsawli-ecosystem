import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "अमान्य भुगतान विवरण" },
        { status: 400 }
      )
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json(
        { message: "भुगतान कॉन्फ़िगरेशन त्रुटि" },
        { status: 500 }
      )
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "भुगतान सत्यापन विफल" },
        { status: 400 }
      )
    }

    const donation = await prisma.donation.findFirst({
      where: { orderId: razorpay_order_id },
    })

    if (!donation) {
      return NextResponse.json({ message: "दान रिकॉर्ड नहीं मिला" }, { status: 404 })
    }

    const updated = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        paymentId: razorpay_payment_id,
        status: "COMPLETED",
      },
    })

    return NextResponse.json({
      message: "भुगतान सफल",
      receiptNumber: updated.receiptNumber,
      donationId: updated.id,
      want80G: updated.want80G,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { message: "भुगतान सत्यापन में त्रुटि" },
      { status: 500 }
    )
  }
}
