import { NextResponse } from "next/server"

export interface AppError extends Error {
  statusCode?: number
  code?: string
  details?: Record<string, any>
}

export class ValidationError extends Error {
  statusCode = 400
  code = "VALIDATION_ERROR"

  constructor(
    message: string,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends Error {
  statusCode = 401
  code = "AUTHENTICATION_ERROR"

  constructor(message = "Authentication required") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends Error {
  statusCode = 403
  code = "AUTHORIZATION_ERROR"

  constructor(message = "Insufficient permissions") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends Error {
  statusCode = 404
  code = "NOT_FOUND"

  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
  }
}

export class RateLimitError extends Error {
  statusCode = 429
  code = "RATE_LIMIT_EXCEEDED"

  constructor(message = "Rate limit exceeded") {
    super(message)
    this.name = "RateLimitError"
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  // Generic error handling
  const appError = error as AppError
  const statusCode = appError.statusCode || 500
  const message = statusCode === 500 ? "Internal server error" : appError.message

  return NextResponse.json(
    {
      error: message,
      code: appError.code || "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && { stack: appError.stack }),
    },
    { status: statusCode },
  )
}

export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
): (...args: T) => Promise<R | NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
