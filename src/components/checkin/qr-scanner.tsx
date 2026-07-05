"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { QrCode, Calendar, Award } from "lucide-react"

export function QRScanner() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)

  const handleScan = async (data: string) => {
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: data }),
      })

      const result = await response.json()
      
      if (response.ok) {
        setScanResult("success")
        setStreak(result.streak)
        toast({
          title: "✓ चेक-इन सफल!",
          description: `आपका ${result.streak}वां लगातार दर्शन!`,
        })
        setIsScanning(false)
      } else {
        toast({
          title: "त्रुटि",
          description: result.message || "चेक-इन विफल",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "चेक-इन में समस्या हुई",
        variant: "destructive",
      })
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-600 mb-4">चेक-इन करने के लिए लॉगिन करें</p>
          <Button onClick={() => window.location.href = "/login"}>
            लॉगिन करें
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sacred-maroon flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          QR चेक-इन
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {streak > 0 && (
          <div className="flex items-center justify-between p-3 bg-saffron-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-saffron-600" />
              <span className="font-semibold">लगातार दर्शन</span>
            </div>
            <Badge variant="secondary" className="bg-saffron-600 text-white">
              {streak} दिन
            </Badge>
          </div>
        )}

        <div className="text-center py-8">
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <QrCode className="w-24 h-24 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            मंदिर में QR कोड स्कैन करने के लिए कैमरा खोलें
          </p>
          <Button 
            onClick={() => setIsScanning(!isScanning)}
            className="w-full"
            size="lg"
          >
            {isScanning ? "स्कैनर बंद करें" : "कैमरा खोलें"}
          </Button>
        </div>

        {scanResult === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-semibold">✓ चेक-इन सफल!</p>
            <p className="text-sm text-green-600 mt-1">
              आपका दर्शन रिकॉर्ड कर लिया गया है
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}