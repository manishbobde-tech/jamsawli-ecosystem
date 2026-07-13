import { BookingForm } from "@/components/booking/booking-form"

export default function BookPage({ params }: { params: { slug: string } }) {
  return (
    <div className="gradient-hero py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="chip mx-auto mb-3 w-fit">Seva booking</p>
          <h1 className="section-title font-hindi">पूजा बुक करें</h1>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            गोत्र · संकल्प · स्लॉट क्षमता · Book with devotee details
          </p>
        </div>
        <BookingForm templeSlug={params.slug} />
      </div>
    </div>
  )
}
