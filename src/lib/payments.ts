/**
 * Payment readiness — honest status for pilot temples.
 * Money desk (counter cash/UPI logged by clerk) does NOT need Razorpay.
 * Online donate DOES need Razorpay keys.
 */

export type PaymentMode = "live" | "unconfigured"

export function isRazorpayConfigured(): boolean {
  const id = process.env.RAZORPAY_KEY_ID?.trim()
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim()
  const pub = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim()
  return Boolean(id && secret && pub)
}

export function getPaymentMode(): PaymentMode {
  return isRazorpayConfigured() ? "live" : "unconfigured"
}

export function getPublicRazorpayKey(): string | null {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || null
}

export function paymentStatusPayload() {
  const mode = getPaymentMode()
  return {
    mode,
    onlineDonateReady: mode === "live",
    moneyDeskReady: true, // counter path never needs gateway
    weeklyReportReady: true,
    publicKeyPresent: Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim()),
    serverKeyPresent: Boolean(process.env.RAZORPAY_KEY_ID?.trim()),
    serverSecretPresent: Boolean(process.env.RAZORPAY_KEY_SECRET?.trim()),
    message:
      mode === "live"
        ? "Online UPI/card checkout is live."
        : "Razorpay keys not set. Counter money desk still works; online donate will fail until keys are added on Vercel.",
    setup: [
      "Create Razorpay account → API Keys (test first, then live)",
      "Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID on Vercel",
      "Redeploy production",
      "Smoke: /t/jamsawli-hanuman/donate with ₹1 test (test mode) or real ₹101 (live)",
    ],
  }
}
