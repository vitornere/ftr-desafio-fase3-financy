import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { executeAuth } from "@/graphql/execute";
import {
  CategoriesQuery,
  CreateCategoryMutation,
  UpdateCategoryMutation,
  DeleteCategoryMutation,
} from "./operations";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/graphql/graphql";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => executeAuth(CategoriesQuery),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      executeAuth(CreateCategoryMutation, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCategoryInput) =>
      executeAuth(UpdateCategoryMutation, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      executeAuth(DeleteCategoryMutation, { input: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}
