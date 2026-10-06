import { QueryClient, QueryCache } from "@tanstack/react-query";
import { ApiError } from "@/api/client";

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Session query expects 401 for unauthenticated users
        if (query.queryKey[0] === "session") return;
        // Any other query returning 401 means session expired → redirect
        if (error instanceof ApiError && error.status === 401 && typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
