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
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { TenantProvider } from "@/lib/tenant-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "जामसावली हनुमान लोक - Where Faith Meets Innovation",
  description: "चमत्कारिक श्री हनुमान मंदिर का डिजिटल पारिस्थितिकी तंत्र",
  keywords: ["jamsawli", "hanuman", "mandir", "temple", "donation", "booking"],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const templeSlug = headersList.get("x-tenant-slug")

  let templeData = null
  if (templeSlug) {
    const temple = await prisma.temple.findFirst({
      where: { slug: templeSlug },
      select: {
        id: true,
        slug: true,
        name: true,
        organizationId: true,
        organization: { select: { name: true } },
      },
    })
    if (temple) {
      templeData = {
        templeId: temple.id,
        templeSlug: temple.slug,
        templeName: temple.name,
        templeNameHi: temple.name,
        organizationId: temple.organizationId,
        organizationName: temple.organization.name,
      }
    }
  }

  return (
    <html lang="hi">
      <body className={inter.className}>
        <TenantProvider temple={templeData}>
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
        </TenantProvider>
      </body>
    </html>
  )
}
