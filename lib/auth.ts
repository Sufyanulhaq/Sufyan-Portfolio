import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import connectDB from "./mongodb"
import User from "../models/User"
import UserActivity from "../models/UserActivity"

export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  EDITOR: 3,
  VIEWER: 2,
  USER: 1,
} as const

export type UserRole = keyof typeof ROLE_HIERARCHY

export const PERMISSIONS = {
  // User management
  MANAGE_USERS: ["SUPER_ADMIN", "ADMIN"],
  VIEW_USERS: ["SUPER_ADMIN", "ADMIN", "EDITOR"],

  // Content management
  MANAGE_POSTS: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  PUBLISH_POSTS: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  VIEW_POSTS: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],

  // Project management
  MANAGE_PROJECTS: ["SUPER_ADMIN", "ADMIN"],
  VIEW_PROJECTS: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],

  // System management
  MANAGE_SYSTEM: ["SUPER_ADMIN"],
  VIEW_ANALYTICS: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  MANAGE_COMMENTS: ["SUPER_ADMIN", "ADMIN", "EDITOR"],

  // Contact management
  MANAGE_CONTACTS: ["SUPER_ADMIN", "ADMIN"],
  VIEW_CONTACTS: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
} as const

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole)
}

export function hasRoleLevel(userRole: UserRole, requiredLevel: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredLevel]
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await connectDB()
          const user = await User.findOne({ email: credentials.email })

          if (!user || !user.isActive) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date(),
            $inc: { loginCount: 1 },
          })

          // Log login activity
          await UserActivity.create({
            user: user._id,
            action: "LOGIN",
            resource: "USER",
            resourceId: user._id,
            details: { method: "credentials" },
          })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.avatar = user.avatar
        token.isEmailVerified = user.isEmailVerified
      }

      if (trigger === "update" && session) {
        token.name = session.name
        token.avatar = session.avatar
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.avatar = token.avatar as string
        session.user.isEmailVerified = token.isEmailVerified as boolean
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        try {
          await connectDB()
          await UserActivity.create({
            user: token.sub,
            action: "LOGOUT",
            resource: "USER",
            resourceId: token.sub,
          })
        } catch (error) {
          console.error("Logout tracking error:", error)
        }
      }
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
}
