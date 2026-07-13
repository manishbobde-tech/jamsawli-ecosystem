import { NextResponse } from "next/server"
import { paymentStatusPayload } from "@/lib/payments"

/** Public-ish readiness check — no secrets returned. */
export async function GET() {
  return NextResponse.json(paymentStatusPayload())
}
