/**
 * Auth Layout - No navbar or footer for clean auth screens
 * This layout wraps sign-in, sign-up, verify-email, and password reset pages
 * Guest guards are applied per-page (signin/signup only), not here,
 * because verify-email must remain accessible regardless of auth state.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


