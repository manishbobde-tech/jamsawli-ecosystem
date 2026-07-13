import Link from "next/link"
import { MapPin, ArrowRight, Building2 } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function TemplesPage() {
  let temples: Array<{
    id: string
    name: string
    nameHi: string | null
    slug: string
    city: string | null
    state: string | null
    description: string | null
    isPremium: boolean
    subscriptionPlan: string
  }> = []

  try {
    temples = await prisma.temple.findMany({
      where: { isActive: true },
      orderBy: [{ isPremium: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        nameHi: true,
        slug: true,
        city: true,
        state: true,
        description: true,
        isPremium: true,
        subscriptionPlan: true,
      },
    })
  } catch {
    temples = []
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-wide mb-1">
              MandirOS Directory
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-sacred-maroon">
              मंदिर निर्देशिका / Temple Directory
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              Discover temples on the platform. Donate, book sevas, and follow public transparency.
            </p>
          </div>
          <Link href="/admin/temples/new">
            <Button className="bg-saffron-500 hover:bg-saffron-600">
              <Building2 className="mr-2 h-4 w-4" />
              List your temple
            </Button>
          </Link>
        </div>

        {temples.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <Building2 className="h-10 w-10 text-saffron-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-900">No temples listed yet</h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Seed the database or apply to list the first temple. Jamsawli Hanuman Lok is the anchor tenant.
            </p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Link href="/">
                <Button variant="outline">Visit Jamsawli home</Button>
              </Link>
              <Link href="/admin/temples/new">
                <Button className="bg-saffron-500 hover:bg-saffron-600">Apply now</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {temples.map((temple) => (
              <article
                key={temple.id}
                className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md hover:border-saffron-300 transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-sacred-maroon">
                    {temple.nameHi || temple.name}
                  </h2>
                  {temple.isPremium && (
                    <span className="text-[10px] uppercase font-semibold tracking-wide bg-saffron-100 text-saffron-800 px-2 py-0.5 rounded-full shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                {temple.nameHi && (
                  <p className="text-sm text-gray-500">{temple.name}</p>
                )}
                {(temple.city || temple.state) && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5" />
                    {[temple.city, temple.state].filter(Boolean).join(", ")}
                  </p>
                )}
                {temple.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3 flex-1">
                    {temple.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link href={`/t/${temple.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      Visit
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/t/${temple.slug}/donate`} className="flex-1">
                    <Button className="w-full bg-saffron-500 hover:bg-saffron-600" size="sm">
                      Donate
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
