"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StaffTempleSwitcher } from "@/components/dashboard/staff-temple-switcher"

const navItems = [
  { href: "/dashboard", label: "Dashboard", labelHi: "डैशबोर्ड" },
  { href: "/dashboard/pilot", label: "7-day pilot", labelHi: "पायलट" },
  { href: "/dashboard/money-desk", label: "Money desk", labelHi: "मनी डेस्क" },
  { href: "/dashboard/report", label: "Weekly report", labelHi: "रिपोर्ट" },
  { href: "/dashboard/team", label: "Team", labelHi: "टीम" },
  { href: "/dashboard/poojas", label: "Sevas", labelHi: "पूजा" },
  { href: "/dashboard/festival", label: "Festival board", labelHi: "त्योहार" },
  { href: "/dashboard/posters", label: "QR posters", labelHi: "QR" },
  { href: "/dashboard/campaigns", label: "Campaigns", labelHi: "अभियान" },
  { href: "/dashboard/settings", label: "Settings", labelHi: "सेटिंग" },
  { href: "/dashboard/messages", label: "WhatsApp texts", labelHi: "संदेश" },
  { href: "/dashboard/donations", label: "Donations", labelHi: "दान" },
  { href: "/dashboard/bookings", label: "Bookings", labelHi: "बुकिंग" },
  { href: "/dashboard/ops", label: "Daily ops", labelHi: "ops" },
  { href: "/dashboard/trust", label: "80G / 10BD", labelHi: "80G" },
  { href: "/dashboard/widgets", label: "Widgets", labelHi: "Widgets" },
  { href: "/dashboard/billing", label: "Billing", labelHi: "प्लान" },
  { href: "/help", label: "Help", labelHi: "सहायता" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === "loading") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Loading…
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50/40 to-gray-50">
      <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="font-bold text-sacred-maroon text-sm sm:text-base truncate block"
            >
              Trustee console
            </Link>
            <p className="text-[10px] text-gray-400 truncate max-w-[50vw]">
              {session.user?.name || session.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StaffTempleSwitcher />
            <Link href="/dashboard/pilot">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Pilot
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="h-9">
                Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Horizontal scroll nav — mobile & tablet */}
        <div className="lg:hidden border-t overflow-x-auto scrollbar-none">
          <div className="flex gap-1 px-2 py-2 min-w-max">
            {navItems.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-saffron-500 text-white shadow-sm"
                      : "bg-white border text-gray-600 hover:border-saffron-300"
                  )}
                >
                  {item.labelHi}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="surface-card p-2 sticky top-20 space-y-0.5">
              {navItems.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2.5 rounded-xl text-sm transition-colors",
                      active
                        ? "bg-saffron-50 text-saffron-800 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-sacred-maroon"
                    )}
                  >
                    <span className="block">{item.label}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      {item.labelHi}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 pb-4">{children}</main>
        </div>
      </div>
    </div>
  )
}
