import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const { qrData } = await req.json()

    // Parse QR data
    let scannedUserId = session.user.id
    if (qrData) {
      try {
        const data = JSON.parse(qrData)
        if (data.type === "DEVOTEE_CHECKIN") {
          scannedUserId = data.userId
        }
      } catch (e) {
        // Invalid QR, use current user
      }
    }

    // Create check-in record
    const visit = await prisma.visit.create({
      data: {
        userId: session.user.id,
        checkInTime: new Date(),
      },
    })

    // Update streak
    const streak = await prisma.userStreak.upsert({
      where: { 
        userId_type: { 
          userId: session.user.id, 
          type: "visit" 
        } 
      },
      update: { 
        currentStreak: { increment: 1 },
        longestStreak: { 
          increment: 1
        }
      },
      create: {
        userId: session.user.id,
        type: "visit",
        currentStreak: 1,
        longestStreak: 1,
      },
    })

    // Check for badges
    const newBadges: string[] = []
    if (streak.currentStreak === 7) {
      newBadges.push("STREAK_7")
    } else if (streak.currentStreak === 30) {
      newBadges.push("STREAK_30")
    }

    return NextResponse.json({ 
      visit, 
      streak: streak.currentStreak,
      badges: newBadges,
      message: "चेक-इन सफल! जय श्री हनुमान!" 
    })
  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json(
      { message: "चेक-इन में त्रुटि" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const visits = await prisma.visit.findMany({
      where: { userId: session.user.id },
      orderBy: { checkInTime: "desc" },
      take: 10,
    })

    const streak = await prisma.userStreak.findUnique({
      where: {
        userId_type: {
          userId: session.user.id,
          type: "visit",
        },
      },
    })

    return NextResponse.json({ visits, streak })
  } catch (error) {
    return NextResponse.json(
      { message: "डेटा लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}