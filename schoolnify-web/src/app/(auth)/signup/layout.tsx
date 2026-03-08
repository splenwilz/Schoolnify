import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Schoolnify",
  description: "Create your Schoolnify school account and start managing your school.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
