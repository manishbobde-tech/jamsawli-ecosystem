import type { Metadata, Viewport } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ServiceWorkerProvider } from "@/components/providers-sw"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { TenantProvider } from "@/lib/tenant-context"
import { AppShell } from "@/components/layout/app-shell"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7ed" },
    { media: "(prefers-color-scheme: dark)", color: "#7f1d1d" },
  ],
}

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  "https://jamsawli-ecosystem.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MandirOS — Digital trust layer for temples",
    template: "%s · MandirOS",
  },
  description:
    "MandirOS helps temples take UPI donations, book sevas, run a counter money desk, and share public fund transparency. Spin up any temple as a tenant.",
  applicationName: "MandirOS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MandirOS",
  },
  formatDetection: { telephone: true },
  openGraph: {
    title: "MandirOS — Digital trust layer for temples",
    description:
      "Multi-tenant temple platform: donate, book, money desk, weekly reports, transparency.",
    locale: "en_IN",
    type: "website",
    url: siteUrl,
  },
  manifest: "/manifest.json",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const templeSlug = headersList.get("x-tenant-slug")
  const shell = headersList.get("x-shell") || "platform"
  const isEmbedShell =
    headersList.get("x-embed-shell") === "1" || shell === "embed"

  let templeData = null
  let temple: {
    id: string
    slug: string
    name: string
    nameHi: string | null
    primaryColor: string | null
    secondaryColor: string | null
    organizationId: string
    organization: { name: string }
  } | null = null

  if (templeSlug) {
    try {
      temple = await prisma.temple.findFirst({
        where: { slug: templeSlug, isActive: true },
        select: {
          id: true,
          slug: true,
          name: true,
          nameHi: true,
          primaryColor: true,
          secondaryColor: true,
          organizationId: true,
          organization: { select: { name: true } },
        },
      })
      if (temple) {
        templeData = {
          templeId: temple.id,
          templeSlug: temple.slug,
          templeName: temple.name,
          templeNameHi: temple.nameHi || temple.name,
          organizationId: temple.organizationId,
          organizationName: temple.organization.name,
        }
      }
    } catch {
      /* build-time DB may be down */
    }
  }

  const themeStyles = temple?.primaryColor
    ? ({
        "--theme-primary": temple.primaryColor,
        "--theme-secondary": temple.secondaryColor || temple.primaryColor,
      } as React.CSSProperties)
    : undefined

  return (
    <html
      lang="en"
      style={themeStyles}
      className={cn(inter.variable, notoDevanagari.variable)}
    >
      <body
        className={cn(
          inter.className,
          "font-sans",
          isEmbedShell && "embed-shell"
        )}
      >
        <TenantProvider temple={templeData}>
          <ServiceWorkerProvider>
            <Providers>
              <AppShell
                shell={
                  isEmbedShell
                    ? "embed"
                    : shell === "tenant" || templeData
                      ? "tenant"
                      : "platform"
                }
                temple={templeData}
              >
                {children}
              </AppShell>
            </Providers>
          </ServiceWorkerProvider>
        </TenantProvider>
      </body>
    </html>
  )
}
