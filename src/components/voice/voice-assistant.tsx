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
              &quot;{transcript}&quot;
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