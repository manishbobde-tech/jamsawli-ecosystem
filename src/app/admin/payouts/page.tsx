"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, CheckCircle, XCircle } from "lucide-react"

interface Payout {
  id: string
  amount: number
  periodStart: string
  periodEnd: string
  status: string
  bankAccountNo: string | null
  bankName: string | null
  transactionRef: string | null
  notes: string | null
  processedAt: string | null
  temple: { name: string }
  createdAt: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newPayout, setNewPayout] = useState({ templeId: "", amount: "", periodStart: "", periodEnd: "" })
  const [temples, setTemples] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payoutsRes, templesRes] = await Promise.all([
          fetch("/api/admin/payouts"),
          fetch("/api/admin/temples"),
        ])
        if (payoutsRes.ok) setPayouts((await payoutsRes.json()).payouts || [])
        if (templesRes.ok) setTemples((await templesRes.json()).temples || [])
      } catch (err) {
        console.error("Failed to load:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/payouts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templeId: newPayout.templeId,
        amount: Number(newPayout.amount),
        periodStart: new Date(newPayout.periodStart),
        periodEnd: new Date(newPayout.periodEnd),
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setPayouts((prev) => [data.payout, ...prev])
      setShowCreate(false)
      setNewPayout({ templeId: "", amount: "", periodStart: "", periodEnd: "" })
    }
  }

  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  }

  if (isLoading) return <div className="text-center py-20 text-gray-500">लोड हो रहा है...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sacred-maroon">भुगतान प्रबंधन</h1>
          <p className="text-gray-500 mt-1">Payout Management</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="bg-saffron-500 hover:bg-saffron-600">
          {showCreate ? "रद्द करें" : "नया भुगतान"}
        </Button>
      </div>

      {showCreate && (
        <Card className="p-4">
          <form onSubmit={handleCreate} className="grid md:grid-cols-5 gap-4">
            <select value={newPayout.templeId} onChange={(e) => setNewPayout((p) => ({ ...p, templeId: e.target.value }))} required className="px-3 py-2 border rounded-lg text-sm">
              <option value="">मंदिर चुनें</option>
              {temples.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input type="number" placeholder="राशि" value={newPayout.amount} onChange={(e) => setNewPayout((p) => ({ ...p, amount: e.target.value }))} required className="px-3 py-2 border rounded-lg text-sm" />
            <input type="date" value={newPayout.periodStart} onChange={(e) => setNewPayout((p) => ({ ...p, periodStart: e.target.value }))} required className="px-3 py-2 border rounded-lg text-sm" />
            <input type="date" value={newPayout.periodEnd} onChange={(e) => setNewPayout((p) => ({ ...p, periodEnd: e.target.value }))} required className="px-3 py-2 border rounded-lg text-sm" />
            <Button type="submit" className="bg-green-600 hover:bg-green-700">बनाएं</Button>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {payouts.map((payout) => (
          <Card key={payout.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{payout.temple.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusStyles[payout.status] || ""}`}>
                    {payout.status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-sacred-maroon mt-1">
                  ₹{payout.amount.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(payout.periodStart).toLocaleDateString("hi-IN")} — {new Date(payout.periodEnd).toLocaleDateString("hi-IN")}
                </p>
                {payout.bankName && <p className="text-xs text-gray-400">{payout.bankName} — {payout.bankAccountNo}</p>}
                {payout.transactionRef && <p className="text-xs text-gray-400">Ref: {payout.transactionRef}</p>}
              </div>
              <div className="flex gap-2">
                {payout.status === "PENDING" && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(payout.id, "PAID")}>
                      <CheckCircle className="w-4 h-4 mr-1" /> भुगतान किया
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateStatus(payout.id, "CANCELLED")}>
                      <XCircle className="w-4 h-4 mr-1" /> रद्द करें
                    </Button>
                  </>
                )}
                {payout.status === "PAID" && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 
                    {payout.processedAt ? new Date(payout.processedAt).toLocaleDateString("hi-IN") : "भुगतान किया"}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
        {payouts.length === 0 && <p className="text-center text-gray-500 py-10">कोई भुगतान नहीं</p>}
      </div>
    </div>
  )
}
