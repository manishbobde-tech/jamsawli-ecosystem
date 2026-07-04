import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
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
          user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          })
        }

        if (!user) {
          throw new Error("User not found")
        }

        if (!user.password) {
          throw new Error("This account uses Google sign-in. Please sign in with Google.")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
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
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
