import { NextResponse } from "next/server"
import { sendPhoneOtp } from "@/lib/otp"

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    if (!phone) {
      return NextResponse.json({ message: "Phone required" }, { status: 400 })
    }

    const result = await sendPhoneOtp(phone)
    return NextResponse.json({
      message: "OTP sent",
      phone: result.phone,
      expiresInSeconds: result.expiresInSeconds,
      channel: result.channel,
      ...(result.devOtp ? { devOtp: result.devOtp } : {}),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send OTP"
    return NextResponse.json({ message }, { status: 400 })
  }
}
