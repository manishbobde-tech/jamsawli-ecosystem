import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    if (!templeSlug) {
      return NextResponse.json({ message: "Temple slug required" }, { status: 400 })
    }

    const temple = await resolveTemple(templeSlug)

    const totalDonations = await prisma.donation.aggregate({
      where: { status: "COMPLETED", templeId: temple.id },
      _sum: { amount: true },
      _count: true,
    })

    const categoryBreakdown = await prisma.donation.groupBy({
      by: ["purpose"],
      where: { status: "COMPLETED", templeId: temple.id },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    })

    const recentDonations = await prisma.donation.findMany({
      where: { status: "COMPLETED", templeId: temple.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        purpose: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    })

    const projectProgress = [
      {
        name: "मंदिर निर्माण",
        nameEn: "Temple Construction",
        target: 36200000000,
        current: Number(totalDonations._sum.amount || 0) * 0.4,
        icon: "🛕",
      },
      {
        name: "चिकित्सा सेवा",
        nameEn: "Medical Services",
        target: 5000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.2,
        icon: "🏥",
      },
      {
        name: "शिक्षा",
        nameEn: "Education",
        target: 3000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.15,
        icon: "📚",
      },
      {
        name: "सामाजिक सेवा",
        nameEn: "Social Service",
        target: 2000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.15,
        icon: "🤝",
      },
      {
        name: "रखरखाव",
        nameEn: "Maintenance",
        target: 2000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.1,
        icon: "🔧",
      },
    ]

    return NextResponse.json({
      totalDonations: Number(totalDonations._sum.amount || 0),
      donationCount: totalDonations._count,
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.purpose || "सामान्य दान",
        amount: Number(c._sum.amount || 0),
        count: c._count,
      })),
      recentDonations: recentDonations.map((d) => ({
        ...d,
        amount: Number(d.amount),
        donorName: d.user.name || "अज्ञात भक्त",
      })),
      projectProgress: projectProgress.map((p) => ({
        ...p,
        percentage: Math.min(Math.round((p.current / p.target) * 100), 100),
      })),
    })
  } catch (error) {
    console.error("Transparency API error:", error)
    return NextResponse.json(
      { message: "त्रुटि" },
      { status: 500 }
    )
  }
}