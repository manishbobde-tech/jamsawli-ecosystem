"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/razorpay"
import { format } from "date-fns"

interface Booking {
  id: string
  date: string
  time: string
  status: string
  totalAmount: any
  devoteeName?: string | null
  gotra?: string | null
  phone?: string | null
  sankalp?: string | null
  certificateUrl?: string
  pooja: {
    nameHi: string | null
    name: string
  }
  user?: {
    name: string | null
    email: string | null
  } | null
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const response = await fetch("/api/admin/bookings")
      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>भक्त</TableHead>
          <TableHead>पूजा</TableHead>
          <TableHead>तिथि</TableHead>
          <TableHead>समय</TableHead>
          <TableHead>राशि</TableHead>
          <TableHead>स्थिति</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>
              <div>
                <div className="font-medium">
                  {booking.devoteeName || booking.user?.name || "अतिथि"}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.gotra
                    ? `गोत्र: ${booking.gotra}`
                    : booking.user?.email || booking.phone || "—"}
                </div>
              </div>
            </TableCell>
            <TableCell>{booking.pooja.nameHi || booking.pooja.name}</TableCell>
            <TableCell>{format(new Date(booking.date), "dd MMM yyyy")}</TableCell>
            <TableCell>{booking.time}</TableCell>
            <TableCell className="font-medium">{formatPrice(Number(booking.totalAmount))}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                  {booking.status === "CONFIRMED" ? "पुष्ट" : booking.status}
                </Badge>
                <a
                  href={booking.certificateUrl || `/certificate/${booking.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-saffron-700 hover:underline"
                >
                  Certificate
                </a>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
