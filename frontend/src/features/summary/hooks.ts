import { useQuery } from "@tanstack/react-query"

import { executeAuth } from "@/graphql/execute"
import { queryKeys } from "@/lib/queryKeys"

import { DashboardSummaryQuery } from "./operations"

/**
 * Fetch dashboard summary for a specific month and year.
 * Returns balance, income, and expense totals.
 */
export function useDashboardSummary(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.summary.byMonthYear(month, year),
    queryFn: () => executeAuth(DashboardSummaryQuery, { month, year }),
  })
}
