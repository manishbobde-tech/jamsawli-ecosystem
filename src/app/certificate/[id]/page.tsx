import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ReceiptActions } from "@/components/donation/receipt-actions"

export const dynamic = "force-dynamic"

export default async function SevaCertificatePage({
  params,
}: {
  params: { id: string }
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      pooja: true,
      temple: true,
      user: { select: { name: true } },
    },
  })

  if (!booking) notFound()

  const devotee =
    booking.devoteeName || booking.user?.name || "Devotee"
  const templeName = booking.temple?.nameHi || booking.temple?.name || "Temple"
  const seva = booking.pooja?.nameHi || booking.pooja?.name || "Seva"

  return (
    <main className="min-h-screen bg-stone-100 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto mb-4 print:hidden flex flex-wrap gap-3 items-center">
        <ReceiptActions />
        {booking.temple?.slug && (
          <Link
            href={`/t/${booking.temple.slug}`}
            className="text-sm text-saffron-700 hover:underline"
          >
            ← Temple home
          </Link>
        )}
      </div>

      <article className="max-w-2xl mx-auto bg-white border-4 border-double border-saffron-300 shadow-soft print:shadow-none p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-3 border border-saffron-100 pointer-events-none rounded-sm" />
        <p className="text-xs uppercase tracking-[0.25em] text-saffron-600 font-semibold">
          Seva certificate · सेवा प्रमाणपत्र
        </p>
        <div className="mt-4 mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-saffron-400 to-sacred-maroon text-white flex items-center justify-center text-2xl font-bold">
          ॐ
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-sacred-maroon font-hindi">
          {templeName}
        </h1>
        <p className="mt-6 text-stone-600 text-sm">This certifies that</p>
        <p className="mt-2 text-2xl sm:text-3xl font-bold text-stone-900">{devotee}</p>
        {booking.gotra && (
          <p className="text-sm text-stone-500 mt-1">गोत्र / Gotra: {booking.gotra}</p>
        )}
        <p className="mt-6 text-stone-600 text-sm">has booked / reserved</p>
        <p className="mt-2 text-xl sm:text-2xl font-semibold text-saffron-700">{seva}</p>
        {booking.sankalp && (
          <p className="mt-3 text-sm text-stone-600 italic max-w-md mx-auto">
            संकल्प: {booking.sankalp}
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm max-w-sm mx-auto">
          <div className="rounded-xl bg-saffron-50 p-3">
            <p className="text-xs text-stone-500">Date</p>
            <p className="font-semibold">
              {new Date(booking.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="rounded-xl bg-saffron-50 p-3">
            <p className="text-xs text-stone-500">Time</p>
            <p className="font-semibold">{booking.time}</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-stone-400">
          Booking ID: {booking.id.slice(0, 12)}… · Status: {booking.status}
        </p>
        <p className="mt-6 text-sm text-sacred-maroon font-medium">जय श्री हनुमान</p>
        <p className="mt-2 text-[10px] text-stone-400">Issued via MandirOS</p>
      </article>
    </main>
  )
}
