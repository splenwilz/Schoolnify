"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/endpoints/auth";
import type { ApiError } from "@/api/client";
import type { VerifiedUser } from "@/types/auth";

export const SESSION_QUERY_KEY = ["session"] as const;

export function useSession() {
  const query = useQuery<VerifiedUser, ApiError>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: authApi.getMe,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: false,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  return async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear client state regardless of backend response
    }
    queryClient.setQueryData(SESSION_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
    window.location.href = "/signin";
  };
}
