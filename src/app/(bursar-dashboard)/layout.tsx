import { BursarSidebar } from "@/components/dashboard/bursar-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function BursarDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard mode="protected">
      <div className="min-h-screen bg-[var(--background)]">
        <BursarSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
