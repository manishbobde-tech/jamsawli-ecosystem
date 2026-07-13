"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Compass } from "lucide-react"
import {
  DEVOTEE_TOUR,
  TRUSTEE_TOUR,
  SALES_TOUR,
  TourAudience,
  TourStep,
} from "@/lib/tour-steps"
import { useI18n } from "@/lib/i18n"

const STORAGE_PREFIX = "mandiros-tour-done:"

function stepsFor(audience: TourAudience): TourStep[] {
  if (audience === "trustee") return TRUSTEE_TOUR
  if (audience === "sales") return SALES_TOUR
  return DEVOTEE_TOUR
}

interface ProductTourProps {
  audience?: TourAudience
  /** auto-open on first visit for this audience */
  autoStart?: boolean
  /** show floating "Tour" launcher */
  showLauncher?: boolean
}

export function ProductTour({
  audience = "devotee",
  autoStart = true,
  showLauncher = true,
}: ProductTourProps) {
  const { locale } = useI18n()
  const hi = locale === "hi"
  const router = useRouter()
  const pathname = usePathname()
  const steps = stepsFor(audience)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const storageKey = STORAGE_PREFIX + audience

  useEffect(() => {
    if (!autoStart) return
    try {
      const done = localStorage.getItem(storageKey)
      if (!done) {
        const t = setTimeout(() => setOpen(true), 900)
        return () => clearTimeout(t)
      }
    } catch {
      /* ignore */
    }
  }, [autoStart, storageKey])

  // Allow external restart: window event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { audience?: TourAudience } | undefined
      if (!detail?.audience || detail.audience === audience) {
        setIndex(0)
        setOpen(true)
      }
    }
    window.addEventListener("mandiros:start-tour", handler)
    return () => window.removeEventListener("mandiros:start-tour", handler)
  }, [audience])

  const close = useCallback(
    (markDone = true) => {
      setOpen(false)
      if (markDone) {
        try {
          localStorage.setItem(storageKey, "1")
        } catch {
          /* ignore */
        }
      }
    },
    [storageKey]
  )

  const step = steps[index]
  const isLast = index >= steps.length - 1

  function next() {
    if (isLast) close(true)
    else setIndex((i) => i + 1)
  }

  function prev() {
    setIndex((i) => Math.max(0, i - 1))
  }

  function goCta() {
    if (step.href) {
      router.push(step.href)
      // keep tour open for multi-step unless last
      if (isLast) close(true)
      else setIndex((i) => i + 1)
    } else {
      next()
    }
  }

  // Don't show tour chrome on embed/receipt
  if (pathname?.startsWith("/embed") || pathname?.startsWith("/receipt")) {
    return null
  }

  return (
    <>
      {showLauncher && (
        <button
          type="button"
          onClick={() => {
            setIndex(0)
            setOpen(true)
          }}
          className="tour-launcher fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-8 right-3 sm:right-4 z-[60] flex items-center gap-2 rounded-full bg-sacred-maroon text-white pl-3 pr-4 py-2.5 text-sm font-medium shadow-xl shadow-sacred-maroon/30 hover:bg-sacred-maroon/90 active:scale-95 transition-all no-print"
          aria-label="Start product tour"
        >
          <Compass className="h-4 w-4" />
          {hi ? "टूर" : "Tour"}
        </button>
      )}

      {open && step && (
        <div className="fixed inset-0 z-[70] print:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => close(false)}
          />
          <div className="absolute bottom-0 inset-x-0 md:bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-saffron-100 overflow-hidden">
              <div className="bg-gradient-to-r from-saffron-500 to-sacred-maroon px-5 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-lg">{step.icon || "🙏"}</span>
                  <span>
                    {hi ? "प्रॉडक्ट टूर" : "Product tour"} · {index + 1}/{steps.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => close(true)}
                  className="p-1 rounded-lg hover:bg-white/20"
                  aria-label="Close tour"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex gap-1 mb-4">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i <= index ? "bg-saffron-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <h2 className="text-xl font-bold text-sacred-maroon">
                  {hi ? step.titleHi : step.title}
                </h2>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {hi ? step.bodyHi : step.body}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={prev}
                    disabled={index === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {hi ? "पिछला" : "Back"}
                  </Button>

                  {step.href ? (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-saffron-500 hover:bg-saffron-600 gap-1 flex-1 sm:flex-none"
                      onClick={goCta}
                    >
                      {hi ? step.ctaHi || "खोलें" : step.cta || "Open"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-saffron-500 hover:bg-saffron-600 gap-1 flex-1 sm:flex-none"
                      onClick={next}
                    >
                      {isLast
                        ? hi
                          ? "समाप्त"
                          : "Finish"
                        : hi
                          ? "आगे"
                          : "Next"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}

                  {!isLast && (
                    <Button type="button" variant="ghost" size="sm" onClick={next}>
                      {hi ? "छोड़ें" : "Skip step"}
                    </Button>
                  )}
                </div>

                <p className="mt-4 text-[11px] text-gray-400 text-center">
                  {audience === "trustee"
                    ? hi
                      ? "न्यासी टूर"
                      : "Trustee tour"
                    : audience === "sales"
                      ? hi
                        ? "सेल्स / डेमो टूर"
                        : "Sales / demo tour"
                      : hi
                        ? "भक्त टूर"
                        : "Devotee tour"}
                  {" · "}
                  <button
                    type="button"
                    className="underline hover:text-gray-600"
                    onClick={() => close(true)}
                  >
                    {hi ? "फिर न दिखाएँ" : "Don't show again"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Helper for buttons elsewhere */
export function startProductTour(audience: TourAudience = "devotee") {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent("mandiros:start-tour", { detail: { audience } })
  )
}
