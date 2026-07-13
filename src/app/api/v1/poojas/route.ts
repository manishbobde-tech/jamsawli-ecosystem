import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../api-key"

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const poojas = await prisma.pooja.findMany({
    where: { templeId: auth.templeId, isActive: true },
    orderBy: { price: "asc" },
  })

  return NextResponse.json({ poojas })
}
