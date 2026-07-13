import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orgId = (session.user as any).organizationId
    if (!orgId) {
      return NextResponse.json({ message: "No organization" }, { status: 403 })
    }

    const temple = await prisma.temple.findFirst({ where: { organizationId: orgId } })
    if (temple) {
      const gate = await assertFeature(temple.id, "developer_api")
      if (!gate.ok) {
        return NextResponse.json(
          { message: gate.message, ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId) },
          { status: 402 }
        )
      }
    }

    const keys = await prisma.apiKey.findMany({
      where: { temple: { organizationId: orgId } },
      select: {
        id: true,
        name: true,
        key: true,
        scopes: true,
        isActive: true,
        createdAt: true,
        lastUsedAt: true,
        templeId: true,
      },
    })

    return NextResponse.json({ keys })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orgId = (session.user as any).organizationId
    if (!orgId) {
      return NextResponse.json({ message: "No organization" }, { status: 403 })
    }

    const { templeId, name, scopes } = await req.json()
    const gate = await assertFeature(templeId, "developer_api")
    if (!gate.ok) {
      return NextResponse.json(
        { message: gate.message, ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId) },
        { status: 402 }
      )
    }

    const generatedKey = crypto.randomBytes(32).toString("hex")

    const apiKey = await prisma.apiKey.create({
      data: {
        templeId,
        name,
        key: generatedKey,
        scopes: scopes || "read",
      },
    })

    return NextResponse.json({ apiKey: { id: apiKey.id, name: apiKey.name, key: apiKey.key } })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
