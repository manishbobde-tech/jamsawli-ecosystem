import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { resolveOrganization } from "@/lib/temple"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password, orgSlug } = body

    if (!password) {
      return NextResponse.json(
        { message: "पासवर्ड आवश्यक है" },
        { status: 400 }
      )
    }

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

    if (!orgSlug) {
      return NextResponse.json(
        { message: "Organization slug required" },
        { status: 400 }
      )
    }

    const org = await resolveOrganization(orgSlug)

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
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
