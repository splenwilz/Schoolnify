"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  CreditCard,
  Banknote,
  Building2,
  User,
} from "lucide-react";
import { financialTransactions } from "@/lib/demo-data";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Completed", color: "text-[#10B981]", bg: "bg-[#10B981]/10", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", icon: Clock },
  overdue: { label: "Overdue", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", icon: AlertTriangle },
};

const methodIcons: Record<string, typeof CreditCard> = {
  "Credit Card": CreditCard,
  Cash: Banknote,
  "Bank Transfer": Building2,
};

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const txn = financialTransactions.find((t) => t.id === id);

  if (!txn) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/school-admin/finances"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Transaction Not Found</h1>
        </div>
        <div className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center">
          <FileText className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--muted)] mb-4">
            The transaction <span className="font-mono">{id}</span> could not be found.
          </p>
          <Link
            href="/school-admin/finances"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] transition-colors"
          >
            Back to Finances
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[txn.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const MethodIcon = methodIcons[txn.method] || CreditCard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/school-admin/finances"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Transaction Details
            </h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5 font-mono">
              {txn.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] transition-colors">
            <Download className="w-4 h-4" />
            Receipt
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${
        txn.status === "completed"
          ? "border-[#10B981]/20 bg-[#10B981]/5"
          : txn.status === "overdue"
            ? "border-[#EF4444]/20 bg-[#EF4444]/5"
            : "border-[#F59E0B]/20 bg-[#F59E0B]/5"
      }`}>
        <StatusIcon className={`w-5 h-5 ${status.color}`} />
        <div>
          <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
          <p className="text-xs text-[var(--muted)]">
            {txn.status === "completed"
              ? `Payment was received on ${new Date(txn.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
              : txn.status === "overdue"
                ? `Payment was due on ${new Date(txn.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                : `Payment is expected by ${new Date(txn.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
            }
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-1">
            Amount
          </p>
          <p className="text-4xl font-bold text-[var(--foreground)]">
            ${txn.amount.toLocaleString()}
          </p>
          <p className="text-sm text-[var(--muted)] mt-1 capitalize">
            {txn.type} Fee
          </p>
        </div>

        {/* Details Grid */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
            Details
          </h2>
          <div className="space-y-4">
            {/* Student */}
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Student</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0891B2]/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-[#0891B2]" />
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {txn.studentName}
                </span>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Fee Type</span>
              <span className="text-sm font-medium text-[var(--foreground)] capitalize">
                {txn.type}
              </span>
            </div>

            {/* Method */}
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Payment Method</span>
              <div className="flex items-center gap-2">
                <MethodIcon className="w-4 h-4 text-[var(--muted)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {txn.method}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Date</span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {new Date(txn.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Transaction ID */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-[var(--muted)]">Transaction ID</span>
              <span className="text-sm font-mono text-[var(--foreground)]">
                {txn.id}
              </span>
            </div>
          </div>
        </div>

        {/* Actions for non-completed transactions */}
        {txn.status !== "completed" && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-3">
              Actions
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/school-admin/finances/collect"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Record Payment
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl hover:bg-[var(--card)] transition-colors">
                Send Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
