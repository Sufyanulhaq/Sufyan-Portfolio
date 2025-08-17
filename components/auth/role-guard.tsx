"use client"

import { useSession } from "next-auth/react"
import { hasPermission, hasRoleLevel, type UserRole } from "@/lib/auth"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: UserRole
  requiredPermission?: keyof typeof import("@/lib/auth").PERMISSIONS
  fallback?: ReactNode
  allowedRoles?: UserRole[]
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = null,
  allowedRoles,
}: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!session) {
    return <>{fallback}</>
  }

  const userRole = session.user.role as UserRole

  // Check specific role requirement
  if (requiredRole && !hasRoleLevel(userRole, requiredRole)) {
    return <>{fallback}</>
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <>{fallback}</>
  }

  // Check allowed roles list
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
