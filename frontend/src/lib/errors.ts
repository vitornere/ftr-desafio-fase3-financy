/**
 * Application error codes for categorizing errors.
 */
export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "NETWORK"
  | "UNKNOWN"

/**
 * Custom error class for application-level errors.
 * Provides structured error information with code and optional details.
 */
export class AppError extends Error {
  readonly code: AppErrorCode
  readonly details?: unknown

  constructor(message: string, code: AppErrorCode = "UNKNOWN", details?: unknown) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.details = details
  }
}

/**
 * GraphQL error structure from responses.
 */
interface GraphQLError {
  message: string
  extensions?: {
    code?: string
    [key: string]: unknown
  }
}

/**
 * Check if an object looks like a GraphQL error response.
 */
function hasGraphQLErrors(
  err: unknown
): err is { response?: { errors?: GraphQLError[] }; errors?: GraphQLError[] } {
  if (typeof err !== "object" || err === null) return false
  const e = err as Record<string, unknown>
  return (
    Array.isArray(e.errors) ||
    (typeof e.response === "object" &&
      e.response !== null &&
      Array.isArray((e.response as Record<string, unknown>).errors))
  )
}

/**
 * Extract error code from GraphQL error extensions.
 */
function extractCodeFromGraphQLError(errors: GraphQLError[]): AppErrorCode {
  const firstError = errors[0]
  const code = firstError?.extensions?.code

  if (typeof code === "string") {
    const upperCode = code.toUpperCase()
    if (upperCode === "UNAUTHENTICATED" || upperCode === "UNAUTHORIZED") {
      return "UNAUTHENTICATED"
    }
    if (upperCode === "FORBIDDEN") {
      return "FORBIDDEN"
    }
    if (upperCode === "NOT_FOUND") {
      return "NOT_FOUND"
    }
    if (upperCode === "BAD_USER_INPUT" || upperCode === "VALIDATION_ERROR") {
      return "VALIDATION"
    }
  }

  return "UNKNOWN"
}

/**
 * Get a user-friendly error message from any error type.
 *
 * @param err - Unknown error (could be Error, AppError, GraphQL response, etc.)
 * @returns User-friendly error message string
 */
export function getErrorMessage(err: unknown): string {
  // AppError - use its message directly
  if (err instanceof AppError) {
    return err.message
  }

  // GraphQL errors (from response)
  if (hasGraphQLErrors(err)) {
    const errors = err.errors ?? err.response?.errors
    if (errors && errors.length > 0) {
      return errors[0].message
    }
  }

  // Standard Error
  if (err instanceof Error) {
    return err.message
  }

  // String error
  if (typeof err === "string") {
    return err
  }

  // Fallback
  return "Algo deu errado. Tente novamente."
}

/**
 * Check if an error is an authentication error.
 *
 * @param err - Unknown error
 * @returns true if the error indicates the user is not authenticated
 */
export function isUnauthenticatedError(err: unknown): boolean {
  // Check AppError code
  if (err instanceof AppError && err.code === "UNAUTHENTICATED") {
    return true
  }

  // Check error message patterns
  const message = getErrorMessage(err).toLowerCase()
  const patterns = [
    "not authenticated",
    "não autenticado",
    "unauthorized",
    "unauthenticated",
    "invalid token",
    "token expired",
    "jwt expired",
  ]

  return patterns.some((pattern) => message.includes(pattern))
}

/**
 * Create an AppError from a GraphQL error response.
 */
export function createAppErrorFromGraphQL(
  errors: GraphQLError[],
  fallbackMessage = "Erro na requisição"
): AppError {
  const message = errors[0]?.message ?? fallbackMessage
  const code = extractCodeFromGraphQLError(errors)
  return new AppError(message, code, { errors })
}
