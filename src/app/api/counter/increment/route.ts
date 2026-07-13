import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    if (!templeSlug) {
      return NextResponse.json({ message: "Temple slug required" }, { status: 400 })
    }
    const temple = await resolveTemple(templeSlug)
    const counterName = `daily_visitors:${temple.id}`

    const counter = await prisma.counter.upsert({
      where: { name: counterName },
      update: { value: { increment: 1 } },
      create: {
        name: counterName,
        value: 1,
      },
    })

    return NextResponse.json({
      count: counter.value,
      lastUpdated: counter.lastUpdated,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to increment counter" },
      { status: 500 }
    )
  }
}
