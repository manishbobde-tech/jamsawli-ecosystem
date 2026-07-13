"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Globe, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { useOptionalTemple } from "@/hooks/useTemple"
import { tenantPath } from "@/lib/tenant-path"
import { cn } from "@/lib/utils"

export function TenantNavbar() {
  const { data: session } = useSession()
  const { t, locale, toggleLocale } = useI18n()
  const temple = useOptionalTemple()
  const [open, setOpen] = useState(false)
  const slug = temple?.templeSlug || ""

  const brand =
    temple?.templeNameHi && locale === "hi"
      ? temple.templeNameHi
      : temple?.templeName || t("brand")

  const tp = (path: string) => (slug ? tenantPath(slug, path) : path)

  const primaryLinks = [
    { href: tp("/donate"), label: t("donate") },
    { href: tp("/book"), label: t("book") },
    { href: tp("/transparency"), label: t("transparency") },
    { href: tp("/pilgrim"), label: t("pilgrim") },
  ]

  const role = (session?.user as { role?: string } | undefined)?.role
  const isStaff = role === "ADMIN" || role === "SUPER_ADMIN" || role === "TRUSTEE"

  return (
    <header className="glass-nav sticky top-0 z-50 pt-safe no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/"
            className="hidden sm:flex items-center text-xs text-stone-400 hover:text-saffron-700 shrink-0"
            title="MandirOS"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-semibold">
              Mandir<span className="text-saffron-600">OS</span>
            </span>
          </Link>
          <Link
            href={slug ? tenantPath(slug) : "/"}
            className="flex items-center gap-2 min-w-0 font-bold text-sacred-maroon touch-manipulation"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-sacred-maroon text-white text-sm shadow-md shrink-0">
              ॐ
            </span>
            <span className="truncate text-sm sm:text-base max-w-[42vw] sm:max-w-xs">
              {brand}
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg"
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
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  {t("dashboard")}
                </Button>
              </Link>
              {isStaff && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    {t("admin")}
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">{t("login")}</Button>
            </Link>
          )}
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
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-xs font-semibold text-saffron-700"
          >
            ← MandirOS platform
          </Link>
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3.5 rounded-xl text-base font-medium hover:bg-saffron-50"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full h-12" size="lg">
                    {t("dashboard")}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                  onClick={() => signOut()}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button className="w-full h-12" size="lg">
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
