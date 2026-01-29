import { useQuery } from "@tanstack/react-query";
import { executeAuth } from "@/graphql/execute";
import { DashboardSummaryQuery } from "./operations";
import { queryKeys } from "@/lib/queryKeys";

export function useDashboardSummary(month: number, year: number) {
  return useQuery({
    queryKey: queryKeys.summary.byMonth(month, year),
    queryFn: () => executeAuth(DashboardSummaryQuery, { month, year }),
  });
}
