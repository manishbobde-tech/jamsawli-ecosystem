import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDefaultTempleSlug } from "@/lib/tenant"
import { paymentStatusPayload } from "@/lib/payments"

export type PilotDay = {
  day: number
  title: string
  done: boolean
  notes?: string
  completedAt?: string
}

const DEFAULT_DAYS: Omit<PilotDay, "done">[] = [
  { day: 1, title: "Clerk logs first counter receipt (₹101 cash)" },
  { day: 2, title: "Second day money desk — morning + evening total" },
  { day: 3, title: "One online donate path tested (or documented blocked by Razorpay)" },
  { day: 4, title: "Seva booking with gotra + sankalp completed" },
  { day: 5, title: "Weekly report opened and shared (WhatsApp/print)" },
  { day: 6, title: "Transparency page shown to one trustee" },
  { day: 7, title: "Board decision: keep Free / upgrade Growth / pause" },
]

function readPilot(config: unknown): { days: PilotDay[]; startedAt?: string } {
  if (!config || typeof config !== "object") {
    return {
      days: DEFAULT_DAYS.map((d) => ({ ...d, done: false })),
    }
  }
  const p = (config as { pilot?: { days?: PilotDay[]; startedAt?: string } }).pilot
  if (!p?.days?.length) {
    return {
      days: DEFAULT_DAYS.map((d) => ({ ...d, done: false })),
      startedAt: p?.startedAt,
    }
  }
  // Merge with defaults so new days appear
  const byDay = new Map(p.days.map((d) => [d.day, d]))
  return {
    startedAt: p.startedAt,
    days: DEFAULT_DAYS.map((d) => {
      const prev = byDay.get(d.day)
      return {
        ...d,
        done: Boolean(prev?.done),
        notes: prev?.notes,
        completedAt: prev?.completedAt,
      }
    }),
  }
}

async function requireStaff() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "TRUSTEE" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return null
  }
  return user
}

export async function GET(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("templeSlug") || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({
    where: { slug },
    include: { subscription: true },
  })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const pilot = readPilot(temple.config)
  const payments = paymentStatusPayload()

  // Live activity signals for pilot truth
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [cashToday, donationsWeek, bookingsWeek] = await Promise.all([
    prisma.cashEntry.count({
      where: { templeId: temple.id, collectedAt: { gte: startOfToday } },
    }),
    prisma.donation.count({
      where: {
        templeId: temple.id,
        status: "COMPLETED",
        createdAt: { gte: weekAgo },
      },
    }),
    prisma.booking.count({
      where: {
        templeId: temple.id,
        createdAt: { gte: weekAgo },
        status: { not: "CANCELLED" },
      },
    }),
  ])

  const daysDone = pilot.days.filter((d) => d.done).length
  const success =
    daysDone >= 5 &&
    cashToday + donationsWeek > 0 &&
    (payments.onlineDonateReady || daysDone >= 3)

  return NextResponse.json({
    temple: {
      slug: temple.slug,
      name: temple.name,
      nameHi: temple.nameHi,
      plan: temple.subscription?.plan || temple.subscriptionPlan,
    },
    pilot,
    payments,
    activity: {
      cashEntriesToday: cashToday,
      completedDonations7d: donationsWeek,
      bookings7d: bookingsWeek,
    },
    score: {
      daysDone,
      daysTotal: pilot.days.length,
      pilotPassing: success,
      note: success
        ? "Pilot bar met — discuss paid plan with board."
        : "Keep using money desk daily until Day 7.",
    },
  })
}

export async function PUT(req: Request) {
  const staff = await requireStaff()
  if (!staff) return NextResponse.json({ message: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const slug = body.templeSlug || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({ where: { slug } })
  if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

  const prev =
    temple.config && typeof temple.config === "object"
      ? (temple.config as Record<string, unknown>)
      : {}
  const current = readPilot(temple.config)

  let days = current.days
  if (typeof body.day === "number") {
    days = days.map((d) =>
      d.day === body.day
        ? {
            ...d,
            done: body.done !== undefined ? Boolean(body.done) : !d.done,
            notes: body.notes !== undefined ? String(body.notes) : d.notes,
            completedAt:
              body.done === false
                ? undefined
                : d.completedAt || new Date().toISOString(),
          }
        : d
    )
  }

  const pilot = {
    startedAt: current.startedAt || new Date().toISOString(),
    days,
  }

  await prisma.temple.update({
    where: { id: temple.id },
    data: {
      config: {
        ...prev,
        pilot,
      } as object,
    },
  })

  return NextResponse.json({ pilot })
}
