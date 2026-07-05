import { FundTracker } from "@/components/transparency/fund-tracker"
import { ProjectTracker } from "@/components/transparency/project-tracker"

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-4">
          पारदर्शिता डैशबोर्ड
        </h1>
        <p className="text-center text-gray-600 mb-8">
          हर रुपये का हिसाब - Trust through Transparency
        </p>
        <FundTracker />
        <ProjectTracker />
      </div>
    </div>
  )
}