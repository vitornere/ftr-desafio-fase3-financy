import type { QueryClient } from "@tanstack/react-query"
import { queryKeys } from "./queryKeys"

// =============================================================================
// Invalidation Helpers
// =============================================================================

/**
 * Invalidation options for transactions.
 */
export interface InvalidateTransactionsOptions {
  /**
   * If provided, also invalidates summary for this specific month/year.
   * If not provided, invalidates all summary queries.
   */
  month?: number
  year?: number
}

/**
 * Invalidate all category-related queries.
 * Use after create/update/delete category operations.
 */
export function invalidateCategories(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
}

/**
 * Invalidate all transaction-related queries.
 * Optionally invalidate summary for specific month/year.
 *
 * @param queryClient - TanStack Query client
 * @param opts - Optional month/year to invalidate specific summary
 */
export function invalidateTransactions(
  queryClient: QueryClient,
  opts?: InvalidateTransactionsOptions
): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })

  // Invalidate summary
  if (opts?.month !== undefined && opts?.year !== undefined) {
    invalidateSummary(queryClient, opts.month, opts.year)
  } else {
    // Fallback: invalidate all summary queries
    queryClient.invalidateQueries({ queryKey: queryKeys.summary.all })
  }
}

/**
 * Invalidate summary for a specific month/year.
 */
export function invalidateSummary(
  queryClient: QueryClient,
  month: number,
  year: number
): void {
  queryClient.invalidateQueries({
    queryKey: queryKeys.summary.byMonthYear(month, year),
  })
}

/**
 * Invalidate all summary queries (all months/years).
 */
export function invalidateAllSummary(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.summary.all })
}

/**
 * Clear all cached data after logout.
 * This removes all queries from the cache.
 */
export function invalidateAllAfterLogout(queryClient: QueryClient): void {
  queryClient.clear()
}

// =============================================================================
// Compound Invalidation Rules
// =============================================================================

/**
 * Invalidation policy for category mutations.
 * After create/update/delete category:
 * - Invalidate categories (list + detail)
 * - Invalidate transactions (category label shown in list)
 * - Invalidate summary (category affects transaction counts)
 *
 * @param queryClient - TanStack Query client
 * @param opts - Optional month/year for targeted summary invalidation
 */
export function invalidateAfterCategoryMutation(
  queryClient: QueryClient,
  opts?: InvalidateTransactionsOptions
): void {
  invalidateCategories(queryClient)
  invalidateTransactions(queryClient, opts)
}

/**
 * Invalidation policy for transaction mutations.
 * After create/update/delete transaction:
 * - Invalidate transactions (list + detail)
 * - Invalidate categories (transactionCount field)
 * - Invalidate summary (amounts change)
 *
 * @param queryClient - TanStack Query client
 * @param opts - Optional month/year for targeted summary invalidation
 */
export function invalidateAfterTransactionMutation(
  queryClient: QueryClient,
  opts?: InvalidateTransactionsOptions
): void {
  invalidateTransactions(queryClient, opts)
  invalidateCategories(queryClient)
}
