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
                  &quot;{transcript}&quot;
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}