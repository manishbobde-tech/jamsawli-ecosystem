import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseTrustConfig, type TrustComplianceConfig } from "@/lib/trust-config"

async function requireStaff() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) }
  }
  return { session, user }
}

export async function GET() {
  try {
    const gate = await requireStaff()
    if ("error" in gate && gate.error) return gate.error

    const orgId = gate.session!.user.organizationId
    let org = orgId
      ? await prisma.organization.findUnique({ where: { id: orgId } })
      : await prisma.organization.findFirst()

    if (!org) {
      return NextResponse.json({ message: "No organization" }, { status: 404 })
    }

    const config = parseTrustConfig(org.config)
    return NextResponse.json({ organizationId: org.id, config })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const gate = await requireStaff()
    if ("error" in gate && gate.error) return gate.error

    const body = (await req.json()) as { config: TrustComplianceConfig; organizationId?: string }
    if (!body.config?.trustLegalName) {
      return NextResponse.json({ message: "trustLegalName required" }, { status: 400 })
    }

    const orgId =
      body.organizationId ||
      gate.session!.user.organizationId ||
      (await prisma.organization.findFirst())?.id

    if (!orgId) {
      return NextResponse.json({ message: "No organization" }, { status: 404 })
    }

    const existing = await prisma.organization.findUnique({ where: { id: orgId } })
    const prev =
      existing?.config && typeof existing.config === "object"
        ? (existing.config as Record<string, unknown>)
        : {}

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: {
        config: {
          ...prev,
          trust: { ...body.config },
        } as object,
      },
    })

    return NextResponse.json({
      organizationId: updated.id,
      config: parseTrustConfig(updated.config),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed to save" }, { status: 500 })
  }
}
