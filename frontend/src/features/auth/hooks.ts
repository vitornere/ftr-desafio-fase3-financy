import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { executePublic } from "@/graphql/execute";
import { LoginMutation, RegisterMutation } from "./operations";
import { clearTokens, setTokens } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";
import type { LoginInput, RegisterInput } from "@/graphql/graphql";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => executePublic(LoginMutation, { data }),
    onSuccess: (result) => {
      setTokens({
        token: result.login.token,
        refreshToken: result.login.refreshToken,
      });
      queryClient.setQueryData(queryKeys.authMe, result.login.user);
      queryClient.invalidateQueries();
      router.navigate({ to: "/app" });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      executePublic(RegisterMutation, { data }),
    onSuccess: (result) => {
      setTokens({
        token: result.register.token,
        refreshToken: result.register.refreshToken,
      });
      queryClient.setQueryData(queryKeys.authMe, result.register.user);
      queryClient.invalidateQueries();
      router.navigate({ to: "/app" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      clearTokens();
    },
    onSuccess: () => {
      queryClient.clear();
      router.navigate({ to: "/login" });
    },
  });
}
