"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { useToast } from "@/hooks/use-toast"
import { Code2, Copy } from "lucide-react"
import { FeatureGate } from "@/components/billing/feature-gate"
import { PlanId } from "@/lib/plans"

export default function WidgetsPage() {
  const { toast } = useToast()
  const [slug, setSlug] = useState(DEFAULT_TENANT_SLUG)
  const [type, setType] = useState<"donate" | "book">("donate")
  const [planId, setPlanId] = useState<PlanId>("FREE")
  const [allowed, setAllowed] = useState(false)
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"

  useEffect(() => {
    fetch(`/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setPlanId(d.planId)
          setAllowed((d.features || []).includes("embed_widgets"))
        }
      })
  }, [])

  const snippet = `<!-- MandirOS ${type} widget -->
<div id="mandiros-${type}"></div>
<script
  src="${origin}/widget.js"
  data-temple="${slug}"
  data-type="${type}"
  data-target="mandiros-${type}"
  data-height="${type === "book" ? "720" : "780"}"
  async
></script>`

  const iframe = `<iframe
  src="${origin}/embed/${type}?temple=${slug}"
  title="MandirOS ${type}"
  style="width:100%;max-width:480px;height:${type === "book" ? 720 : 780}px;border:0;border-radius:12px"
  loading="lazy"
  allow="payment *"
></iframe>`

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "Paste on your temple website" })
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-sacred-maroon flex items-center gap-2">
          <Code2 className="h-7 w-7" />
          Embed widgets
        </h1>
        <p className="text-gray-500 mt-1">
          Put donate / book on any existing temple website — distribution without migration.
        </p>
      </div>

      <FeatureGate feature="embed_widgets" allowed={allowed} currentPlan={planId}>
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Temple slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Widget type</Label>
            <select
              className="flex h-10 w-full rounded-md border px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as "donate" | "book")}
            >
              <option value="donate">Donate</option>
              <option value="book">Book pooja</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-sm">Script embed</h2>
            <Button size="sm" variant="outline" onClick={() => copy(snippet)}>
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
          </div>
          <pre className="text-xs bg-gray-900 text-green-100 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
            {snippet}
          </pre>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-sm">Iframe only</h2>
            <Button size="sm" variant="outline" onClick={() => copy(iframe)}>
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
            </Button>
          </div>
          <pre className="text-xs bg-gray-900 text-green-100 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
            {iframe}
          </pre>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm font-medium mb-3">Live preview</p>
          <iframe
            src={`/embed/${type}?temple=${encodeURIComponent(slug)}`}
            title="preview"
            className="w-full max-w-md h-[640px] border-0 rounded-xl bg-white"
          />
        </div>
      </div>
      </FeatureGate>
    </div>
  )
}
