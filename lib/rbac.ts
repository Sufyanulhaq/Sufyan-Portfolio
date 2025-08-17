import { getServerSession } from "next-auth"
import { authOptions, hasPermission, hasRoleLevel, type UserRole } from "./auth"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }
  return session
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth()
  const userRole = session.user.role as UserRole

  if (!hasRoleLevel(userRole, requiredRole)) {
    redirect("/unauthorized")
  }

  return session
}

export async function requirePermission(permission: keyof typeof import("./auth").PERMISSIONS) {
  const session = await requireAuth()
  const userRole = session.user.role as UserRole

  if (!hasPermission(userRole, permission)) {
    redirect("/unauthorized")
  }

  return session
}

// Client-side hooks
export function useRequireAuth() {
  // This would be implemented with useSession from next-auth/react
  // For now, just a placeholder
}

export function useRequireRole(requiredRole: UserRole) {
  // This would be implemented with useSession from next-auth/react
  // For now, just a placeholder
}
