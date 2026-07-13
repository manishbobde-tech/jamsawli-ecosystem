"use client"

import { usePathname } from "next/navigation"
import { ProductTour } from "./product-tour"
import type { TourAudience } from "@/lib/tour-steps"

function audienceFromPath(pathname: string | null): TourAudience {
  if (!pathname) return "devotee"
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    return "trustee"
  }
  if (
    pathname.startsWith("/demo") ||
    pathname.startsWith("/platform") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/case-study")
  ) {
    return "sales"
  }
  return "devotee"
}

export function TourHost() {
  const pathname = usePathname()
  const audience = audienceFromPath(pathname)

  // Auto-start only on key entry pages (avoid annoying every navigation)
  const autoStart =
    pathname === "/" ||
    pathname === "/demo" ||
    pathname === "/dashboard" ||
    pathname === "/platform"

  return (
    <ProductTour
      key={audience}
      audience={audience}
      autoStart={autoStart}
      showLauncher
    />
  )
}
