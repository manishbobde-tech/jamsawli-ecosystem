"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { useOptionalTemple } from "@/hooks/useTemple"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session } = useSession()
  const { t, locale, toggleLocale } = useI18n()
  const temple = useOptionalTemple()
  const [open, setOpen] = useState(false)

  const brand =
    temple?.templeNameHi && locale === "hi"
      ? temple.templeNameHi
      : temple?.templeName || t("brand")

  const primaryLinks = [
    { href: "/donate", label: t("donate") },
    { href: "/book", label: t("book") },
    { href: "/transparency", label: t("transparency") },
    { href: "/pilgrim", label: t("pilgrim") },
  ]

  const secondaryLinks = [
    { href: "/demo", label: t("demo") },
    { href: "/for-trustees", label: t("forTrustees") },
    { href: "/pricing", label: t("pricing") },
    { href: "/temples", label: t("temples") },
    { href: "/platform", label: t("platform") },
  ]

  const role = (session?.user as { role?: string } | undefined)?.role
  const isStaff = role === "ADMIN" || role === "SUPER_ADMIN" || role === "TRUSTEE"

  return (
    <header className="glass-nav sticky top-0 z-50 pt-safe no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 min-w-0 shrink font-bold text-sacred-maroon touch-manipulation"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-sacred-maroon text-white text-sm shadow-md shadow-saffron-500/20">
            ॐ
          </span>
          <span className="truncate text-sm sm:text-base md:text-lg max-w-[40vw] sm:max-w-none">
            {brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-gray-200 mx-1" />
          {secondaryLinks.slice(0, 3).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2.5 py-2 text-sm text-gray-500 hover:text-saffron-600 rounded-lg transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="gap-1.5 text-sacred-maroon"
            aria-label="Toggle language"
          >
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
              <Button size="sm" className="btn-primary-glow">
                {t("login")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="h-10 w-10 p-0"
            aria-label="Language"
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile full menu sheet */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out border-t bg-white",
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <div className="px-4 py-4 space-y-1 overflow-y-auto max-h-[75vh] pb-safe">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-2 mb-1">
            {locale === "hi" ? "मुख्य" : "Primary"}
          </p>
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-3.5 rounded-xl text-base font-medium text-gray-900 hover:bg-saffron-50 active:bg-saffron-100"
            >
              {l.label}
            </Link>
          ))}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-2 pt-3 mb-1">
            {locale === "hi" ? "और" : "More"}
          </p>
          {secondaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full h-12 btn-primary-glow" size="lg">
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
                <Button className="w-full h-12 btn-primary-glow" size="lg">
                  {t("login")}
                </Button>
              </Link>
            )}
            <Link href="/demo" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full h-12 gap-2" size="lg">
                <Sparkles className="h-4 w-4" />
                Free vs Pro Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
