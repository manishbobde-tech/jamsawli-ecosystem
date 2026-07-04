"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DevoteeCounter() {
  const [count, setCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchCount()
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchCount() {
    try {
      const response = await fetch("/api/counter")
      const data = await response.json()
      setCount(data.count)
      setLastUpdated(new Date(data.lastUpdated))
    } catch (error) {
      console.error("Failed to fetch counter:", error)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-saffron-500 to-sacred-red text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">🔴 लाइव भक्त काउंटर</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-5xl font-bold mb-2">{count.toLocaleString("hi-IN")}</div>
        <p className="text-sm opacity-90">आज के भक्त</p>
        {lastUpdated && (
          <p className="text-xs opacity-70 mt-2">
            अंतिम अपडेट: {lastUpdated.toLocaleTimeString("hi-IN")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
