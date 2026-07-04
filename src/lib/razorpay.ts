import Razorpay from "razorpay"

let _razorpay: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  }
  return _razorpay
}

export const razorpay = new Proxy({} as Razorpay, {
  get(_, prop, receiver) {
    const client = getRazorpay()
    const value = Reflect.get(client, prop, receiver)
    if (typeof value === "function") {
      return value.bind(client)
    }
    return value
  },
})

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price)
}
