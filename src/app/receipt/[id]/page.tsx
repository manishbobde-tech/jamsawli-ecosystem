import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { parseTrustConfig, isEightyGReady } from "@/lib/trust-config"
import { ReceiptActions } from "@/components/donation/receipt-actions"

export const dynamic = "force-dynamic"

export default async function ReceiptPage({
  params,
}: {
  params: { id: string }
}) {
  const donation = await prisma.donation.findFirst({
    where: {
      OR: [{ id: params.id }, { receiptNumber: params.id }],
      status: "COMPLETED",
    },
    include: {
      temple: { include: { organization: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
  })

  if (!donation) notFound()

  const trust = parseTrustConfig(
    donation.temple?.organization?.config,
    donation.temple?.config
  )
  const ready = isEightyGReady(trust)
  const donor =
    donation.donorName || donation.user?.name || "Devotee"
  const amount = Number(donation.amount)

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto mb-4 print:hidden">
        <ReceiptActions />
        <Link href="/transparency" className="text-sm text-saffron-700 hover:underline ml-4">
          View fund transparency
        </Link>
      </div>

      <article
        id="receipt-print"
        className="max-w-2xl mx-auto bg-white border shadow-sm print:shadow-none print:border-0 p-8 md:p-10"
      >
        <header className="border-b-2 border-sacred-maroon pb-4 mb-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
            Donation Receipt {donation.want80G ? "· 80G" : ""}
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-sacred-maroon">
            {trust.trustLegalNameHi || trust.trustLegalName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{trust.trustLegalName}</p>
          <p className="text-xs text-gray-500 mt-2">
            {[trust.address, trust.city, trust.state, trust.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          <div>
            <p className="text-gray-500">Receipt No.</p>
            <p className="font-mono font-semibold">{donation.receiptNumber || donation.id}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Date</p>
            <p className="font-semibold">
              {new Date(donation.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Payment ID</p>
            <p className="font-mono text-xs break-all">{donation.paymentId || "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Temple</p>
            <p className="font-semibold text-sm">
              {donation.temple?.nameHi || donation.temple?.name || "—"}
            </p>
          </div>
        </div>

        <table className="w-full text-sm mb-6 border">
          <tbody>
            <tr className="border-b">
              <td className="p-2 text-gray-500 w-1/3">Received from</td>
              <td className="p-2 font-medium">{donor}</td>
            </tr>
            {donation.panNumber && (
              <tr className="border-b">
                <td className="p-2 text-gray-500">PAN</td>
                <td className="p-2 font-mono">{donation.panNumber}</td>
              </tr>
            )}
            {(donation.donorEmail || donation.user?.email) && (
              <tr className="border-b">
                <td className="p-2 text-gray-500">Email</td>
                <td className="p-2">{donation.donorEmail || donation.user?.email}</td>
              </tr>
            )}
            <tr className="border-b">
              <td className="p-2 text-gray-500">Purpose</td>
              <td className="p-2">{donation.purpose || "General donation"}</td>
            </tr>
            <tr className="bg-saffron-50">
              <td className="p-3 text-gray-700 font-medium">Amount</td>
              <td className="p-3 text-xl font-bold text-sacred-maroon">
                ₹{amount.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>

        <section className="rounded-lg border border-dashed border-gray-300 p-4 text-xs text-gray-600 space-y-1 mb-6">
          <p className="font-semibold text-gray-800 text-sm mb-2">Trust / 80G details</p>
          <p>Registration: {trust.registrationNumber || "—"}</p>
          <p>80G No.: {trust.eightyGNumber || "—"}</p>
          <p>Trust PAN: {trust.panNumber || "—"}</p>
          {(trust.eightyGValidFrom || trust.eightyGValidTo) && (
            <p>
              Validity: {trust.eightyGValidFrom || "—"} to {trust.eightyGValidTo || "—"}
            </p>
          )}
          {!ready && (
            <p className="text-amber-700 mt-2">
              Note: Trust 80G numbers are not fully configured yet. This is a
              payment receipt; final tax certificate requires valid 80G
              registration on the trust profile.
            </p>
          )}
          {ready && donation.want80G && (
            <p className="text-green-700 mt-2">
              This receipt is issued for claiming deduction under Section 80G
              of the Income Tax Act, subject to applicable law.
            </p>
          )}
        </section>

        <footer className="flex justify-between items-end text-sm pt-8">
          <div className="text-xs text-gray-500 max-w-xs">
            Generated by MandirOS · Jai Shri Hanuman
            <br />
            {trust.contactEmail} {trust.contactPhone ? `· ${trust.contactPhone}` : ""}
          </div>
          <div className="text-center">
            <div className="h-10 border-b border-gray-400 w-40 mb-1" />
            <p className="text-xs text-gray-600">
              {trust.authorizedSignatory || "Authorized Signatory"}
            </p>
          </div>
        </footer>
      </article>
    </main>
  )
}
