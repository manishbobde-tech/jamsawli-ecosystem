"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NewTempleApplicationPage() {
  const [form, setForm] = useState({
    templeName: "",
    templeSlug: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || "कुछ गलत हो गया")
      }
    } catch {
      setError("सर्वर से कनेक्ट नहीं हो सका")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="text-6xl mb-4">🙏</div>
        <h1 className="text-2xl font-bold text-sacred-maroon mb-2">आवेदन सफल!</h1>
        <p className="text-gray-600 mb-6">आपका आवेदन प्राप्त हो गया है। हम जल्द ही समीक्षा करेंगे।</p>
        <Button onClick={() => setSuccess(false)} variant="outline">नया आवेदन</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-sacred-maroon mb-2">मंदिर पंजीकरण</h1>
      <p className="text-gray-500 mb-8">अपने मंदिर को हमारे प्लेटफॉर्म पर पंजीकृत करें / Register Your Temple</p>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-3">मंदिर की जानकारी / Temple Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">मंदिर का नाम *</label>
                <input name="templeName" value={form.templeName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL स्लग *</label>
                <input name="templeSlug" value={form.templeSlug} onChange={handleChange} required placeholder="mandir-naam" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">विवरण</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">पता</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">शहर</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">राज्य</label>
                <input name="state" value={form.state} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">पिन कोड</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">फ़ोन</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ईमेल</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">वेबसाइट</label>
                <input name="website" value={form.website} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-3">संपर्क जानकारी / Contact Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">संपर्क व्यक्ति *</label>
                <input name="contactName" value={form.contactName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">फ़ोन *</label>
                <input name="contactPhone" value={form.contactPhone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ईमेल</label>
                <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-saffron-500 hover:bg-saffron-600">
            {isSubmitting ? "भेज रहा है..." : "आवेदन जमा करें / Submit Application"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
