"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FlaskConical, ArrowLeftRight } from "lucide-react"
import { useOptionalTemple } from "@/hooks/useTemple"

const DEMO_SLUGS = new Set(["demo-free", "demo-pro"])

export function DemoBanner() {
  const temple = useOptionalTemple()
  const pathname = usePathname()
  const slug = temple?.templeSlug

  const parts = pathname?.split("/").filter(Boolean) || []
  const pathSlug = parts[0] === "t" ? parts[1] : parts[0]
  const effectiveSlug = slug || pathSlug || ""

  const isDemoTenant = DEMO_SLUGS.has(effectiveSlug)

  // Only on demo tenant sites, not platform /demo hub
  if (!isDemoTenant) return null
  if (pathname === "/demo") return null

  const planLabel =
    effectiveSlug === "demo-pro" ? "Trust Pro demo" : "Free demo"

  const other =
    effectiveSlug === "demo-pro"
      ? { href: "/t/demo-free", label: "Switch to Free" }
      : { href: "/t/demo-pro", label: "Switch to Trust Pro" }

  return (
    <div className="bg-indigo-950 text-white text-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-indigo-300" />
          <span>
            <strong>{planLabel}</strong>
            {" · "}
            Tenant sandbox · path <code className="text-indigo-200">/t/{effectiveSlug}</code>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={other.href}
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-indigo-200"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {other.label}
          </Link>
          <Link href="/demo" className="font-medium text-indigo-200 hover:text-white">
            Compare hub
          </Link>
          <Link href="/" className="text-indigo-300 hover:text-white">
            MandirOS
          </Link>
        </div>
      </div>
    </div>
  )
}
