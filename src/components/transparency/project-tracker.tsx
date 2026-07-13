"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOptionalTemple } from "@/hooks/useTemple"

interface Project {
  name: string
  nameEn: string
  target: number
  current: number
  percentage: number
  icon: string
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

interface ProjectTrackerProps {
  templeSlug?: string
}

export function ProjectTracker({ templeSlug: propSlug }: ProjectTrackerProps) {
  const temple = useOptionalTemple()
  const templeSlug = propSlug || temple?.templeSlug || "jamsawli-hanuman"
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/transparency?templeSlug=${templeSlug}`)
        const json = await res.json()
        setProjects(json.projectProgress || [])
      } catch (error) {
        console.error("Failed to fetch project data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        प्रोजेक्ट लोड हो रहे हैं...
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-sacred-maroon mb-6 text-center">
        ₹362 करोड़ विकास परियोजना
      </h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.nameEn} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{project.icon}</span>
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-500">{project.nameEn}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formatCurrency(project.current)} प्राप्त
                  </span>
                  <span className="text-gray-500">
                    लक्ष्य: {formatCurrency(project.target)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max(project.percentage, 2)}%`,
                      background: `linear-gradient(90deg, #f97316 0%, #ea580c 100%)`,
                    }}
                  >
                    {project.percentage >= 10 && (
                      <span className="text-xs text-white font-medium">
                        {project.percentage}%
                      </span>
                    )}
                  </div>
                </div>
                {project.percentage < 10 && (
                  <p className="text-xs text-gray-400 text-right">
                    {project.percentage}%
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}