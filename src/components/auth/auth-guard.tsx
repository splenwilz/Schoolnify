"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";

interface AuthGuardProps {
  children: React.ReactNode;
  mode: "protected" | "guest";
  redirectTo?: string;
}

function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center animate-pulse">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
            />
          </svg>
        </div>
        <div className="w-48 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#0891B2] to-[#10B981] rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

export function AuthGuard({ children, mode, redirectTo }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (mode === "protected" && !isAuthenticated) {
      router.replace(redirectTo ?? "/signin");
    }

    if (mode === "guest" && isAuthenticated) {
      router.replace(redirectTo ?? "/school-admin");
    }
  }, [isLoading, isAuthenticated, mode, redirectTo, router]);

  if (isLoading) return <AuthLoadingSkeleton />;
  if (mode === "protected" && !isAuthenticated) return <AuthLoadingSkeleton />;
  if (mode === "guest" && isAuthenticated) return <AuthLoadingSkeleton />;

  return <>{children}</>;
}
