"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { CheckCircle2, IndianRupee, ClipboardList } from "lucide-react"
import { FeatureGate } from "@/components/billing/feature-gate"
import { PlanId } from "@/lib/plans"

interface ChecklistDef {
  key: string
  label: string
}

export default function OpsPage() {
  const { toast } = useToast()
  const templeSlug = DEFAULT_TENANT_SLUG
  const [defs, setDefs] = useState<ChecklistDef[]>([])
  const [items, setItems] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState("")
  const [completed, setCompleted] = useState(false)
  const [cashAmount, setCashAmount] = useState("")
  const [cashType, setCashType] = useState("HUNDI")
  const [cashNote, setCashNote] = useState("")
  const [todayTotal, setTodayTotal] = useState(0)
  const [entries, setEntries] = useState<
    Array<{ id: string; type: string; amount: number; note: string | null; collectedAt: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(true)
  const [denied, setDenied] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const ent = await fetch(`/api/temple/entitlements?templeSlug=${templeSlug}`).then((r) =>
        r.ok ? r.json() : null
      )
      if (ent) {
        setPlanId(ent.planId)
        const ok = (ent.features || []).includes("daily_ops")
        setAllowed(ok)
        if (!ok) {
          setDenied(true)
          setLoading(false)
          return
        }
      }

      const [cRes, kRes] = await Promise.all([
        fetch(`/api/admin/ops/checklist?templeSlug=${templeSlug}`),
        fetch(`/api/admin/ops/cash?templeSlug=${templeSlug}`),
      ])
      if (cRes.status === 402 || kRes.status === 402) {
        setDenied(true)
        setAllowed(false)
        return
      }
      if (cRes.ok) {
        const c = await cRes.json()
        setDefs(c.definitions || [])
        setItems(c.items || {})
        setNotes(c.notes || "")
        setCompleted(c.completed || false)
      }
      if (kRes.ok) {
        const k = await kRes.json()
        setTodayTotal(k.todayTotal || 0)
        setEntries(k.entries || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function saveChecklist() {
    const res = await fetch("/api/admin/ops/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templeSlug, items, notes }),
    })
    if (res.ok) {
      const data = await res.json()
      setCompleted(data.completed)
      toast({ title: "Checklist saved", description: data.completed ? "All items done ✓" : "Progress saved" })
    } else {
      toast({ title: "Error", description: "Could not save checklist", variant: "destructive" })
    }
  }

  async function addCash(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/ops/cash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templeSlug,
        amount: Number(cashAmount),
        type: cashType,
        note: cashNote,
      }),
    })
    if (res.ok) {
      toast({ title: "Cash logged", description: `₹${cashAmount} recorded` })
      setCashAmount("")
      setCashNote("")
      load()
    } else {
      const d = await res.json().catch(() => ({}))
      toast({ title: "Error", description: d.message || "Failed", variant: "destructive" })
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading ops…</div>
  }

  if (denied || !allowed) {
    return (
      <FeatureGate feature="daily_ops" allowed={false} currentPlan={planId}>
        {null}
      </FeatureGate>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
          <ClipboardList className="h-7 w-7" />
          Daily Ops / दैनिक संचालन
        </h1>
        <p className="text-gray-500 mt-1">
          Trustee checklist + hundi/counter cash — retention starts with daily ops.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today&apos;s checklist</h2>
            {completed && (
              <span className="inline-flex items-center gap-1 text-green-700 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" /> Complete
              </span>
            )}
          </div>
          <ul className="space-y-3">
            {defs.map((d) => (
              <li key={d.key}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-saffron-600"
                    checked={Boolean(items[d.key])}
                    onChange={(e) =>
                      setItems((prev) => ({ ...prev, [d.key]: e.target.checked }))
                    }
                  />
                  <span className="text-sm text-gray-800">{d.label}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2">
            <Label>Notes</Label>
            <textarea
              className="w-full border rounded-lg p-2 text-sm min-h-[80px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any issues for the board..."
            />
          </div>
          <Button className="mt-4 bg-saffron-500 hover:bg-saffron-600" onClick={saveChecklist}>
            Save checklist
          </Button>
        </section>

        <section className="bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <IndianRupee className="h-5 w-5 text-saffron-600" />
            Hundi / Counter cash
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Today&apos;s offline total:{" "}
            <strong className="text-sacred-maroon">
              ₹{todayTotal.toLocaleString("en-IN")}
            </strong>
          </p>

          <form onSubmit={addCash} className="space-y-3 border rounded-xl p-4 bg-saffron-50/40">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border px-3 text-sm"
                  value={cashType}
                  onChange={(e) => setCashType(e.target.value)}
                >
                  <option value="HUNDI">Hundi</option>
                  <option value="COUNTER">Counter</option>
                  <option value="PRASAD">Prasad sales</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Note</Label>
              <Input
                value={cashNote}
                onChange={(e) => setCashNote(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-600">
              Log cash entry
            </Button>
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent entries</h3>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {entries.length === 0 && (
                <li className="text-sm text-gray-400">No entries yet</li>
              )}
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between text-sm border-b border-gray-50 py-2"
                >
                  <span>
                    <span className="font-medium">{e.type}</span>
                    {e.note ? ` · ${e.note}` : ""}
                    <span className="block text-xs text-gray-400">
                      {new Date(e.collectedAt).toLocaleString("en-IN")}
                    </span>
                  </span>
                  <span className="font-semibold">₹{e.amount.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
