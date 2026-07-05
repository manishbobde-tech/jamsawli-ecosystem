"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"
import { VoiceAssistant } from "@/components/voice/voice-assistant"
import { VoiceCommandPalette } from "@/components/voice/voice-command-palette"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
      <VoiceAssistant />
      <VoiceCommandPalette />
    </SessionProvider>
  )
}
