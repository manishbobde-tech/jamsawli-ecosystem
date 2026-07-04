"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const presetAmounts = [101, 201, 501, 1001, 2001, 5001]

export function DonationForm() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState<number>(101)
  const [customAmount, setCustomAmount] = useState("")
  const [purpose, setPurpose] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const donationAmount = customAmount ? parseInt(customAmount) : amount

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          purpose,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Order creation failed")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "जामसावली हनुमान लोक",
        description: "दान - " + (purpose || "सामान्य दान"),
        order_id: data.order.id,
        handler: async function (response: any) {
          const verifyResponse = await fetch("/api/donations/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (verifyResponse.ok) {
            toast({
              title: "🙏 दान सफल",
              description: "आपके दान के लिए धन्यवाद!",
            })
          }
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
        description: "दान प्रक्रिया में समस्या हुई।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">🙏 दान करें</CardTitle>
        <CardDescription>अपनी भक्ति के साथ दान दें</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>राशि चुनें</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset && !customAmount ? "default" : "outline"}
                  onClick={() => {
                    setAmount(preset)
                    setCustomAmount("")
                  }}
                  className={amount === preset && !customAmount ? "bg-saffron-500 hover:bg-saffron-600" : ""}
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customAmount">कस्टम राशि</Label>
              <Input
                id="customAmount"
                type="number"
                placeholder="अन्य राशि दर्ज करें"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">दान का उद्देश्य (वैकल्पिक)</Label>
            <Input
              id="purpose"
              placeholder="जैसे: मंदिर निर्माण, भंडारा"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-600" disabled={isLoading}>
            {isLoading ? "प्रसंस्करण..." : `₹${customAmount || amount} दान करें`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
