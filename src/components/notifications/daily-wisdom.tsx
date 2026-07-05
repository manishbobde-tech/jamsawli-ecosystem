"use client"

import { useState, useEffect } from "react"
import { BookOpen, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DailyWisdomVerse {
  id: string
  verse: string
  verseHi: string
  source: string
  audioUrl?: string
}

export function DailyWisdom() {
  const [verse, setVerse] = useState<DailyWisdomVerse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWisdom = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notifications?type=daily-wisdom")
      if (response.ok) {
        const data = await response.json()
        setVerse(data)
      }
    } catch (error) {
      console.error("Failed to fetch daily wisdom:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWisdom()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!verse) return null

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-1" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          आज का ज्ञान
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-lg font-medium leading-relaxed">{verse.verseHi}</p>
        <p className="text-sm text-muted-foreground italic">{verse.verse}</p>
        <p className="text-xs text-muted-foreground">— {verse.source}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchWisdom}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          नया श्लोक
        </Button>
      </CardContent>
    </Card>
  )
}
