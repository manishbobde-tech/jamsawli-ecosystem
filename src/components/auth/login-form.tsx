"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type Method = "otp" | "email" | "phone-password"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [method, setMethod] = useState<Method>("otp")
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)

  async function sendOtp() {
    setIsLoading(true)
    setDevOtp(null)
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to send OTP")
      setOtpSent(true)
      if (data.devOtp) {
        setDevOtp(data.devOtp)
        setOtp(data.devOtp)
      }
      toast({
        title: "OTP भेजा गया",
        description:
          data.channel === "console"
            ? "Dev mode: OTP shown below (configure MSG91/Twilio for SMS)"
            : "Check your SMS for the 6-digit code",
      })
    } catch (e) {
      toast({
        title: "त्रुटि",
        description: e instanceof Error ? e.message : "OTP send failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function loginWithOtp(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn("phone-otp", {
        phone,
        otp,
        name,
        redirect: false,
      })
      if (result?.error) {
        toast({
          title: "त्रुटि",
          description: result.error === "CredentialsSignin" ? "Invalid OTP" : result.error,
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      toast({ title: "त्रुटि", description: "Login failed", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const identifier =
      method === "email"
        ? (formData.get("email") as string)
        : (formData.get("phone") as string)
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        [method === "email" ? "email" : "phone"]: identifier,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "त्रुटि",
          description: "लॉगिन में समस्या हुई। कृपया पुनः प्रयास करें।",
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      toast({ title: "त्रुटि", description: "कुछ गलत हो गया।", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-saffron-100">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">लॉगिन करें</CardTitle>
        <CardDescription>
          Phone OTP (recommended) · Email · Google
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6 flex-wrap">
          {(
            [
              ["otp", "फोन OTP"],
              ["email", "ईमेल"],
              ["phone-password", "फोन+पासवर्ड"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={method === id ? "default" : "outline"}
              onClick={() => {
                setMethod(id)
                setOtpSent(false)
              }}
              className={method === id ? "bg-saffron-500 hover:bg-saffron-600" : ""}
            >
              {label}
            </Button>
          ))}
        </div>

        {method === "otp" ? (
          <form onSubmit={loginWithOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-otp">Mobile (India)</Label>
              <Input
                id="phone-otp"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {!otpSent ? (
              <Button
                type="button"
                className="w-full bg-saffron-500 hover:bg-saffron-600"
                disabled={isLoading || !phone}
                onClick={sendOtp}
              >
                {isLoading ? "भेजा जा रहा है..." : "OTP भेजें / Send OTP"}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">6-digit OTP</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    className="font-mono tracking-widest text-lg"
                  />
                  {devOtp && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      Dev OTP: <strong className="font-mono">{devOtp}</strong>
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name (new users)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional if already registered"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-saffron-500 hover:bg-saffron-600"
                  disabled={isLoading || otp.length < 6}
                >
                  {isLoading ? "Verify..." : "Verify & Login"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={sendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </Button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={onPasswordSubmit} className="space-y-4">
            {method === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="email">ईमेल</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone">फोन नंबर</Label>
                <Input id="phone" name="phone" type="tel" placeholder="9876543210" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">पासवर्ड</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="अपना पासवर्ड डालें"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
            </Button>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">या</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => signIn("google")}
          >
            Google से लॉगिन करें
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          खाता नहीं है?{" "}
          <a href="/register" className="text-saffron-600 hover:underline">
            रजिस्टर करें
          </a>
          {" · "}
          <span className="text-gray-500">OTP auto-creates account</span>
        </p>
      </CardContent>
    </Card>
  )
}
