"use client"

import { useContext } from "react"
import { TempleContext, TempleContextType } from "@/lib/tenant-context"

export function useTemple(): TempleContextType {
  const context = useContext(TempleContext)
  if (!context) {
    throw new Error("useTemple must be used within a TenantProvider")
  }
  return context
}

export function useOptionalTemple(): TempleContextType | null {
  return useContext(TempleContext)
}
