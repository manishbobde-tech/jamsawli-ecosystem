import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let counter = await prisma.counter.findUnique({
      where: { name: "daily_visitors" },
    })

    if (!counter) {
      counter = await prisma.counter.create({
        data: {
          name: "daily_visitors",
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
