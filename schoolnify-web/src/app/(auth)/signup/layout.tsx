import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Sign Up - Schoolnify",
  description: "Create your Schoolnify school account and start managing your school.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard mode="guest">{children}</AuthGuard>;
}
