import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function POST(req: Request) {
  try {
    const { userId, templeSlug, type, location, message } = await req.json()
    if (!templeSlug) {
      return NextResponse.json({ message: "Temple slug required" }, { status: 400 })
    }
    const temple = await resolveTemple(templeSlug)

    const alert = await prisma.sosAlert.create({
      data: {
        userId,
        templeId: temple.id,
        type: type || "MEDICAL",
        location: location || "",
        message: message || "",
        status: "ACTIVE",
      },
    })

    return NextResponse.json({ success: true, alertId: alert.id })
  } catch (error) {
    console.error("SOS error:", error)
    return NextResponse.json({ message: "SOS failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    if (!templeSlug) {
      return NextResponse.json({ message: "Temple slug required" }, { status: 400 })
    }
    const temple = await resolveTemple(templeSlug)

    const alerts = await prisma.sosAlert.findMany({
      where: {
        templeId: temple.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Fetch SOS error:", error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
