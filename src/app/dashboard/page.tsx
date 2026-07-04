import { StatsCard } from "@/components/dashboard/stats-card"
import { DonationsTable } from "@/components/dashboard/donations-table"
import { BookingsTable } from "@/components/dashboard/bookings-table"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-sacred-maroon">डैशबोर्ड</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="कुल दान"
          value="₹2,45,000"
          description="इस महीने"
          icon="💰"
        />
        <StatsCard
          title="बुकिंग"
          value="127"
          description="इस महीने"
          icon="📅"
        />
        <StatsCard
          title="पंजीकृत भक्त"
          value="1,234"
          description="कुल"
          icon="👥"
        />
        <StatsCard
          title="आज के दर्शन"
          value="2,847"
          description="अभी तक"
          icon="🎥"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">हाल का दान</h2>
          <DonationsTable />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">हाल की बुकिंग</h2>
          <BookingsTable />
        </div>
      </div>
    </div>
  )
}
