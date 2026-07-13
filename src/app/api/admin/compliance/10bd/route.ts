import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseTrustConfig } from "@/lib/trust-config"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"
import { getDefaultTempleSlug } from "@/lib/tenant"

/**
 * Form 10BD-oriented donation export (CSV) — Trust Pro feature.
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
    const fy = searchParams.get("fy")
    const templeId = searchParams.get("templeId")
    const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()

    const gate = await assertFeature(templeId || templeSlug, "form_10bd")
    if (!gate.ok) {
      return NextResponse.json(
        {
          message: gate.message,
          ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId),
        },
        { status: 402 }
      )
    }

    let start: Date
    let end: Date
    if (fy && /^\d{4}-\d{2}$/.test(fy)) {
      const startYear = parseInt(fy.split("-")[0], 10)
      start = new Date(startYear, 3, 1)
      end = new Date(startYear + 1, 2, 31, 23, 59, 59)
    } else {
      const now = new Date()
      const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
      start = new Date(y, 3, 1)
      end = new Date(y + 1, 2, 31, 23, 59, 59)
    }

    const orgId = session.user.organizationId
    const where: Record<string, unknown> = {
      status: "COMPLETED",
      createdAt: { gte: start, lte: end },
    }
    if (templeId) {
      where.templeId = templeId
    } else if (gate.entitlements) {
      where.templeId = gate.entitlements.templeId
    } else if (orgId) {
      where.temple = { organizationId: orgId }
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        temple: { include: { organization: true } },
        user: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    const org =
      donations[0]?.temple?.organization ||
      (orgId
        ? await prisma.organization.findUnique({ where: { id: orgId } })
        : await prisma.organization.findFirst())
    const trust = parseTrustConfig(org?.config)

    const header = [
      "Unique Identification Number of donor (PAN)",
      "ID Code",
      "Section code",
      "Name of donor",
      "Address of donor",
      "Donation type",
      "Mode of receipt",
      "Amount of donation (INR)",
      "Receipt number",
      "Donation date",
      "Payment ID",
      "Purpose",
      "Temple",
      "Want80G",
      "Trust 80G Number",
      "Trust PAN",
    ]

    const rows = donations.map((d) => {
      const pan = d.panNumber || ""
      const name = d.donorName || d.user?.name || "Anonymous"
      return [
        pan,
        pan ? "PAN" : "OTHER",
        "80G",
        csvEscape(name),
        "",
        "Others",
        "Electronic modes including account payee cheque/draft",
        Number(d.amount).toFixed(2),
        d.receiptNumber || d.id,
        d.createdAt.toISOString().slice(0, 10),
        d.paymentId || "",
        csvEscape(d.purpose || "General"),
        csvEscape(d.temple?.name || ""),
        d.want80G ? "Y" : "N",
        trust.eightyGNumber || "",
        trust.panNumber || "",
      ].join(",")
    })

    const csv = [header.join(","), ...rows].join("\n")
    const filename = `form-10bd-export-${fy || "current"}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (e) {
    console.error("10BD export error", e)
    return NextResponse.json({ message: "Export failed" }, { status: 500 })
  }
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
