import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  return Number(value)
}

function buildRevenueTrend(
  donations: { amount: unknown; createdAt: Date }[],
  bookings: { totalAmount: unknown; createdAt: Date }[],
) {
  const now = new Date()
  const monthMap: Record<string, { month: string; booking_revenue: number; donation_revenue: number }> = {}
  const result: { month: string; booking_revenue: number; donation_revenue: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    const entry = { month: label, booking_revenue: 0, donation_revenue: 0 }
    monthMap[key] = entry
    result.push(entry)
  }

  for (const donation of donations) {
    const d = donation.createdAt
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthMap[key]) {
      monthMap[key].donation_revenue += toNumber(donation.amount)
    }
  }

  for (const booking of bookings) {
    const d = booking.createdAt
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthMap[key]) {
      monthMap[key].booking_revenue += toNumber(booking.totalAmount)
    }
  }

  return result
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfSixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const [
      completedDonationAgg,
      completedBookingAgg,
      pendingDonationAgg,
      pendingBookingAgg,
      thisMonthDonationAgg,
      thisMonthBookingAgg,

      totalTemples,
      activeTemples,
      premiumTemples,
      pendingApplications,

      totalBookings,
      completedBookingCount,
      pendingBookingCount,
      cancelledBookingCount,
      thisMonthBookingCount,

      totalDonations,
      completedDonationCount,
      failedDonationCount,
      refundedDonationCount,
      thisMonthDonationCount,

      totalUsers,
      newUsersThisMonth,
      devoteeCount,
      adminCount,
      trusteeCount,
      superAdminCount,

      commissionAgg,

      paidPayoutAgg,
      pendingPayoutAgg,

      last6MonthsDonations,
      last6MonthsBookings,

      donationByTemple,
      bookingByTemple,
    ] = await Promise.all([
      prisma.donation.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.booking.aggregate({
        where: { status: "COMPLETED" },
        _sum: { totalAmount: true },
      }),
      prisma.donation.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.booking.aggregate({
        where: { status: "PENDING" },
        _sum: { totalAmount: true },
      }),
      prisma.donation.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.booking.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
        _sum: { totalAmount: true },
      }),

      prisma.temple.count(),
      prisma.temple.count({ where: { isActive: true } }),
      prisma.temple.count({ where: { isPremium: true } }),
      prisma.templeApplication.count({ where: { status: "PENDING" } }),

      prisma.booking.count(),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),

      prisma.donation.count(),
      prisma.donation.count({ where: { status: "COMPLETED" } }),
      prisma.donation.count({ where: { status: "FAILED" } }),
      prisma.donation.count({ where: { status: "REFUNDED" } }),
      prisma.donation.count({ where: { createdAt: { gte: startOfMonth } } }),

      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { role: "DEVOTEE" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "TRUSTEE" } }),
      prisma.user.count({ where: { role: "SUPER_ADMIN" } }),

      prisma.commissionConfig.aggregate({
        where: { premiumListingActive: true },
        _sum: { platformFee: true },
      }),

      prisma.payout.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.payout.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
      }),

      prisma.donation.findMany({
        where: { status: "COMPLETED", createdAt: { gte: startOfSixMonthsAgo } },
        select: { amount: true, createdAt: true },
      }),
      prisma.booking.findMany({
        where: { status: "COMPLETED", createdAt: { gte: startOfSixMonthsAgo } },
        select: { totalAmount: true, createdAt: true },
      }),

      prisma.donation.groupBy({
        by: ["templeId"],
        where: { status: "COMPLETED", templeId: { not: null } },
        _sum: { amount: true },
      }),
      prisma.booking.groupBy({
        by: ["templeId"],
        where: { status: "COMPLETED" },
        _sum: { totalAmount: true },
      }),
    ])

    const totalCompletedDonation = toNumber(completedDonationAgg._sum.amount)
    const totalCompletedBooking = toNumber(completedBookingAgg._sum.totalAmount)
    const totalPendingDonation = toNumber(pendingDonationAgg._sum.amount)
    const totalPendingBooking = toNumber(pendingBookingAgg._sum.totalAmount)
    const thisMonthDonation = toNumber(thisMonthDonationAgg._sum.amount)
    const thisMonthBooking = toNumber(thisMonthBookingAgg._sum.totalAmount)

    const templeTotals: Record<string, number> = {}
    for (const d of donationByTemple) {
      if (d.templeId) {
        templeTotals[d.templeId] = (templeTotals[d.templeId] || 0) + toNumber(d._sum.amount)
      }
    }
    for (const b of bookingByTemple) {
      templeTotals[b.templeId] = (templeTotals[b.templeId] || 0) + toNumber(b._sum.totalAmount)
    }

    const topTempleIds = Object.entries(templeTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id]) => id)

    const topTemples = topTempleIds.length > 0
      ? await prisma.temple.findMany({
          where: { id: { in: topTempleIds } },
          select: { id: true, name: true, slug: true },
        })
      : []

    const templePerformance = topTempleIds.map((id) => {
      const temple = topTemples.find((t) => t.id === id)
      return {
        name: temple?.name || "Unknown",
        slug: temple?.slug || "unknown",
        totalAmount: templeTotals[id],
      }
    })

    const revenueTrend = buildRevenueTrend(last6MonthsDonations, last6MonthsBookings)

    return NextResponse.json({
      revenue: {
        totalRevenue: totalCompletedDonation + totalCompletedBooking,
        totalPending: totalPendingDonation + totalPendingBooking,
        thisMonth: thisMonthDonation + thisMonthBooking,
      },
      temples: {
        total: totalTemples,
        active: activeTemples,
        premium: premiumTemples,
        pendingApplications,
      },
      bookings: {
        total: totalBookings,
        completed: completedBookingCount,
        pending: pendingBookingCount,
        cancelled: cancelledBookingCount,
        thisMonth: thisMonthBookingCount,
      },
      donations: {
        total: totalDonations,
        completed: completedDonationCount,
        failed: failedDonationCount,
        refunded: refundedDonationCount,
        thisMonth: thisMonthDonationCount,
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        byRole: {
          devotee: devoteeCount,
          admin: adminCount,
          trustee: trusteeCount,
          superAdmin: superAdminCount,
        },
      },
      platform: {
        totalPlatformFees: toNumber(commissionAgg._sum.platformFee),
        totalPremiumTemples: premiumTemples,
      },
      payouts: {
        totalPaidOut: toNumber(paidPayoutAgg._sum.amount),
        pendingAmount: toNumber(pendingPayoutAgg._sum.amount),
      },
      revenueTrend,
      templePerformance,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
