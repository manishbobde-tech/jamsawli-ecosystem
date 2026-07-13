import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"

export interface Campaign {
  id: string
  title: string
  titleHi?: string
  target: number
  raised?: number
  description?: string
}

function readCampaigns(config: unknown): Campaign[] {
  if (!config || typeof config !== "object") return []
  const c = config as { campaigns?: Campaign[] }
  return Array.isArray(c.campaigns) ? c.campaigns : []
}

async function requireStaff() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return null
  }
  return user
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) {
    return NextResponse.json({ message: "Temple not found" }, { status: 404 })
  }

  const campaigns = readCampaigns(temple.config)

  // Compute raised from completed donations matching purpose loosely, or store raised
  const withRaised = await Promise.all(
    campaigns.map(async (camp) => {
      if (typeof camp.raised === "number") {
        return { ...camp, raised: camp.raised }
      }
      const agg = await prisma.donation.aggregate({
        where: {
          templeId: temple.id,
          status: "COMPLETED",
          purpose: { contains: camp.title.split(" ")[0] || camp.title },
        },
        _sum: { amount: true },
      })
      return {
        ...camp,
        raised: Number(agg._sum.amount || 0),
      }
    })
  )

  return NextResponse.json({
    templeSlug: temple.slug,
    campaigns: withRaised,
  })
}

export async function POST(req: Request) {
  const user = await requireStaff()
  if (!user) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const templeSlug = body.templeSlug || getDefaultTempleSlug()
  const gate = await assertFeature(templeSlug, "donation_campaigns")
  if (!gate.ok) {
    return NextResponse.json(
      {
        message: gate.message,
        ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId),
      },
      { status: 402 }
    )
  }

  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) {
    return NextResponse.json({ message: "Temple not found" }, { status: 404 })
  }

  const title = String(body.title || "").trim()
  const target = Number(body.target)
  if (!title || !target || target <= 0) {
    return NextResponse.json({ message: "title and target required" }, { status: 400 })
  }

  const prev =
    temple.config && typeof temple.config === "object"
      ? (temple.config as Record<string, unknown>)
      : {}
  const existing = readCampaigns(temple.config)
  const campaign: Campaign = {
    id: `camp_${Date.now().toString(36)}`,
    title,
    titleHi: body.titleHi || title,
    target,
    raised: Number(body.raised || 0),
    description: body.description || "",
  }

  const updated = await prisma.temple.update({
    where: { id: temple.id },
    data: {
      config: {
        ...prev,
        campaigns: [...existing, campaign],
      } as object,
    },
  })

  return NextResponse.json({
    campaigns: readCampaigns(updated.config),
    campaign,
  })
}

export async function DELETE(req: Request) {
  const user = await requireStaff()
  if (!user) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const templeSlug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  if (!id) return NextResponse.json({ message: "id required" }, { status: 400 })

  const gate = await assertFeature(templeSlug, "donation_campaigns")
  if (!gate.ok) {
    return NextResponse.json(
      { message: gate.message, ...featureDeniedPayload(gate.requiredPlan) },
      { status: 402 }
    )
  }

  const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const prev =
    temple.config && typeof temple.config === "object"
      ? (temple.config as Record<string, unknown>)
      : {}
  const existing = readCampaigns(temple.config).filter((c) => c.id !== id)

  await prisma.temple.update({
    where: { id: temple.id },
    data: { config: { ...prev, campaigns: existing } as object },
  })

  return NextResponse.json({ campaigns: existing })
}
