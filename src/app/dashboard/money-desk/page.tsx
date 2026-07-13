"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { FeatureGate } from "@/components/billing/feature-gate"
import { PlanId } from "@/lib/plans"
import { IndianRupee, Printer, Wallet } from "lucide-react"

export default function MoneyDeskPage() {
  const { toast } = useToast()
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(true)
  const [loading, setLoading] = useState(true)
  const [today, setToday] = useState({ cash: 0, online: 0, total: 0, cashCount: 0, onlineCount: 0 })
  const [amount, setAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [purpose, setPurpose] = useState("सामान्य दान")
  const [mode, setMode] = useState("CASH")
  const [want80G, setWant80G] = useState(false)
  const [pan, setPan] = useState("")
  const [lastReceipt, setLastReceipt] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const ent = await fetch(
        `/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`
      ).then((r) => (r.ok ? r.json() : null))
      if (ent) {
        setPlanId(ent.planId)
        setAllowed((ent.features || []).includes("money_desk"))
      }
      const res = await fetch(
        `/api/admin/money-desk?templeSlug=${DEFAULT_TENANT_SLUG}`
      )
      if (res.status === 402) {
        setAllowed(false)
        return
      }
      if (res.ok) {
        const d = await res.json()
        setToday(d.today)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/money-desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templeSlug: DEFAULT_TENANT_SLUG,
          amount: Number(amount),
          donorName,
          purpose,
          mode,
          want80G,
          panNumber: pan,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed")
      setLastReceipt(data.receiptUrl)
      toast({
        title: "✓ दर्ज",
        description: `₹${amount} · Receipt ${data.donation?.receiptNumber}`,
      })
      setAmount("")
      setDonorName("")
      load()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Loading money desk…</div>
  }

  if (!allowed) {
    return <FeatureGate feature="money_desk" allowed={false} currentPlan={planId} />
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
          <Wallet className="h-7 w-7" />
          Counter Money Desk
        </h1>
        <p className="text-gray-500 mt-1">
          10-second counter receipt — the reason clerks open MandirOS every day.
          Cash + UPI counter both create a real donation receipt.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">Counter today</p>
          <p className="text-xl font-bold text-teal-700">
            ₹{today.cash.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-gray-400">{today.cashCount} entries</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">Online today</p>
          <p className="text-xl font-bold text-blue-700">
            ₹{today.online.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-gray-400">{today.onlineCount} payments</p>
        </div>
        <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-4">
          <p className="text-xs text-saffron-800">Total today</p>
          <p className="text-xl font-bold text-sacred-maroon">
            ₹{today.total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Amount (₹) *</Label>
            <Input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label>Mode</Label>
            <select
              className="flex h-10 w-full rounded-md border px-3 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="UPI_COUNTER">UPI (counter QR)</option>
              <option value="CARD_COUNTER">Card at counter</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label>Devotee name</Label>
            <Input
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1">
            <Label>Purpose</Label>
            <Input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="General / bhandara / construction"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={want80G}
            onChange={(e) => setWant80G(e.target.checked)}
            className="mt-1"
          />
          <span>
            80G receipt needed
            {want80G && (
              <Input
                className="mt-2 font-mono uppercase"
                placeholder="PAN ABCDE1234F"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                maxLength={10}
              />
            )}
          </span>
        </label>

        <Button
          type="submit"
          disabled={saving}
          className="w-full h-12 text-base bg-saffron-500 hover:bg-saffron-600 gap-2"
        >
          <IndianRupee className="h-5 w-5" />
          {saving ? "Saving…" : "Record & issue receipt"}
        </Button>

        {lastReceipt && (
          <Link href={lastReceipt} target="_blank">
            <Button type="button" variant="outline" className="w-full gap-2">
              <Printer className="h-4 w-4" />
              Print last receipt
            </Button>
          </Link>
        )}
      </form>

      <p className="text-xs text-gray-500">
        This is the product temples pay to keep. Not AI. Not gamification.{" "}
        <strong>Daily money control.</strong>
      </p>
    </div>
  )
}
