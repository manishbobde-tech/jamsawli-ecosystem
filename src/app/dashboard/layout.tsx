"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "डैशबोर्ड" },
  { href: "/dashboard/donations", label: "दान" },
  { href: "/dashboard/bookings", label: "बुकिंग" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">लोड हो रहा है...</div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-sacred-maroon">
            जामसावली एडमिन
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user?.name || session.user?.email}</span>
            <Link href="/">
              <Button variant="outline" size="sm">होमपेज</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 rounded-lg hover:bg-saffron-50 text-gray-700 hover:text-sacred-maroon"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
