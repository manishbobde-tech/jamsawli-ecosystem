import { BookingsTable } from "@/components/dashboard/bookings-table"

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-sacred-maroon">बुकिंग प्रबंधन</h1>
      <BookingsTable />
    </div>
  )
}
