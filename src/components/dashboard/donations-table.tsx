"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/razorpay"
import { format } from "date-fns"

interface Donation {
  id: string
  amount: any
  purpose: string | null
  status: string
  createdAt: string
  donorName?: string | null
  want80G?: boolean
  panNumber?: string | null
  receiptNumber?: string | null
  user?: {
    name: string | null
    email: string | null
  } | null
}

export function DonationsTable() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
  }, [])

  async function fetchDonations() {
    try {
      const response = await fetch("/api/admin/donations")
      const data = await response.json()
      setDonations(data.donations)
    } catch (error) {
      console.error("Failed to fetch donations:", error)
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
          <TableHead>दाता</TableHead>
          <TableHead>राशि</TableHead>
          <TableHead>उद्देश्य</TableHead>
          <TableHead>स्थिति</TableHead>
          <TableHead>तिथि</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell>
              <div>
                <div className="font-medium">
                  {donation.donorName || donation.user?.name || "अतिथि / Guest"}
                </div>
                <div className="text-sm text-gray-500">
                  {donation.user?.email || donation.receiptNumber || "—"}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium">{formatPrice(Number(donation.amount))}</TableCell>
            <TableCell>
              {donation.purpose || "सामान्य दान"}
              {donation.want80G ? (
                <span className="ml-1 text-[10px] text-saffron-700 font-semibold">80G</span>
              ) : null}
            </TableCell>
            <TableCell>
              <Badge variant={donation.status === "COMPLETED" ? "default" : "secondary"}>
                {donation.status === "COMPLETED" ? "सफल" : "लंबित"}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(donation.createdAt), "dd MMM yyyy")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
