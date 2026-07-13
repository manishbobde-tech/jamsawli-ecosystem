import crypto from "crypto"
import { prisma } from "./prisma"
import { normalizePhone, isValidIndianMobile, toE164India } from "./phone"

const OTP_TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

function hashCode(code: string, phone: string): string {
  return crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET || "mandiros-otp")
    .update(`${phone}:${code}`)
    .digest("hex")
}

function generateCode(): string {
  return String(crypto.randomInt(100000, 999999))
}

async function deliverSms(phone: string, code: string): Promise<{ delivered: boolean; channel: string }> {
  // MSG91 / Twilio style — wire when keys exist
  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    try {
      const mobile = toE164India(phone).replace("+", "")
      await fetch("https://control.msg91.com/api/v5/flow/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authkey: process.env.MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID,
          short_url: "0",
          recipients: [{ mobiles: mobile, otp: code }],
        }),
      })
      return { delivered: true, channel: "msg91" }
    } catch (e) {
      console.error("MSG91 send failed", e)
    }
  }

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID
      const token = process.env.TWILIO_AUTH_TOKEN
      const auth = Buffer.from(`${sid}:${token}`).toString("base64")
      const body = new URLSearchParams({
        To: toE164India(phone),
        From: process.env.TWILIO_FROM,
        Body: `MandirOS OTP: ${code}. Valid 10 min. Do not share.`,
      })
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      )
      return { delivered: true, channel: "twilio" }
    } catch (e) {
      console.error("Twilio send failed", e)
    }
  }

  // Dev / fallback: log OTP (never log in production audits without redaction)
  console.info(`[OTP] phone=${phone} code=${code}`)
  return { delivered: false, channel: "console" }
}

export async function sendPhoneOtp(rawPhone: string) {
  if (!isValidIndianMobile(rawPhone)) {
    throw new Error("Invalid Indian mobile number")
  }
  const phone = normalizePhone(rawPhone)

  // Invalidate previous unused OTPs
  await prisma.phoneOtp.updateMany({
    where: { phone, consumed: false },
    data: { consumed: true },
  })

  const code = generateCode()
  const codeHash = hashCode(code, phone)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await prisma.phoneOtp.create({
    data: { phone, codeHash, expiresAt },
  })

  const delivery = await deliverSms(phone, code)

  return {
    phone,
    expiresInSeconds: OTP_TTL_MS / 1000,
    channel: delivery.channel,
    // Only expose OTP in non-production so local/demo works without SMS
    devOtp:
      process.env.NODE_ENV !== "production" || process.env.OTP_DEV_EXPOSE === "true"
        ? code
        : undefined,
  }
}

export async function verifyPhoneOtp(rawPhone: string, code: string) {
  if (!isValidIndianMobile(rawPhone)) {
    throw new Error("Invalid Indian mobile number")
  }
  const phone = normalizePhone(rawPhone)
  const record = await prisma.phoneOtp.findFirst({
    where: { phone, consumed: false },
    orderBy: { createdAt: "desc" },
  })

  if (!record) throw new Error("No OTP requested. Please send OTP first.")
  if (record.expiresAt < new Date()) throw new Error("OTP expired. Request a new one.")
  if (record.attempts >= MAX_ATTEMPTS) throw new Error("Too many attempts. Request a new OTP.")

  const expected = hashCode(code.trim(), phone)
  if (expected !== record.codeHash) {
    await prisma.phoneOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    })
    throw new Error("Invalid OTP")
  }

  await prisma.phoneOtp.update({
    where: { id: record.id },
    data: { consumed: true },
  })

  return { phone }
}
