/**
 * Dashboard Layout
 * Contains sidebar navigation and main content area
 * Used for all authenticated dashboard pages
 */

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar - Fixed on desktop, hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <DashboardHeader />
        
        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


