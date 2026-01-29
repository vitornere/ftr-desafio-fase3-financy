import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { executeAuth } from "@/graphql/execute";
import {
  TransactionsQuery,
  CreateTransactionMutation,
  UpdateTransactionMutation,
  DeleteTransactionMutation,
} from "./operations";
import { queryKeys } from "@/lib/queryKeys";
import type {
  TransactionFiltersInput,
  PaginationInput,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/graphql/graphql";

export function useTransactions(
  filters?: TransactionFiltersInput,
  pagination?: PaginationInput
) {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters, pagination),
    queryFn: () => executeAuth(TransactionsQuery, { filters, pagination }),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      executeAuth(CreateTransactionMutation, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTransactionInput) =>
      executeAuth(UpdateTransactionMutation, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      executeAuth(DeleteTransactionMutation, { input: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.summary.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
