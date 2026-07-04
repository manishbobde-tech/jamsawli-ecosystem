import { DonationForm } from "@/components/donation/donation-form"

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-8">
          दान करें
        </h1>
        <p className="text-center text-gray-600 mb-8">
          आपका दान मंदिर के विकास और सेवा कार्यों में सहायक है
        </p>
        <DonationForm />
      </div>
    </div>
  )
}
