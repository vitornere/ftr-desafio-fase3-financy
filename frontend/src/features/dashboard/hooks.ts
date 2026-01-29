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
