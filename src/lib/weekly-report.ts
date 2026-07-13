import { prisma } from "@/lib/prisma"
import { getTempleEntitlements } from "@/lib/entitlements"

export type WeeklyReport = {
  temple: {
    id: string
    name: string
    nameHi: string | null
    slug: string
    org: string
  }
  period: { from: string; to: string; label: string }
  money: {
    onlineDonations: number
    counterCash: number
    poojaBookings: number
    grandTotal: number
    estimatedPlatformFees: number
    netToTempleEstimate: number
  }
  volume: {
    donationCount: number
    cashEntries: number
    bookingCount: number
    visits: number
  }
  topPurposes: Array<{ purpose: string; amount: number; count: number }>
  plan: string
  generatedAt: string
  oneLinerHi: string
  oneLinerEn: string
}

export async function buildWeeklyReport(templeSlug: string): Promise<WeeklyReport | null> {
  const temple = await prisma.temple.findFirst({
    where: { slug: templeSlug },
    include: { organization: true },
  })
  if (!temple) return null

  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  start.setHours(0, 0, 0, 0)

  const [
    onlineAgg,
    cashAgg,
    bookingAgg,
    bookingCount,
    donationCount,
    topPurposes,
    visits,
  ] = await Promise.all([
    prisma.donation.aggregate({
      where: {
        templeId: temple.id,
        status: "COMPLETED",
        createdAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.cashEntry.aggregate({
      where: {
        templeId: temple.id,
        collectedAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.booking.aggregate({
      where: {
        templeId: temple.id,
        createdAt: { gte: start, lte: end },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true },
    }),
    prisma.booking.count({
      where: {
        templeId: temple.id,
        createdAt: { gte: start, lte: end },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.donation.count({
      where: {
        templeId: temple.id,
        status: "COMPLETED",
        createdAt: { gte: start, lte: end },
      },
    }),
    prisma.donation.groupBy({
      by: ["purpose"],
      where: {
        templeId: temple.id,
        status: "COMPLETED",
        createdAt: { gte: start, lte: end },
      },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
      take: 8,
    }),
    prisma.visit.count({
      where: {
        templeId: temple.id,
        checkInTime: { gte: start, lte: end },
      },
    }),
  ])

  const online = Number(onlineAgg._sum.amount || 0)
  const cash = Number(cashAgg._sum.amount || 0)
  const bookings = Number(bookingAgg._sum.totalAmount || 0)
  const entitlements = await getTempleEntitlements(temple.id)
  const feeRate = entitlements?.transactionFeeRate ?? 0.025
  const estFees = Math.round(online * feeRate)

  return {
    temple: {
      id: temple.id,
      name: temple.name,
      nameHi: temple.nameHi,
      slug: temple.slug,
      org: temple.organization.name,
    },
    period: {
      from: start.toISOString(),
      to: end.toISOString(),
      label: `${start.toLocaleDateString("en-IN")} – ${end.toLocaleDateString("en-IN")}`,
    },
    money: {
      onlineDonations: online,
      counterCash: cash,
      poojaBookings: bookings,
      grandTotal: online + cash + bookings,
      estimatedPlatformFees: estFees,
      netToTempleEstimate: online + cash + bookings - estFees,
    },
    volume: {
      donationCount,
      cashEntries: cashAgg._count,
      bookingCount,
      visits,
    },
    topPurposes: topPurposes.map((p) => ({
      purpose: p.purpose || "General",
      amount: Number(p._sum.amount || 0),
      count: p._count,
    })),
    plan: entitlements?.planId || "FREE",
    generatedAt: new Date().toISOString(),
    oneLinerHi: `इस सप्ताह कुल ₹${(online + cash + bookings).toLocaleString("en-IN")} — ऑनलाइन ₹${online.toLocaleString("en-IN")}, काउंटर ₹${cash.toLocaleString("en-IN")}, पूजा ₹${bookings.toLocaleString("en-IN")}`,
    oneLinerEn: `This week total ₹${(online + cash + bookings).toLocaleString("en-IN")} — online ₹${online.toLocaleString("en-IN")}, counter ₹${cash.toLocaleString("en-IN")}, poojas ₹${bookings.toLocaleString("en-IN")}`,
  }
}

export function formatReportText(report: WeeklyReport): string {
  const lines = [
    `📋 MandirOS weekly report`,
    report.temple.nameHi || report.temple.name,
    report.period.label,
    ``,
    report.oneLinerHi,
    report.oneLinerEn,
    ``,
    `Online: ₹${report.money.onlineDonations.toLocaleString("en-IN")}`,
    `Counter: ₹${report.money.counterCash.toLocaleString("en-IN")}`,
    `Poojas: ₹${report.money.poojaBookings.toLocaleString("en-IN")}`,
    `Grand total: ₹${report.money.grandTotal.toLocaleString("en-IN")}`,
    `Bookings: ${report.volume.bookingCount} · Donations: ${report.volume.donationCount} · Visits: ${report.volume.visits}`,
    ``,
    `Dashboard: open Weekly report for full detail.`,
    `जय श्री हनुमान · MandirOS`,
  ]
  return lines.join("\n")
}

export type NotifyConfig = {
  emails: string[]
  slackWebhookUrl?: string
  autoSendEnabled?: boolean
}

export function readNotifyConfig(config: unknown): NotifyConfig {
  if (!config || typeof config !== "object") {
    return { emails: [], autoSendEnabled: false }
  }
  const n = (config as { notifications?: NotifyConfig }).notifications
  if (!n || typeof n !== "object") {
    return { emails: [], autoSendEnabled: false }
  }
  return {
    emails: Array.isArray(n.emails) ? n.emails.filter(Boolean) : [],
    slackWebhookUrl: n.slackWebhookUrl || "",
    autoSendEnabled: Boolean(n.autoSendEnabled),
  }
}

export async function sendWeeklyReportChannels(
  report: WeeklyReport,
  notify: NotifyConfig
): Promise<{ email: boolean; slack: boolean; errors: string[] }> {
  const text = formatReportText(report)
  const errors: string[] = []
  let emailOk = false
  let slackOk = false

  // Slack incoming webhook
  const slackUrl =
    notify.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL || ""
  if (slackUrl) {
    try {
      const res = await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: `MandirOS · ${report.temple.name}`,
              },
            },
            {
              type: "section",
              text: { type: "mrkdwn", text: `*${report.period.label}*\n${report.oneLinerEn}` },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Online*\n₹${report.money.onlineDonations.toLocaleString("en-IN")}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Counter*\n₹${report.money.counterCash.toLocaleString("en-IN")}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Poojas*\n₹${report.money.poojaBookings.toLocaleString("en-IN")}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Total*\n₹${report.money.grandTotal.toLocaleString("en-IN")}`,
                },
              ],
            },
          ],
        }),
      })
      if (!res.ok) throw new Error(`Slack ${res.status}`)
      slackOk = true
    } catch (e) {
      errors.push(`Slack: ${e instanceof Error ? e.message : "failed"}`)
    }
  }

  // Email via Resend
  const emails = notify.emails.length
    ? notify.emails
    : process.env.WEEKLY_REPORT_EMAIL
      ? [process.env.WEEKLY_REPORT_EMAIL]
      : []

  if (emails.length && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "MandirOS <onboarding@resend.dev>",
          to: emails,
          subject: `Weekly report · ${report.temple.name} · ${report.period.label}`,
          text,
          html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;line-height:1.5">${text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")}</pre>`,
        }),
      })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(body.slice(0, 200))
      }
      emailOk = true
    } catch (e) {
      errors.push(`Email: ${e instanceof Error ? e.message : "failed"}`)
    }
  } else if (emails.length && !process.env.RESEND_API_KEY) {
    // Dev fallback: log (still counts as "sent" for demo)
    console.info("[weekly-report email dry-run]", emails, text.slice(0, 200))
    emailOk = true
    errors.push("Email dry-run (set RESEND_API_KEY for real send)")
  }

  return { email: emailOk, slack: slackOk, errors }
}
