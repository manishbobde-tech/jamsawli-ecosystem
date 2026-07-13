"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PoojaList } from "./pooja-list"
import { formatPrice } from "@/lib/razorpay"
import { addDays, format } from "date-fns"
import { useOptionalTemple } from "@/hooks/useTemple"

interface Pooja {
  id: string
  name: string
  nameHi: string
  description: string | null
  descriptionHi: string | null
  duration: number
  price: any
}

const timeSlots = [
  "05:00-06:00",
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
]

interface BookingFormProps {
  templeSlug?: string
}

export function BookingForm({ templeSlug: propSlug }: BookingFormProps) {
  const temple = useOptionalTemple()
  const templeSlug = propSlug || temple?.templeSlug || "jamsawli-hanuman"
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null)
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"))
  const [selectedTime, setSelectedTime] = useState("")

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (!selectedPooja || !selectedTime) {
      toast({
        title: "त्रुटि",
        description: "कृपया पूजा और समय चुनें",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poojaId: selectedPooja.id,
          date: selectedDate,
          time: selectedTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Booking failed")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "जामसावली हनुमान लोक",
        description: `पूजा बुकिंग - ${selectedPooja.nameHi || selectedPooja.name}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          toast({
            title: "🙏 बुकिंग सफल",
            description: "आपकी पूजा बुक हो गई है!",
          })
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#f97316",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "बुकिंग प्रक्रिया में समस्या हुई।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-sacred-maroon">पूजा चुनें</CardTitle>
        </CardHeader>
        <CardContent>
          <PoojaList onSelect={setSelectedPooja} selectedPooja={selectedPooja} templeSlug={templeSlug} />
        </CardContent>
      </Card>

      {selectedPooja && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sacred-maroon">तिथि और समय</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">तिथि</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  min={minDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>समय चुनें</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? "default" : "outline"}
                      onClick={() => setSelectedTime(slot)}
                      className={selectedTime === slot ? "bg-saffron-500 hover:bg-saffron-600" : ""}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-saffron-50 rounded-lg">
                <p className="font-semibold">चयनित पूजा: {selectedPooja.nameHi || selectedPooja.name}</p>
                <p className="text-sm text-gray-600">
                  तिथि: {format(new Date(selectedDate), "dd MMMM yyyy")}
                </p>
                <p className="text-sm text-gray-600">समय: {selectedTime}</p>
                <p className="text-lg font-bold text-sacred-maroon mt-2">
                  कुल राशि: {formatPrice(Number(selectedPooja.price))}
                </p>
              </div>

              <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-600" disabled={isLoading}>
                {isLoading ? "बुक हो रहा है..." : "बुकिंग करें"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
