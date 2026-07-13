import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export const metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <div className="gradient-hero min-h-[80vh] flex flex-col items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-sacred-maroon text-white text-lg font-bold shadow-glow">
            ॐ
          </div>
          <h1 className="text-2xl font-bold text-sacred-maroon">Welcome back</h1>
          <p className="text-sm text-stone-500">
            Phone OTP recommended for India · Email also works
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-stone-400">
          <Link href="/" className="text-saffron-700 hover:underline">
            ← Back home
          </Link>
          {" · "}
          <Link href="/demo" className="hover:underline">
            Free vs Pro demo
          </Link>
        </p>
      </div>
    </div>
  )
}
