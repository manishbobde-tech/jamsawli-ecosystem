import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone } = body

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "यह ईमेल या फोन पहले से रजिस्टर्ड है" },
        { status: 400 }
      )
    }

    const org = await prisma.organization.findUnique({
      where: { slug: "jamsawli" },
    })

    if (!org) {
      return NextResponse.json(
        { message: "संगठन नहीं मिला" },
        { status: 500 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        organizationId: org.id,
      },
    })

    return NextResponse.json(
      { message: "खाता सफलतापूर्वक बनाया गया", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "रजिस्ट्रेशन में त्रुटि" },
      { status: 500 }
    )
  }
}
