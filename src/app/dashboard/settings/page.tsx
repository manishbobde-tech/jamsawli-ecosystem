"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function TempleSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    nameHi: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    primaryColor: "#ea580c",
    secondaryColor: "#7f1d1d",
    slug: DEFAULT_TENANT_SLUG,
  })

  useEffect(() => {
    fetch(`/api/admin/temple-settings?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.temple) {
          const t = d.temple
          setForm({
            name: t.name || "",
            nameHi: t.nameHi || "",
            description: t.description || "",
            address: t.address || "",
            city: t.city || "",
            state: t.state || "",
            pincode: t.pincode || "",
            phone: t.phone || "",
            email: t.email || "",
            website: t.website || "",
            primaryColor: t.primaryColor || "#ea580c",
            secondaryColor: t.secondaryColor || "#7f1d1d",
            slug: t.slug || DEFAULT_TENANT_SLUG,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/temple-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templeSlug: form.slug, ...form }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.message || "Failed")
      toast({ title: "Saved", description: "Temple profile updated" })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-stone-500 py-12">Loading…</p>

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Temple controls"
        title="Temple profile & branding"
        description="Name, address, colors for your tenant site. Public URL stays /t/{slug}."
        action={
          <Link href={`/t/${form.slug}`}>
            <Button variant="outline" size="sm">
              View public site
            </Button>
          </Link>
        }
      />

      <form onSubmit={save} className="surface-elevated p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sacred-maroon">
          <Settings className="h-5 w-5" />
          Profile
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {(
            [
              ["name", "Name (EN)"],
              ["nameHi", "Name (HI)"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
              ["website", "Website"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="space-y-1 sm:col-span-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-stone-200 px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Primary color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-14 h-12 p-1"
                value={form.primaryColor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, primaryColor: e.target.value }))
                }
              />
              <Input
                value={form.primaryColor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, primaryColor: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Secondary color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-14 h-12 p-1"
                value={form.secondaryColor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, secondaryColor: e.target.value }))
                }
              />
              <Input
                value={form.secondaryColor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, secondaryColor: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-stone-500">
          Slug (URL): <code className="bg-stone-100 px-1 rounded">/t/{form.slug}</code> —
          contact MandirOS to change slug.
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save temple profile"}
        </Button>
      </form>
    </div>
  )
}
