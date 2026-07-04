"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "सफल",
          description: "खाता बन गया। अब लॉगिन करें।",
        })
        router.push("/login")
      } else {
        const error = await response.json()
        toast({
          title: "त्रुटि",
          description: error.message || "रजिस्ट्रेशन में समस्या हुई।",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "कुछ गलत हो गया।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">रजिस्टर करें</CardTitle>
        <CardDescription>नया खाता बनाएं</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">नाम</Label>
            <Input
              id="name"
              name="name"
              placeholder="आपका नाम"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ईमेल</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">फोन नंबर</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "रजिस्टर हो रहा है..." : "रजिस्टर करें"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          पहले से खाता है?{" "}
          <a href="/login" className="text-saffron-600 hover:underline">
            लॉगिन करें
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
