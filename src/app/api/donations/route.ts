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

    const { amount, purpose, templeId } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json(
        { message: "अमान्य राशि" },
        { status: 400 }
      )
    }

    if (!templeId) {
      return NextResponse.json(
        { message: "मंदिर चयन आवश्यक है" },
        { status: 400 }
      )
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `donation_${Date.now()}`,
    })

    const donation = await prisma.donation.create({
      data: {
        amount,
        purpose: purpose || "सामान्य दान",
        orderId: order.id,
        userId: session.user.id,
        templeId,
      },
    })

    return NextResponse.json({ order, donationId: donation.id })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json(
      { message: "दान प्रक्रिया में त्रुटि" },
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

    const donations = await prisma.donation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({ donations })
  } catch (error) {
    return NextResponse.json(
      { message: "दान लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}
