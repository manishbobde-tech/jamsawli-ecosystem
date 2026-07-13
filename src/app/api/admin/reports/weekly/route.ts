import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"
import { buildWeeklyReport } from "@/lib/weekly-report"

/**
 * Weekly "kitna aaya" report — what trustees ask every Monday.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "TRUSTEE" &&
        user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
    const gate = await assertFeature(templeSlug, "weekly_report")
    if (!gate.ok) {
      return NextResponse.json(
        {
          message: gate.message,
          ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId),
        },
        { status: 402 }
      )
    }

    const report = await buildWeeklyReport(templeSlug)
    if (!report) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (e) {
    console.error("Weekly report error", e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
