import { DonationForm } from "@/components/donation/donation-form"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ShieldCheck, FileText, Heart } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DonatePage({
  params,
}: {
  params: { slug: string }
}) {
  const temple = await prisma.temple.findFirst({
    where: { slug: params.slug, isActive: true },
    select: {
      id: true,
      name: true,
      nameHi: true,
      slug: true,
      city: true,
      state: true,
    },
  })

  if (!temple) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xl text-gray-700 mb-4">मंदिर नहीं मिला / Temple not found</p>
        <Link href="/temples" className="text-saffron-600 font-medium hover:underline">
          Browse temple directory →
        </Link>
      </div>
    )
  }

  return (
    <div className="gradient-hero py-8 sm:py-12">
      <div className="page-container max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <p className="chip mx-auto mb-3 w-fit">Secure donation · सुरक्षित दान</p>
          <h1 className="section-title font-hindi">दान करें</h1>
          <p className="mt-1 text-base sm:text-lg text-gray-600">Donate with trust</p>
          <p className="mt-2 text-base sm:text-lg font-medium text-gray-800">
            {temple.nameHi || temple.name}
          </p>
          {(temple.city || temple.state) && (
            <p className="text-sm text-gray-500">
              {[temple.city, temple.state].filter(Boolean).join(", ")}
            </p>
          )}
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            अपनी श्रद्धा अनुसार दान दें। पारदर्शिता{" "}
            <Link
              href={`/t/${temple.slug}/transparency`}
              className="text-saffron-700 font-medium underline underline-offset-2"
            >
              फंड ट्रैकर
            </Link>{" "}
            पर देखें।
          </p>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto scrollbar-none pb-1">
          {[
            { icon: Heart, title: "UPI · Cards", body: "Secure checkout" },
            { icon: FileText, title: "80G ready", body: "PAN on receipt" },
            { icon: ShieldCheck, title: "Transparent", body: "Public ledger" },
          ].map((item) => (
            <div
              key={item.title}
              className="min-w-[70%] sm:min-w-0 rounded-2xl bg-white border border-saffron-100 px-4 py-3 flex gap-3 items-start shadow-soft shrink-0"
            >
              <div className="h-9 w-9 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-saffron-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <DonationForm
          templeId={temple.id}
          templeName={temple.nameHi || temple.name}
        />

        <p className="mt-6 sm:mt-8 text-center text-[11px] sm:text-xs text-gray-500 max-w-lg mx-auto leading-relaxed px-2">
          Tax benefits under Section 80G apply only where the trust holds a valid
          registration. Verify with your CA. Receipts issue for completed payments.
        </p>
      </div>
    </div>
  )
}
