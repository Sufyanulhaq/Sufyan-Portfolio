import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { hasPermission, hasRoleLevel, type UserRole } from "./lib/auth"
import { addSecurityHeaders, logSecurityEvent } from "./lib/security"
import { apiRateLimit, authRateLimit, contactRateLimit } from "./lib/rate-limit"
import { startPerformanceTracking, endPerformanceTracking, addPerformanceHeaders } from "./lib/performance"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    const method = req.method

    // Start performance tracking
    const requestId = startPerformanceTracking(req)

    // Apply rate limiting
    let rateLimitResult
    if (pathname.startsWith("/api/auth")) {
      rateLimitResult = authRateLimit.check(req)
    } else if (pathname.startsWith("/api/contact")) {
      rateLimitResult = contactRateLimit.check(req)
    } else if (pathname.startsWith("/api/")) {
      rateLimitResult = apiRateLimit.check(req)
    }

    if (rateLimitResult && !rateLimitResult.success) {
      logSecurityEvent({
        type: "RATE_LIMIT_EXCEEDED",
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
        userAgent: req.headers.get("user-agent") || undefined,
        userId: token?.sub,
        details: { pathname, method },
      })

      const response = NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rateLimitResult.resetTime },
        { status: 429 },
      )

      response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString())
      response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
      response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString())

      return addSecurityHeaders(response)
    }

    // Create response
    const response = NextResponse.next()

    // Add security headers
    addSecurityHeaders(response)

    // Add rate limit headers if applicable
    if (rateLimitResult) {
      response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString())
      response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
      response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString())
    }

    // End performance tracking and add headers
    const metrics = endPerformanceTracking(requestId, response.status)
    if (metrics) {
      addPerformanceHeaders(response, metrics)
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        const userRole = token?.role as UserRole

        if (!token) {
          // Log unauthorized access attempts
          logSecurityEvent({
            type: "INVALID_TOKEN",
            ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
            userAgent: req.headers.get("user-agent") || undefined,
            details: { pathname, method: req.method },
          })
          return false
        }

        // Super Admin routes
        if (pathname.startsWith("/admin/system")) {
          return hasPermission(userRole, "MANAGE_SYSTEM")
        }

        // User management routes
        if (pathname.startsWith("/admin/users")) {
          return hasPermission(userRole, "MANAGE_USERS")
        }

        // Content management routes
        if (pathname.startsWith("/admin/posts")) {
          return hasPermission(userRole, "MANAGE_POSTS")
        }

        // Project management routes
        if (pathname.startsWith("/admin/projects")) {
          return hasPermission(userRole, "MANAGE_PROJECTS")
        }

        // Analytics routes
        if (pathname.startsWith("/admin/analytics")) {
          return hasPermission(userRole, "VIEW_ANALYTICS")
        }

        // Contact management routes
        if (pathname.startsWith("/admin/contacts")) {
          return hasPermission(userRole, "MANAGE_CONTACTS")
        }

        // General admin access (dashboard, comments)
        if (pathname.startsWith("/admin")) {
          return hasRoleLevel(userRole, "VIEWER")
        }

        // API routes protection
        if (pathname.startsWith("/api/admin")) {
          return hasRoleLevel(userRole, "VIEWER")
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
  matcher: ["/admin/:path*", "/profile/:path*", "/api/admin/:path*", "/api/auth/:path*", "/api/contact/:path*"],
}
