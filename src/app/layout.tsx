import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/layout/navbar"
import { ServiceWorkerProvider } from "@/components/providers-sw"
import { HanumanAssistant } from "@/components/chatbot/hanuman-assistant"
import { VoiceAssistant } from "@/components/voice/voice-assistant"
import { VoiceCommandPalette } from "@/components/voice/voice-command-palette"
import { OfflineIndicator } from "@/components/offline/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "जामसावली हनुमान लोक - Where Faith Meets Innovation",
  description: "चमत्कारिक श्री हनुमान मंदिर का डिजिटल पारिस्थितिकी तंत्र",
  keywords: ["jamsawli", "hanuman", "mandir", "temple", "donation", "booking"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body className={inter.className}>
        <ServiceWorkerProvider>
          <Providers>
            <Navbar />
            {children}
            <HanumanAssistant />
            <VoiceAssistant />
            <VoiceCommandPalette />
            <OfflineIndicator />
          </Providers>
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}
