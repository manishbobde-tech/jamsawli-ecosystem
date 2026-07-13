"use client"

import { useCallback, useEffect, useState } from "react"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"

const STORAGE_KEY = "mandiros_staff_temple"

/** Staff console temple — default = pilot anchor (jamsawli-hanuman). */
export function useStaffTemple() {
  const [slug, setSlugState] = useState(DEFAULT_TENANT_SLUG)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSlugState(stored)
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  const setSlug = useCallback((next: string) => {
    const s = next.trim() || DEFAULT_TENANT_SLUG
    setSlugState(s)
    try {
      localStorage.setItem(STORAGE_KEY, s)
    } catch {
      /* ignore */
    }
  }, [])

  return { slug, setSlug, ready, isPilotDefault: slug === "jamsawli-hanuman" }
}
