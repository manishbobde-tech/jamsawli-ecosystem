"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const presetAmounts = [101, 201, 501, 1001, 2001, 5001]

const purposes = [
  { value: "general", label: "सामान्य दान / General" },
  { value: "construction", label: "मंदिर निर्माण / Construction" },
  { value: "bhandara", label: "भंडारा / Annadan" },
  { value: "annakut", label: "अन्नकूट / Festival" },
  { value: "maintenance", label: "देखभाल / Maintenance" },
]

interface DonationFormProps {
  templeId: string
  templeName?: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function DonationForm({ templeId, templeName }: DonationFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState<number>(101)
  const [customAmount, setCustomAmount] = useState("")
  const [purpose, setPurpose] = useState("general")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [donorPhone, setDonorPhone] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [want80G, setWant80G] = useState(false)
  const [successReceipt, setSuccessReceipt] = useState<{
    amount: number
    receiptNumber?: string
    paymentId?: string
    donationId?: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const donationAmount = customAmount ? parseInt(customAmount, 10) : amount
    if (!donationAmount || donationAmount < 1) {
      toast({
        title: "अमान्य राशि",
        description: "कृपया सही राशि दर्ज करें।",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (want80G) {
      if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(panNumber.trim())) {
        toast({
          title: "PAN आवश्यक",
          description: "80G रसीद के लिए वैध PAN दर्ज करें (ABCDE1234F)।",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      if (!donorName.trim()) {
        toast({
          title: "नाम आवश्यक",
          description: "80G रसीद पर नाम चाहिए।",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }

    if (!session?.user && !donorName.trim()) {
      toast({
        title: "नाम दर्ज करें",
        description: "अतिथि दान के लिए नाम आवश्यक है — या लॉगिन करें।",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) throw new Error("Razorpay failed to load")

      const purposeLabel =
        purposes.find((p) => p.value === purpose)?.label || purpose

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          purpose: purposeLabel,
          templeId,
          donorName: donorName || session?.user?.name,
          donorEmail: donorEmail || session?.user?.email,
          donorPhone,
          panNumber: want80G ? panNumber.trim().toUpperCase() : undefined,
          want80G,
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
        name: templeName || "MandirOS Donation",
        description: "दान - " + purposeLabel,
        order_id: data.order.id,
        handler: async function (paymentResponse: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          const verifyResponse = await fetch("/api/donations/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            }),
          })

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json().catch(() => ({}))
            setSuccessReceipt({
              amount: donationAmount,
              receiptNumber: verifyData.receiptNumber,
              paymentId: paymentResponse.razorpay_payment_id,
              donationId: verifyData.donationId,
            })
            toast({
              title: "🙏 दान सफल",
              description: want80G
                ? "धन्यवाद! 80G विवरण रसीद में शामिल हैं।"
                : "आपके दान के लिए धन्यवाद!",
            })
          } else {
            toast({
              title: "सत्यापन लंबित",
              description: "भुगतान मिला। सत्यापन में देरी हो सकती है।",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: donorName || session?.user?.name || "",
          email: donorEmail || session?.user?.email || "",
          contact: donorPhone || "",
        },
        theme: {
          color: "#f97316",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: "त्रुटि",
        description:
          error instanceof Error ? error.message : "दान प्रक्रिया में समस्या हुई।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (successReceipt) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-700">🙏 दान सफल</CardTitle>
          <CardDescription>Jai Shri Hanuman — thank you for your seva</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-xl bg-green-50 border border-green-100 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold">₹{successReceipt.amount}</span>
            </div>
            {successReceipt.receiptNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Receipt No.</span>
                <span className="font-mono text-xs">{successReceipt.receiptNumber}</span>
              </div>
            )}
            {successReceipt.paymentId && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 shrink-0">Payment ID</span>
                <span className="font-mono text-xs break-all text-right">
                  {successReceipt.paymentId}
                </span>
              </div>
            )}
            {want80G && panNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">PAN (80G)</span>
                <span className="font-mono">{panNumber.toUpperCase()}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Save this screen or payment ID for your records. Full PDF 80G
            certificates ship with trust registration details.
          </p>
          <div className="flex flex-col gap-2">
            {(successReceipt.donationId || successReceipt.receiptNumber) && (
              <Link
                href={`/receipt/${successReceipt.donationId || successReceipt.receiptNumber}`}
              >
                <Button className="w-full bg-saffron-500 hover:bg-saffron-600">
                  View / Print 80G Receipt
                </Button>
              </Link>
            )}
            <Link href="/temples">
              <Button variant="outline" className="w-full">
                Browse temples
              </Button>
            </Link>
            <Button variant="ghost" className="w-full" onClick={() => setSuccessReceipt(null)}>
              Donate again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-saffron-100">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">🙏 दान करें</CardTitle>
        <CardDescription>
          {session?.user
            ? `Logged in as ${session.user.name || session.user.email}`
            : "Guest donation welcome — no account required"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label>राशि चुनें / Amount</Label>
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
                  className={
                    amount === preset && !customAmount
                      ? "bg-saffron-500 hover:bg-saffron-600"
                      : ""
                  }
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customAmount">कस्टम राशि / Custom</Label>
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
            <Label htmlFor="purpose">उद्देश्य / Purpose</Label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {purposes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 rounded-xl border bg-saffron-50/50 p-3">
            <p className="text-sm font-medium text-gray-800">
              Donor details {session?.user ? "(optional if logged in)" : "(required)"}
            </p>
            <div className="space-y-2">
              <Label htmlFor="donorName">नाम / Name</Label>
              <Input
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder={session?.user?.name || "Your full name"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donorEmail">Email</Label>
              <Input
                id="donorEmail"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder={session?.user?.email || "you@example.com"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donorPhone">Phone / WhatsApp</Label>
              <Input
                id="donorPhone"
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="rounded-xl border border-saffron-200 p-3 space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={want80G}
                onChange={(e) => setWant80G(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-saffron-600"
              />
              <span className="text-sm">
                <span className="font-medium text-gray-900">
                  80G tax receipt chahiye / I need 80G receipt
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  PAN required. Subject to trust&apos;s valid 80G registration.
                </span>
              </span>
            </label>
            {want80G && (
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="font-mono uppercase"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-saffron-500 hover:bg-saffron-600 h-11 text-base"
            disabled={isLoading}
          >
            {isLoading
              ? "प्रसंस्करण..."
              : `₹${customAmount || amount} सुरक्षित दान करें`}
          </Button>

          {!session?.user && (
            <p className="text-xs text-center text-gray-500">
              Want history &amp; certificates?{" "}
              <Link href="/login" className="text-saffron-700 underline">
                Login
              </Link>{" "}
              or{" "}
              <Link href="/register" className="text-saffron-700 underline">
                create account
              </Link>
              .
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
