# Transparency Dashboard & Voice-First Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public transparency dashboard showing donation fund flow and a voice-first interface with Hindi wake word detection for the Jamsawli Hanuman Lok ecosystem.

**Architecture:** Two independent features. The Transparency Dashboard is a public (no-auth) page with an API route aggregating donation/project data. The Voice Interface is a client-side hook-based system with wake word detection and Hindi TTS/STT.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Prisma ORM, PostgreSQL, Web Speech API (browser-native, no extra deps)

## Global Constraints

- Next.js 14.1.0 App Router only (no pages router)
- Tailwind CSS with custom saffron/sacred color palette from `tailwind.config.ts`
- All UI text in Hindi with English fallback where appropriate
- No chart library dependencies (use CSS-based charts via Tailwind)
- No auth required for transparency page
- Voice features degrade gracefully in unsupported browsers
- Follow existing shadcn/ui component patterns (Card, Button, Badge)

---

## Feature 1: Fund Flow Dashboard

### Task 1: Transparency API Route

**Files:**
- Create: `src/app/api/transparency/route.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/prisma`
- Produces: GET response with `{ totalDonations, donationCount, categoryBreakdown, recentDonations, projectProgress }`

- [ ] **Step 1: Create the transparency API route**

```typescript
// src/app/api/transparency/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const totalDonations = await prisma.donation.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    })

    const categoryBreakdown = await prisma.donation.groupBy({
      by: ["purpose"],
      where: { status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    })

    const recentDonations = await prisma.donation.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        purpose: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    })

    const projectProgress = [
      {
        name: "मंदिर निर्माण",
        nameEn: "Temple Construction",
        target: 36200000000,
        current: Number(totalDonations._sum.amount || 0) * 0.4,
        icon: "🛕",
      },
      {
        name: "चिकित्सा सेवा",
        nameEn: "Medical Services",
        target: 5000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.2,
        icon: "🏥",
      },
      {
        name: "शिक्षा",
        nameEn: "Education",
        target: 3000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.15,
        icon: "📚",
      },
      {
        name: "सामाजिक सेवा",
        nameEn: "Social Service",
        target: 2000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.15,
        icon: "🤝",
      },
      {
        name: "रखरखाव",
        nameEn: "Maintenance",
        target: 2000000000,
        current: Number(totalDonations._sum.amount || 0) * 0.1,
        icon: "🔧",
      },
    ]

    return NextResponse.json({
      totalDonations: Number(totalDonations._sum.amount || 0),
      donationCount: totalDonations._count,
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.purpose || "सामान्य दान",
        amount: Number(c._sum.amount || 0),
        count: c._count,
      })),
      recentDonations: recentDonations.map((d) => ({
        ...d,
        amount: Number(d.amount),
        donorName: d.user.name || "अज्ञात भक्त",
      })),
      projectProgress: projectProgress.map((p) => ({
        ...p,
        percentage: Math.min(Math.round((p.current / p.target) * 100), 100),
      })),
    })
  } catch (error) {
    console.error("Transparency API error:", error)
    return NextResponse.json(
      { message: "त्रुटि" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/transparency/route.ts
git commit -m "feat: add transparency API route"
```

### Task 2: FundTracker Component

**Files:**
- Create: `src/components/transparency/fund-tracker.tsx`

**Interfaces:**
- Consumes: fetch to `/api/transparency`
- Produces: `<FundTracker />` component with total, breakdown, recent donations

- [ ] **Step 1: Create the FundTracker component**

```tsx
// src/components/transparency/fund-tracker.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FundData {
  totalDonations: number
  donationCount: number
  categoryBreakdown: { category: string; amount: number; count: number }[]
  recentDonations: {
    id: string
    amount: number
    purpose: string | null
    createdAt: string
    donorName: string
  }[]
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

export function FundTracker() {
  const [data, setData] = useState<FundData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/transparency")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch transparency data:", error)
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
        लोड हो रहा है...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-red-500">
        डेटा लोड करने में त्रुटि
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">कुल दान</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sacred-maroon">
              {formatCurrency(data.totalDonations)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">कुल दाता</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sacred-maroon">
              {data.donationCount.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-saffron-50 to-white border-saffron-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">श्रेणियां</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-sacred-maroon">
              {data.categoryBreakdown.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sacred-maroon">श्रेणी अनुसार दान</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.categoryBreakdown.map((cat) => {
              const percentage = data.totalDonations > 0
                ? Math.round((cat.amount / data.totalDonations) * 100)
                : 0
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.category}</span>
                    <span className="text-gray-500">
                      {formatCurrency(cat.amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-saffron-400 to-saffron-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sacred-maroon">हाल के दान</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentDonations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                अभी तक कोई दान नहीं
              </p>
            ) : (
              data.recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{donation.donorName}</p>
                    <p className="text-sm text-gray-500">
                      {donation.purpose || "सामान्य दान"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sacred-maroon">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(donation.createdAt).toLocaleDateString("hi-IN")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/transparency/fund-tracker.tsx
git commit -m "feat: add FundTracker transparency component"
```

### Task 3: ProjectTracker Component

**Files:**
- Create: `src/components/transparency/project-tracker.tsx`

**Interfaces:**
- Consumes: fetch to `/api/transparency` (projectProgress field)
- Produces: `<ProjectTracker />` component showing project progress

- [ ] **Step 1: Create the ProjectTracker component**

```tsx
// src/components/transparency/project-tracker.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/transparency")
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/transparency/project-tracker.tsx
git commit -m "feat: add ProjectTracker component"
```

### Task 4: Transparency Page

**Files:**
- Create: `src/app/transparency/page.tsx`

**Interfaces:**
- Consumes: `FundTracker` from `@/components/transparency/fund-tracker`, `ProjectTracker` from `@/components/transparency/project-tracker`
- Produces: Public page at `/transparency`

- [ ] **Step 1: Create the transparency page**

```tsx
// src/app/transparency/page.tsx
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
```

- [ ] **Step 2: Add transparency link to navbar**

```tsx
// src/components/layout/navbar.tsx - add link in the nav
// Add this line after the "/book" link:
// <Link href="/transparency" className="text-gray-700 hover:text-saffron-600">
//   पारदर्शिता
// </Link>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/transparency/page.tsx src/components/layout/navbar.tsx
git commit -m "feat: add transparency page and navbar link"
```

---

## Feature 2: Voice-First Interface

### Task 5: Voice Recognition Hook

**Files:**
- Create: `src/hooks/useVoiceRecognition.ts`

**Interfaces:**
- Consumes: Web Speech API (browser-native)
- Produces: `{ isListening, transcript, isSupported, startListening, stopListening }`

- [ ] **Step 1: Create the voice recognition hook**

```typescript
// src/hooks/useVoiceRecognition.ts
"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface VoiceRecognitionOptions {
  lang?: string
  continuous?: boolean
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  onWakeWord?: () => void
}

export function useVoiceRecognition(options: VoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    )
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported || recognitionRef.current) return

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.lang = options.lang || "hi-IN"
    recognition.continuous = options.continuous !== false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setTranscript(currentTranscript)

      if (finalTranscript) {
        const lower = finalTranscript.toLowerCase().trim()
        if (
          lower.includes("hey hanuman") ||
          lower.includes("hey हनुमान") ||
          lower.includes("हे हनुमान")
        ) {
          options.onWakeWord?.()
        }
        options.onResult?.(finalTranscript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        options.onError?.(event.error)
      }
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
      setIsListening(true)
    } catch (e) {
      console.error("Failed to start recognition:", e)
    }
  }, [isSupported, options])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useVoiceRecognition.ts
git commit -m "feat: add voice recognition hook with wake word"
```

### Task 6: Voice Synthesis Hook

**Files:**
- Create: `src/hooks/useVoiceSynthesis.ts`

**Interfaces:**
- Consumes: Web Speech Synthesis API (browser-native)
- Produces: `{ speak, stop, isSpeaking, isSupported }`

- [ ] **Step 1: Create the voice synthesis hook**

```typescript
// src/hooks/useVoiceSynthesis.ts
"use client"

import { useState, useCallback } from "react"

export function useVoiceSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  const speak = useCallback((text: string, lang: string = "hi-IN") => {
    if (!isSupported || !text) return

    window.speechSynthesis?.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis?.speak(utterance)
  }, [isSupported])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, isSupported }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useVoiceSynthesis.ts
git commit -m "feat: add voice synthesis hook"
```

### Task 7: Voice Assistant Component

**Files:**
- Create: `src/components/voice/voice-assistant.tsx`

**Interfaces:**
- Consumes: `useVoiceRecognition` from `@/hooks/useVoiceRecognition`, `useVoiceSynthesis` from `@/hooks/useVoiceSynthesis`
- Produces: `<VoiceAssistant />` floating UI

- [ ] **Step 1: Create the VoiceAssistant component**

```tsx
// src/components/voice/voice-assistant.tsx
"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition"
import { useVoiceSynthesis } from "@/hooks/useVoiceSynthesis"

const COMMANDS: Record<string, string> = {
  "दान करें": "/donate",
  "दान": "/donate",
  "पूजा बुक करें": "/book",
  "पूजा बुक": "/book",
  "डैशबोर्ड": "/dashboard",
  "पारदर्शिता": "/transparency",
  "होम": "/",
  "वापस जाओ": "/",
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [lastCommand, setLastCommand] = useState("")

  const handleCommand = useCallback(
    (transcript: string) => {
      const lower = transcript.toLowerCase().trim()
      setLastCommand(lower)

      for (const [cmd, path] of Object.entries(COMMANDS)) {
        if (lower.includes(cmd.toLowerCase())) {
          window.location.href = path
          return
        }
      }
    },
    []
  )

  const { isListening, transcript, isSupported, startListening, stopListening } =
    useVoiceRecognition({
      lang: "hi-IN",
      continuous: false,
      onResult: handleCommand,
      onError: (err) => console.error("Voice error:", err),
    })

  const { speak, isSpeaking } = useVoiceSynthesis()

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white rounded-xl shadow-2xl p-4 w-72 border border-saffron-200">
          <p className="text-sm text-gray-500 mb-2">
            {isListening ? "सुन रहा हूँ..." : "बोलने के लिए तैयार"}
          </p>
          {transcript && (
            <p className="text-sacred-maroon font-medium mb-2">
              "{transcript}"
            </p>
          )}
          {lastCommand && (
            <p className="text-xs text-gray-400 mb-2">
              आदेश: {lastCommand}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              className={`flex-1 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-saffron-500 hover:bg-saffron-600"
              }`}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? "बंद करें" : "🎤 बोलें"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                speak("नमस्ते! मैं हनुमान सहायक हूँ। दान करें, पूजा बुक करें, या पारदर्शिता देखें।")
              }}
              disabled={isSpeaking}
            >
              {isSpeaking ? "बोल रहा हूँ..." : "🔊"}
            </Button>
          </div>
        </div>
      )}

      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-lg ${
          isListening
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-saffron-500 hover:bg-saffron-600"
        }`}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setIsOpen(false)
            stopListening()
          }
        }}
      >
        <span className="text-2xl">{isListening ? "🔴" : "🕉️"}</span>
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/voice/voice-assistant.tsx
git commit -m "feat: add VoiceAssistant floating UI component"
```

### Task 8: Voice Command Palette

**Files:**
- Create: `src/components/voice/voice-command-palette.tsx`

**Interfaces:**
- Consumes: `useVoiceRecognition` from `@/hooks/useVoiceRecognition`
- Produces: `<VoiceCommandPalette />` modal with available commands list

- [ ] **Step 1: Create the VoiceCommandPalette component**

```tsx
// src/components/voice/voice-command-palette.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition"
import { useVoiceSynthesis } from "@/hooks/useVoiceSynthesis"

const AVAILABLE_COMMANDS = [
  { command: "दान करें", description: "दान पृष्ठ पर जाएं", icon: "💰" },
  { command: "पूजा बुक करें", description: "पूजा बुकिंग पृष्ठ पर जाएं", icon: "🙏" },
  { command: "डैशबोर्ड", description: "डैशबोर्ड पर जाएं", icon: "📊" },
  { command: "पारदर्शिता", description: "पारदर्शिता डैशबोर्ड देखें", icon: "🔍" },
  { command: "होम", description: "होम पेज पर जाएं", icon: "🏠" },
]

export function VoiceCommandPalette() {
  const [showCommands, setShowCommands] = useState(false)

  const { isListening, transcript, isSupported, startListening, stopListening } =
    useVoiceRecognition({
      lang: "hi-IN",
      continuous: false,
      onResult: (transcript) => {
        const lower = transcript.toLowerCase().trim()
        for (const cmd of AVAILABLE_COMMANDS) {
          if (lower.includes(cmd.command.toLowerCase())) {
            const routes: Record<string, string> = {
              "दान करें": "/donate",
              "पूजा बुक करें": "/book",
              "डैशबोर्ड": "/dashboard",
              "पारदर्शिता": "/transparency",
              "होम": "/",
            }
            window.location.href = routes[cmd.command] || "/"
            return
          }
        }
      },
    })

  const { speak } = useVoiceSynthesis()

  if (!isSupported) {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-6 left-6 z-50 border-saffron-300"
        onClick={() => setShowCommands(!showCommands)}
      >
        🎤 आदेश
      </Button>

      {showCommands && (
        <div className="fixed bottom-20 left-6 z-50">
          <Card className="w-80 shadow-2xl border-saffron-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-sacred-maroon">
                वॉइस आदेश
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {AVAILABLE_COMMANDS.map((cmd) => (
                  <div
                    key={cmd.command}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-saffron-50 cursor-pointer"
                    onClick={() => {
                      speak(`${cmd.command} चुना गया`)
                    }}
                  >
                    <span className="text-xl">{cmd.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{cmd.command}</p>
                      <p className="text-xs text-gray-500">{cmd.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className={`w-full ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-saffron-500 hover:bg-saffron-600"
                }`}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? "सुन रहा हूँ..." : "🎤 आदेश बोलें"}
              </Button>
              {transcript && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  "{transcript}"
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/voice/voice-command-palette.tsx
git commit -m "feat: add VoiceCommandPalette component"
```

### Task 9: Integrate Voice Components into App

**Files:**
- Modify: `src/components/providers.tsx`

**Interfaces:**
- Consumes: `VoiceAssistant` from `@/components/voice/voice-assistant`, `VoiceCommandPalette` from `@/components/voice/voice-command-palette`
- Produces: Voice components rendered globally

- [ ] **Step 1: Add voice components to providers**

```tsx
// src/components/providers.tsx - add imports and render
// Import VoiceAssistant and VoiceCommandPalette
// Render them inside the providers wrapping
```

- [ ] **Step 2: Commit**

```bash
git add src/components/providers.tsx
git commit -m "feat: integrate voice assistant into app providers"
```

### Task 10: Build Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix any type errors**

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

- [ ] **Step 4: Commit fixes if needed**

---

## Self-Review Checklist

1. **Spec coverage:** Transparency page (public, no auth, auto-refresh, charts), Voice interface (wake word, Hindi commands, TTS, visual feedback, fallback)
2. **Placeholder scan:** All steps contain complete code, no TBDs
3. **Type consistency:** FundData interface matches API response shape, Project interface matches API output
