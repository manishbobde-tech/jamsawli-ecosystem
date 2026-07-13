"use client"

import type { ReactNode } from "react"
import { PlatformNavbar } from "@/components/layout/platform-navbar"
import { PlatformFooter } from "@/components/layout/platform-footer"
import { TenantNavbar } from "@/components/layout/tenant-navbar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { PlatformBottomNav } from "@/components/layout/platform-bottom-nav"
import { PremiumShell } from "@/components/layout/premium-shell"
import { DemoBanner } from "@/components/demo/demo-banner"
import { TourHost } from "@/components/tour/tour-host"
import type { TempleContextType } from "@/lib/tenant-context"

type Shell = "platform" | "tenant" | "embed"

export function AppShell({
  shell,
  temple,
  children,
}: {
  shell: Shell
  temple: TempleContextType | null
  children: ReactNode
}) {
  if (shell === "embed") {
    return <div className="page-shell min-h-screen">{children}</div>
  }

  if (shell === "tenant") {
    return (
      <>
        <DemoBanner />
        <TenantNavbar />
        <div className="page-shell">{children}</div>
        <MobileBottomNav />
        <PremiumShell />
        <TourHost />
      </>
    )
  }

  // Platform (MandirOS)
  return (
    <>
      <PlatformNavbar />
      <div className="page-shell min-h-[60vh]">{children}</div>
      <PlatformFooter />
      <PlatformBottomNav />
      <TourHost />
    </>
  )
}
