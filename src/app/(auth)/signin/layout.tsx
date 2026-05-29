import { AuthGuard } from "@/components/auth/auth-guard";

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard mode="guest">{children}</AuthGuard>;
}
