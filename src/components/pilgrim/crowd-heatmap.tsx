"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Clock, Users, TrendingUp } from "lucide-react"

export function CrowdHeatmap() {
  const [crowdLevel, setCrowdLevel] = useState<"low" | "medium" | "high">("medium")

  // Simulated crowd data - in production, this would come from cameras/sensors
  const crowdData = {
    current: "मध्यम भीड़",
    waitTime: "15-20 मिनट",
    bestTime: "सुबह 6-8 बजे",
    areas: [
      { name: "मुख्य मंदिर", level: "high" },
      { name: "प्रसाद काउंटर", level: "medium" },
      { name: "भक्त निवास", level: "low" },
      { name: "पार्किंग", level: "medium" },
    ],
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "high": return "bg-red-500"
      default: return "bg-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sacred-maroon flex items-center gap-2">
          <Users className="w-6 h-6" />
          भीड़ स्थिति (Live)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">वर्तमान</p>
            <p className="text-lg font-bold text-saffron-600">{crowdData.current}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">प्रतीक्षा समय</p>
            <p className="text-lg font-bold text-saffron-600">{crowdData.waitTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">सर्वोत्तम समय</p>
            <p className="text-lg font-bold text-green-600">{crowdData.bestTime}</p>
          </div>
        </div>

        {/* Area-wise Crowd */}
        <div className="space-y-3">
          <p className="font-semibold">विभिन्न क्षेत्रों में भीड़:</p>
          {crowdData.areas.map((area) => (
            <div key={area.name} className="flex items-center justify-between">
              <span className="text-sm">{area.name}</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getLevelColor(area.level)}`} />
                <span className="text-xs text-gray-600">
                  {area.level === "low" ? "कम" : area.level === "medium" ? "मध्यम" : "अधिक"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>सुझाव:</strong> भीड़ से बचने के लिए सप्ताह के मध्य में या सुबह जल्दी आएं।
            मंगलवार और शनिवार को विशेष भीड़ होती है।
          </p>
        </div>
      </CardContent>
    </Card>
  )
}