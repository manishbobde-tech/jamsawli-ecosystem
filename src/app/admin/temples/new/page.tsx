"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

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
    plan: "FREE",
  })
  const [slugTouched, setSlugTouched] = useState(false)
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === "templeName" && !slugTouched) {
        next.templeSlug = slugify(value)
      }
      return next
    })
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center px-4">
        <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-sacred-maroon mb-2">
          आवेदन सफल! / Application received
        </h1>
        <p className="text-gray-600 mb-2">
          We review within 2–3 business days. You will get your temple page, donate & book
          flows, and onboarding checklist.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Next: configure 80G numbers in Trust settings after approval.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/pricing">
            <Button variant="outline">View pricing</Button>
          </Link>
          <Link href="/case-study">
            <Button className="bg-saffron-500 hover:bg-saffron-600">Read Jamsawli case study</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <p className="text-saffron-600 text-sm font-semibold uppercase tracking-wide mb-1">
        MandirOS onboarding
      </p>
      <h1 className="text-2xl font-bold text-sacred-maroon mb-2">मंदिर पंजीकरण / List your temple</h1>
      <p className="text-gray-500 mb-6">
        Self-serve application · Free plan to start · Upgrade anytime.{" "}
        <Link href="/pricing" className="text-saffron-700 underline">
          See plans
        </Link>
      </p>

      <div className="grid grid-cols-3 gap-2 mb-8 text-center text-xs">
        {["1. Apply", "2. Verify", "3. Go live"].map((s, i) => (
          <div
            key={s}
            className={`rounded-lg border py-2 px-1 ${i === 0 ? "bg-saffron-50 border-saffron-200 font-semibold" : "bg-white text-gray-500"}`}
          >
            {s}
          </div>
        ))}
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-3">मंदिर की जानकारी / Temple Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">मंदिर का नाम *</label>
                <input
                  name="templeName"
                  value={form.templeName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL स्लग *</label>
                <input
                  name="templeSlug"
                  value={form.templeSlug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    handleChange(e)
                  }}
                  required
                  placeholder="mandir-naam"
                  className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  yoursite.com/{form.templeSlug || "slug"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">विवरण</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">पता</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
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
                <label className="block text-sm font-medium mb-1">Starting plan</label>
                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="FREE">Free</option>
                  <option value="GROWTH">Growth ₹2,499/mo</option>
                  <option value="TRUST_PRO">Trust Pro ₹7,999/mo</option>
                </select>
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
          <p className="text-xs text-center text-gray-400">
            By applying you agree to platform terms. Transaction fees apply per plan.
          </p>
        </form>
      </Card>
    </div>
  )
}
