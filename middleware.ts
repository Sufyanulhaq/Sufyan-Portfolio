import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Create response
    const response = NextResponse.next()

    // Add basic security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("Referrer-Policy", "origin-when-cross-origin")

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        if (!token) {
          return false
        }

        // Basic role-based access control
        const userRole = token?.role as string

        // Super Admin routes
        if (pathname.startsWith("/admin/system")) {
          return userRole === "SUPER_ADMIN"
        }

        // User management routes
        if (pathname.startsWith("/admin/users")) {
          return ["SUPER_ADMIN", "ADMIN"].includes(userRole)
        }

        // Content management routes
        if (pathname.startsWith("/admin/posts")) {
          return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(userRole)
        }

        // Project management routes
        if (pathname.startsWith("/admin/projects")) {
          return ["SUPER_ADMIN", "ADMIN"].includes(userRole)
        }

        // Analytics routes
        if (pathname.startsWith("/admin/analytics")) {
          return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(userRole)
        }

        // Contact management routes
        if (pathname.startsWith("/admin/contacts")) {
          return ["SUPER_ADMIN", "ADMIN"].includes(userRole)
        }

        // General admin access (dashboard, comments)
        if (pathname.startsWith("/admin")) {
          return ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"].includes(userRole)
        }

        // API routes protection
        if (pathname.startsWith("/api/admin")) {
          return ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"].includes(userRole)
        }

        // Profile routes - all authenticated users
        if (pathname.startsWith("/profile")) {
          return true
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/api/admin/:path*", "/api/auth/:path*"],
}
