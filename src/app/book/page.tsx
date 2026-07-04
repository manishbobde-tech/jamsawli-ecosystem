import { BookingForm } from "@/components/booking/booking-form"

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-8">
          पूजा बुक करें
        </h1>
        <p className="text-center text-gray-600 mb-8">
          अपनी पसंद की पूजा बुक करें और घर बैठे प्रसाद प्राप्त करें
        </p>
        <BookingForm />
      </div>
    </div>
  )
}
