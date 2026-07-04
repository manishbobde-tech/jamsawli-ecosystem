import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const counter = await prisma.counter.upsert({
      where: { name: "daily_visitors" },
      update: { value: { increment: 1 } },
      create: {
        name: "daily_visitors",
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
