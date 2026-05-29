"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/endpoints/auth";
import { SESSION_QUERY_KEY } from "@/hooks/use-session";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Pre-populate session cache so AuthGuard sees user immediately
      queryClient.setQueryData(SESSION_QUERY_KEY, data.user);
    },
  });
}

export function useAdminSignup() {
  return useMutation({
    mutationFn: authApi.adminSignup,
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,
  });
}

export function useCreateOrganization() {
  return useMutation({
    mutationFn: (params: { school_name: string; refresh_token?: string; accessToken?: string }) => {
      const { accessToken, ...data } = params;
      return authApi.createOrganization(data, accessToken);
    },
  });
}
