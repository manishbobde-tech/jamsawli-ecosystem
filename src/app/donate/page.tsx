import { DonationForm } from "@/components/donation/donation-form"
import { prisma } from "@/lib/prisma"

export default async function DonatePage() {
  const temple = await prisma.temple.findFirst({
    where: { slug: "jamsawli-hanuman" },
    select: { id: true },
  })

  if (!temple) {
    return <div className="text-center py-20">मंदिर नहीं मिला</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-8">
          दान करें
        </h1>
        <p className="text-center text-gray-600 mb-8">
          अपनी श्रद्धा अनुसार दान दें और पुण्य के भागी बनें
        </p>
        <DonationForm templeId={temple.id} />
      </div>
    </div>
  )
}
