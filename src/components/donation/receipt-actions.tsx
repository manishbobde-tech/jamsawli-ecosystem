"use client"

import { Button } from "@/components/ui/button"

export function ReceiptActions() {
  return (
    <Button
      className="bg-saffron-500 hover:bg-saffron-600"
      onClick={() => window.print()}
    >
      Download / Print PDF
    </Button>
  )
}
