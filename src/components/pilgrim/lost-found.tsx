"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Package, Search } from "lucide-react"

interface LostItem {
  id: string
  type: "lost" | "found"
  title: string
  description: string
  contact: string
  date: string
}

export function LostFound() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"lost" | "found">("lost")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contact: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In production, this would save to database
    toast({
      title: activeTab === "lost" ? "गुम सामान रिपोर्ट दर्ज" : "मिला सामान रिपोर्ट दर्ज",
      description: "आपकी रिपोर्ट दर्ज कर ली गई है। धन्यवाद!",
    })
    
    setFormData({ title: "", description: "", contact: "" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sacred-maroon">
          {activeTab === "lost" ? "🔍 गुम सामान" : "📦 मिला सामान"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "lost" ? "default" : "outline"}
            onClick={() => setActiveTab("lost")}
            className="flex-1"
          >
            गुम सामान
          </Button>
          <Button
            variant={activeTab === "found" ? "default" : "outline"}
            onClick={() => setActiveTab("found")}
            className="flex-1"
          >
            मिला सामान
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">शीर्षक</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={activeTab === "lost" ? "जैसे: बैग गुम गया" : "जैसे: बैग मिला"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">विवरण</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="वस्तु का विवरण दें"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">संपर्क नंबर</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {activeTab === "lost" ? "रिपोर्ट दर्ज करें" : "सामान जमा करें"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}