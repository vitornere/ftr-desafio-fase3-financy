import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { executeAuth } from "@/graphql/execute"
import type { CreateCategoryInput, UpdateCategoryInput } from "@/graphql/graphql"
import { getErrorMessage } from "@/lib/errors"
import { invalidateAfterCategoryMutation } from "@/lib/invalidation"
import { queryKeys } from "@/lib/queryKeys"
import { toastError, toastSuccess } from "@/lib/toast"

import {
  CategoriesQuery,
  CreateCategoryMutation,
  DeleteCategoryMutation,
  UpdateCategoryMutation,
} from "./operations"

/**
 * Fetch all categories for the authenticated user.
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => executeAuth(CategoriesQuery),
  })
}

/**
 * Create a new category.
 * Invalidates: categories, transactions, summary
 */
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      executeAuth(CreateCategoryMutation, { input }),
    onSuccess: () => {
      invalidateAfterCategoryMutation(queryClient)
      toastSuccess("Categoria criada")
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })
}

/**
 * Update an existing category.
 * Invalidates: categories, transactions, summary
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateCategoryInput) =>
      executeAuth(UpdateCategoryMutation, { input }),
    onSuccess: () => {
      invalidateAfterCategoryMutation(queryClient)
      toastSuccess("Categoria atualizada")
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })
}

/**
 * Delete a category.
 * Invalidates: categories, transactions, summary
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      executeAuth(DeleteCategoryMutation, { input: { id } }),
    onSuccess: () => {
      invalidateAfterCategoryMutation(queryClient)
      toastSuccess("Categoria removida")
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })
}
