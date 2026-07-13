"use client"

import { createContext, useContext, ReactNode } from "react"

export interface TempleContextType {
  templeId: string
  templeSlug: string
  templeName: string
  templeNameHi: string
  organizationId: string
  organizationName: string
}

const TempleContext = createContext<TempleContextType | null>(null)

interface TenantProviderProps {
  children: ReactNode
  temple: TempleContextType | null
}

export function TenantProvider({ children, temple }: TenantProviderProps) {
  return (
    <TempleContext.Provider value={temple}>
      {children}
    </TempleContext.Provider>
  )
}

export { TempleContext }
