// src/lib/qrcode.ts
export interface QRCheckinData {
  type: "DEVOTEE_CHECKIN"
  userId: string
  timestamp: number
}

export function generateQRData(userId: string): QRCheckinData {
  return {
    type: "DEVOTEE_CHECKIN",
    userId,
    timestamp: Date.now(),
  }
}

export function parseQRData(data: string): QRCheckinData | null {
  try {
    const parsed = JSON.parse(data)
    if (parsed.type === "DEVOTEE_CHECKIN" && parsed.userId && parsed.timestamp) {
      return parsed as QRCheckinData
    }
    return null
  } catch {
    return null
  }
}

export function isValidQRData(data: string): boolean {
  return parseQRData(data) !== null
}