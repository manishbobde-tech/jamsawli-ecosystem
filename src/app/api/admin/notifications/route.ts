import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { readNotifyConfig, type NotifyConfig } from "@/lib/weekly-report"

async function requireStaff() {
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

export async function GET(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({ where: { slug } })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

  return NextResponse.json({
    templeSlug: temple.slug,
    notifications: readNotifyConfig(temple.config),
    providers: {
      resend: Boolean(process.env.RESEND_API_KEY),
      slackEnv: Boolean(process.env.SLACK_WEBHOOK_URL),
    },
  })
}

export async function PUT(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const slug = body.templeSlug || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({ where: { slug } })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const emailsRaw = String(body.emails || "")
  const emails = emailsRaw
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"))

  const notifications: NotifyConfig = {
    emails,
    slackWebhookUrl: String(body.slackWebhookUrl || "").trim(),
    autoSendEnabled: Boolean(body.autoSendEnabled),
  }

  const prev =
    temple.config && typeof temple.config === "object"
      ? (temple.config as Record<string, unknown>)
      : {}

  await prisma.temple.update({
    where: { id: temple.id },
    data: {
      config: {
        ...prev,
        notifications,
      } as object,
    },
  })

  return NextResponse.json({ notifications })
}
