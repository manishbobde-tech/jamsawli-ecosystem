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