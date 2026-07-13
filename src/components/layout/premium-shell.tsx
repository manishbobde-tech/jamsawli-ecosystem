"use client"

import { useEffect, useState } from "react"
import { HanumanAssistant } from "@/components/chatbot/hanuman-assistant"
import { VoiceAssistant } from "@/components/voice/voice-assistant"
import { VoiceCommandPalette } from "@/components/voice/voice-command-palette"
import { OfflineIndicator } from "@/components/offline/offline-indicator"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"

/**
 * Renders innovative UI chrome based on temple plan entitlements.
 * Free: offline only. Growth+: nothing extra in chrome. Trust Pro: AI + voice.
 * Local knowledge chatbot still works for all via API soft-degrade.
 */
export function PremiumShell({ forceAll = false }: { forceAll?: boolean }) {
  const [features, setFeatures] = useState<string[]>(forceAll ? ["ai_chatbot", "voice_assistant"] : [])

  useEffect(() => {
    if (forceAll) return
    fetch(`/api/temple/entitlements?templeSlug=${DEFAULT_TENANT_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.features) setFeatures(d.features)
        // Always show assistant bubble — API soft-degrades for lower plans
        else setFeatures(["ai_chatbot"])
      })
      .catch(() => setFeatures(["ai_chatbot"]))
  }, [forceAll])

  const ai = features.includes("ai_chatbot") || true // always show entry; gated answers
  const voice = features.includes("voice_assistant")

  return (
    <>
      {ai && <HanumanAssistant />}
      {voice && (
        <>
          <VoiceAssistant />
          <VoiceCommandPalette />
        </>
      )}
      <OfflineIndicator />
    </>
  )
}
