import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"
import {
  buildWeeklyReport,
  readNotifyConfig,
  sendWeeklyReportChannels,
} from "@/lib/weekly-report"

/**
 * Send weekly report now via email (Resend) and/or Slack webhook.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (
      !user ||
      (user.role !== "ADMIN" &&
        user.role !== "TRUSTEE" &&
        user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const templeSlug = body.templeSlug || getDefaultTempleSlug()

    const gate = await assertFeature(templeSlug, "weekly_report")
    if (!gate.ok) {
      return NextResponse.json(
        {
          message: gate.message,
          ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId),
        },
        { status: 402 }
      )
    }

    const temple = await prisma.temple.findFirst({ where: { slug: templeSlug } })
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    const report = await buildWeeklyReport(templeSlug)
    if (!report) {
      return NextResponse.json({ message: "Report failed" }, { status: 500 })
    }

    // Optional override emails/slack from request body
    const stored = readNotifyConfig(temple.config)
    const notify = {
      emails:
        Array.isArray(body.emails) && body.emails.length
          ? body.emails
          : stored.emails,
      slackWebhookUrl: body.slackWebhookUrl || stored.slackWebhookUrl,
      autoSendEnabled: stored.autoSendEnabled,
    }

    if (!notify.emails.length && !notify.slackWebhookUrl && !process.env.SLACK_WEBHOOK_URL) {
      return NextResponse.json(
        {
          message:
            "Configure notification emails or Slack webhook in Report settings first.",
          reportPreview: report.oneLinerEn,
        },
        { status: 400 }
      )
    }

    const result = await sendWeeklyReportChannels(report, notify)

    return NextResponse.json({
      ok: result.email || result.slack,
      channels: result,
      report: {
        oneLinerEn: report.oneLinerEn,
        grandTotal: report.money.grandTotal,
        period: report.period.label,
      },
    })
  } catch (e) {
    console.error("Weekly send error", e)
    return NextResponse.json({ message: "Send failed" }, { status: 500 })
  }
}
