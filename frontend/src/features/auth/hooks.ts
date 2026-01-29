import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"

import { executePublic } from "@/graphql/execute"
import type { LoginInput, RegisterInput } from "@/graphql/graphql"
import { clearTokens, setTokens } from "@/lib/auth"
import { getErrorMessage } from "@/lib/errors"
import { invalidateAllAfterLogout } from "@/lib/invalidation"
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
      // Invalidate all stale data from previous session
      // The userMe query will be fetched fresh when needed
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
      // Invalidate all stale data from previous session
      // The userMe query will be fetched fresh when needed
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
      // Clear all cached data including userMe
      invalidateAllAfterLogout(queryClient)
      router.navigate({ to: "/login" })
    },
  })
}
