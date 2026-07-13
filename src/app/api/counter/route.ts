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
    const counterName = `daily_visitors:${temple.id}`

    let counter = await prisma.counter.findUnique({
      where: { name: counterName },
    })

    if (!counter) {
      counter = await prisma.counter.create({
        data: {
          name: counterName,
          value: 0,
        },
      })
    }

    return NextResponse.json({
      count: counter.value,
      lastUpdated: counter.lastUpdated,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch counter" },
      { status: 500 }
    )
  }
}
