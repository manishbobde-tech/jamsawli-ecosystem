"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  HELP_ARTICLES,
  type HelpAudience,
  articlesFor,
} from "@/lib/help-content"
import { cn } from "@/lib/utils"

const FILTERS: { id: HelpAudience | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "employee", label: "Employees" },
  { id: "sales", label: "Sales" },
  { id: "cs", label: "Support / CS" },
  { id: "trustee", label: "Trustees" },
  { id: "clerk", label: "Counter clerks" },
  { id: "it", label: "Temple IT" },
]

export default function HelpCenterPage() {
  const [audience, setAudience] = useState<HelpAudience | "all">("all")
  const [q, setQ] = useState("")
  const [activeId, setActiveId] = useState(HELP_ARTICLES[0]?.id)

  const list = useMemo(() => {
    let items = articlesFor(audience)
    if (q.trim()) {
      const s = q.toLowerCase()
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(s) ||
          a.summary.toLowerCase().includes(s) ||
          a.body.some((b) => b.toLowerCase().includes(s))
      )
    }
    return items
  }, [audience, q])

  const active = list.find((a) => a.id === activeId) || list[0]

  return (
    <main className="gradient-hero min-h-[80vh]">
      <div className="page-container py-10 sm:py-14">
        <div className="max-w-3xl mb-8">
          <div className="chip mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            Company + temple operating system
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-sacred-maroon tracking-tight">
            Help & playbooks
          </h1>
          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
            Everything employees, trustees, clerks, and temple IT need to run MandirOS
            day to day — without digging through Git. Full docs also live in the repo under{" "}
            <code className="text-xs bg-white px-1.5 py-0.5 rounded border">docs/</code>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                className="pl-9"
                placeholder="Search playbooks…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAudience(f.id)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    audience === f.id
                      ? "bg-saffron-500 text-white border-saffron-500"
                      : "bg-white text-stone-600 border-stone-200 hover:border-saffron-300"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <nav className="surface-card p-2 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
              {list.length === 0 && (
                <p className="p-3 text-sm text-stone-500">No articles match.</p>
              )}
              {list.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveId(a.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors",
                    active?.id === a.id
                      ? "bg-saffron-50 text-saffron-900 font-semibold"
                      : "text-stone-700 hover:bg-stone-50"
                  )}
                >
                  {a.title}
                </button>
              ))}
            </nav>

            <div className="text-xs text-stone-500 space-y-1 px-1">
              <p className="font-semibold text-stone-700">Repo docs</p>
              <p>docs/COMPANY_PLAYBOOK.md</p>
              <p>docs/handbook/* · playbooks/* · guides/* · runbooks/*</p>
              <p>AGENTS.md · DESIGN.md · docs/PRD.md</p>
            </div>
          </aside>

          {/* Article */}
          <article className="flex-1 min-w-0 surface-elevated p-5 sm:p-8">
            {active ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron-600 mb-2">
                  {active.audience.filter((a) => a !== "all").join(" · ") || "Everyone"}
                </p>
                <h2 id={active.id} className="text-2xl font-bold text-sacred-maroon">
                  {active.title}
                </h2>
                <p className="mt-2 text-stone-600">{active.summary}</p>
                <ul className="mt-6 space-y-3">
                  {active.body.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-sm sm:text-base text-stone-800 leading-relaxed"
                    >
                      <span className="text-saffron-500 font-bold shrink-0">·</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {active.links && active.links.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {active.links.map((l) => (
                      <Link key={l.href} href={l.href}>
                        <Button variant="outline" size="sm" className="gap-1">
                          {l.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-stone-500">Select an article.</p>
            )}
          </article>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-3">
          {[
            {
              t: "Trustees",
              d: "Money desk, Monday report, team, 80G",
              href: "/dashboard",
            },
            {
              t: "Employees",
              d: "Sales demo, support triage, golden paths",
              href: "/help",
            },
            {
              t: "Add a temple",
              d: "Self-serve application for new tenants",
              href: "/admin/temples/new",
            },
          ].map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="surface-card p-4 hover:border-saffron-300 transition-colors"
            >
              <p className="font-semibold text-sacred-maroon">{c.t}</p>
              <p className="text-sm text-stone-500 mt-1">{c.d}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
