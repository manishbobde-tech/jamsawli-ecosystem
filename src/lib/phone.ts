/** Normalize Indian phone numbers to 10-digit local form + display E.164-ish. */

export function normalizePhone(input: string): string {
  const digits = String(input || "").replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2)
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1)
  }
  if (digits.length === 10) {
    return digits
  }
  return digits
}

export function formatPhoneDisplay(phone: string): string {
  const n = normalizePhone(phone)
  if (n.length === 10) return `+91 ${n.slice(0, 5)} ${n.slice(5)}`
  return phone
}

export function isValidIndianMobile(phone: string): boolean {
  const n = normalizePhone(phone)
  return /^[6-9]\d{9}$/.test(n)
}

export function toE164India(phone: string): string {
  return `+91${normalizePhone(phone)}`
}
