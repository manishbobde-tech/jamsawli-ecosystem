"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Phone, MapPin, Shield } from "lucide-react"

const EMERGENCY_CONTACTS = [
  { name: "Temple Security", number: "+91 94221 82393", icon: Shield },
  { name: "Medical Aid", number: "+91 83190 84434", icon: Phone },
  { name: "Help Desk", number: "+91 94221 82394", icon: MapPin },
]

export function EmergencySOS() {
  const { toast } = useToast()
  const [sosActive, setSosActive] = useState(false)

  const handleSOS = async () => {
    setSosActive(true)
    
    // In production, this would send location and alert temple security
    toast({
      title: "🚨 SOS भेजा गया!",
      description: "मंदिर सुरक्षा को आपका संदेश भेज दिया गया है। वे जल्द ही आपसे संपर्क करेंगे।",
      variant: "destructive",
    })

    // Simulate sending alert
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSosActive(false)
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700">🚨 आपातकालीन SOS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSOS}
          disabled={sosActive}
          className="w-full h-16 text-xl bg-red-600 hover:bg-red-700"
          size="lg"
        >
          {sosActive ? "भेजा जा रहा है..." : "SOS भेजें"}
        </Button>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">आपातकालीन संपर्क:</p>
          {EMERGENCY_CONTACTS.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <contact.icon className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.number}</p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}