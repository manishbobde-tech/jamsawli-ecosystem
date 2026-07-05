"use client"

import { useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { useOffline } from "@/hooks/useOffline"
import { toast } from "@/hooks/use-toast"

export function OfflineIndicator() {
  const { isOffline, pendingActions } = useOffline()

  useEffect(() => {
    if (isOffline) {
      toast({
        title: "ऑफ़लाइन मोड",
        description: "आप ऑफ़लाइन हैं। क्रियाएँ ऑनलाइन होने पर सिंक हो जाएंगी।",
        variant: "destructive",
      })
    } else if (pendingActions.length > 0) {
      toast({
        title: "वापस ऑनलाइन",
        description: `${pendingActions.length} क्रियाएँ सिंक हो रही हैं...`,
      })
    }
  }, [isOffline, pendingActions.length])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">ऑफ़लाइन</span>
      </div>
    </div>
  )
}
