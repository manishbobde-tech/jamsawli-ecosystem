"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FundData {
  totalDonations: number
  donationCount: number
  categoryBreakdown: { category: string; amount: number; count: number }[]
  recentDonations: {
    id: string
    amount: number
    purpose: string | null
    createdAt: string
    donorName: string
  }[]
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

export function FundTracker() {
  const [data, setData] = useState<FundData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/transparency")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch transparency data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        लोड हो रहा है...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-red-500">
        डेटा लोड करने में त्रुटि
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">कुल दान</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sacred-maroon">
              {formatCurrency(data.totalDonations)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">कुल दाता</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sacred-maroon">
              {data.donationCount.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">श्रेणियां</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sacred-maroon">
              {data.categoryBreakdown.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sacred-maroon">श्रेणी अनुसार दान</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.categoryBreakdown.map((cat) => {
              const percentage = data.totalDonations > 0
                ? Math.round((cat.amount / data.totalDonations) * 100)
                : 0
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.category}</span>
                    <span className="text-gray-500">
                      {formatCurrency(cat.amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-saffron-400 to-saffron-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sacred-maroon">हाल के दान</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentDonations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                अभी तक कोई दान नहीं
              </p>
            ) : (
              data.recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{donation.donorName}</p>
                    <p className="text-sm text-gray-500">
                      {donation.purpose || "सामान्य दान"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sacred-maroon">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(donation.createdAt).toLocaleDateString("hi-IN")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}