"use client"

import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"
import { useStaffTemple } from "@/hooks/useStaffTemple"

type TempleOpt = { slug: string; name: string }

const FALLBACK: TempleOpt[] = [
  { slug: "jamsawli-hanuman", name: "Jamsawli Hanuman (pilot)" },
  { slug: "demo-full", name: "Demo showcase" },
  { slug: "demo-pro", name: "Demo Trust Pro" },
  { slug: "demo-free", name: "Demo Free" },
]

export function StaffTempleSwitcher() {
  const { slug, setSlug, ready } = useStaffTemple()
  const [options, setOptions] = useState<TempleOpt[]>(FALLBACK)

  useEffect(() => {
    fetch("/api/admin/temples?limit=50")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const list = d?.temples || d?.data || []
        if (Array.isArray(list) && list.length) {
          setOptions(
            list.map((t: { slug: string; name: string; nameHi?: string }) => ({
              slug: t.slug,
              name: t.nameHi || t.name,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  if (!ready) return null

  return (
    <label className="flex items-center gap-1.5 text-xs text-stone-600">
      <Building2 className="h-3.5 w-3.5 shrink-0 text-saffron-600" />
      <span className="hidden sm:inline text-stone-400">Temple</span>
      <select
        className="max-w-[9.5rem] sm:max-w-[14rem] h-8 rounded-lg border border-stone-200 bg-white px-2 text-xs font-medium text-stone-800"
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value)
          // Reload current dashboard page data for new temple
          window.location.reload()
        }}
        aria-label="Staff temple"
      >
        {options.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
        {!options.some((o) => o.slug === slug) && (
          <option value={slug}>{slug}</option>
        )}
      </select>
    </label>
  )
}
