import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { verifyPhoneOtp } from "./otp"
import { normalizePhone } from "./phone"

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "tel" },
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error("Email or phone required")
        }
        if (!credentials?.password) {
          throw new Error("Password required")
        }

        let user
        if (credentials.email) {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })
        } else {
          const phone = normalizePhone(credentials.phone!)
          user = await prisma.user.findUnique({
            where: { phone },
          })
        }

        if (!user) throw new Error("User not found")
        if (!user.password) {
          throw new Error("Use phone OTP or Google for this account")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error("Invalid password")

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Phone and OTP required")
        }

        const { phone } = await verifyPhoneOtp(credentials.phone, credentials.otp)

        let user = await prisma.user.findUnique({ where: { phone } })
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone,
              name: credentials.name?.trim() || `Devotee ${phone.slice(-4)}`,
              role: "DEVOTEE",
            },
          })
        } else if (credentials.name?.trim() && !user.name) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { name: credentials.name.trim() },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string | undefined
        session.user.organizationId = token.organizationId as string | undefined
        ;(session.user as { phone?: string }).phone = token.phone as string | undefined
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            organization: { select: { id: true, slug: true } },
          },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.organizationId = dbUser.organizationId || undefined
          token.orgSlug = dbUser.organization?.slug
          token.phone = dbUser.phone || undefined
        }
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
