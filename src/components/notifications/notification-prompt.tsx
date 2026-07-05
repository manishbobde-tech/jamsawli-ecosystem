"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPush,
} from "@/lib/notifications"

export function NotificationPrompt() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const handleEnable = async () => {
    setIsLoading(true)
    try {
      const newPermission = await requestNotificationPermission()
      setPermission(newPermission)

      if (newPermission === "granted") {
        const registration = await registerServiceWorker()
        if (registration) {
          const subscription = await subscribeToPush(registration)
          setIsSubscribed(!!subscription)

          if (subscription) {
            await fetch("/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "subscribe",
                subscription: subscription.toJSON(),
              }),
            })
          }
        }
      }
    } catch (error) {
      console.error("Notification setup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (permission === "granted" && isSubscribed) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            सूचनाएँ सक्रिय
          </CardTitle>
          <CardDescription>
            आपको दैनिक ज्ञान और कार्यक्रम अपडेट मिलेंगे
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (permission === "denied") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BellOff className="h-4 w-4" />
            सूचनाएँ बंद हैं
          </CardTitle>
          <CardDescription>
            ब्राउज़र सेटिंग्स में सूचनाएँ सक्षम करें
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bell className="h-4 w-4" />
          दैनिक ज्ञान प्राप्त करें
        </CardTitle>
        <CardDescription>
          हर दिन हनुमान चालीसा से श्लोक और कार्यक्रम रिमाइंडर पाएं
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleEnable} disabled={isLoading} size="sm" className="w-full">
          {isLoading ? "सक्षम हो रहा है..." : "सूचनाएँ चालू करें"}
        </Button>
      </CardContent>
    </Card>
  )
}
