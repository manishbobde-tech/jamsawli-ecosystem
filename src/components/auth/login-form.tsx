"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [method, setMethod] = useState<"email" | "phone">("email")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const identifier = method === "email"
      ? formData.get("email") as string
      : formData.get("phone") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        [method]: identifier,
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
        <CardTitle className="text-2xl text-sacred-maroon">लॉगिन करें</CardTitle>
        <CardDescription>अपने खाते में साइन इन करें</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={method === "email" ? "default" : "outline"}
            onClick={() => setMethod("email")}
            className="flex-1"
          >
            ईमेल
          </Button>
          <Button
            type="button"
            variant={method === "phone" ? "default" : "outline"}
            onClick={() => setMethod("phone")}
            className="flex-1"
          >
            फोन
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {method === "email" ? (
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
          ) : (
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
        </p>
      </CardContent>
    </Card>
  )
}
