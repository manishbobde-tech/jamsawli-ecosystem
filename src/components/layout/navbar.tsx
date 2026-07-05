"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-sacred-maroon">
          🕉️ जामसावली हनुमान लोक
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/donate" className="text-gray-700 hover:text-saffron-600">
            दान करें
          </Link>
          <Link href="/book" className="text-gray-700 hover:text-saffron-600">
            पूजा बुक करें
          </Link>
          <Link href="/pilgrim" className="text-gray-700 hover:text-saffron-600">
            तीर्थयात्री
          </Link>
          <Link href="/checkin" className="text-gray-700 hover:text-saffron-600">
            चेक-इन
          </Link>
          <Link href="/transparency" className="text-gray-700 hover:text-saffron-600">
            पारदर्शिता
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-saffron-600">
                डैशबोर्ड
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                लॉगआउट
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-saffron-500 hover:bg-saffron-600">
                लॉगिन
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
