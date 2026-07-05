// src/components/checkin/qr-generator.tsx
"use client"

import { QRCodeSVG } from "qrcode.react"
import { generateQRData } from "@/lib/qrcode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QRGeneratorProps {
  userId: string
  size?: number
}

export function QRGenerator({ userId, size = 200 }: QRGeneratorProps) {
  const qrData = generateQRData(userId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sacred-maroon">आपका QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <QRCodeSVG value={JSON.stringify(qrData)} size={size} />
        <p className="text-sm text-gray-500 text-center">
          मंदिर प्रवेश द्वार पर यह QR code स्कैन करें
        </p>
      </CardContent>
    </Card>
  )
}