"use client"

import { useSession } from "next-auth/react"
import { ReactNode } from "react"

interface RoleGateProps {
  children: ReactNode
  fallback?: ReactNode
  allowedRoles: string[]
}

export function RoleGate({ children, fallback = null, allowedRoles }: RoleGateProps) {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  if (allowedRoles.includes(role)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
