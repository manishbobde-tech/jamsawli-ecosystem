"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureGate } from "@/components/billing/feature-gate"
import { PlanId } from "@/lib/plans"
import { useStaffTemple } from "@/hooks/useStaffTemple"
import {
  FileBarChart,
  Printer,
  Share2,
  Send,
  Settings2,
  Loader2,
  Mail,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WeeklyReport {
  temple: { name: string; nameHi: string | null; org: string }
  period: { label: string }
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
  oneLinerHi: string
  oneLinerEn: string
  plan: string
  generatedAt: string
}

interface NotifyConfig {
  emails: string[]
  slackWebhookUrl?: string
  autoSendEnabled?: boolean
}

export default function WeeklyReportPage() {
  const { toast } = useToast()
  const { slug: templeSlug, ready: templeReady } = useStaffTemple()
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [emails, setEmails] = useState("")
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("")
  const [autoSendEnabled, setAutoSendEnabled] = useState(false)
  const [providers, setProviders] = useState({ resend: false, slackEnv: false })

  useEffect(() => {
    if (!templeReady) return
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/admin/reports/weekly?templeSlug=${templeSlug}`
        )
        if (res.status === 402) {
          setAllowed(false)
          const ent = await fetch(
            `/api/temple/entitlements?templeSlug=${templeSlug}`
          ).then((r) => (r.ok ? r.json() : null))
          if (ent) setPlanId(ent.planId)
          return
        }
        if (res.ok) {
          const d = await res.json()
          setReport(d)
          setPlanId((d.plan as PlanId) || "FREE")
        }

        const nRes = await fetch(
          `/api/admin/notifications?templeSlug=${templeSlug}`
        )
        if (nRes.ok) {
          const n = await nRes.json()
          const cfg = n.notifications as NotifyConfig
          setEmails((cfg.emails || []).join(", "))
          setSlackWebhookUrl(cfg.slackWebhookUrl || "")
          setAutoSendEnabled(Boolean(cfg.autoSendEnabled))
          if (n.providers) setProviders(n.providers)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [templeSlug, templeReady])

  async function share() {
    if (!report) return
    const text = `${report.oneLinerHi}\n${report.period.label}\n— MandirOS`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Weekly temple report", text })
      } else {
        await navigator.clipboard.writeText(text)
        toast({ title: "Copied", description: "Paste into WhatsApp to trustees" })
      }
    } catch {
      await navigator.clipboard.writeText(text)
      toast({ title: "Copied to clipboard" })
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templeSlug,
          emails,
          slackWebhookUrl,
          autoSendEnabled,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast({
          title: "Could not save",
          description: err.message || "Try again",
          variant: "destructive",
        })
        return
      }
      const data = await res.json()
      const cfg = data.notifications as NotifyConfig
      setEmails((cfg.emails || []).join(", "))
      setSlackWebhookUrl(cfg.slackWebhookUrl || "")
      setAutoSendEnabled(Boolean(cfg.autoSendEnabled))
      toast({
        title: "Notification settings saved",
        description: autoSendEnabled
          ? "Auto-send on Mondays is enabled (when cron + channels are configured)."
          : "Auto-send is off. You can still send manually.",
      })
    } finally {
      setSaving(false)
    }
  }

  async function sendNow() {
    setSending(true)
    try {
      const res = await fetch("/api/admin/reports/weekly/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templeSlug,
          emails: emails
            .split(/[,;\s]+/)
            .map((e) => e.trim())
            .filter((e) => e.includes("@")),
          slackWebhookUrl: slackWebhookUrl || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 400) {
        toast({
          title: "No channel configured",
          description:
            data.message ||
            "Add trustee emails or a Slack webhook in settings first.",
          variant: "destructive",
        })
        setShowSettings(true)
        return
      }
      if (!res.ok) {
        toast({
          title: "Send failed",
          description: data.message || "Check Resend / Slack config",
          variant: "destructive",
        })
        return
      }
      const ch = data.channels || {}
      const parts: string[] = []
      if (ch.email) parts.push("email")
      if (ch.slack) parts.push("Slack")
      const errNote =
        Array.isArray(ch.errors) && ch.errors.length
          ? ` Notes: ${ch.errors.join("; ")}`
          : ""
      toast({
        title: data.ok ? "Report sent" : "Partial / dry-run",
        description: `${parts.length ? `Via ${parts.join(" + ")}.` : "No channel succeeded."}${errNote}`,
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Generating report…</div>
  }

  if (!allowed) {
    return <FeatureGate feature="weekly_report" allowed={false} currentPlan={planId} />
  }

  if (!report) {
    return <div className="py-16 text-center text-red-500">Could not load report</div>
  }

  const m = report.money

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
            <FileBarChart className="h-7 w-7" />
            Weekly trustee report
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            The Monday message boards actually want: kitna aaya?
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings((v) => !v)}
            className="gap-1"
          >
            <Settings2 className="h-4 w-4" />
            {showSettings ? "Hide settings" : "Email / Slack"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={sendNow}
            disabled={sending}
            className="gap-1"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send now
          </Button>
          <Button variant="outline" size="sm" onClick={share} className="gap-1">
            <Share2 className="h-4 w-4" /> WhatsApp
          </Button>
          <Button
            size="sm"
            className="bg-saffron-500 hover:bg-saffron-600 gap-1"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {showSettings && (
        <div className="print:hidden rounded-2xl border bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-semibold text-sacred-maroon flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Auto-send & channels
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Email via Resend · Slack incoming webhook · Optional Monday cron (03:00 UTC).
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-emails">Trustee emails (comma-separated)</Label>
            <Input
              id="report-emails"
              placeholder="trustee@temple.org, accounts@temple.org"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slack-url" className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Slack webhook URL (optional)
            </Label>
            <Input
              id="slack-url"
              type="url"
              placeholder="https://hooks.slack.com/services/…"
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-stone-300 text-saffron-600 focus:ring-saffron-500"
              checked={autoSendEnabled}
              onChange={(e) => setAutoSendEnabled(e.target.checked)}
            />
            <span>
              <span className="text-sm font-medium text-stone-900">
                Auto-send every Monday
              </span>
              <span className="block text-xs text-stone-500 mt-0.5">
                Requires plan with weekly report, channels above,{" "}
                <code className="text-[10px] bg-stone-100 px-1 rounded">CRON_SECRET</code>{" "}
                + Vercel cron. Manual “Send now” always works when channels are set.
              </span>
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button onClick={saveSettings} disabled={saving} size="sm" className="gap-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save settings
            </Button>
            <p className="text-xs text-stone-400">
              Providers: Resend {providers.resend ? "✓" : "—"} · Platform Slack env{" "}
              {providers.slackEnv ? "✓" : "—"}
            </p>
          </div>
        </div>
      )}

      <article
        id="weekly-report-print"
        className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm print:shadow-none print:border-0"
      >
        <header className="border-b pb-4 mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            MandirOS · Weekly money report
          </p>
          <h2 className="text-xl font-bold text-sacred-maroon mt-1">
            {report.temple.nameHi || report.temple.name}
          </h2>
          <p className="text-sm text-gray-600">{report.temple.org}</p>
          <p className="text-sm font-medium mt-2">{report.period.label}</p>
        </header>

        <div className="rounded-xl bg-saffron-50 border border-saffron-100 p-4 mb-6">
          <p className="text-lg font-semibold text-sacred-maroon">{report.oneLinerHi}</p>
          <p className="text-sm text-gray-600 mt-1">{report.oneLinerEn}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Online donations", value: m.onlineDonations },
            { label: "Counter / hundi", value: m.counterCash },
            { label: "Pooja bookings", value: m.poojaBookings },
            { label: "Grand total", value: m.grandTotal, bold: true },
          ].map((row) => (
            <div
              key={row.label}
              className={`rounded-lg border p-3 ${row.bold ? "bg-sacred-maroon text-white col-span-2" : ""}`}
            >
              <p className={`text-xs ${row.bold ? "text-white/70" : "text-gray-500"}`}>
                {row.label}
              </p>
              <p className="text-xl font-bold">
                ₹{row.value.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm mb-6">
          <div className="border rounded-lg p-2">
            <p className="font-bold">{report.volume.donationCount}</p>
            <p className="text-xs text-gray-500">donations</p>
          </div>
          <div className="border rounded-lg p-2">
            <p className="font-bold">{report.volume.cashEntries}</p>
            <p className="text-xs text-gray-500">cash logs</p>
          </div>
          <div className="border rounded-lg p-2">
            <p className="font-bold">{report.volume.bookingCount}</p>
            <p className="text-xs text-gray-500">bookings</p>
          </div>
          <div className="border rounded-lg p-2">
            <p className="font-bold">{report.volume.visits}</p>
            <p className="text-xs text-gray-500">check-ins</p>
          </div>
        </div>

        {report.topPurposes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-2">Top purposes</h3>
            <ul className="space-y-1 text-sm">
              {report.topPurposes.map((p) => (
                <li key={p.purpose} className="flex justify-between border-b border-gray-50 py-1">
                  <span>
                    {p.purpose}{" "}
                    <span className="text-gray-400">×{p.count}</span>
                  </span>
                  <span className="font-medium">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="text-xs text-gray-500 border-t pt-4 flex justify-between">
          <span>
            Est. platform fees: ₹{m.estimatedPlatformFees.toLocaleString("en-IN")} · Net est.
            ₹{m.netToTempleEstimate.toLocaleString("en-IN")}
          </span>
          <span>Plan: {report.plan}</span>
        </footer>
      </article>
    </div>
  )
}
