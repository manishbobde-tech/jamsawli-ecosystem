import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { getTempleEntitlements } from "@/lib/entitlements"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
    const temple = await prisma.temple.findFirst({
      where: { slug: templeSlug },
    })
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [
      donationAgg,
      donationMonth,
      bookingCount,
      bookingMonth,
      devoteeCount,
      visitsToday,
      cashToday,
      pendingBookings,
      completedDonations,
    ] = await Promise.all([
      prisma.donation.aggregate({
        where: { templeId: temple.id, status: "COMPLETED" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.aggregate({
        where: {
          templeId: temple.id,
          status: "COMPLETED",
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.booking.count({ where: { templeId: temple.id } }),
      prisma.booking.count({
        where: { templeId: temple.id, createdAt: { gte: startOfMonth } },
      }),
      prisma.user.count({
        where: {
          OR: [
            { donations: { some: { templeId: temple.id } } },
            { bookings: { some: { templeId: temple.id } } },
            { visits: { some: { templeId: temple.id } } },
          ],
        },
      }),
      prisma.visit.count({
        where: { templeId: temple.id, checkInTime: { gte: startOfDay } },
      }),
      prisma.cashEntry.aggregate({
        where: { templeId: temple.id, collectedAt: { gte: startOfDay } },
        _sum: { amount: true },
      }),
      prisma.booking.count({
        where: { templeId: temple.id, status: "PENDING" },
      }),
      prisma.donation.count({
        where: { templeId: temple.id, status: "COMPLETED" },
      }),
    ])

    const entitlements = await getTempleEntitlements(temple.id)
    const onlineTotal = Number(donationAgg._sum.amount || 0)
    const feeRate = entitlements?.transactionFeeRate ?? 0.025
    const platformFeesEstimate = Math.round(onlineTotal * feeRate)

    return NextResponse.json({
      temple: {
        id: temple.id,
        slug: temple.slug,
        name: temple.name,
        nameHi: temple.nameHi,
      },
      entitlements,
      stats: {
        totalDonations: onlineTotal,
        donationCount: donationAgg._count,
        monthDonations: Number(donationMonth._sum.amount || 0),
        monthDonationCount: donationMonth._count,
        totalBookings: bookingCount,
        monthBookings: bookingMonth,
        pendingBookings,
        devotees: devoteeCount,
        visitsToday,
        cashToday: Number(cashToday._sum.amount || 0),
        completedDonations,
        platformFeesEstimate,
      },
    })
  } catch (e) {
    console.error("Dashboard stats error", e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
