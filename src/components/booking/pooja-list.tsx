"use client"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/razorpay"
import { useOptionalTemple } from "@/hooks/useTemple"

interface Pooja {
  id: string
  name: string
  nameHi: string
  description: string | null
  descriptionHi: string | null
  duration: number
  price: any
}

interface PoojaListProps {
  onSelect: (pooja: Pooja) => void
  selectedPooja: Pooja | null
  templeSlug?: string
}

export function PoojaList({ onSelect, selectedPooja, templeSlug: propSlug }: PoojaListProps) {
  const temple = useOptionalTemple()
  const templeSlug = propSlug || temple?.templeSlug || DEFAULT_TENANT_SLUG
  const [poojas, setPoojas] = useState<Pooja[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPoojas()
  }, [templeSlug])

  async function fetchPoojas() {
    try {
      const response = await fetch(`/api/poojas?templeSlug=${templeSlug}`)
      const data = await response.json()
      setPoojas(data.poojas)
    } catch (error) {
      console.error("Failed to fetch poojas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>
  }

  return (
    <div className="grid gap-4">
      {poojas.map((pooja) => (
        <Card
          key={pooja.id}
          className={`cursor-pointer transition-all ${
            selectedPooja?.id === pooja.id
              ? "ring-2 ring-saffron-500"
              : "hover:shadow-lg"
          }`}
          onClick={() => onSelect(pooja)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{pooja.nameHi || pooja.name}</CardTitle>
            <CardDescription>
              {pooja.duration} मिनट | {formatPrice(Number(pooja.price))}
            </CardDescription>
          </CardHeader>
          {pooja.descriptionHi && (
            <CardContent>
              <p className="text-sm text-gray-600">{pooja.descriptionHi}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
