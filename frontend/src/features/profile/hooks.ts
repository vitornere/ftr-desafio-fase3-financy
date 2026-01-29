import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { UserMeQuery } from "@/features/auth/operations"
import { executeAuth } from "@/graphql/execute"
import { getErrorMessage } from "@/lib/errors"
import { queryKeys } from "@/lib/queryKeys"
import { toastError, toastSuccess } from "@/lib/toast"

/**
 * Hook to get the current authenticated user.
 * Uses the userMe GraphQL query as the single source of truth.
 */
export function useUserMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => executeAuth(UserMeQuery),
    select: (data) => data.userMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth errors
  })
}

/**
 * User data from the userMe query.
 */
interface UserMeData {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

/**
 * Hook to update user name.
 * Since there's no updateUser mutation in the API, this updates
 * the local cache only as a placeholder for future backend support.
 *
 * When the backend adds updateUser mutation, replace the mutationFn
 * with the actual API call.
 */
export function useUpdateUserName() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newName: string): Promise<UserMeData> => {
      // Get current cached user from the query
      const queryData = queryClient.getQueryData<{ userMe: UserMeData | null }>(queryKeys.auth.me)
      const currentUser = queryData?.userMe

      if (!currentUser) {
        throw new Error("Usuário não encontrado")
      }

      // TODO: When backend supports updateUser mutation, replace this with:
      // return executeAuth(UpdateUserMutation, { input: { name: newName } })

      // For now, simulate success by returning updated user
      // This is a local-only update
      const updatedUser: UserMeData = {
        ...currentUser,
        name: newName.trim(),
        updatedAt: new Date().toISOString(),
      }

      return updatedUser
    },
    onSuccess: (updatedUser) => {
      // Update the cache with new user data
      queryClient.setQueryData(queryKeys.auth.me, { userMe: updatedUser })
      toastSuccess("Alterações salvas!")
    },
    onError: (err) => {
      toastError(getErrorMessage(err) || "Não foi possível salvar alterações.")
    },
  })
}
