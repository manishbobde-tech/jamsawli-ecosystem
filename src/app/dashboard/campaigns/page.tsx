"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/ui/page-header"
import { FeatureGate } from "@/components/billing/feature-gate"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { PlanId } from "@/lib/plans"
import { useToast } from "@/hooks/use-toast"
import { Target, Trash2 } from "lucide-react"

interface Campaign {
  id: string
  title: string
  titleHi?: string
  target: number
  raised?: number
  description?: string
}

export default function CampaignsPage() {
  const { toast } = useToast()
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [title, setTitle] = useState("")
  const [target, setTarget] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const ent = await fetch(
        `/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`
      ).then((r) => (r.ok ? r.json() : null))
      if (ent) {
        setPlanId(ent.planId)
        setAllowed((ent.features || []).includes("donation_campaigns"))
      }
      const res = await fetch(
        `/api/admin/campaigns?templeSlug=${DEFAULT_TENANT_SLUG}`
      )
      if (res.ok) {
        const d = await res.json()
        setCampaigns(d.campaigns || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templeSlug: DEFAULT_TENANT_SLUG,
        title,
        target: Number(target),
      }),
    })
    const d = await res.json()
    if (!res.ok) {
      toast({ title: "Error", description: d.message, variant: "destructive" })
      if (res.status === 402) setAllowed(false)
      return
    }
    toast({ title: "Campaign created" })
    setTitle("")
    setTarget("")
    load()
  }

  async function remove(id: string) {
    await fetch(
      `/api/admin/campaigns?id=${id}&templeSlug=${DEFAULT_TENANT_SLUG}`,
      { method: "DELETE" }
    )
    load()
  }

  if (!allowed) {
    return (
      <FeatureGate feature="donation_campaigns" allowed={false} currentPlan={planId} />
    )
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Innovation · Growth+"
        title="Donation campaigns"
        description="Public goals for bhandara, construction, annadan. Value: social proof that moves donors."
      />

      <form onSubmit={add} className="surface-elevated p-5 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Campaign title</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bhandara 2026"
            />
          </div>
          <div className="space-y-1">
            <Label>Target ₹</Label>
            <Input
              required
              type="number"
              min="1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="500000"
            />
          </div>
        </div>
        <Button type="submit">Create campaign</Button>
      </form>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {campaigns.map((c) => {
            const raised = c.raised || 0
            const pct = Math.min(100, Math.round((raised / c.target) * 100))
            return (
              <li key={c.id} className="surface-card p-4">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sacred-maroon flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {c.titleHi || c.title}
                    </p>
                    <p className="text-sm text-stone-500 mt-1">
                      ₹{raised.toLocaleString("en-IN")} / ₹
                      {c.target.toLocaleString("en-IN")} ({pct}%)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(c.id)}
                    className="text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-3 h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-saffron-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            )
          })}
          {campaigns.length === 0 && (
            <p className="text-stone-500 text-sm">No campaigns yet.</p>
          )}
        </ul>
      )}
    </div>
  )
}
