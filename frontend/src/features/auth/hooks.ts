import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"

import { executePublic } from "@/graphql/execute"
import type { LoginInput, RegisterInput } from "@/graphql/graphql"
import { clearTokens, setTokens } from "@/lib/auth"
import { getErrorMessage } from "@/lib/errors"
import { invalidateAllAfterLogout } from "@/lib/invalidation"
import { queryKeys } from "@/lib/queryKeys"
import { toastError } from "@/lib/toast"

import { LoginMutation, RegisterMutation } from "./operations"

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: LoginInput) => executePublic(LoginMutation, { input }),
    onSuccess: (result) => {
      setTokens({
        token: result.login.token,
        refreshToken: result.login.refreshToken,
      })
      // Cache user data
      queryClient.setQueryData(queryKeys.auth.me, result.login.user)
      // Invalidate all stale data from previous session
      queryClient.invalidateQueries()
      router.navigate({ to: "/app" })
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: RegisterInput) =>
      executePublic(RegisterMutation, { input }),
    onSuccess: (result) => {
      setTokens({
        token: result.register.token,
        refreshToken: result.register.refreshToken,
      })
      // Cache user data
      queryClient.setQueryData(queryKeys.auth.me, result.register.user)
      // Invalidate all stale data from previous session
      queryClient.invalidateQueries()
      router.navigate({ to: "/app" })
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      clearTokens()
    },
    onSuccess: () => {
      // Clear all cached data
      invalidateAllAfterLogout(queryClient)
      router.navigate({ to: "/login" })
    },
  })
}
