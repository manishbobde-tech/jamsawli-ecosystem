import { EmergencySOS } from "@/components/pilgrim/emergency-sos"
import { LostFound } from "@/components/pilgrim/lost-found"
import { CrowdHeatmap } from "@/components/pilgrim/crowd-heatmap"

export default function PilgrimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-4">
          🙏 तीर्थयात्री सेवाएं
        </h1>
        <p className="text-center text-gray-600 mb-8">
          मंदिर में आपकी सुरक्षा और सुविधा के लिए
        </p>

        <div className="space-y-6">
          <CrowdHeatmap />
          <EmergencySOS />
          <LostFound />
        </div>
      </div>
    </div>
  )
}