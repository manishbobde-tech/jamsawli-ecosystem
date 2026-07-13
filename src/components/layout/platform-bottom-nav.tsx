"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Tags, FlaskConical, Building2, LayoutDashboard } from "lucide-react"
import { useSession } from "next-auth/react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { ComponentType } from "react"

export function PlatformBottomNav() {
  const pathname = usePathname()
  const { locale } = useI18n()
  const { data: session } = useSession()
  const hi = locale === "hi"

  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/t/")
  ) {
    return null
  }

  const items: {
    href: string
    icon: ComponentType<{ className?: string }>
    label: string
  }[] = [
    { href: "/", icon: Home, label: hi ? "होम" : "Home" },
    { href: "/pricing", icon: Tags, label: hi ? "मूल्य" : "Pricing" },
    { href: "/demo", icon: FlaskConical, label: hi ? "डेमो" : "Demo" },
    { href: "/temples", icon: Building2, label: hi ? "मंदिर" : "Temples" },
    {
      href: session ? "/dashboard" : "/login",
      icon: LayoutDashboard,
      label: session ? (hi ? "डैश" : "Dash") : hi ? "लॉगिन" : "Login",
    },
  ]

  return (
    <nav className="bottom-nav fixed bottom-0 inset-x-0 z-50 lg:hidden glass-nav border-t shadow-[0_-4px_24px_rgba(0,0,0,0.06)] no-print">
      <div className="flex items-stretch justify-around px-1 pt-1 max-w-lg mx-auto">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[52px] touch-manipulation",
                active ? "text-saffron-600" : "text-stone-500"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl",
                  active && "bg-saffron-50"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
