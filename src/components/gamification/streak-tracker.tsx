"use client"

import { Card } from "@/components/ui/card"
import { Flame, Calendar, Trophy } from "lucide-react"

interface Streak {
  type: string
  currentStreak: number
  longestStreak: number
}

interface StreakTrackerProps {
  streaks: Streak[]
}

const typeLabels: Record<string, { en: string; hi: string; icon: string }> = {
  darshan: { en: "Darshan", hi: "दर्शन", icon: "🙏" },
  donation: { en: "Donation", hi: "दान", icon: "💝" },
  booking: { en: "Booking", hi: "बुकिंग", icon: "📅" },
}

export function StreakTracker({ streaks }: StreakTrackerProps) {
  if (streaks.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No streaks yet. Start your spiritual journey!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {streaks.map((streak) => {
        const info = typeLabels[streak.type] || { en: streak.type, hi: streak.type, icon: "📌" }
        return (
          <Card key={streak.type} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{info.icon}</span>
              <div>
                <h3 className="font-semibold">{info.hi}</h3>
                <p className="text-xs text-gray-500">{info.en}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-2xl font-bold text-orange-500">{streak.currentStreak}</span>
                <span className="text-sm text-gray-500">days</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Trophy className="w-4 h-4" />
                <span>Best: {streak.longestStreak}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
