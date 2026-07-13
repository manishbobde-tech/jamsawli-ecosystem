import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"
import { isRazorpayConfigured, paymentStatusPayload } from "@/lib/payments"

function makeReceiptNumber() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `MOS-${y}${m}-${rand}`
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const {
      amount,
      purpose,
      templeId,
      donorName,
      donorEmail,
      donorPhone,
      panNumber,
      want80G,
    } = body

    if (!amount || amount < 1) {
      return NextResponse.json({ message: "अमान्य राशि" }, { status: 400 })
    }

    if (!templeId) {
      return NextResponse.json(
        { message: "मंदिर चयन आवश्यक है" },
        { status: 400 }
      )
    }

    const temple = await prisma.temple.findFirst({
      where: { id: templeId, isActive: true },
      select: { id: true, name: true },
    })

    if (!temple) {
      return NextResponse.json({ message: "मंदिर नहीं मिला" }, { status: 404 })
    }

    // Guest allowed: require a name either from session or body
    const resolvedName =
      donorName || session?.user?.name || session?.user?.email || null
    if (!session?.user && !resolvedName) {
      return NextResponse.json(
        { message: "अतिथि दान के लिए नाम आवश्यक है" },
        { status: 400 }
      )
    }

    if (want80G) {
      if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(String(panNumber))) {
        return NextResponse.json(
          { message: "80G के लिए वैध PAN आवश्यक है" },
          { status: 400 }
        )
      }
      if (!resolvedName) {
        return NextResponse.json(
          { message: "80G रसीद के लिए नाम आवश्यक है" },
          { status: 400 }
        )
      }
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          message:
            "Online payments are not configured yet. Counter money desk still works for the pilot.",
          code: "RAZORPAY_NOT_CONFIGURED",
          payments: paymentStatusPayload(),
        },
        { status: 503 }
      )
    }

    const receiptNumber = makeReceiptNumber()

    let order: { id: string; amount: number | string; currency: string }
    try {
      order = (await razorpay.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        receipt: receiptNumber.slice(0, 40),
        notes: {
          templeId,
          purpose: purpose || "सामान्य दान",
          want80G: want80G ? "true" : "false",
        },
      })) as { id: string; amount: number | string; currency: string }
    } catch (rzErr) {
      console.error("Razorpay order create failed", rzErr)
      return NextResponse.json(
        {
          message:
            "Razorpay order failed. Check keys (test vs live) and amount.",
          code: "RAZORPAY_ORDER_FAILED",
        },
        { status: 502 }
      )
    }

    const donation = await prisma.donation.create({
      data: {
        amount,
        purpose: purpose || "सामान्य दान",
        orderId: order.id,
        userId: session?.user?.id || null,
        templeId,
        donorName: resolvedName,
        donorEmail: donorEmail || session?.user?.email || null,
        donorPhone: donorPhone || null,
        panNumber: want80G ? String(panNumber).toUpperCase() : null,
        want80G: Boolean(want80G),
        receiptNumber,
      },
    })

    return NextResponse.json({
      order,
      donationId: donation.id,
      receiptNumber,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json(
      { message: "दान प्रक्रिया में त्रुटि" },
      { status: 500 }
    )
  }
}

export async function GET() {
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
      take: 20,
    })

    return NextResponse.json({ donations })
  } catch {
    return NextResponse.json(
      { message: "दान लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}
