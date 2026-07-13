"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/hooks/use-toast"
import { Users, UserPlus, Trash2, Copy } from "lucide-react"

interface Member {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  role: string
  createdAt: string
}

export default function TeamPage() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "ADMIN",
  })
  const [lastInvite, setLastInvite] = useState<{
    password?: string
    phone?: string | null
    email?: string | null
  } | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/team")
      if (res.ok) {
        const d = await res.json()
        setMembers(d.members || [])
      } else {
        const d = await res.json().catch(() => ({}))
        toast({
          title: "Cannot load team",
          description: d.message || "Need ADMIN/TRUSTEE role + organization",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setLastInvite(null)
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.message || "Invite failed")
      setLastInvite({
        password: d.temporaryPassword,
        phone: d.member?.phone,
        email: d.member?.email,
      })
      toast({ title: "Staff added", description: d.message })
      setForm({ name: "", phone: "", email: "", role: "ADMIN" })
      load()
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

  async function remove(userId: string) {
    if (!confirm("Remove this person's temple dashboard access?")) return
    const res = await fetch(`/api/admin/team?userId=${userId}`, { method: "DELETE" })
    if (res.ok) {
      toast({ title: "Access removed" })
      load()
    } else {
      const d = await res.json().catch(() => ({}))
      toast({
        title: "Failed",
        description: d.message || "Could not remove",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Temple controls"
        title="Team & access"
        description="Trustees control who can run money desk, reports, and settings. Remove staff the day they leave."
      />

      <form onSubmit={invite} className="surface-elevated p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-sacred-maroon font-semibold">
          <UserPlus className="h-5 w-5" />
          Invite staff
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <Label>Full name *</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
            />
          </div>
          <div className="space-y-1">
            <Label>Phone (India)</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="9876543210"
            />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="optional@temple.org"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Role</Label>
            <select
              className="flex h-12 w-full rounded-xl border border-stone-200 px-3 text-sm"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="ADMIN">ADMIN — manager / counter clerk</option>
              <option value="TRUSTEE">TRUSTEE — board / full temple controls</option>
            </select>
            <p className="text-xs text-stone-500 mt-1">
              Never grant platform SUPER_ADMIN to temple staff. Phone OTP login preferred.
            </p>
          </div>
        </div>
        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving…" : "Add to temple team"}
        </Button>

        {lastInvite?.password && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm">
            <p className="font-semibold text-amber-900">Temporary password (show once)</p>
            <p className="font-mono mt-1 text-lg">{lastInvite.password}</p>
            <p className="text-xs text-amber-800 mt-2">
              Login: /login · phone OTP preferred · or email/phone + this password
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-2 gap-1"
              onClick={() => {
                navigator.clipboard.writeText(lastInvite.password || "")
                toast({ title: "Copied password" })
              }}
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
          </div>
        )}
      </form>

      <section className="surface-card overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center gap-2 font-semibold text-stone-800">
          <Users className="h-4 w-4 text-saffron-600" />
          Current access
        </div>
        {loading ? (
          <p className="p-6 text-stone-500 text-sm">Loading…</p>
        ) : members.length === 0 ? (
          <p className="p-6 text-stone-500 text-sm">
            No staff found. Ensure your user has organizationId set (seed or super-admin).
          </p>
        ) : (
          <ul className="divide-y">
            {members.map((m) => (
              <li
                key={m.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium text-stone-900">{m.name || "—"}</p>
                  <p className="text-xs text-stone-500">
                    {m.role}
                    {m.phone ? ` · ${m.phone}` : ""}
                    {m.email ? ` · ${m.email}` : ""}
                  </p>
                </div>
                {m.role !== "SUPER_ADMIN" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1 text-red-700 border-red-200"
                    onClick={() => remove(m.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-stone-500">
        Full guides:{" "}
        <a href="/help" className="text-saffron-700 underline">
          /help
        </a>{" "}
        · Trustee & IT playbooks in repo <code>docs/guides/</code>
      </p>
    </div>
  )
}
