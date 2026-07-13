"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DonationsTable } from "@/components/dashboard/donations-table"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { GamificationSection } from "@/components/gamification/gamification-section"
import { FeatureGate } from "@/components/billing/feature-gate"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { tenantPath } from "@/lib/tenant-path"
import { PlanId, PLANS } from "@/lib/plans"
import { Button } from "@/components/ui/button"
import {
  IndianRupee,
  CalendarHeart,
  Users,
  Eye,
  Wallet,
  Zap,
  ArrowRight,
  ClipboardList,
  FileText,
  Compass,
  QrCode,
  CalendarRange,
  Target,
  ListTree,
  Settings,
  BookOpen,
  ExternalLink,
} from "lucide-react"
import { startProductTour } from "@/components/tour/product-tour"
import { PageHeader } from "@/components/ui/page-header"

interface StatsPayload {
  stats: {
    totalDonations: number
    donationCount: number
    monthDonations: number
    monthDonationCount: number
    totalBookings: number
    monthBookings: number
    pendingBookings: number
    devotees: number
    visitsToday: number
    cashToday: number
    platformFeesEstimate: number
  }
  entitlements: {
    planId: PlanId
    planName: string
    features: string[]
    transactionFeeRate: number
  } | null
  temple: { name: string; nameHi: string | null; slug: string }
}

export default function DashboardPage() {
  const [data, setData] = useState<StatsPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/dashboard/stats?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const planId = (data?.entitlements?.planId || "FREE") as PlanId
  const has = (f: string) => data?.entitlements?.features?.includes(f)
  const slug = data?.temple?.slug || DEFAULT_TENANT_SLUG

  if (loading) {
    return (
      <div className="py-20 text-center text-stone-500">Loading live dashboard…</div>
    )
  }

  const s = data?.stats

  const cards = [
    {
      label: "Total donations",
      value: `₹${(s?.totalDonations || 0).toLocaleString("en-IN")}`,
      sub: `${s?.donationCount || 0} payments`,
      icon: IndianRupee,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "This month",
      value: `₹${(s?.monthDonations || 0).toLocaleString("en-IN")}`,
      sub: `${s?.monthDonationCount || 0} donations`,
      icon: IndianRupee,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Bookings",
      value: String(s?.totalBookings || 0),
      sub: `${s?.monthBookings || 0} this month · ${s?.pendingBookings || 0} pending`,
      icon: CalendarHeart,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Devotees engaged",
      value: String(s?.devotees || 0),
      sub: `${s?.visitsToday || 0} check-ins today`,
      icon: Users,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Hundi / cash today",
      value: `₹${(s?.cashToday || 0).toLocaleString("en-IN")}`,
      sub: "Offline collections",
      icon: Wallet,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: "Est. platform fees",
      value: `₹${(s?.platformFeesEstimate || 0).toLocaleString("en-IN")}`,
      sub: `${((data?.entitlements?.transactionFeeRate || 0.025) * 100).toFixed(1)}% on online total`,
      icon: Eye,
      color: "text-stone-600 bg-stone-50",
    },
  ]

  const actions = [
    { href: "/dashboard/money-desk", label: "Money desk", icon: Wallet, feature: "money_desk" },
    { href: "/dashboard/report", label: "Weekly report", icon: FileText, feature: "weekly_report" },
    { href: "/dashboard/poojas", label: "Manage sevas", icon: ListTree, feature: null },
    { href: "/dashboard/festival", label: "Festival board", icon: CalendarRange, feature: "festival_board" },
    { href: "/dashboard/posters", label: "QR posters", icon: QrCode, feature: "qr_posters" },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: Target, feature: "donation_campaigns" },
    { href: "/dashboard/team", label: "Team access", icon: Users, feature: null },
    { href: "/dashboard/settings", label: "Temple settings", icon: Settings, feature: null },
    { href: "/dashboard/ops", label: "Daily ops", icon: ClipboardList, feature: "daily_ops" },
    { href: "/dashboard/billing", label: "Billing / plan", icon: Zap, feature: null },
    { href: "/help", label: "Help & playbooks", icon: BookOpen, feature: null },
    { href: tenantPath(slug), label: "Public temple site", icon: ExternalLink, feature: null },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={data?.temple?.nameHi || data?.temple?.name || "Temple"}
        title="Live dashboard"
        description="Real numbers from donations, bookings, visits & cash ops — not placeholders."
        action={
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide bg-saffron-100 text-saffron-800 px-3 py-1.5 rounded-full self-center">
              {PLANS[planId].name}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => startProductTour("trustee")}
            >
              <Compass className="h-3.5 w-3.5" />
              Tour
            </Button>
            <Link href="/dashboard/billing">
              <Button size="sm" className="gap-1">
                <Zap className="h-3.5 w-3.5" />
                Plan
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-stone-500">{c.label}</span>
              <div className={`p-2 rounded-lg ${c.color}`}>
                <c.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-stone-900">{c.value}</p>
            <p className="text-xs text-stone-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          All controls
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {actions.map((a) => {
            const locked = a.feature && !has(a.feature)
            return (
              <Link
                key={a.href}
                href={locked ? "/dashboard/billing" : a.href}
                className="flex items-center gap-2 rounded-xl border bg-white p-3 hover:border-saffron-300 hover:shadow-sm transition-all text-sm"
              >
                <a.icon className="h-4 w-4 text-saffron-600 shrink-0" />
                <span className="font-medium flex-1 leading-tight">{a.label}</span>
                {locked ? (
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">
                    PLAN
                  </span>
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-stone-300" />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent donations</h2>
          <div className="surface-card overflow-hidden">
            <DonationsTable />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent bookings</h2>
          <div className="surface-card overflow-hidden">
            <BookingsTable />
          </div>
        </div>
      </div>

      <FeatureGate
        feature="gamification"
        allowed={Boolean(has("gamification"))}
        currentPlan={planId}
      >
        <GamificationSection />
      </FeatureGate>
    </div>
  )
}
