"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, ShieldCheck } from "lucide-react";
import { useVerifyEmail, useResendVerification, useCreateOrganization } from "@/hooks/use-auth";
import { ApiError } from "@/api/client";

const CODE_LENGTH = 6;

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0891B2]" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const school = searchParams.get("school");
  const userId = searchParams.get("uid");

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const createOrg = useCreateOrganization();

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (!userId || cooldown > 0) return;
    setResendSuccess(false);

    resend.mutate(
      { user_id: userId },
      {
        onSuccess: () => {
          setResendSuccess(true);
          setCooldown(60);
          setTimeout(() => setResendSuccess(false), 5000);
        },
        onError: (err) => {
          if (err instanceof ApiError && err.data) {
            const data = err.data as Record<string, unknown>;
            const errObj = data.error as Record<string, unknown> | undefined;
            const message = errObj?.message ?? data.detail ?? data.message;
            setError(typeof message === "string" ? message : "Failed to resend code.");
          } else {
            setError("Network error. Please try again.");
          }
        },
      }
    );
  };

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const submitCode = useCallback(
    (code: string) => {
      if (!token) return;
      setError("");

      verify.mutate(
        { code, pending_authentication_token: token },
        {
          onSuccess: (verifyData) => {
            if (!school) {
              router.push("/school-admin");
              return;
            }

            createOrg.mutate(
              {
                school_name: school,
                refresh_token: verifyData.refresh_token,
                accessToken: verifyData.access_token,
              },
              {
                onSuccess: (orgData) => {
                  // Redirect to subdomain with token handoff via hash
                  // The subdomain's signin page will call establish-session to set cookies
                  const targetUrl = new URL(orgData.subdomain_url);
                  const slug = targetUrl.hostname.split(".")[0];
                  const hashParams = `auth=${verifyData.access_token}&slug=${slug}`;
                  window.location.href = `${orgData.subdomain_url}/signin#${hashParams}`;
                },
                onError: (orgErr) => {
                  if (orgErr instanceof ApiError && orgErr.data) {
                    const data = orgErr.data as Record<string, unknown>;
                    const errObj = data.error as Record<string, unknown> | undefined;
                    const message = errObj?.message ?? data.detail ?? data.message;
                    setError(typeof message === "string" ? message : "Failed to set up school. Please try again.");
                  } else {
                    setError("Network error during school setup. Please try again.");
                  }
                },
              }
            );
          },
          onError: (err) => {
            if (err instanceof ApiError && err.data) {
              const data = err.data as Record<string, unknown>;
              const errObj = data.error as Record<string, unknown> | undefined;
              const message = errObj?.message ?? data.detail ?? data.message;
              setError(typeof message === "string" ? message : "Verification failed. Please try again.");
            } else {
              setError("Network error. Please check your connection.");
            }
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
          },
        }
      );
    },
    [token, verify]
  );

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError("");

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (digit && index === CODE_LENGTH - 1) {
      const code = newDigits.join("");
      if (code.length === CODE_LENGTH) {
        submitCode(code);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const code = digits.join("");
      if (code.length === CODE_LENGTH) {
        submitCode(code);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newDigits = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    setError("");

    if (pasted.length === CODE_LENGTH) {
      submitCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  // No token. invalid link
  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[#EF4444]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Invalid Verification Link</h1>
          <p className="text-[var(--muted)] mb-6 text-sm">This link is missing the verification token. Please sign up again.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10B981] text-white font-medium hover:bg-[#059669] transition-all"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Main. OTP input
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/20 via-[var(--background-secondary)] to-[#10B981]/10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#0891B2]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[#10B981]/15 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-xl w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <span>Schoolni<span className="text-[#0891B2]">fy</span></span>
          </Link>

          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Almost there!<br />
              <span className="text-[#10B981]">Verify your email.</span>
            </h2>
            <p className="text-[var(--muted)] text-lg mb-8 max-w-md">
              We sent a 6-digit code to your email. Enter it to activate your school account.
            </p>
            <div className="space-y-4">
              {["Check your inbox (and spam folder)", "Code expires in 10 minutes", "You can request a new code if needed"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] text-sm">✓</div>
                  <span className="text-[var(--muted)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)]/80 border border-[var(--border)]/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm">Why verify?</div>
                <div className="text-sm text-[var(--muted)]">Email verification keeps your school data secure and prevents unauthorized access.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel. OTP Form */}
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
              <span>Schoolni<span className="text-[#0891B2]">fy</span></span>
            </Link>
          </div>

          {/* Icon */}
          <div className="flex justify-center lg:justify-start mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#0891B2]" />
            </div>
          </div>

          <div className="text-center lg:text-left mb-2">
            <h1 className="text-3xl font-bold mb-2">Check your email</h1>
            <p className="text-[var(--muted)]">
              We sent a verification code to{" "}
              {email ? (
                <span className="font-medium text-[var(--foreground)]">{email}</span>
              ) : (
                "your email"
              )}
            </p>
            {school && (
              <p className="text-sm text-[var(--muted)] mt-1">
                for <span className="font-medium text-[var(--foreground)]">{school}</span>
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20">
              <p className="text-sm text-[#EF4444] font-medium">{error}</p>
            </div>
          )}

          {/* OTP Inputs */}
          <div className="mt-8 mb-6">
            <label className="block text-sm font-medium text-[var(--muted)] mb-3">
              Enter 6-digit code
            </label>
            <div className="flex gap-3 justify-center lg:justify-start" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={verify.isPending || createOrg.isPending}
                  className={`
                    w-12 h-14 text-center text-xl font-semibold rounded-xl
                    bg-[var(--card)] border-2 text-[var(--foreground)]
                    focus:outline-none transition-all
                    disabled:opacity-50
                    ${error
                      ? "border-[#EF4444]/50 focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                      : digit
                        ? "border-[#10B981]/50 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                        : "border-[var(--border)] focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2]"
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => {
              const code = digits.join("");
              if (code.length === CODE_LENGTH) submitCode(code);
            }}
            disabled={verify.isPending || createOrg.isPending || digits.join("").length < CODE_LENGTH}
            className="w-full py-4 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {createOrg.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up your school...
              </>
            ) : verify.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend success */}
          {resendSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
              <p className="text-sm text-[#10B981] font-medium text-center">Verification code resent! Check your inbox.</p>
            </div>
          )}

          {/* Help text */}
          <div className="mt-6 space-y-3 text-center lg:text-left">
            <p className="text-sm text-[var(--muted)]">
              Didn&apos;t receive the code?{" "}
              {userId ? (
                <button
                  onClick={handleResend}
                  disabled={resend.isPending || cooldown > 0}
                  className="text-[#10B981] hover:text-[#22D3EE] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resend.isPending
                    ? "Sending..."
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend code"}
                </button>
              ) : (
                <Link href="/signup" className="text-[#10B981] hover:text-[#22D3EE] font-medium transition-colors">
                  Sign up again
                </Link>
              )}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Wrong email?{" "}
              <Link href="/signup" className="text-[#10B981] hover:text-[#22D3EE] font-medium transition-colors">
                Go back to sign up
              </Link>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-center gap-6 text-xs text-[var(--muted)]">
              <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
              <Link href="/support" className="hover:text-[var(--foreground)] transition-colors">Support</Link>
            </div>
            <p className="text-center text-xs text-[var(--muted)] mt-4">© 2026 Schoolnify. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
