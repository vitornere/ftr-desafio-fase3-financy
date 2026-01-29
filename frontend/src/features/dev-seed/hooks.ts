import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { executeAuth } from "@/graphql/execute"
import type { SeedDevDataInput } from "@/graphql/graphql"
import { getErrorMessage } from "@/lib/errors"
import {
  invalidateAfterCategoryMutation,
  invalidateAfterTransactionMutation,
} from "@/lib/invalidation"
import { toastError, toastSuccess } from "@/lib/toast"

import { IsDevSeedEnabledQuery, SeedDevDataMutation } from "./operations"

/**
 * Query to check if dev seed feature is enabled on the server.
 */
export function useIsDevSeedEnabled() {
  return useQuery({
    queryKey: ["dev-seed", "enabled"],
    queryFn: () => executeAuth(IsDevSeedEnabledQuery),
    // Only run if frontend flag is enabled
    enabled: import.meta.env.VITE_DEV_SEED_ENABLED === "true",
    // Cache for a long time - this rarely changes
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  })
}

/**
 * Mutation to seed development data.
 * Invalidates all relevant queries after success:
 * - transactions list
 * - categories list
 * - dashboard summary
 */
export function useSeedDevData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SeedDevDataInput) =>
      executeAuth(SeedDevDataMutation, { input }),
    onSuccess: (data) => {
      // Invalidate all relevant caches
      invalidateAfterTransactionMutation(queryClient)
      invalidateAfterCategoryMutation(queryClient)

      const { categoriesCreated, transactionsCreated } = data.seedDevData
      toastSuccess(
        `Dados gerados: ${categoriesCreated} categorias, ${transactionsCreated} transações`
      )
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })
}
