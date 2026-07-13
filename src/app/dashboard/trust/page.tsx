"use client"

import { useEffect, useState, type InputHTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { TrustComplianceConfig } from "@/lib/trust-config"
import { FileText, Download } from "lucide-react"

const empty: TrustComplianceConfig = {
  trustLegalName: "",
  trustLegalNameHi: "",
  registrationNumber: "",
  eightyGNumber: "",
  eightyGValidFrom: "",
  eightyGValidTo: "",
  panNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  authorizedSignatory: "",
  contactEmail: "",
  contactPhone: "",
}

export default function TrustSettingsPage() {
  const { toast } = useToast()
  const [config, setConfig] = useState<TrustComplianceConfig>(empty)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [fy, setFy] = useState(() => {
    const now = new Date()
    const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
    return `${y}-${String((y + 1) % 100).padStart(2, "0")}`
  })

  useEffect(() => {
    fetch("/api/admin/trust-config")
      .then((r) => r.json())
      .then((d) => {
        if (d.config) setConfig({ ...empty, ...d.config })
        if (d.organizationId) setOrgId(d.organizationId)
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/trust-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config, organizationId: orgId }),
    })
    if (res.ok) {
      toast({ title: "Saved", description: "Trust / 80G config updated for receipts" })
    } else {
      toast({ title: "Error", description: "Could not save", variant: "destructive" })
    }
  }

  function field(
    key: keyof TrustComplianceConfig,
    label: string,
    props?: InputHTMLAttributes<HTMLInputElement>
  ) {
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <Input
          value={config[key] || ""}
          onChange={(e) => setConfig((c) => ({ ...c, [key]: e.target.value }))}
          {...props}
        />
      </div>
    )
  }

  if (loading) return <div className="py-12 text-center text-gray-500">Loading…</div>

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
          <FileText className="h-7 w-7" />
          Trust & 80G settings
        </h1>
        <p className="text-gray-500 mt-1">
          These numbers appear on donation receipts and Form 10BD export.
        </p>
      </div>

      <form onSubmit={save} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {field("trustLegalName", "Legal name (EN)", { required: true })}
          {field("trustLegalNameHi", "Legal name (HI)")}
          {field("registrationNumber", "Trust registration no.")}
          {field("eightyGNumber", "80G approval number")}
          {field("eightyGValidFrom", "80G valid from", { type: "date" })}
          {field("eightyGValidTo", "80G valid to", { type: "date" })}
          {field("panNumber", "Trust PAN", { className: "font-mono uppercase" })}
          {field("authorizedSignatory", "Authorized signatory")}
          {field("address", "Address")}
          {field("city", "City")}
          {field("state", "State")}
          {field("pincode", "Pincode")}
          {field("contactEmail", "Contact email", { type: "email" })}
          {field("contactPhone", "Contact phone")}
        </div>
        <Button type="submit" className="bg-saffron-500 hover:bg-saffron-600">
          Save trust config
        </Button>
      </form>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Form 10BD export</h2>
        <p className="text-sm text-gray-500 mb-4">
          CSV of completed donations for the selected Indian financial year
          (Apr–Mar). Use with your CA for income-tax filing.
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <Label>FY (e.g. 2025-26)</Label>
            <Input value={fy} onChange={(e) => setFy(e.target.value)} className="w-36" />
          </div>
          <a href={`/api/admin/compliance/10bd?fy=${encodeURIComponent(fy)}`}>
            <Button type="button" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
