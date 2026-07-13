"use client"

import { useEffect, useMemo, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { FeatureGate } from "@/components/billing/feature-gate"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { tenantPath } from "@/lib/tenant-path"
import { PlanId } from "@/lib/plans"
import { Printer, QrCode } from "lucide-react"

type PosterType = "home" | "donate" | "book" | "checkin"

const TYPES: { id: PosterType; label: string; labelHi: string; blurb: string }[] = [
  {
    id: "home",
    label: "Temple home",
    labelHi: "मंदिर होम",
    blurb: "Main temple page on MandirOS",
  },
  {
    id: "donate",
    label: "Donate",
    labelHi: "दान",
    blurb: "Gate / hundi board — scan to give",
  },
  {
    id: "book",
    label: "Book seva",
    labelHi: "पूजा बुकिंग",
    blurb: "Festival desk QR",
  },
  {
    id: "checkin",
    label: "Darshan check-in",
    labelHi: "दर्शन चेक-इन",
    blurb: "Entry gate scan",
  },
]

export default function PostersPage() {
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(true)
  const [slug, setSlug] = useState(DEFAULT_TENANT_SLUG)
  const [type, setType] = useState<PosterType>("donate")
  const [templeName, setTempleName] = useState("Temple")
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch(`/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        setPlanId(d.planId)
        setAllowed((d.features || []).includes("qr_posters"))
        if (d.templeSlug) setSlug(d.templeSlug)
      })
    fetch(`/api/v1/temple?slug=${DEFAULT_TENANT_SLUG}`).catch(() => {})
    // name from entitlements isn't full — fetch public if needed
    fetch(`/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan?.name) {
          /* keep */
        }
      })
  }, [])

  useEffect(() => {
    // Lightweight name: use slug prettified if no API
    setTempleName(
      slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    )
  }, [slug])

  const pathMap: Record<PosterType, string> = {
    home: tenantPath(slug),
    donate: tenantPath(slug, "/donate"),
    book: tenantPath(slug, "/book"),
    checkin: tenantPath(slug, "/checkin"),
  }

  const url = useMemo(() => {
    if (!origin) return pathMap[type]
    return `${origin}${pathMap[type]}`
  }, [origin, slug, type])

  const meta = TYPES.find((t) => t.id === type)!

  if (!allowed) {
    return <FeatureGate feature="qr_posters" allowed={false} currentPlan={planId} />
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        eyebrow="Innovation · Free+"
        title="QR posters"
        description="Print gate posters for donate, booking, and check-in. No designer needed — scan opens the right tenant page."
        action={
          <Button className="gap-1" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print poster
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 no-print">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`px-3 py-2 rounded-full text-sm font-medium border ${
              type === t.id
                ? "bg-saffron-500 text-white border-saffron-500"
                : "bg-white text-stone-600 border-stone-200"
            }`}
          >
            {t.labelHi} · {t.label}
          </button>
        ))}
      </div>

      <div
        id="poster-print"
        className="surface-elevated p-8 sm:p-12 text-center max-w-lg mx-auto print:shadow-none print:border-0"
      >
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-saffron-400 to-sacred-maroon text-white flex items-center justify-center text-lg font-bold">
            ॐ
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-saffron-600">
          MandirOS · {meta.labelHi}
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-sacred-maroon">
          {templeName}
        </h2>
        <p className="mt-1 text-stone-500 text-sm">{meta.blurb}</p>

        <div className="mt-8 flex justify-center">
          <div className="p-4 bg-white rounded-2xl border-2 border-saffron-100 inline-block">
            <QRCodeSVG value={url} size={220} level="M" includeMargin />
          </div>
        </div>

        <p className="mt-6 text-sm font-medium text-stone-800">
          स्कैन करें · Scan with any phone camera
        </p>
        <p className="mt-2 text-[10px] sm:text-xs font-mono text-stone-400 break-all px-2">
          {url}
        </p>
        <p className="mt-8 text-xs text-stone-400">Powered by MandirOS</p>
      </div>

      <p className="text-xs text-stone-500 no-print flex items-start gap-2">
        <QrCode className="h-4 w-4 shrink-0 mt-0.5" />
        Value: devotees never type long URLs. Print on A4, laminate at gates / hundi /
        parking.
      </p>
    </div>
  )
}
