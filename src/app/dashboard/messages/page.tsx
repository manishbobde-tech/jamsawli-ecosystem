"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { tenantPath } from "@/lib/tenant-path"
import { Copy, MessageCircle } from "lucide-react"

const TEMPLATES = [
  {
    id: "donate",
    title: "Donate link (WhatsApp status / group)",
    body: (host: string, slug: string, name: string) =>
      `🙏 जय श्री हनुमान\n${name}\nदान करें (UPI / कार्ड):\n${host}${tenantPath(slug, "/donate")}\nपारदर्शिता: ${host}${tenantPath(slug, "/transparency")}\n— MandirOS`,
  },
  {
    id: "book",
    title: "Book pooja link",
    body: (host: string, slug: string, name: string) =>
      `🙏 ${name}\nघर बैठे पूजा / सेवा बुक करें:\n${host}${tenantPath(slug, "/book")}\nनाम, गोत्र, संकल्प भरें।`,
  },
  {
    id: "report",
    title: "Monday board report placeholder",
    body: () =>
      `📋 साप्ताहिक मंदिर रिपोर्ट\n(Open Dashboard → Weekly report → Share for live numbers)\nजय श्री हनुमान`,
  },
  {
    id: "welcome",
    title: "New devotee welcome",
    body: (host: string, slug: string, name: string) =>
      `स्वागत है 🙏\n${name} अब MandirOS पर है।\nदान: ${host}${tenantPath(slug, "/donate")}\nबुकिंग: ${host}${tenantPath(slug, "/book")}`,
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const [host, setHost] = useState("https://jamsawli-ecosystem.vercel.app")
  const slug = DEFAULT_TENANT_SLUG
  const name = "हमारा मंदिर"

  useEffect(() => {
    setHost(window.location.origin)
  }, [])

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "Paste into WhatsApp" })
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        eyebrow="Distribution"
        title="WhatsApp message templates"
        description="Copy-ready texts for status, groups, and board. Value: meet devotees where they already are — no extra app install."
      />

      <ul className="space-y-4">
        {TEMPLATES.map((t) => {
          const text = t.body(host, slug, name)
          return (
            <li key={t.id} className="surface-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sacred-maroon flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {t.title}
                  </p>
                  <pre className="mt-3 text-xs sm:text-sm whitespace-pre-wrap text-stone-700 bg-stone-50 rounded-xl p-3 border">
                    {text}
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1"
                  onClick={() => copy(text)}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
