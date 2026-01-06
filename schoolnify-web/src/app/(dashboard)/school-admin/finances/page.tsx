"use client";

/**
 * Finances Page - Stripe-Inspired Dashboard
 * Features: Revenue overview, transactions table, charts
 * @see Stripe Dashboard - Payments page
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { feeSummary, financialTransactions } from "@/lib/demo-data";

// Tab options
const tabs = [
  { id: "all", label: "All", count: financialTransactions.length },
  { id: "completed", label: "Completed", count: financialTransactions.filter(t => t.status === "completed").length },
  { id: "pending", label: "Pending", count: financialTransactions.filter(t => t.status === "pending").length },
  { id: "overdue", label: "Overdue", count: financialTransactions.filter(t => t.status === "overdue").length },
];

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return financialTransactions.filter(txn => {
      if (activeTab !== "all" && txn.status !== activeTab) return false;
      if (typeFilter && txn.type !== typeFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!txn.studentName.toLowerCase().includes(query) && !txn.id.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, searchQuery, typeFilter]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Finances</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Track fee collection, payments, and financial reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Export
          </button>
          <Link
            href="/school-admin/finances/collect"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Collect Fee
          </Link>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Total Collected</p>
              <p className="text-3xl font-semibold text-[var(--foreground)] mt-1">{formatCurrency(feeSummary.totalCollected)}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-[#10B981]">↑ {feeSummary.collectionRate}%</span>
              <span className="text-[var(--muted)]">collection rate</span>
            </div>
            <div className="text-sm text-[var(--muted)]">
              of {formatCurrency(feeSummary.totalExpected)} expected
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#10B981] rounded-full transition-all"
              style={{ width: `${feeSummary.collectionRate}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Outstanding</p>
          <p className="text-2xl font-semibold text-[#F59E0B] mt-2">{formatCurrency(feeSummary.totalOutstanding)}</p>
          <p className="text-sm text-[var(--muted)] mt-1">{feeSummary.overdueAccounts} accounts</p>
        </div>

        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">This Month</p>
          <p className="text-2xl font-semibold text-[#0891B2] mt-2">{formatCurrency(feeSummary.thisMonthCollected)}</p>
          <p className="text-sm text-[var(--muted)] mt-1">collected</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/school-admin/finances/invoices"
          className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[#0891B2]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">Generate Invoices</p>
            <p className="text-xs text-[var(--muted)]">Create fee invoices</p>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        <Link
          href="/school-admin/finances/reminders"
          className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[#0891B2]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">Send Reminders</p>
            <p className="text-xs text-[var(--muted)]">{feeSummary.overdueAccounts} overdue accounts</p>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        <Link
          href="/school-admin/finances/reports"
          className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[#0891B2]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#A855F7]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#A855F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">Financial Reports</p>
            <p className="text-xs text-[var(--muted)]">Monthly summaries</p>
          </div>
          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#0891B2] text-[#0891B2]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
              activeTab === tab.id
                ? "bg-[#0891B2]/10 text-[#0891B2]"
                : "bg-[var(--background-secondary)] text-[var(--muted)]"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
        >
          <option value="">All types</option>
          <option value="tuition">Tuition</option>
          <option value="activity">Activity</option>
          <option value="supplies">Supplies</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Transaction</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredTransactions.map(txn => (
              <tr key={txn.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-[var(--foreground)]">{txn.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--foreground)]">{txn.studentName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    txn.type === "tuition" ? "bg-[#0891B2]/10 text-[#0891B2]" :
                    txn.type === "activity" ? "bg-[#A855F7]/10 text-[#A855F7]" :
                    "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }`}>
                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-[var(--foreground)]">{formatCurrency(txn.amount)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    txn.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" :
                    txn.status === "pending" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                    "bg-[#EF4444]/10 text-[#EF4444]"
                  }`}>
                    {txn.status === "completed" && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />}
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--muted)]">{formatDate(txn.date)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--foreground-secondary)]">{txn.method}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">No transactions found</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">
              Showing <span className="font-medium text-[var(--foreground)]">1</span> to{" "}
              <span className="font-medium text-[var(--foreground)]">{filteredTransactions.length}</span> of{" "}
              <span className="font-medium text-[var(--foreground)]">{filteredTransactions.length}</span> transactions
            </p>
            <div className="flex items-center gap-1">
              <button disabled className="px-3 py-1.5 text-sm text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] rounded-md disabled:opacity-50">
                Previous
              </button>
              <button disabled className="px-3 py-1.5 text-sm text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] rounded-md disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


