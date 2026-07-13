import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  buildWeeklyReport,
  readNotifyConfig,
  sendWeeklyReportChannels,
} from "@/lib/weekly-report"
import { getTempleEntitlements } from "@/lib/entitlements"
import { planHasFeature } from "@/lib/plans"

/**
 * Cron endpoint: send weekly reports for temples with autoSendEnabled.
 * Secure with CRON_SECRET header.
 *
 * Vercel cron example (vercel.json):
 * { "path": "/api/cron/weekly-reports", "schedule": "0 3 * * 1" }
 * Monday 03:00 UTC
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  const auth =
    req.headers.get("authorization") || req.headers.get("x-cron-secret") || ""
  const token = auth.replace(/^Bearer\s+/i, "")

  if (!secret || token !== secret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const temples = await prisma.temple.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, config: true, name: true },
  })

  const results: Array<{
    slug: string
    sent: boolean
    email?: boolean
    slack?: boolean
    skipped?: string
    errors?: string[]
  }> = []

  for (const temple of temples) {
    const notify = readNotifyConfig(temple.config)
    if (!notify.autoSendEnabled) {
      results.push({ slug: temple.slug, sent: false, skipped: "autoSend disabled" })
      continue
    }

    const ent = await getTempleEntitlements(temple.id)
    if (!ent || !planHasFeature(ent.planId, "weekly_report")) {
      results.push({ slug: temple.slug, sent: false, skipped: "plan" })
      continue
    }

    if (!notify.emails.length && !notify.slackWebhookUrl && !process.env.SLACK_WEBHOOK_URL) {
      results.push({ slug: temple.slug, sent: false, skipped: "no channels" })
      continue
    }

    const report = await buildWeeklyReport(temple.slug)
    if (!report) {
      results.push({ slug: temple.slug, sent: false, skipped: "build failed" })
      continue
    }

    const channels = await sendWeeklyReportChannels(report, notify)
    results.push({
      slug: temple.slug,
      sent: channels.email || channels.slack,
      email: channels.email,
      slack: channels.slack,
      errors: channels.errors,
    })
  }

  return NextResponse.json({
    ok: true,
    at: new Date().toISOString(),
    results,
  })
}

export async function POST(req: Request) {
  return GET(req)
}
