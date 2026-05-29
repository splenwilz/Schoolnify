"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./_components/overview-tab";
import { FeeStructureTab } from "./_components/fee-structure-tab";
import { InvoicesTab } from "./_components/invoices-tab";
import { ExpensesTab } from "./_components/expenses-tab";
import { PayrollTab } from "./_components/payroll-tab";
import { ReportsTab } from "./_components/reports-tab";

const mainTabs = [
  { id: "overview", label: "Overview" },
  { id: "fee-structure", label: "Fee Structure" },
  { id: "invoices", label: "Invoices" },
  { id: "expenses", label: "Expenses" },
  { id: "payroll", label: "Payroll" },
  { id: "reports", label: "Reports" },
] as const;

type MainTab = (typeof mainTabs)[number]["id"];

export default function BursarDashboardPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("overview");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Bursar Dashboard
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage fees, payments, expenses, and financial reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <DollarSign className="w-4 h-4" />
            Collect Fee
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--background-secondary)] mb-6 w-fit overflow-x-auto">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "fee-structure" && <FeeStructureTab />}
      {activeTab === "invoices" && <InvoicesTab />}
      {activeTab === "expenses" && <ExpensesTab />}
      {activeTab === "payroll" && <PayrollTab />}
      {activeTab === "reports" && <ReportsTab />}
    </motion.div>
  );
}
