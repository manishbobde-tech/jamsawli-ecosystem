import { QRScanner } from "@/components/checkin/qr-scanner"

export default function CheckinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-4">
          🙏 मंदिर चेक-इन
        </h1>
        <p className="text-center text-gray-600 mb-8">
          QR कोड स्कैन करें और अपना दर्शन रिकॉर्ड करें
        </p>
        <QRScanner />
      </div>
    </div>
  )
}