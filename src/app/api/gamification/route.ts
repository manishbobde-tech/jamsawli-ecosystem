import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  checkAndAwardBadges,
  updateStreak,
  updateLeaderboard,
  getUserBadges,
  getUserStreaks,
  getLeaderboard,
} from "@/lib/gamification"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action")

    switch (action) {
      case "badges":
        const badges = await getUserBadges(session.user.id)
        return NextResponse.json({ badges })

      case "streaks":
        const streaks = await getUserStreaks(session.user.id)
        return NextResponse.json({ streaks })

      case "leaderboard":
        const period = searchParams.get("period") || "alltime"
        const leaderboard = await getLeaderboard(period)
        return NextResponse.json({ leaderboard })

      default:
        const [userBadges, userStreaks] = await Promise.all([
          getUserBadges(session.user.id),
          getUserStreaks(session.user.id),
        ])
        return NextResponse.json({ badges: userBadges, streaks: userStreaks })
    }
  } catch (error) {
    console.error("Gamification error:", error)
    return NextResponse.json(
      { error: "Failed to fetch gamification data" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, type, score, period } = await req.json()

    switch (action) {
      case "checkBadges":
        const newBadges = await checkAndAwardBadges(session.user.id)
        return NextResponse.json({ newBadges })

      case "updateStreak":
        if (!type) {
          return NextResponse.json({ error: "Type required" }, { status: 400 })
        }
        const streak = await updateStreak(session.user.id, type)
        return NextResponse.json({ streak })

      case "updateLeaderboard":
        if (!score || !period) {
          return NextResponse.json({ error: "Score and period required" }, { status: 400 })
        }
        const leaderboardEntry = await updateLeaderboard(session.user.id, score, period)
        return NextResponse.json({ entry: leaderboardEntry })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Gamification error:", error)
    return NextResponse.json(
      { error: "Failed to update gamification data" },
      { status: 500 }
    )
  }
}
