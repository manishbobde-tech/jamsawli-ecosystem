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
  pooja: {
    nameHi: string | null
    name: string
  }
  user: {
    name: string | null
    email: string | null
  }
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
                <div className="font-medium">{booking.user.name || "अज्ञात"}</div>
                <div className="text-sm text-gray-500">{booking.user.email}</div>
              </div>
            </TableCell>
            <TableCell>{booking.pooja.nameHi || booking.pooja.name}</TableCell>
            <TableCell>{format(new Date(booking.date), "dd MMM yyyy")}</TableCell>
            <TableCell>{booking.time}</TableCell>
            <TableCell className="font-medium">{formatPrice(Number(booking.totalAmount))}</TableCell>
            <TableCell>
              <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                {booking.status === "CONFIRMED" ? "पुष्ट" : "लंबित"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
