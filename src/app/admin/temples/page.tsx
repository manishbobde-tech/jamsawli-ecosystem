"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Temple {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  isActive: boolean
  isPremium: boolean
  createdAt: string
}

interface Application {
  id: string
  templeName: string
  templeSlug: string
  contactName: string
  contactPhone: string
  city: string | null
  state: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

export default function AdminTemplesPage() {
  const [tab, setTab] = useState<"temples" | "applications">("temples")
  const [temples, setTemples] = useState<Temple[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templesRes, appsRes] = await Promise.all([
          fetch("/api/admin/temples"),
          fetch("/api/admin/applications"),
        ])
        if (templesRes.ok) setTemples((await templesRes.json()).temples || [])
        if (appsRes.ok) setApplications((await appsRes.json()).applications || [])
      } catch (err) {
        console.error("Failed to load:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    })
    if (res.ok) {
      const updated = await res.json()
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)))
    }
  }

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    })
    if (res.ok) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" as const } : a)))
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/temples/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    if (res.ok) {
      setTemples((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !isActive } : t)))
    }
  }

  if (isLoading) return <div className="text-center py-20 text-gray-500">लोड हो रहा है...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sacred-maroon">मंदिर प्रबंधन</h1>
          <p className="text-gray-500 mt-1">Temple Management</p>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setTab("temples")} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${tab === "temples" ? "bg-saffron-50 text-saffron-700 border-b-2 border-saffron-500" : "text-gray-500 hover:text-gray-700"}`}>
          मंदिर ({temples.length})
        </button>
        <button onClick={() => setTab("applications")} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${tab === "applications" ? "bg-saffron-50 text-saffron-700 border-b-2 border-saffron-500" : "text-gray-500 hover:text-gray-700"}`}>
          आवेदन ({applications.length})
        </button>
      </div>

      {tab === "temples" && (
        <div className="space-y-3">
          {temples.map((temple) => (
            <Card key={temple.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{temple.name}</h3>
                  {temple.isPremium && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">PREMIUM</span>}
                  <span className={`text-xs px-2 py-0.5 rounded ${temple.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {temple.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{temple.city}, {temple.state}</p>
                <p className="text-xs text-gray-400">/{temple.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(temple.id, temple.isActive)}>
                  {temple.isActive ? "निष्क्रिय करें" : "सक्रिय करें"}
                </Button>
              </div>
            </Card>
          ))}
          {temples.length === 0 && <p className="text-center text-gray-500 py-10">कोई मंदिर नहीं</p>}
        </div>
      )}

      {tab === "applications" && (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{app.templeName}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {app.contactName} — {app.contactPhone}
                  </p>
                  <p className="text-sm text-gray-400">{app.city}, {app.state}</p>
                  <p className="text-xs text-gray-400">/{app.templeSlug}</p>
                </div>
                {app.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(app.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> स्वीकृत
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleReject(app.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> अस्वीकृत
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
          {applications.length === 0 && <p className="text-center text-gray-500 py-10">कोई आवेदन नहीं</p>}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  }
  const labels = { PENDING: "लंबित", APPROVED: "स्वीकृत", REJECTED: "अस्वीकृत" }
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${styles[status as keyof typeof styles] || ""}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}
