import { NextResponse } from "next/server"

// In-memory store (replace with database in production)
const lostFoundItems: any[] = []

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, title, description, contact } = body

    const item = {
      id: crypto.randomUUID(),
      type,
      title,
      description,
      contact,
      date: new Date().toISOString(),
    }

    lostFoundItems.push(item)

    return NextResponse.json({ success: true, item })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to submit item" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") as "lost" | "found" | null

    const items = type 
      ? lostFoundItems.filter(item => item.type === type)
      : lostFoundItems

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch items" },
      { status: 500 }
    )
  }
}