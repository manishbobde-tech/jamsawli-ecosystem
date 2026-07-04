import { DonationsTable } from "@/components/dashboard/donations-table"

export default function DonationsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-sacred-maroon">दान प्रबंधन</h1>
      <DonationsTable />
    </div>
  )
}
