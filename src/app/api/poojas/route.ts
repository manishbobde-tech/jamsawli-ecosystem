import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")

    const temple = await resolveTemple(templeSlug)

    const poojas = await prisma.pooja.findMany({
      where: {
        templeId: temple.id,
        isActive: true,
      },
      orderBy: { price: "asc" },
    })

    return NextResponse.json({ poojas })
  } catch (error) {
    console.error("Fetch poojas error:", error)
    return NextResponse.json(
      { message: "Failed to fetch poojas" },
      { status: 500 }
    )
  }
}
