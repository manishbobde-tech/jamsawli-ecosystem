import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { normalizePhone, isValidIndianMobile } from "@/lib/phone"
import bcrypt from "bcryptjs"

async function requireTempleManager() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return null
  }
  return user
}

export async function GET() {
  try {
    const actor = await requireTempleManager()
    if (!actor) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const orgId = actor.organizationId
    if (!orgId && actor.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "No organization linked" }, { status: 400 })
    }

    const members = await prisma.user.findMany({
      where:
        actor.role === "SUPER_ADMIN" && !orgId
          ? {
              role: { in: ["ADMIN", "TRUSTEE", "SUPER_ADMIN"] },
            }
          : {
              OR: [
                { organizationId: orgId! },
                {
                  userOrganizations: { some: { organizationId: orgId! } },
                },
              ],
            },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        organizationId: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json({
      members,
      organizationId: orgId,
      actorRole: actor.role,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

/**
 * Invite / upsert temple staff by phone or email.
 * Body: { name, phone?, email?, role: ADMIN|TRUSTEE, temporaryPassword? }
 */
export async function POST(req: Request) {
  try {
    const actor = await requireTempleManager()
    if (!actor) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const name = String(body.name || "").trim()
    const role = String(body.role || "ADMIN").toUpperCase()
    let phone = body.phone ? normalizePhone(String(body.phone)) : null
    const email = body.email ? String(body.email).trim().toLowerCase() : null

    if (!name) {
      return NextResponse.json({ message: "Name required" }, { status: 400 })
    }
    if (role !== "ADMIN" && role !== "TRUSTEE") {
      return NextResponse.json(
        { message: "Role must be ADMIN or TRUSTEE (not SUPER_ADMIN)" },
        { status: 400 }
      )
    }
    if (!phone && !email) {
      return NextResponse.json({ message: "Phone or email required" }, { status: 400 })
    }
    if (phone && !isValidIndianMobile(phone)) {
      return NextResponse.json({ message: "Invalid Indian mobile" }, { status: 400 })
    }

    const orgId =
      actor.role === "SUPER_ADMIN" && body.organizationId
        ? body.organizationId
        : actor.organizationId

    if (!orgId) {
      return NextResponse.json(
        {
          message:
            "Your user has no organizationId. Link org first or pass organizationId as SUPER_ADMIN.",
        },
        { status: 400 }
      )
    }

    const tempPassword =
      body.temporaryPassword ||
      `Temple@${Math.random().toString(36).slice(2, 8)}`
    const hashed = await bcrypt.hash(tempPassword, 10)

    let user =
      (phone && (await prisma.user.findUnique({ where: { phone } }))) ||
      (email && (await prisma.user.findUnique({ where: { email } }))) ||
      null

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          role: role as "ADMIN" | "TRUSTEE",
          organizationId: orgId,
          ...(body.temporaryPassword ? { password: hashed } : {}),
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          name,
          phone: phone || undefined,
          email: email || undefined,
          role: role as "ADMIN" | "TRUSTEE",
          organizationId: orgId,
          password: hashed,
        },
      })
    }

    await prisma.userOrganization.upsert({
      where: {
        userId_organizationId: { userId: user.id, organizationId: orgId },
      },
      create: {
        userId: user.id,
        organizationId: orgId,
        role,
      },
      update: { role },
    })

    return NextResponse.json({
      member: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      temporaryPassword: body.temporaryPassword || tempPassword,
      message:
        "Staff ready. They can login with phone OTP (preferred) or email/phone + temporary password.",
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed to invite" }, { status: 500 })
  }
}

/** Demote / remove temple access */
export async function DELETE(req: Request) {
  try {
    const actor = await requireTempleManager()
    if (!actor) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 })
    }
    if (userId === actor.id) {
      return NextResponse.json({ message: "Cannot remove yourself" }, { status: 400 })
    }

    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
    if (target.role === "SUPER_ADMIN" && actor.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Cannot modify super admin" }, { status: 403 })
    }

    const orgId = actor.organizationId
    if (orgId) {
      await prisma.userOrganization.deleteMany({
        where: { userId, organizationId: orgId },
      })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "DEVOTEE",
        organizationId:
          target.organizationId === orgId ? null : target.organizationId,
      },
    })

    return NextResponse.json({ message: "Access removed" })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
