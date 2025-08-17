import type { NextRequest, NextResponse } from "next/server"

export interface PerformanceMetrics {
  requestId: string
  method: string
  url: string
  startTime: number
  endTime?: number
  duration?: number
  statusCode?: number
  userAgent?: string
  ip?: string
}

const performanceStore = new Map<string, PerformanceMetrics>()

export function startPerformanceTracking(request: NextRequest): string {
  const requestId = crypto.randomUUID()
  const startTime = performance.now()

  const metrics: PerformanceMetrics = {
    requestId,
    method: request.method,
    url: request.url,
    startTime,
    userAgent: request.headers.get("user-agent") || undefined,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || undefined,
  }

  performanceStore.set(requestId, metrics)
  return requestId
}

export function endPerformanceTracking(requestId: string, statusCode: number): PerformanceMetrics | null {
  const metrics = performanceStore.get(requestId)
  if (!metrics) return null

  const endTime = performance.now()
  const duration = endTime - metrics.startTime

  metrics.endTime = endTime
  metrics.duration = duration
  metrics.statusCode = statusCode

  // Log slow requests (> 1 second)
  if (duration > 1000) {
    console.warn(`[PERFORMANCE] Slow request detected:`, {
      url: metrics.url,
      method: metrics.method,
      duration: `${duration.toFixed(2)}ms`,
      statusCode,
    })
  }

  // Clean up
  performanceStore.delete(requestId)

  return metrics
}

export function addPerformanceHeaders(response: NextResponse, metrics: PerformanceMetrics): NextResponse {
  if (metrics.duration) {
    response.headers.set("X-Response-Time", `${metrics.duration.toFixed(2)}ms`)
  }
  response.headers.set("X-Request-ID", metrics.requestId)
  return response
}

// Cache control helpers
export function setCacheHeaders(response: NextResponse, maxAge: number, staleWhileRevalidate?: number): NextResponse {
  const cacheControl = [`max-age=${maxAge}`]

  if (staleWhileRevalidate) {
    cacheControl.push(`stale-while-revalidate=${staleWhileRevalidate}`)
  }

  response.headers.set("Cache-Control", cacheControl.join(", "))
  return response
}

export function setNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")
  return response
}
