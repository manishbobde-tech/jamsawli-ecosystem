"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { tenantPath } from "@/lib/tenant-path"

export function PlatformNavbar() {
  const { data: session } = useSession()
  const { locale, toggleLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const hi = locale === "hi"

  const links = [
    { href: "/pricing", label: hi ? "मूल्य" : "Pricing" },
    { href: "/features", label: hi ? "सुविधाएँ" : "Features" },
    { href: "/demo", label: hi ? "डेमो" : "Demo" },
    { href: "/for-trustees", label: hi ? "न्यासियों के लिए" : "For trustees" },
    { href: "/temples", label: hi ? "मंदिर" : "Temples" },
    { href: "/help", label: hi ? "सहायता" : "Help" },
  ]

  return (
    <header className="glass-nav sticky top-0 z-50 pt-safe no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 font-bold touch-manipulation">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-sacred-maroon text-white text-sm shadow-md shadow-saffron-500/20">
            M
          </span>
          <span className="text-base sm:text-lg tracking-tight">
            <span className="text-sacred-maroon">Mandir</span>
            <span className="text-saffron-600">OS</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-saffron-700 hover:bg-saffron-50 rounded-lg transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLocale} className="gap-1.5">
            <Globe className="h-4 w-4" />
            {locale === "hi" ? "EN" : "हिं"}
          </Button>
          <Link href={tenantPath(DEFAULT_TENANT_SLUG)}>
            <Button variant="outline" size="sm">
              {hi ? "जामसावली देखें" : "View Jamsawli"}
            </Button>
          </Link>
          {session ? (
            <Link href="/dashboard">
              <Button size="sm">{hi ? "डैशबोर्ड" : "Dashboard"}</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm">{hi ? "लॉगिन" : "Log in"}</Button>
            </Link>
          )}
          <Link href="/admin/temples/new">
            <Button size="sm" variant="sacred" className="gap-1">
              {hi ? "मंदिर जोड़ें" : "Add temple"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={toggleLocale}>
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t bg-white",
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <div className="px-4 py-4 space-y-1 pb-safe">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3.5 rounded-xl text-base font-medium text-stone-900 hover:bg-saffron-50"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2">
            <Link href={tenantPath(DEFAULT_TENANT_SLUG)} onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full h-12" size="lg">
                {hi ? "जामसावली टेनेन्ट" : "Open Jamsawli tenant"}
              </Button>
            </Link>
            <Link href="/admin/temples/new" onClick={() => setOpen(false)}>
              <Button className="w-full h-12" size="lg">
                {hi ? "अपना मंदिर जोड़ें" : "List your temple"}
              </Button>
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="secondary" className="w-full h-12" size="lg">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-12" size="lg" onClick={() => signOut()}>
                  Log out
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full h-12" size="lg">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
