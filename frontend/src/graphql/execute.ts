import type { TypedDocumentString } from "@/graphql/graphql"
import { clearTokens, getRefreshToken, getToken } from "@/lib/auth"
import { AppError, createAppErrorFromGraphQL, isUnauthenticatedError } from "@/lib/errors"
import { isJwtExpired } from "@/lib/jwt"
import { performTokenRefresh } from "@/lib/refreshToken"

type Variables<T> = T extends Record<string, never> ? [] : [T]

interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: {
      code?: string
      [key: string]: unknown
    }
  }>
}

/**
 * Leeway in seconds for proactive token refresh.
 * Refresh if token expires within this window to avoid mid-request expiration.
 */
const TOKEN_EXPIRY_LEEWAY_SECONDS = 30

/**
 * Proactively refresh token if it's expired or about to expire.
 * This avoids the cost of a failed request + refresh + retry.
 *
 * @returns The current valid token (possibly refreshed)
 * @throws AppError UNAUTHENTICATED if no tokens available or refresh fails
 */
async function ensureValidToken(): Promise<string> {
  const accessToken = getToken()
  const refreshToken = getRefreshToken()

  // Case 1: No access token
  if (!accessToken) {
    if (refreshToken) {
      // Try proactive refresh
      if (import.meta.env.DEV) {
        console.log("[execute] preflight refresh triggered: no access token, attempting refresh")
      }
      return performTokenRefresh()
    }
    // No tokens at all
    clearTokens()
    throw new AppError("Not authenticated", "UNAUTHENTICATED")
  }

  // Case 2: Access token exists but is expired (or about to expire)
  if (isJwtExpired(accessToken, TOKEN_EXPIRY_LEEWAY_SECONDS)) {
    if (refreshToken) {
      // Proactive refresh before it expires
      if (import.meta.env.DEV) {
        console.log("[execute] preflight refresh triggered: access token expired/expiring")
      }
      return performTokenRefresh()
    }
    // Token expired and no refresh token
    clearTokens()
    throw new AppError("Session expired", "UNAUTHENTICATED")
  }

  // Case 3: Token is valid
  return accessToken
}

/**
 * Make a GraphQL request to the server.
 *
 * @param body - The GraphQL request body
 * @param withAuth - Whether to include Authorization header
 * @param skipRefresh - If true, skip automatic token refresh on 401 (prevents infinite loops)
 */
async function postGraphQL(
  body: unknown,
  withAuth: boolean,
  skipRefresh = false
): Promise<unknown> {
  let token: string | null = null

  // Preflight: ensure valid token for authenticated requests
  // If preflight fails, the error propagates (user not authenticated)
  if (withAuth) {
    token = await ensureValidToken()
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/graphql-response+json",
  }

  if (withAuth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
  } catch (networkError) {
    // Network error (offline, DNS failure, etc.)
    throw new AppError(
      "Erro de conexão. Verifique sua internet.",
      "NETWORK",
      networkError
    )
  }

  let json: GraphQLResponse
  try {
    json = await res.json()
  } catch {
    // Response is not valid JSON
    throw new AppError(
      `Resposta inválida do servidor (${res.status})`,
      "UNKNOWN"
    )
  }

  // GraphQL errors come in the payload even with 200 status
  if (json?.errors?.length) {
    const error = createAppErrorFromGraphQL(json.errors)

    // Fallback: If it's an auth error and we're doing an authenticated request,
    // try to refresh the token and retry (unless we're already retrying).
    // This handles cases like clock skew or token revocation that preflight didn't catch.
    if (withAuth && !skipRefresh && isUnauthenticatedError(error)) {
      if (import.meta.env.DEV) {
        console.log("[execute] fallback refresh triggered: 401/UNAUTHENTICATED from server")
      }
      // Attempt token refresh (handles concurrency internally)
      // If refresh fails, it throws and clears tokens automatically
      await performTokenRefresh()

      // Retry the original request with the new token (skipRefresh=true to prevent loop)
      return postGraphQL(body, withAuth, true)
    }

    throw error
  }

  // HTTP error without GraphQL errors
  if (!res.ok) {
    throw new AppError(`Erro do servidor (${res.status})`, "UNKNOWN")
  }

  return json.data
}

/**
 * Execute a GraphQL query/mutation without authentication.
 * Used for login, register, and other public endpoints.
 */
export async function executePublic<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: Variables<TVariables>
): Promise<TResult> {
  return postGraphQL({ query, variables }, false) as Promise<TResult>
}

/**
 * Execute a GraphQL query/mutation with authentication.
 *
 * Features:
 * - Automatically includes Authorization header with access token
 * - On 401/UNAUTHENTICATED: attempts token refresh and retries once
 * - Concurrency safe: multiple 401s trigger only one refresh
 * - On refresh failure: clears tokens (triggers redirect on next route check)
 */
export async function executeAuth<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: Variables<TVariables>
): Promise<TResult> {
  return postGraphQL({ query, variables }, true) as Promise<TResult>
}
