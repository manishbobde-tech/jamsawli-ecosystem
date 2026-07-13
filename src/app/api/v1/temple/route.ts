import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../api-key"

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const temple = await prisma.temple.findUnique({
    where: { id: auth.templeId },
    select: {
      id: true,
      name: true,
      nameHi: true,
      slug: true,
      description: true,
      address: true,
      city: true,
      state: true,
      phone: true,
      email: true,
    },
  })

  return NextResponse.json({ temple })
}
