"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BadgeDisplay } from "./badge-display"
import { StreakTracker } from "./streak-tracker"
import { Leaderboard } from "./leaderboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GamificationSection() {
  const { data: session, status } = useSession()
  const [badges, setBadges] = useState<any[]>([])
  const [streaks, setStreaks] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [badgesRes, streaksRes, leaderboardRes] = await Promise.all([
          fetch("/api/gamification?action=badges"),
          fetch("/api/gamification?action=streaks"),
          fetch("/api/gamification?action=leaderboard&period=alltime"),
        ])

        if (badgesRes.ok) {
          const data = await badgesRes.json()
          setBadges(data.badges?.map((ub: any) => ub.badge) || [])
        }
        if (streaksRes.ok) {
          const data = await streaksRes.json()
          setStreaks(data.streaks || [])
        }
        if (leaderboardRes.ok) {
          const data = await leaderboardRes.json()
          const withRank = (data.leaderboard || []).map((entry: any, i: number) => ({
            ...entry,
            rank: i + 1,
          }))
          setLeaderboard(withRank)
        }
      } catch (err) {
        console.error("Failed to load gamification:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session, status])

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">लोड हो रहा है...</div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow">
        <p className="text-gray-500 mb-4">गेमिफिकेशन देखने के लिए लॉगिन करें</p>
        <Link href="/login">
          <Button className="bg-saffron-500 hover:bg-saffron-600">लॉगिन करें</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sacred-maroon">आपकी उपलब्धियाँ</h2>

      <div>
        <h3 className="text-lg font-semibold mb-3">बैज / Badges</h3>
        <BadgeDisplay badges={badges} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">स्ट्रीक / Streaks</h3>
        <StreakTracker streaks={streaks} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">लीडरबोर्ड</h3>
        <Leaderboard entries={leaderboard} currentUserId={session.user.id} />
      </div>
    </div>
  )
}
