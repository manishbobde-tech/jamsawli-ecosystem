"use client"

import { useEffect } from "react"
import { OfflineIndicator } from "@/components/offline/offline-indicator"
import { NotificationPrompt } from "@/components/notifications/notification-prompt"
import { DailyWisdom } from "@/components/notifications/daily-wisdom"

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service Worker registration failed:", err)
      })
    }
  }, [])

  return (
    <>
      {children}
      <OfflineIndicator />
    </>
  )
}

export { NotificationPrompt, DailyWisdom }
