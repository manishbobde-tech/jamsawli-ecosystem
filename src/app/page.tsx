import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-sacred-maroon/10" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-sacred-maroon mb-6">
            जामसावली हनुमान लोक
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-8">
            जहाँ आस्था और नवीनता मिलते हैं
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600">
                दान करें
              </Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline">
                पूजा बुक करें
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-sacred-maroon">
            हमारी सेवाएं
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="लाइव दर्शन"
              description="24/7 मंदिर कैमरे से जुड़ें"
              icon="🎥"
            />
            <FeatureCard
              title="ऑनलाइन दान"
              description="सुरक्षित और पारदर्शी दान"
              icon="💰"
            />
            <FeatureCard
              title="पूजा बुकिंग"
              description="घर बैठे पूजा बुक करें"
              icon="🙏"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
