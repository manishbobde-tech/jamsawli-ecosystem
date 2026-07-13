"use client"

import type { ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Heart,
  CalendarHeart,
  Eye,
  LayoutDashboard,
  Wallet,
  FileBarChart,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useI18n } from "@/lib/i18n"
import { useOptionalTemple } from "@/hooks/useTemple"
import { tenantPath } from "@/lib/tenant-path"
import { cn } from "@/lib/utils"

/**
 * Tenant-only bottom nav (devotee + trustee desk).
 * Platform has its own PlatformBottomNav.
 */
export function MobileBottomNav() {
  const pathname = usePathname()
  const { t, locale } = useI18n()
  const { data: session } = useSession()
  const temple = useOptionalTemple()

  // Only on tenant routes
  const onTenant = pathname?.startsWith("/t/") || Boolean(temple?.templeSlug)
  if (!onTenant && !pathname?.startsWith("/dashboard")) {
    return null
  }

  // Trustee desk
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return (
      <nav className="bottom-nav fixed bottom-0 inset-x-0 z-50 lg:hidden glass-nav border-t no-print">
        <div className="flex items-stretch justify-around px-1 pt-1">
          <Tab
            href="/dashboard"
            icon={LayoutDashboard}
            label={locale === "hi" ? "डैशबोर्ड" : "Dash"}
            active={pathname === "/dashboard"}
          />
          <Tab
            href="/dashboard/money-desk"
            icon={Wallet}
            label={locale === "hi" ? "डेस्क" : "Desk"}
            active={Boolean(pathname?.includes("money-desk"))}
          />
          <Tab
            href="/dashboard/report"
            icon={FileBarChart}
            label={locale === "hi" ? "रिपोर्ट" : "Report"}
            active={Boolean(pathname?.includes("report"))}
          />
          <Tab
            href={temple?.templeSlug ? tenantPath(temple.templeSlug) : "/temples"}
            icon={Home}
            label={locale === "hi" ? "मंदिर" : "Temple"}
            active={false}
          />
        </div>
      </nav>
    )
  }

  const slug = temple?.templeSlug
  if (!slug) return null

  const primary = [
    { href: tenantPath(slug), icon: Home, label: locale === "hi" ? "होम" : "Home", match: "exact" as const },
    { href: tenantPath(slug, "/donate"), icon: Heart, label: t("donate"), match: "prefix" as const },
    { href: tenantPath(slug, "/book"), icon: CalendarHeart, label: t("book"), match: "prefix" as const },
    {
      href: tenantPath(slug, "/transparency"),
      icon: Eye,
      label: t("transparency"),
      match: "prefix" as const,
    },
    {
      href: session ? "/dashboard" : "/login",
      icon: LayoutDashboard,
      label: session ? (locale === "hi" ? "डैश" : "Dash") : t("login"),
      match: "prefix" as const,
    },
  ]

  return (
    <nav className="bottom-nav fixed bottom-0 inset-x-0 z-50 lg:hidden glass-nav border-t shadow-[0_-4px_24px_rgba(0,0,0,0.06)] no-print">
      <div className="flex items-stretch justify-around px-1 pt-1 max-w-lg mx-auto">
        {primary.map((item) => {
          const active =
            item.match === "exact"
              ? pathname === item.href || pathname === `${item.href}/`
              : pathname?.startsWith(item.href)
          return (
            <Tab
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={Boolean(active)}
            />
          )
        })}
      </div>
    </nav>
  )
}

function Tab({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[52px] touch-manipulation transition-colors",
        active ? "text-saffron-600" : "text-stone-500"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
          active && "bg-saffron-50 scale-105"
        )}
      >
        <Icon className={cn("h-5 w-5", active && "stroke-[2.25px]")} />
      </span>
      <span className={cn("text-[10px] font-medium leading-none", active && "font-semibold")}>
        {label}
      </span>
    </Link>
  )
}
