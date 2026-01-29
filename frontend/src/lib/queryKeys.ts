import type {
  TransactionFiltersInput,
  PaginationInput,
} from "@/graphql/graphql"

// =============================================================================
// Stable Key Helper
// =============================================================================

/**
 * Creates a stable, serializable key from an object.
 * - Removes undefined values
 * - Sorts keys recursively for consistent ordering
 * - Returns a JSON string for use in query keys
 *
 * This ensures that { a: 1, b: 2 } and { b: 2, a: 1 } produce the same key.
 */
function stableStringify(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return ""
  }

  if (typeof obj !== "object") {
    return JSON.stringify(obj)
  }

  if (Array.isArray(obj)) {
    return JSON.stringify(obj.map(stableStringify))
  }

  // Sort keys and recursively process
  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort()
  const entries: Record<string, unknown> = {}

  for (const key of sortedKeys) {
    const value = (obj as Record<string, unknown>)[key]
    // Skip undefined values
    if (value !== undefined) {
      entries[key] = typeof value === "object" ? JSON.parse(stableStringify(value)) : value
    }
  }

  return JSON.stringify(entries)
}

/**
 * Creates a stable key segment from filter/pagination objects.
 * Returns an empty string if the object is empty or all undefined.
 */
function stableKey(obj: unknown): string {
  const result = stableStringify(obj)
  return result === "{}" ? "" : result
}

// =============================================================================
// Query Keys
// =============================================================================

/**
 * Centralized query keys for TanStack Query.
 * This is the SINGLE SOURCE OF TRUTH for all query keys in the application.
 *
 * Key structure follows a hierarchical pattern:
 * - `.all` - Base key for invalidating all queries in a domain
 * - `.list()` - List queries (with optional filters/pagination)
 * - `.detail(id)` - Single item queries
 *
 * Usage:
 * - Use `.all` for broad invalidation (invalidates list + detail)
 * - Use specific keys for targeted invalidation
 */
export const queryKeys = {
  // ===========================================================================
  // Auth
  // ===========================================================================
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },

  // ===========================================================================
  // Categories
  // ===========================================================================
  categories: {
    all: ["categories"] as const,
    list: () => ["categories", "list"] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },

  // ===========================================================================
  // Transactions
  // ===========================================================================
  transactions: {
    all: ["transactions"] as const,
    list: (filters?: TransactionFiltersInput, pagination?: PaginationInput) => {
      const filterKey = stableKey(filters)
      const paginationKey = stableKey(pagination)
      return ["transactions", "list", filterKey, paginationKey] as const
    },
    detail: (id: string) => ["transactions", "detail", id] as const,
  },

  // ===========================================================================
  // Summary (Dashboard)
  // ===========================================================================
  summary: {
    all: ["summary"] as const,
    byMonthYear: (month: number, year: number) =>
      ["summary", "byMonthYear", month, year] as const,
  },
} as const

// =============================================================================
// Type Exports
// =============================================================================

export type QueryKeys = typeof queryKeys
