"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { BarChart3, Building2, IndianRupee, Wallet, CalendarHeart, Heart, ChevronRight, ShieldAlert } from "lucide-react"
import { redirect } from "next/navigation"

const sidebarLinks = [
  { href: "/admin", label: "एनालिटिक्स", labelEn: "Analytics", icon: BarChart3 },
  { href: "/admin/temples", label: "मंदिर", labelEn: "Temples", icon: Building2 },
  { href: "/admin/pricing", label: "मूल्य निर्धारण", labelEn: "Pricing", icon: IndianRupee },
  { href: "/admin/payouts", label: "भुगतान", labelEn: "Payouts", icon: Wallet },
  { href: "/dashboard/bookings", label: "बुकिंग", labelEn: "Bookings", icon: CalendarHeart },
  { href: "/dashboard/donations", label: "दान", labelEn: "Donations", icon: Heart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">लोड हो रहा है...</div>
  }

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-sacred-maroon">एडमिन पैनल</h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-saffron-50 text-saffron-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                <span className="text-xs text-gray-400 ml-auto">{link.labelEn}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
