"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IndianRupee, Save } from "lucide-react"

interface TempleConfig {
  templeId: string
  templeName: string
  platformFee: number
  premiumListingFee: number
  premiumListingActive: boolean
  plan: string
}

export default function AdminPricingPage() {
  const [configs, setConfigs] = useState<TempleConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [pricingRes, subsRes] = await Promise.all([
          fetch("/api/admin/pricing"),
          fetch("/api/admin/subscriptions"),
        ])
        const pricingData = pricingRes.ok ? await pricingRes.json() : { configs: [] }
        const subsData = subsRes.ok ? await subsRes.json() : { subscriptions: [] }

        const subMap = new Map(subsData.subscriptions?.map((s: any) => [s.templeId, s.plan || "FREE"]))

        const merged = (pricingData.configs || []).map((c: any) => ({
          templeId: c.templeId,
          templeName: c.temple?.name || "Unknown",
          platformFee: Number(c.platformFee),
          premiumListingFee: Number(c.premiumListingFee),
          premiumListingActive: c.premiumListingActive,
          plan: subMap.get(c.templeId) || "FREE",
        }))
        setConfigs(merged)
      } catch (err) {
        console.error("Failed to load:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConfigs()
  }, [])

  const updateConfig = async (templeId: string, updates: Partial<TempleConfig>) => {
    setSavingId(templeId)
    try {
      const res = await fetch(`/api/admin/pricing/${templeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformFee: updates.platformFee,
          premiumListingFee: updates.premiumListingFee,
          premiumListingActive: updates.premiumListingActive,
        }),
      })
      if (res.ok) {
        setConfigs((prev) => prev.map((c) => (c.templeId === templeId ? { ...c, ...updates } : c)))
      }
    } catch (err) {
      console.error("Failed to update:", err)
    } finally {
      setSavingId(null)
    }
  }

  if (isLoading) return <div className="text-center py-20 text-gray-500">लोड हो रहा है...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sacred-maroon">मूल्य निर्धारण</h1>
        <p className="text-gray-500 mt-1">Platform Fee Configuration</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        यहाँ आप प्रत्येक मंदिर के लिए प्लेटफॉर्म शुल्क निर्धारित कर सकते हैं। प्लेटफॉर्म शुल्क एक निश्चित मासिक शुल्क है।
      </div>

      <div className="space-y-3">
        {configs.map((config) => (
          <Card key={config.templeId} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">{config.templeName}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${config.plan === "PREMIUM" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                  {config.plan}
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => updateConfig(config.templeId, config)}
                disabled={savingId === config.templeId}
                className="bg-saffron-500 hover:bg-saffron-600"
              >
                <Save className="w-4 h-4 mr-1" />
                {savingId === config.templeId ? "सेव..." : "सेव करें"}
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">प्लेटफॉर्म शुल्क (मासिक)</label>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={config.platformFee}
                    onChange={(e) => setConfigs((prev) => prev.map((c) => (c.templeId === config.templeId ? { ...c, platformFee: Number(e.target.value) } : c)))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">प्रीमियम लिस्टिंग शुल्क (मासिक)</label>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={config.premiumListingFee}
                    onChange={(e) => setConfigs((prev) => prev.map((c) => (c.templeId === config.templeId ? { ...c, premiumListingFee: Number(e.target.value) } : c)))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id={`premium-${config.templeId}`}
                  checked={config.premiumListingActive}
                  onChange={(e) => setConfigs((prev) => prev.map((c) => (c.templeId === config.templeId ? { ...c, premiumListingActive: e.target.checked } : c)))}
                  className="rounded"
                />
                <label htmlFor={`premium-${config.templeId}`} className="text-sm">प्रीमियम लिस्टिंग सक्रिय</label>
              </div>
            </div>
          </Card>
        ))}
        {configs.length === 0 && <p className="text-center text-gray-500 py-10">कोई कॉन्फ़िगरेशन नहीं</p>}
      </div>
    </div>
  )
}
