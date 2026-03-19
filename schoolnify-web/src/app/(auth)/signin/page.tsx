"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/api/client";
import { authApi } from "@/api/endpoints/auth";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "@/hooks/use-session";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [establishing, setEstablishing] = useState(false);
  const login = useLogin();
  const queryClient = useQueryClient();

  // Handle cross-origin token handoff via URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#auth=")) return;

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("auth");
    const slug = params.get("slug");
    const refreshToken = params.get("rt");

    if (!accessToken || !slug) return;

    // Clear hash immediately
    window.history.replaceState(null, "", window.location.pathname);

    setEstablishing(true);
    authApi
      .establishSession(
        { organization_slug: slug, refresh_token: refreshToken || undefined },
        accessToken
      )
      .then((res) => {
        queryClient.setQueryData(SESSION_QUERY_KEY, res.user);
        window.location.href = "/";
      })
      .catch(() => {
        setEstablishing(false);
        setError("Failed to establish session. Please sign in again.");
      });
  }, [queryClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const targetUrl = new URL(data.subdomain_url);
          const sameHost = window.location.hostname === targetUrl.hostname;

          if (sameHost) {
            // Same subdomain — cookies are already set, just navigate
            window.location.href = "/";
          } else {
            // Cross-origin — pass token via hash to subdomain's signin page
            const slug = targetUrl.hostname.split(".")[0];
            const hashParams = `auth=${data.access_token}&slug=${slug}`;
            window.location.href = `${data.subdomain_url}/signin#${hashParams}`;
          }
        },
        onError: (err) => {
          if (err instanceof ApiError && err.data) {
            const data = err.data as { error?: { message?: string }; detail?: string; message?: string };
            setError(
              data.error?.message ?? data.detail ?? data.message ?? "Invalid email or password."
            );
          } else {
            setError("Network error. Please check your connection.");
          }
        },
      }
    );
  };

  if (establishing) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <p className="text-sm text-[var(--muted)]">Setting up your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background - theme-aware gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/20 via-[var(--background-secondary)] to-[#10B981]/10" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0891B2]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#10B981]/20 blur-[100px] rounded-full" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <span>
              Schoolni<span className="text-[#0891B2]">fy</span>
            </span>
          </Link>

          {/* Main Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Manage your school<br />
              <span className="text-[#0891B2]">from anywhere.</span>
            </h2>
            <p className="text-[var(--muted)] text-lg mb-8 max-w-md">
              Real-time analytics, instant notifications, and complete control over your school operations.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-[#10B981]">10,000+</div>
                <div className="text-sm text-[var(--muted)]">Schools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0891B2]">2M+</div>
                <div className="text-sm text-[var(--muted)]">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#A855F7]">99.9%</div>
                <div className="text-sm text-[var(--muted)]">Uptime</div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-2xl bg-[var(--card)]/80 border border-[var(--border)]/50 backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[var(--muted)] mb-4">
              &quot;Schoolnify transformed how we manage our school. Attendance tracking, grade management, and parent communication — all in one place.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-white">
                SK
              </div>
              <div>
                <div className="font-medium">Sarah Kim</div>
                <div className="text-sm text-[var(--muted)]">Principal, Greenwood Academy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <span>
                Schoolni<span className="text-[#0891B2]">fy</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-[var(--muted)]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-8">
            <button className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            <button className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] font-medium hover:bg-[var(--background-secondary)] hover:border-[var(--border)] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[var(--background)] text-[var(--muted)] uppercase tracking-wider">or sign in with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--muted)] mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--muted)]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded bg-[var(--card)] border-[var(--border)] text-[#0891B2] focus:ring-[#0891B2] focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-sm text-[var(--muted)]">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all shadow-lg shadow-[#0891B2]/20 hover:shadow-[#0891B2]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {login.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[var(--muted)] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0891B2] hover:text-[#22D3EE] font-medium transition-colors">
              Create an account
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-center gap-6 text-xs text-[var(--muted)]">
              <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
              <Link href="/support" className="hover:text-[var(--foreground)] transition-colors">Support</Link>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">
              © 2026 Schoolnify. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
