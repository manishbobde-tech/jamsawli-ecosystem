import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "अमान्य भुगतान विवरण" },
        { status: 400 }
      )
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "भुगतान सत्यापन विफल" },
        { status: 400 }
      )
    }

    await prisma.donation.updateMany({
      where: { orderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        status: "COMPLETED",
      },
    })

    return NextResponse.json({ message: "भुगतान सफल" })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { message: "भुगतान सत्यापन में त्रुटि" },
      { status: 500 }
    )
  }
}
