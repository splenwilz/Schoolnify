"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileDown, DollarSign } from "lucide-react";
import { financialTransactions } from "@/lib/demo-data";
import { FinancialHealthBanner } from "./_components/financial-health-banner";
import { FinanceStatCards } from "./_components/finance-stat-cards";
import { RevenueTrendChart } from "./_components/revenue-trend-chart";
import { FeeTypeDistribution } from "./_components/fee-type-distribution";
import { TransactionTable } from "./_components/transaction-table";
import { UpcomingPaymentsCard } from "./_components/upcoming-payments-card";
import { PaymentMethodsCard } from "./_components/payment-methods-card";
import { EmptyState } from "./_components/empty-state";
import { BulkActionsBar } from "./_components/bulk-actions-bar";

const ITEMS_PER_PAGE = 10;

const tabs = [
  { id: "all", label: "All", count: financialTransactions.length },
  {
    id: "completed",
    label: "Completed",
    count: financialTransactions.filter((t) => t.status === "completed").length,
  },
  {
    id: "pending",
    label: "Pending",
    count: financialTransactions.filter((t) => t.status === "pending").length,
  },
  {
    id: "overdue",
    label: "Overdue",
    count: financialTransactions.filter((t) => t.status === "overdue").length,
  },
];

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return financialTransactions.filter((txn) => {
      if (activeTab !== "all" && txn.status !== activeTab) return false;
      if (typeFilter && txn.type !== typeFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !txn.studentName.toLowerCase().includes(query) &&
          !txn.id.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, searchQuery, typeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, typeFilter]);

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map((t) => t.id));
    }
  };

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setActiveTab("all");
  };

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
            Finances
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Track fee collection, payments, and financial reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/school-admin/finances/collect"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <DollarSign className="w-4 h-4" />
            Collect Fee
          </Link>
        </div>
      </div>

      {/* Row 1: Financial Health Banner + Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <div className="lg:col-span-5">
          <FinancialHealthBanner />
        </div>
        <div className="lg:col-span-7">
          <FinanceStatCards />
        </div>
      </div>

      {/* Row 2: Revenue Trend + Fee Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <RevenueTrendChart />
        </div>
        <div className="lg:col-span-1">
          <FeeTypeDistribution />
        </div>
      </div>

      {/* Row 3: Transaction Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {filteredTransactions.length === 0 ? (
            <EmptyState onClearFilters={clearAllFilters} />
          ) : (
            <TransactionTable
              transactions={filteredTransactions}
              selectedTransactions={selectedTransactions}
              onSelectAll={handleSelectAll}
              onSelectTransaction={handleSelectTransaction}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />
          )}
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <UpcomingPaymentsCard />
          <PaymentMethodsCard />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar
        count={selectedTransactions.length}
        onClear={() => setSelectedTransactions([])}
      />
    </motion.div>
  );
}
