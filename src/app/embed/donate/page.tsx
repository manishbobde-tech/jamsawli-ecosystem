import { DonationForm } from "@/components/donation/donation-form"
import { resolveTenantSlug, getActiveTempleBySlug } from "@/lib/tenant"

export const dynamic = "force-dynamic"

export default async function EmbedDonatePage({
  searchParams,
}: {
  searchParams: { temple?: string }
}) {
  const slug = await resolveTenantSlug(searchParams.temple)
  const temple = await getActiveTempleBySlug(slug)

  if (!temple) {
    return (
      <div className="p-6 text-center text-sm text-gray-600">
        Temple not found. Check <code>data-temple</code> slug.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-3 md:p-4">
      <div className="text-center mb-3">
        <p className="text-xs text-saffron-600 font-semibold uppercase tracking-wide">
          Donate securely
        </p>
        <h1 className="text-lg font-bold text-sacred-maroon">
          {temple.nameHi || temple.name}
        </h1>
      </div>
      <DonationForm templeId={temple.id} templeName={temple.nameHi || temple.name} />
      <p className="text-[10px] text-center text-gray-400 mt-4">
        Powered by MandirOS
      </p>
    </div>
  )
}
