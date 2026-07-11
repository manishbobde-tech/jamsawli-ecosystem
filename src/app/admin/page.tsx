"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Building2, IndianRupee, CalendarHeart, Wallet } from "lucide-react"

interface Analytics {
  revenue: { totalRevenue: number; pending: number; thisMonth: number }
  temples: { total: number; active: number; premium: number; pendingApplications: number }
  bookings: { total: number; completed: number; pending: number; cancelled: number; thisMonth: number }
  donations: { total: number; completed: number; failed: number; refunded: number; thisMonth: number }
  users: { total: number; newThisMonth: number; byRole: Record<string, number> }
  platform: { totalPlatformFees: number; totalPremiumTemples: number }
  payouts: { totalPaidOut: number; pendingAmount: number }
}

export default function AdminPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics")
        if (res.ok) {
          setData(await res.json())
        }
      } catch (err) {
        console.error("Failed to load analytics:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">लोड हो रहा है...</div>
  }

  if (!data) {
    return <div className="text-center py-20 text-red-500">डेटा लोड करने में त्रुटि</div>
  }

  const stats = [
    { label: "कुल राजस्व", value: `₹${(data.revenue.totalRevenue).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
    { label: "इस महीने", value: `₹${(data.revenue.thisMonth).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "कुल मंदिर", value: data.temples.total.toString(), icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "सक्रिय मंदिर", value: data.temples.active.toString(), icon: Building2, color: "text-green-600", bg: "bg-green-50" },
    { label: "कुल बुकिंग", value: data.bookings.total.toString(), icon: CalendarHeart, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "कुल दान", value: data.donations.total.toString(), icon: Heart, color: "text-red-600", bg: "bg-red-50" },
    { label: "कुल उपयोगकर्ता", value: data.users.total.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "कुल भुगतान", value: `₹${(data.payouts.totalPaidOut).toLocaleString("en-IN")}`, icon: Wallet, color: "text-teal-600", bg: "bg-teal-50" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-sacred-maroon">एनालिटिक्स डैशबोर्ड</h1>
        <p className="text-gray-500 mt-1">Analytics Dashboard</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">त्वरित आँकड़े / Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">लंबित बुकिंग</span>
              <span className="font-semibold">{data.bookings.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">लंबित दान</span>
              <span className="font-semibold">{data.donations.total - data.donations.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">लंबित आवेदन</span>
              <span className="font-semibold">{data.temples.pendingApplications}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">लंबित भुगतान</span>
              <span className="font-semibold">₹{(data.payouts.pendingAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">प्रीमियम मंदिर</span>
              <span className="font-semibold">{data.platform.totalPremiumTemples}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">नए उपयोगकर्ता (इस महीने)</span>
              <span className="font-semibold">{data.users.newThisMonth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">उपयोगकर्ता भूमिकाएँ / User Roles</h2>
          <div className="space-y-3">
            {Object.entries(data.users.byRole).map(([role, count]) => (
              <div key={role} className="flex justify-between">
                <span className="text-gray-600">{role}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Heart(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
