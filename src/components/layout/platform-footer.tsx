"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { tenantPath } from "@/lib/tenant-path"

export function PlatformFooter() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  const product = [
    { href: "/pricing", label: hi ? "मूल्य" : "Pricing" },
    { href: "/features", label: hi ? "सुविधाएँ" : "Features" },
    { href: "/demo", label: hi ? "डेमो" : "Demo" },
    { href: "/for-trustees", label: hi ? "न्यासियों के लिए" : "For trustees" },
    { href: "/temples", label: hi ? "मंदिर" : "Temples" },
  ]

  const company = [
    { href: "/help", label: hi ? "सहायता" : "Help" },
    { href: "/case-study", label: hi ? "केस स्टडी" : "Case study" },
    { href: tenantPath(DEFAULT_TENANT_SLUG), label: hi ? "जामसावली" : "Jamsawli" },
    { href: "/admin/temples/new", label: hi ? "मंदिर जोड़ें" : "Add temple" },
  ]

  const legal = [
    { href: "/legal/terms", label: hi ? "सेवा की शर्तें" : "Terms" },
    { href: "/legal/privacy", label: hi ? "गोपनीयता" : "Privacy" },
    { href: "/legal/dpa", label: hi ? "DPA" : "DPA" },
    { href: "/legal/sla", label: hi ? "SLA" : "SLA" },
  ]

  return (
    <footer className="no-print border-t border-stone-200 bg-sacred-maroon text-white mt-auto">
      <div className="page-container py-10 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="font-bold text-lg tracking-tight">
              <span className="text-white">Mandir</span>
              <span className="text-saffron-300">OS</span>
            </p>
            <p className="mt-2 text-sm text-white/70 leading-relaxed max-w-xs">
              {hi
                ? "भारत के मंदिरों का डिजिटल ट्रस्ट लेयर — हर मंदिर एक टेनेन्ट।"
                : "Digital trust layer for temples across India — every temple is a tenant."}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-saffron-200 mb-3">
              {hi ? "उत्पाद" : "Product"}
            </p>
            <ul className="space-y-2 text-sm">
              {product.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-saffron-200 mb-3">
              {hi ? "कंपनी" : "Company"}
            </p>
            <ul className="space-y-2 text-sm">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-saffron-200 mb-3">
              {hi ? "कानूनी" : "Legal"}
            </p>
            <ul className="space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} MandirOS. All rights reserved.</p>
          <p>
            {hi
              ? "जामसावली एंकर टेनेन्ट है — प्लेटफ़ॉर्म नहीं।"
              : "Jamsawli is an anchor tenant — not the whole platform."}
          </p>
        </div>
      </div>
    </footer>
  )
}
