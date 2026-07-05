"use client"

import { Card } from "@/components/ui/card"

interface Badge {
  id: string
  name: string
  nameHi: string
  icon: string
  tier: string
}

interface BadgeDisplayProps {
  badges: Badge[]
}

const tierColors: Record<string, string> = {
  BRONZE: "bg-amber-100 border-amber-300",
  SILVER: "bg-gray-100 border-gray-300",
  GOLD: "bg-yellow-100 border-yellow-400",
  PLATINUM: "bg-purple-100 border-purple-400",
}

const tierLabels: Record<string, string> = {
  BRONZE: "कांस्य",
  SILVER: "चांदी",
  GOLD: "सोना",
  PLATINUM: "प्लैटिनम",
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No badges earned yet. Keep visiting!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={`p-4 text-center border-2 ${tierColors[badge.tier] || tierColors.BRONZE}`}
        >
          <div className="text-4xl mb-2">{badge.icon}</div>
          <h3 className="font-semibold text-sm">{badge.nameHi}</h3>
          <p className="text-xs text-gray-600">{badge.name}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-white/50 rounded">
            {tierLabels[badge.tier]}
          </span>
        </Card>
      ))}
    </div>
  )
}
