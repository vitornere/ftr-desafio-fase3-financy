import { useQuery } from "@tanstack/react-query"

import { TransactionsQuery } from "@/features/transactions/operations"
import { executeAuth } from "@/graphql/execute"
import { queryKeys } from "@/lib/queryKeys"

/**
 * Fetch recent transactions for the dashboard.
 * Limited to 5 items, ordered by date descending (server default).
 */
export function useRecentTransactions(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.transactions.list({ month, year }, { perPage: 5 }),
    queryFn: () =>
      executeAuth(TransactionsQuery, {
        filters: { month, year },
        pagination: { perPage: 5, page: 1 },
      }),
  })
}
// =============================================================================
// Categories Summary
// =============================================================================

export interface CategorySummary {
  id: string
  title: string
  color: string
  itemsCount: number
  totalAmountCents: number
}

/**
 * Fetch categories summary for the dashboard.
 * Aggregates transactions by category for the given month/year.
 * Returns top 5 categories sorted by total amount (descending).
 */
export function useCategoriesSummary(month: number, year: number, limit = 5) {
  return useQuery({
    queryKey: ["categoriesSummary", month, year, limit] as const,
    queryFn: async () => {
      // Fetch all transactions for the month/year
      // Using a high perPage to get all transactions (API limit)
      const result = await executeAuth(TransactionsQuery, {
        filters: { month, year },
        pagination: { perPage: 1000, page: 1 },
      })

      const transactions = result.transactions?.items ?? []

      // Aggregate by category
      const categoryMap = new Map<
        string,
        {
          id: string
          title: string
          color: string
          itemsCount: number
          totalAmountCents: number
        }
      >()

      for (const tx of transactions) {
        if (!tx.category) continue

        const existing = categoryMap.get(tx.category.id)
        if (existing) {
          existing.itemsCount += 1
          existing.totalAmountCents += tx.amountCents
        } else {
          categoryMap.set(tx.category.id, {
            id: tx.category.id,
            title: tx.category.title,
            color: tx.category.color,
            itemsCount: 1,
            totalAmountCents: tx.amountCents,
          })
        }
      }

      // Convert to array, sort by total descending, limit
      const categories = Array.from(categoryMap.values())
        .sort((a, b) => b.totalAmountCents - a.totalAmountCents)
        .slice(0, limit)

      return { categories }
    },
  })
}

