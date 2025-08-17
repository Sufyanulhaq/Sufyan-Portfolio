import type { NextRequest } from "next/server"

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = "Too many requests",
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config

  return {
    check: (
      request: NextRequest,
      identifier?: string,
    ): { success: boolean; limit: number; remaining: number; resetTime: number } => {
      const key = identifier || getClientIdentifier(request)
      const now = Date.now()

      // Clean up expired entries
      if (store[key] && store[key].resetTime < now) {
        delete store[key]
      }

      // Initialize or get current count
      if (!store[key]) {
        store[key] = {
          count: 0,
          resetTime: now + windowMs,
        }
      }

      const current = store[key]
      const isAllowed = current.count < maxRequests

      if (isAllowed) {
        current.count++
      }

      return {
        success: isAllowed,
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - current.count),
        resetTime: current.resetTime,
      }
    },
    message,
  }
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown"

  // Include user agent for additional uniqueness
  const userAgent = request.headers.get("user-agent") || ""

  return `${ip}-${Buffer.from(userAgent).toString("base64").slice(0, 10)}`
}

// Predefined rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: "Too many API requests, please try again later",
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts, please try again later",
})

export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  message: "Too many contact form submissions, please try again later",
})
