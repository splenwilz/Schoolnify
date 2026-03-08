import { LibrarianSidebar } from "@/components/dashboard/librarian-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function LibrarianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <LibrarianSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
