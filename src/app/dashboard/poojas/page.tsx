"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { Plus, Trash2, Pencil } from "lucide-react"

interface Pooja {
  id: string
  name: string
  nameHi: string
  description: string | null
  price: number
  duration: number
  maxPerSlot: number
  isActive: boolean
}

export default function PoojasAdminPage() {
  const { toast } = useToast()
  const [poojas, setPoojas] = useState<Pooja[]>([])
  const [maxPoojas, setMaxPoojas] = useState<number | null>(null)
  const [planId, setPlanId] = useState("FREE")
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: "",
    nameHi: "",
    price: "501",
    duration: "60",
    maxPerSlot: "20",
    description: "",
  })
  const [editId, setEditId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/poojas?templeSlug=${DEFAULT_TENANT_SLUG}`
      )
      if (res.ok) {
        const d = await res.json()
        setPoojas(d.poojas || [])
        setMaxPoojas(d.maxPoojas ?? null)
        setPlanId(d.planId || "FREE")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      templeSlug: DEFAULT_TENANT_SLUG,
      name: form.name,
      nameHi: form.nameHi || form.name,
      price: Number(form.price),
      duration: Number(form.duration),
      maxPerSlot: Number(form.maxPerSlot),
      description: form.description,
    }

    const res = await fetch("/api/admin/poojas", {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { id: editId, ...payload } : payload),
    })
    const d = await res.json()
    if (!res.ok) {
      toast({
        title: "Error",
        description: d.message || "Failed",
        variant: "destructive",
      })
      return
    }
    toast({ title: editId ? "Seva updated" : "Seva created" })
    setForm({
      name: "",
      nameHi: "",
      price: "501",
      duration: "60",
      maxPerSlot: "20",
      description: "",
    })
    setEditId(null)
    load()
  }

  async function deactivate(id: string) {
    if (!confirm("Deactivate this seva? (history kept)")) return
    await fetch(`/api/admin/poojas?id=${id}`, { method: "DELETE" })
    load()
  }

  function startEdit(p: Pooja) {
    setEditId(p.id)
    setForm({
      name: p.name,
      nameHi: p.nameHi,
      price: String(p.price),
      duration: String(p.duration),
      maxPerSlot: String(p.maxPerSlot),
      description: p.description || "",
    })
  }

  const active = poojas.filter((p) => p.isActive).length

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Temple catalogue"
        title="Sevas / Poojas"
        description={`Manage what devotees can book. Plan: ${planId}${
          maxPoojas != null ? ` · max ${maxPoojas} active (Free)` : " · unlimited"
        }. Active: ${active}`}
      />

      <form onSubmit={save} className="surface-elevated p-5 space-y-3">
        <p className="font-semibold text-sacred-maroon flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {editId ? "Edit seva" : "Add seva"}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Name (EN) *</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Name (HI)</Label>
            <Input
              value={form.nameHi}
              onChange={(e) => setForm((f) => ({ ...f, nameHi: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Price ₹ *</Label>
            <Input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Duration (min)</Label>
            <Input
              type="number"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Max per slot (festival capacity)</Label>
            <Input
              type="number"
              value={form.maxPerSlot}
              onChange={(e) => setForm((f) => ({ ...f, maxPerSlot: e.target.value }))}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit">{editId ? "Save changes" : "Create seva"}</Button>
          {editId && (
            <Button type="button" variant="outline" onClick={() => setEditId(null)}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <ul className="space-y-2">
          {poojas.map((p) => (
            <li
              key={p.id}
              className={`surface-card p-4 flex flex-wrap justify-between gap-3 ${
                !p.isActive ? "opacity-50" : ""
              }`}
            >
              <div>
                <p className="font-semibold text-sacred-maroon">
                  {p.nameHi || p.name}
                  {!p.isActive && (
                    <span className="ml-2 text-xs text-stone-400">inactive</span>
                  )}
                </p>
                <p className="text-sm text-stone-500">
                  {p.name} · ₹{p.price.toLocaleString("en-IN")} · {p.duration} min · max{" "}
                  {p.maxPerSlot}/slot
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                {p.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-700"
                    onClick={() => deactivate(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
