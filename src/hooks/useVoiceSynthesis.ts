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