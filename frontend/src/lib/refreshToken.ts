/**
 * Token refresh logic with concurrency control.
 *
 * Key features:
 * - Only one refresh call happens at a time (concurrency lock)
 * - Multiple concurrent 401s will wait for the single refresh
 * - On success: stores new tokens and returns new access token
 * - On failure: clears tokens and throws AppError UNAUTHENTICATED
 */

import { RefreshTokenMutation } from "@/features/auth/operations"
import { clearTokens, getRefreshToken, setTokens } from "@/lib/auth"
import { AppError } from "@/lib/errors"

/**
 * Module-level promise lock to prevent concurrent refresh calls.
 * When a refresh is in progress, other callers await this promise.
 */
let refreshPromise: Promise<string> | null = null

/**
 * Perform token refresh.
 *
 * - If a refresh is already in progress, returns the existing promise
 * - If no refresh token exists, throws immediately
 * - On success, stores new tokens and returns the new access token
 * - On failure, clears tokens and throws AppError UNAUTHENTICATED
 */
export async function performTokenRefresh(): Promise<string> {
  // If refresh already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise
  }

  const currentRefreshToken = getRefreshToken()

  if (!currentRefreshToken) {
    clearTokens()
    throw new AppError("No refresh token available", "UNAUTHENTICATED")
  }

  // Set the lock - all concurrent callers will await this promise
  refreshPromise = executeRefresh(currentRefreshToken)

  try {
    const newAccessToken = await refreshPromise
    return newAccessToken
  } finally {
    // Clear the lock when done (success or failure)
    refreshPromise = null
  }
}

/**
 * Execute the actual refresh API call.
 * This is a separate function to keep the locking logic clean.
 */
async function executeRefresh(refreshToken: string): Promise<string> {
  const body = {
    query: RefreshTokenMutation.toString(),
    variables: {
      input: { refreshToken },
    },
  }

  let res: Response
  try {
    res = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/graphql-response+json",
        // NOTE: Do NOT include Authorization header - refresh uses the refresh token in body
      },
      body: JSON.stringify(body),
    })
  } catch {
    // Network error during refresh
    clearTokens()
    throw new AppError("Network error during token refresh", "UNAUTHENTICATED")
  }

  let json: {
    data?: { refreshToken?: { token: string; refreshToken: string } }
    errors?: Array<{ message: string; extensions?: { code?: string } }>
  }

  try {
    json = await res.json()
  } catch {
    clearTokens()
    throw new AppError("Invalid response during token refresh", "UNAUTHENTICATED")
  }

  // Check for GraphQL errors (e.g., invalid/expired refresh token)
  if (json.errors?.length) {
    clearTokens()
    const message = json.errors[0]?.message ?? "Token refresh failed"
    throw new AppError(message, "UNAUTHENTICATED")
  }

  // Validate response structure
  if (!json.data?.refreshToken?.token || !json.data?.refreshToken?.refreshToken) {
    clearTokens()
    throw new AppError("Invalid refresh response", "UNAUTHENTICATED")
  }

  // Store the new tokens (rotation: both access and refresh are new)
  setTokens({
    token: json.data.refreshToken.token,
    refreshToken: json.data.refreshToken.refreshToken,
  })

  return json.data.refreshToken.token
}

/**
 * Check if a refresh is currently in progress.
 * Useful for debugging or conditional logic.
 */
export function isRefreshInProgress(): boolean {
  return refreshPromise !== null
}
