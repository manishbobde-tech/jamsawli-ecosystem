import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function POST(req: Request) {
  try {
    const { userId, templeSlug, type, description, location, contact } = await req.json()
    if (!templeSlug) {
      return NextResponse.json({ message: "Temple slug required" }, { status: 400 })
    }
    const temple = await resolveTemple(templeSlug)

    const item = await prisma.lostFoundItem.create({
      data: {
        userId,
        templeId: temple.id,
        type: type || "LOST",
        description,
        location: location || "",
        contactInfo: contact || "",
        status: "OPEN",
      },
    })

    return NextResponse.json({ success: true, itemId: item.id })
  } catch (error) {
    console.error("LostFound error:", error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
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

    const items = await prisma.lostFoundItem.findMany({
      where: { templeId: temple.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Fetch LostFound error:", error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
