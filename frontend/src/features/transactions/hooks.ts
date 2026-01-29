import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { executeAuth } from "@/graphql/execute"
import type {
  CreateTransactionInput,
  PaginationInput,
  TransactionFiltersInput,
  UpdateTransactionInput,
} from "@/graphql/graphql"
import { invalidateAfterTransactionMutation } from "@/lib/invalidation"
import { queryKeys } from "@/lib/queryKeys"

import {
  CreateTransactionMutation,
  DeleteTransactionMutation,
  TransactionsQuery,
  UpdateTransactionMutation,
} from "./operations"

/**
 * Fetch transactions with optional filters and pagination.
 * Uses stable query keys for consistent caching.
 */
export function useTransactions(
  filters?: TransactionFiltersInput,
  pagination?: PaginationInput
) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters, pagination),
    queryFn: () => executeAuth(TransactionsQuery, { filters, pagination }),
  })
}

/**
 * Create a new transaction.
 * Invalidates: transactions, categories (transactionCount), summary
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      executeAuth(CreateTransactionMutation, { input }),
    onSuccess: () => {
      // Invalidate all related queries
      // Note: If we had access to the current month/year from context,
      // we could pass it here for more targeted invalidation
      invalidateAfterTransactionMutation(queryClient)
    },
  })
}

/**
 * Update an existing transaction.
 * Invalidates: transactions, categories (transactionCount), summary
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateTransactionInput) =>
      executeAuth(UpdateTransactionMutation, { input }),
    onSuccess: () => {
      invalidateAfterTransactionMutation(queryClient)
    },
  })
}

/**
 * Delete a transaction.
 * Invalidates: transactions, categories (transactionCount), summary
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      executeAuth(DeleteTransactionMutation, { input: { id } }),
    onSuccess: () => {
      invalidateAfterTransactionMutation(queryClient)
    },
  })
}
