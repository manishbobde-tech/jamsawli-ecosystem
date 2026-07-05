import { prisma } from "./prisma"

export const BADGES = {
  FIRST_VISIT: { name: "First Steps", nameHi: "पहला कदम", icon: "👣", tier: "BRONZE" as const },
  VISIT_5: { name: "Regular Devotee", nameHi: "नियमित भक्त", icon: "🙏", tier: "BRONZE" as const },
  VISIT_10: { name: "Faithful Follower", nameHi: "वफादार अनुयायी", icon: "✨", tier: "SILVER" as const },
  VISIT_25: { name: "Hanuman Bhakt", nameHi: "हनुमान भक्त", icon: "🙏", tier: "GOLD" as const },
  VISIT_50: { name: "Temple Guardian", nameHi: "मंदिर रक्षक", icon: "🛡️", tier: "PLATINUM" as const },
  DONATION_100: { name: "Generous Heart", nameHi: "उदार हृदय", icon: "💝", tier: "BRONZE" as const },
  DONATION_1000: { name: "Major Donor", nameHi: "बड़े दानदाता", icon: "💎", tier: "SILVER" as const },
  STREAK_7: { name: "Week Warrior", nameHi: "सप्ताह योद्धा", icon: "🔥", tier: "BRONZE" as const },
  STREAK_30: { name: "Monthly Master", nameHi: "मासिक मास्टर", icon: "⭐", tier: "SILVER" as const },
} as const

export type BadgeName = keyof typeof BADGES

async function hasBadge(userId: string, badgeName: string): Promise<boolean> {
  const badge = await prisma.badge.findFirst({ where: { name: badgeName } })
  if (!badge) return false
  const userBadge = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  })
  return !!userBadge
}

async function awardBadge(userId: string, badgeName: BadgeName) {
  const badgeData = BADGES[badgeName]
  if (!badgeData) return

  const badge = await prisma.badge.upsert({
    where: { name: badgeName },
    update: {},
    create: {
      name: badgeName,
      nameHi: badgeData.nameHi,
      icon: badgeData.icon,
      tier: badgeData.tier,
    },
  })

  await prisma.userBadge.create({
    data: { userId, badgeId: badge.id },
  })
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeName[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { donations: true, bookings: true },
  })

  if (!user) return []

  const newBadges: BadgeName[] = []
  const totalDonations = user.donations.reduce((sum, d) => sum + Number(d.amount), 0)
  const totalVisits = user.bookings.filter((b) => b.status === "COMPLETED").length

  if (totalVisits >= 1 && !await hasBadge(userId, "FIRST_VISIT")) {
    await awardBadge(userId, "FIRST_VISIT")
    newBadges.push("FIRST_VISIT")
  }

  if (totalVisits >= 5 && !await hasBadge(userId, "VISIT_5")) {
    await awardBadge(userId, "VISIT_5")
    newBadges.push("VISIT_5")
  }

  if (totalVisits >= 10 && !await hasBadge(userId, "VISIT_10")) {
    await awardBadge(userId, "VISIT_10")
    newBadges.push("VISIT_10")
  }

  if (totalVisits >= 25 && !await hasBadge(userId, "VISIT_25")) {
    await awardBadge(userId, "VISIT_25")
    newBadges.push("VISIT_25")
  }

  if (totalVisits >= 50 && !await hasBadge(userId, "VISIT_50")) {
    await awardBadge(userId, "VISIT_50")
    newBadges.push("VISIT_50")
  }

  if (totalDonations >= 100 && !await hasBadge(userId, "DONATION_100")) {
    await awardBadge(userId, "DONATION_100")
    newBadges.push("DONATION_100")
  }

  if (totalDonations >= 1000 && !await hasBadge(userId, "DONATION_1000")) {
    await awardBadge(userId, "DONATION_1000")
    newBadges.push("DONATION_1000")
  }

  return newBadges
}

export async function updateStreak(userId: string, type: string) {
  const now = new Date()
  const streak = await prisma.userStreak.findUnique({
    where: { userId_type: { userId, type } },
  })

  if (!streak) {
    return prisma.userStreak.create({
      data: {
        userId,
        type,
        currentStreak: 1,
        longestStreak: 1,
        lastActive: now,
      },
    })
  }

  const lastActive = new Date(streak.lastActive)
  const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)

  if (diffHours > 48) {
    return prisma.userStreak.update({
      where: { userId_type: { userId, type } },
      data: {
        currentStreak: 1,
        lastActive: now,
      },
    })
  }

  const newStreak = streak.currentStreak + 1
  return prisma.userStreak.update({
    where: { userId_type: { userId, type } },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActive: now,
    },
  })
}

export async function updateLeaderboard(userId: string, score: number, period: string) {
  return prisma.leaderboard.upsert({
    where: { userId_period: { userId, period } },
    update: {
      score: { increment: score },
    },
    create: {
      userId,
      period,
      score,
    },
  })
}

export async function getLeaderboard(period: string, limit: number = 10) {
  return prisma.leaderboard.findMany({
    where: { period },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { score: "desc" },
    take: limit,
  })
}

export async function getUserBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: { earnedAt: "desc" },
  })
}

export async function getUserStreaks(userId: string) {
  return prisma.userStreak.findMany({
    where: { userId },
  })
}
