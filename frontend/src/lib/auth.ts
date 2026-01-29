const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Get the current access token from localStorage.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Alias for getToken() - returns the access token.
 * Provided for semantic clarity in code that deals with both token types.
 */
export function getAccessToken(): string | null {
  return getToken();
}

/**
 * Get the current refresh token from localStorage.
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Store both access token and refresh token.
 * Called after login, register, or successful token refresh.
 */
export function setTokens({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Clear all tokens from localStorage.
 * Called on logout or when refresh token is invalid/expired.
 */
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user has an access token stored.
 * Note: This only checks token presence, not validity.
 * Token validity is checked on API calls; if expired, refresh flow handles it.
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
