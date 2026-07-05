"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  id: string
  score: number
  rank: number | null
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No leaderboard entries yet.</p>
      </Card>
    )
  }

  const getRankIcon = (rank: number | null) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 text-center text-gray-500">#{rank}</span>
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-saffron-500 text-white p-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          लीडरबोर्ड / Leaderboard
        </h3>
      </div>
      <div className="divide-y">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-4 ${
              entry.user.id === currentUserId ? "bg-saffron-50" : ""
            }`}
          >
            <div className="flex-shrink-0 w-8">{getRankIcon(entry.rank)}</div>
            <div className="flex-shrink-0">
              {entry.user.image ? (
                <Image
                  src={entry.user.image}
                  alt={entry.user.name || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-semibold">
                  {(entry.user.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${entry.user.id === currentUserId ? "text-saffron-600" : ""}`}>
                {entry.user.name || "Anonymous Devotee"}
                {entry.user.id === currentUserId && (
                  <span className="ml-2 text-xs bg-saffron-100 text-saffron-600 px-2 py-0.5 rounded">
                    You
                  </span>
                )}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-lg font-bold text-saffron-600">{entry.score}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
