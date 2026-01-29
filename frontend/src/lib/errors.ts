/**
 * Application error codes for categorizing errors.
 */
export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "NETWORK"
  | "INTERNAL_SERVER_ERROR"
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
    if (upperCode === "INTERNAL_SERVER_ERROR") {
      return "INTERNAL_SERVER_ERROR"
    }
  }

  return "UNKNOWN"
}

/**
 * Patterns that indicate an internal server error that should not be shown to users.
 * These typically contain stack traces, file paths, or technical details.
 */
const INTERNAL_ERROR_PATTERNS = [
  /prismaClient\./i, // Prisma client errors
  /\.ts:\d+:\d+/, // TypeScript file paths with line numbers
  /\.js:\d+:\d+/, // JavaScript file paths with line numbers
  /node_modules\//i, // Node modules paths
  /at\s+\w+\s*\(/, // Stack trace patterns like "at Function ("
  /Invalid `.*` invocation/i, // Prisma invocation errors
  /The table .* does not exist/i, // Database table errors
  /ECONNREFUSED/i, // Connection refused errors
  /ETIMEDOUT/i, // Timeout errors
]

/**
 * Check if an error message appears to be an internal server error
 * that should be sanitized before showing to users.
 */
function isInternalErrorMessage(message: string): boolean {
  return INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(message))
}

/**
 * Default user-friendly messages for different error types.
 */
const FRIENDLY_ERROR_MESSAGES: Record<string, string> = {
  INTERNAL_SERVER_ERROR: "Erro interno do servidor. Tente novamente mais tarde.",
  UNKNOWN: "Algo deu errado. Tente novamente.",
}

/**
 * Map of known error messages to their Portuguese translations.
 * Keys are lowercase for case-insensitive matching.
 */
const ERROR_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "invalid credentials": "E-mail ou senha incorretos.",
  "user not found": "Usuário não encontrado.",
  "email already exists": "Este e-mail já está cadastrado.",
  "email already in use": "Este e-mail já está em uso.",
  "password too short": "A senha é muito curta.",
  "invalid email": "E-mail inválido.",
  "invalid password": "Senha inválida.",
  "unauthorized": "Não autorizado.",
  "forbidden": "Acesso negado.",
  "not found": "Não encontrado.",
}

/**
 * Try to translate a known error message to Portuguese.
 * Returns the original message if no translation is found.
 */
function translateErrorMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase().trim()
  return ERROR_MESSAGE_TRANSLATIONS[lowerMessage] ?? null
}

/**
 * Sanitize an error message, returning a friendly message if it contains internal details.
 */
function sanitizeErrorMessage(message: string, code: AppErrorCode): string {
  // First, try to translate known error messages
  const translation = translateErrorMessage(message)
  if (translation) {
    return translation
  }

  // If the message looks like an internal error, return a friendly message
  if (isInternalErrorMessage(message)) {
    return FRIENDLY_ERROR_MESSAGES[code] ?? FRIENDLY_ERROR_MESSAGES.UNKNOWN
  }

  // For internal server errors without a known message, return a generic friendly message
  if (code === "INTERNAL_SERVER_ERROR") {
    return FRIENDLY_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  }

  return message
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
      const code = extractCodeFromGraphQLError(errors)
      const rawMessage = errors[0].message
      return sanitizeErrorMessage(rawMessage, code)
    }
  }

  // Standard Error
  if (err instanceof Error) {
    const message = err.message
    // Check if standard error also contains internal details
    if (isInternalErrorMessage(message)) {
      return FRIENDLY_ERROR_MESSAGES.UNKNOWN
    }
    return message
  }

  // String error
  if (typeof err === "string") {
    if (isInternalErrorMessage(err)) {
      return FRIENDLY_ERROR_MESSAGES.UNKNOWN
    }
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
  const code = extractCodeFromGraphQLError(errors)
  const rawMessage = errors[0]?.message ?? fallbackMessage
  const message = sanitizeErrorMessage(rawMessage, code)
  return new AppError(message, code, { errors })
}
