"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStaffTemple } from "@/hooks/useStaffTemple"
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  AlertTriangle,
  IndianRupee,
  FileBarChart,
  ShieldCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type PilotDay = {
  day: number
  title: string
  done: boolean
  notes?: string
  completedAt?: string
}

type PilotPayload = {
  temple: { slug: string; name: string; nameHi: string | null; plan: string }
  pilot: { days: PilotDay[]; startedAt?: string }
  payments: {
    mode: string
    onlineDonateReady: boolean
    moneyDeskReady: boolean
    message: string
    setup: string[]
  }
  activity: {
    cashEntriesToday: number
    completedDonations7d: number
    bookings7d: number
  }
  score: {
    daysDone: number
    daysTotal: number
    pilotPassing: boolean
    note: string
  }
}

export default function PilotPage() {
  const { slug, ready, setSlug } = useStaffTemple()
  const { toast } = useToast()
  const [data, setData] = useState<PilotPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!ready) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/pilot?templeSlug=${slug}`)
      if (res.ok) setData(await res.json())
      else setData(null)
    } finally {
      setLoading(false)
    }
  }, [slug, ready])

  useEffect(() => {
    load()
  }, [load])

  async function toggleDay(day: number, done: boolean) {
    setToggling(day)
    try {
      const res = await fetch("/api/admin/pilot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templeSlug: slug, day, done }),
      })
      if (!res.ok) throw new Error("Save failed")
      await load()
      toast({ title: done ? `Day ${day} done` : `Day ${day} reopened` })
    } catch {
      toast({ title: "Could not save", variant: "destructive" })
    } finally {
      setToggling(null)
    }
  }

  if (!ready || loading) {
    return <div className="py-16 text-center text-stone-500">Loading pilot…</div>
  }

  if (!data) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-red-600">Could not load pilot for {slug}</p>
        <Button
          onClick={() => {
            setSlug("jamsawli-hanuman")
            window.location.reload()
          }}
        >
          Switch to Jamsawli pilot
        </Button>
      </div>
    )
  }

  const { temple, pilot, payments, activity, score } = data

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
          <ClipboardList className="h-7 w-7" />
          7-day temple pilot
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Honest path: one temple, money desk habit, then board decision — not more demos.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Pilot temple</p>
            <p className="text-lg font-bold text-sacred-maroon">
              {temple.nameHi || temple.name}
            </p>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{temple.slug}</p>
            <p className="text-xs text-stone-500 mt-1">Plan: {temple.plan}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-saffron-600">
              {score.daysDone}/{score.daysTotal}
            </p>
            <p className="text-xs text-stone-500">days checked</p>
          </div>
        </div>
        <p
          className={cn(
            "mt-3 text-sm rounded-xl px-3 py-2",
            score.pilotPassing
              ? "bg-green-50 text-green-800 border border-green-100"
              : "bg-amber-50 text-amber-900 border border-amber-100"
          )}
        >
          {score.note}
        </p>
        {slug !== "jamsawli-hanuman" && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setSlug("jamsawli-hanuman")
              window.location.reload()
            }}
          >
            Use Jamsawli (recommended pilot)
          </Button>
        )}
      </div>

      {/* Payment honesty */}
      <div
        className={cn(
          "rounded-2xl border p-5",
          payments.onlineDonateReady
            ? "bg-green-50/50 border-green-200"
            : "bg-amber-50/80 border-amber-200"
        )}
      >
        <h2 className="font-semibold flex items-center gap-2 text-stone-900">
          {payments.onlineDonateReady ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          )}
          Online payments (Razorpay)
        </h2>
        <p className="text-sm mt-2 text-stone-700">{payments.message}</p>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
          <li className="flex gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            Money desk (counter): ready
          </li>
          <li className="flex gap-2">
            {payments.onlineDonateReady ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
            )}
            Online donate: {payments.onlineDonateReady ? "ready" : "blocked until keys"}
          </li>
        </ul>
        {!payments.onlineDonateReady && (
          <ol className="mt-3 list-decimal pl-5 text-xs text-stone-600 space-y-1">
            {payments.setup.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        )}
        <p className="text-xs text-stone-500 mt-3">
          Status API:{" "}
          <Link href="/api/health/payments" className="text-saffron-700 underline" target="_blank">
            /api/health/payments
          </Link>
        </p>
      </div>

      {/* Live activity */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-white p-3 text-center">
          <p className="text-2xl font-bold text-teal-700">{activity.cashEntriesToday}</p>
          <p className="text-[10px] text-stone-500">cash logs today</p>
        </div>
        <div className="rounded-xl border bg-white p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{activity.completedDonations7d}</p>
          <p className="text-[10px] text-stone-500">donations 7d</p>
        </div>
        <div className="rounded-xl border bg-white p-3 text-center">
          <p className="text-2xl font-bold text-sacred-maroon">{activity.bookings7d}</p>
          <p className="text-[10px] text-stone-500">bookings 7d</p>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-2">
        <h2 className="font-semibold text-sacred-maroon">Daily checklist</h2>
        {pilot.days.map((d) => (
          <button
            key={d.day}
            type="button"
            disabled={toggling === d.day}
            onClick={() => toggleDay(d.day, !d.done)}
            className={cn(
              "w-full text-left rounded-xl border p-4 flex gap-3 items-start transition-colors",
              d.done
                ? "bg-green-50/80 border-green-200"
                : "bg-white hover:border-saffron-300"
            )}
          >
            {d.done ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-5 w-5 text-stone-300 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-semibold text-stone-400">Day {d.day}</p>
              <p className="font-medium text-stone-900 text-sm sm:text-base">{d.title}</p>
              {d.completedAt && (
                <p className="text-[10px] text-stone-400 mt-1">
                  {new Date(d.completedAt).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link href="/dashboard/money-desk">
          <Button className="w-full gap-1 h-11">
            <IndianRupee className="h-4 w-4" /> Money desk
          </Button>
        </Link>
        <Link href="/dashboard/report">
          <Button variant="outline" className="w-full gap-1 h-11">
            <FileBarChart className="h-4 w-4" /> Weekly report
          </Button>
        </Link>
        <Link href={`/t/${temple.slug}/transparency`} target="_blank">
          <Button variant="outline" className="w-full gap-1 h-11">
            <ShieldCheck className="h-4 w-4" /> Transparency
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed">
        Full runbook:{" "}
        <code className="bg-stone-100 px-1 rounded">docs/runbooks/PILOT_7_DAY.md</code>
        . Do not create more demo temples until this pilot has a board decision.
      </p>
    </div>
  )
}
