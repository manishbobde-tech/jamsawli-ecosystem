"use client"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"

import { useEffect, useState } from "react"
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
  maxPerSlot?: number
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

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface BookingFormProps {
  templeSlug?: string
}

export function BookingForm({ templeSlug: propSlug }: BookingFormProps) {
  const temple = useOptionalTemple()
  const templeSlug = propSlug || temple?.templeSlug || DEFAULT_TENANT_SLUG
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null)
  const [selectedDate, setSelectedDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  )
  const [selectedTime, setSelectedTime] = useState("")
  const [devoteeName, setDevoteeName] = useState("")
  const [gotra, setGotra] = useState("")
  const [nakshatra, setNakshatra] = useState("")
  const [sankalp, setSankalp] = useState("")
  const [phone, setPhone] = useState("")
  const [slotInfo, setSlotInfo] = useState<{
    remaining: number
    maxPerSlot: number
    full: boolean
  } | null>(null)

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd")

  useEffect(() => {
    if (!selectedPooja || !selectedTime || !selectedDate) {
      setSlotInfo(null)
      return
    }
    fetch(
      `/api/bookings?poojaId=${selectedPooja.id}&date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setSlotInfo({ remaining: d.remaining, maxPerSlot: d.maxPerSlot, full: d.full })
      })
      .catch(() => setSlotInfo(null))
  }, [selectedPooja, selectedTime, selectedDate])

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

    if (!session?.user && !devoteeName.trim()) {
      toast({
        title: "नाम आवश्यक",
        description: "अतिथि बुकिंग के लिए नाम लिखें या लॉगिन करें",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (slotInfo?.full) {
      toast({
        title: "स्लॉट भरा",
        description: "कृपया दूसरा समय चुनें",
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
          devoteeName: devoteeName || session?.user?.name,
          gotra,
          nakshatra,
          sankalp,
          phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Booking failed")
      }

      if (data.demo || data.order?.id?.startsWith("demo_")) {
        toast({
          title: "🙏 बुकिंग दर्ज",
          description:
            data.message ||
            "Booking confirmed. Open certificate to print keepsake.",
        })
        if (data.bookingId && typeof window !== "undefined") {
          window.open(`/certificate/${data.bookingId}`, "_blank")
        }
        setIsLoading(false)
        return
      }

      if (!(window as unknown as { Razorpay?: unknown }).Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: temple?.templeNameHi || temple?.templeName || "MandirOS Booking",
        description: `पूजा बुकिंग - ${selectedPooja.nameHi || selectedPooja.name}`,
        order_id: data.order.id,
        handler: async function (paymentResponse: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          if (data.bookingId) {
            await fetch("/api/bookings/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: data.bookingId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            })
          }
          toast({
            title: "🙏 बुकिंग सफल",
            description: "सेवा प्रमाणपत्र खोलें / Open seva certificate.",
          })
          if (data.bookingId) {
            window.open(`/certificate/${data.bookingId}`, "_blank")
          }
        },
        prefill: {
          name: devoteeName || session?.user?.name || "",
          email: session?.user?.email || "",
          contact: phone || "",
        },
        theme: { color: "#f97316" },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: "त्रुटि",
        description:
          error instanceof Error ? error.message : "बुकिंग प्रक्रिया में समस्या हुई।",
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
          <PoojaList
            onSelect={setSelectedPooja}
            selectedPooja={selectedPooja}
            templeSlug={templeSlug}
          />
        </CardContent>
      </Card>

      {selectedPooja && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sacred-maroon">
              भक्त विवरण · तिथि · समय
            </CardTitle>
            <p className="text-sm text-gray-500 font-normal">
              Gotra / sankalp — what real temples need for the sankalp
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="devoteeName">नाम / Name *</Label>
                  <Input
                    id="devoteeName"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder={session?.user?.name || "भक्त का नाम"}
                    required={!session?.user}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone / WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gotra">गोत्र / Gotra</Label>
                  <Input
                    id="gotra"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    placeholder="e.g. Kashyap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nakshatra">नक्षत्र / Nakshatra</Label>
                  <Input
                    id="nakshatra"
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="sankalp">संकल्प / Purpose of pooja</Label>
                  <Input
                    id="sankalp"
                    value={sankalp}
                    onChange={(e) => setSankalp(e.target.value)}
                    placeholder="e.g. family health, exam success, griha pravesh"
                  />
                </div>
              </div>

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
                      className={
                        selectedTime === slot ? "bg-saffron-500 hover:bg-saffron-600" : ""
                      }
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                {slotInfo && selectedTime && (
                  <p
                    className={`text-xs ${
                      slotInfo.full ? "text-red-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {slotInfo.full
                      ? "यह स्लॉट भर चुका है — दूसरा समय चुनें"
                      : `${slotInfo.remaining} seats left of ${slotInfo.maxPerSlot}`}
                  </p>
                )}
              </div>

              <div className="p-4 bg-saffron-50 rounded-lg">
                <p className="font-semibold">
                  चयनित पूजा: {selectedPooja.nameHi || selectedPooja.name}
                </p>
                <p className="text-sm text-gray-600">
                  तिथि: {format(new Date(selectedDate), "dd MMMM yyyy")}
                </p>
                <p className="text-sm text-gray-600">समय: {selectedTime || "—"}</p>
                {gotra && (
                  <p className="text-sm text-gray-600">गोत्र: {gotra}</p>
                )}
                <p className="text-lg font-bold text-sacred-maroon mt-2">
                  कुल राशि: {formatPrice(Number(selectedPooja.price))}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-saffron-500 hover:bg-saffron-600"
                disabled={isLoading || Boolean(slotInfo?.full)}
              >
                {isLoading ? "बुक हो रहा है..." : "बुकिंग करें"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
