"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { FeatureGate } from "@/components/billing/feature-gate"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { PlanId } from "@/lib/plans"
import { CalendarRange } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Slot {
  time: string
  count: number
  max: number
  remaining: number
  full: boolean
  pct: number
}

interface BoardRow {
  poojaId: string
  name: string
  nameHi: string
  totalBooked: number
  maxPerSlot: number
  slots: Slot[]
}

export default function FestivalBoardPage() {
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(true)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [board, setBoard] = useState<BoardRow[]>([])
  const [totals, setTotals] = useState({ bookings: 0, sevas: 0 })
  const [loading, setLoading] = useState(true)
  const [templeName, setTempleName] = useState("")

  async function load(d: string) {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/festival?templeSlug=${DEFAULT_TENANT_SLUG}&date=${d}`
      )
      if (res.status === 402) {
        setAllowed(false)
        const ent = await fetch(
          `/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`
        ).then((r) => (r.ok ? r.json() : null))
        if (ent) setPlanId(ent.planId)
        return
      }
      if (res.ok) {
        const data = await res.json()
        setBoard(data.board || [])
        setTotals(data.totals || { bookings: 0, sevas: 0 })
        setTempleName(data.templeName || "")
        setPlanId(data.planId || "FREE")
        setAllowed(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(date)
  }, [date])

  if (!allowed) {
    return <FeatureGate feature="festival_board" allowed={false} currentPlan={planId} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Innovation · Growth+"
        title="Festival capacity board"
        description="Live fill rates for seva slots — run the day instead of guessing. Value: fewer overbook fights at the counter."
      />

      <div className="flex flex-wrap items-end gap-4 surface-card p-4">
        <div className="space-y-1">
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="text-sm text-stone-600">
          <p className="font-semibold text-sacred-maroon flex items-center gap-1">
            <CalendarRange className="h-4 w-4" />
            {templeName || "Temple"}
          </p>
          <p>
            {totals.bookings} bookings · {totals.sevas} active sevas
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-stone-500 py-12 text-center">Loading board…</p>
      ) : board.length === 0 ? (
        <p className="text-stone-500 py-12 text-center">
          No active sevas. Add poojas in seed/admin first.
        </p>
      ) : (
        <div className="space-y-6">
          {board.map((row) => (
            <div key={row.poojaId} className="surface-elevated p-4 sm:p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-bold text-lg text-sacred-maroon">
                    {row.nameHi || row.name}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {row.name} · {row.totalBooked} booked today · max {row.maxPerSlot}
                    /slot
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {row.slots.map((s) => (
                  <div
                    key={s.time}
                    className={`rounded-xl border p-2.5 text-center ${
                      s.full
                        ? "bg-red-50 border-red-200"
                        : s.pct >= 70
                          ? "bg-amber-50 border-amber-200"
                          : "bg-green-50/50 border-green-100"
                    }`}
                  >
                    <p className="text-[10px] font-medium text-stone-600">{s.time}</p>
                    <p className="text-lg font-bold text-stone-900">
                      {s.count}
                      <span className="text-xs font-normal text-stone-400">
                        /{s.max}
                      </span>
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-white/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.full ? "bg-red-500" : s.pct >= 70 ? "bg-amber-500" : "bg-green-500"
                        }`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] mt-1 text-stone-500">
                      {s.full ? "FULL" : `${s.remaining} left`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
