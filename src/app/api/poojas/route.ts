import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"
import { getTempleEntitlements } from "@/lib/entitlements"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    if (!templeSlug) {
      return NextResponse.json({ message: "Temple slug required" }, { status: 400 })
    }

    const temple = await resolveTemple(templeSlug)
    const entitlements = await getTempleEntitlements(temple.id)

    const poojas = await prisma.pooja.findMany({
      where: {
        templeId: temple.id,
        isActive: true,
      },
      orderBy: { price: "asc" },
    })

    // Free plan: enforce max sevas catalogue size
    const max = entitlements?.maxPoojas
    const limited =
      max != null && poojas.length > max ? poojas.slice(0, max) : poojas

    return NextResponse.json({
      poojas: limited,
      plan: entitlements?.planId || "FREE",
      maxPoojas: max,
      totalPoojas: poojas.length,
      truncated: max != null && poojas.length > max,
      upgradeHint:
        max != null && poojas.length > max
          ? "Upgrade to Growth for unlimited sevas"
          : undefined,
    })
  } catch (error) {
    console.error("Fetch poojas error:", error)
    return NextResponse.json(
      { message: "Failed to fetch poojas" },
      { status: 500 }
    )
  }
}
