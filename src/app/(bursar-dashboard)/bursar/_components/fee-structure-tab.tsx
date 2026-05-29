"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  CheckCircle,
  TrendingUp,
  Tag,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Plus,
  Check,
  Minus,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { feeStructure, feeDiscounts } from "@/lib/demo-data";

// ── Helpers ──────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const STUDENTS_PER_GRADE = 30;

const fmtCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// ── Summary Card Metrics ─────────────────────────────────────────────

function useSummaryMetrics() {
  return useMemo(() => {
    const totalCategories = feeStructure.length;
    const activeFees = feeStructure.filter((f) => f.status === "active").length;
    const mandatoryFees = feeStructure.filter((f) => f.mandatory).length;
    const optionalFees = totalCategories - mandatoryFees;

    const expectedRevenue = feeStructure.reduce((total, fee) => {
      const gradeSum = Object.values(fee.amounts).reduce((s, v) => s + v, 0);
      return total + gradeSum * STUDENTS_PER_GRADE;
    }, 0);

    // Revenue breakdown by fee type
    const revenueByFee = feeStructure.map((fee) => {
      const total = Object.values(fee.amounts).reduce((s, v) => s + v, 0) * STUDENTS_PER_GRADE;
      return { name: fee.category.replace(" Fee", ""), total };
    }).sort((a, b) => b.total - a.total);

    const totalBeneficiaries = feeDiscounts.reduce((s, d) => s + d.beneficiaries, 0);

    // Estimated total discount value (rough calc)
    const estimatedSavings = feeDiscounts.reduce((s, d) => {
      if (d.type === "percentage") return s + (expectedRevenue * d.value / 100 * d.beneficiaries / (STUDENTS_PER_GRADE * 8));
      return s + d.value * d.beneficiaries;
    }, 0);

    return {
      totalCategories,
      activeFees,
      mandatoryFees,
      optionalFees,
      expectedRevenue,
      revenueByFee,
      totalBeneficiaries,
      estimatedSavings,
      discountCount: feeDiscounts.length,
    };
  }, []);
}

// ── Main Component ───────────────────────────────────────────────────

export function FeeStructureTab() {
  const metrics = useSummaryMetrics();

  // Fee categories state
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredFees = useMemo(() => {
    return feeStructure.filter((fee) => {
      if (frequencyFilter && fee.frequency !== frequencyFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!fee.category.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [searchQuery, frequencyFilter]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fee Categories. mini donut showing mandatory vs optional */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #0D9488, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(13,148,136,0.1)" }}>
                <Layers className="w-4.5 h-4.5" style={{ color: "#0D9488" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Fee Categories</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {metrics.totalCategories}
              </p>
            </div>
            {/* Mini donut: mandatory vs optional */}
            <div className="flex-shrink-0">
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="16" fill="none" stroke="var(--border)" strokeWidth="4" opacity="0.2" />
                <motion.circle
                  cx="22" cy="22" r="16" fill="none"
                  stroke="#0D9488" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - metrics.mandatoryFees / metrics.totalCategories)}`}
                  transform="rotate(-90 22 22)"
                  initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - metrics.mandatoryFees / metrics.totalCategories) }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
                <text x="22" y="23" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="#0D9488">
                  {metrics.mandatoryFees}
                </text>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={11} style={{ color: "#0D9488" }} />
              <span className="text-[10px] text-[var(--muted)]">
                <span className="font-semibold text-[var(--foreground)]">{metrics.mandatoryFees}</span> mandatory
              </span>
            </div>
            <div className="w-px h-3 bg-[var(--border)]" />
            <div className="flex items-center gap-1.5">
              <Tag size={11} style={{ color: "#F59E0B" }} />
              <span className="text-[10px] text-[var(--muted)]">
                <span className="font-semibold text-[var(--foreground)]">{metrics.optionalFees}</span> optional
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Active Fees. progress bar with ratio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.06 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #10B981, transparent 70%)" }}
          />
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
            style={{ background: "rgba(16,185,129,0.1)" }}>
            <CheckCircle className="w-4.5 h-4.5" style={{ color: "#10B981" }} />
          </div>
          <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Active Fees</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {metrics.activeFees}
            </p>
            <span className="text-[11px] text-[var(--muted)]">/ {metrics.totalCategories}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[var(--muted)]">Activation rate</span>
              <span className="text-[10px] font-semibold text-[#10B981]">
                {Math.round((metrics.activeFees / metrics.totalCategories) * 100)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #10B981, #34D399)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(metrics.activeFees / metrics.totalCategories) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Expected Revenue. with breakdown bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.12 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #8B5CF6, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(139,92,246,0.1)" }}>
                <TrendingUp className="w-4.5 h-4.5" style={{ color: "#8B5CF6" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Expected Revenue</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {fmtCompact.format(metrics.expectedRevenue)}
              </p>
            </div>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[rgba(16,185,129,0.1)] text-[#10B981] mt-1">
              <ArrowUpRight size={10} />
              +8.2%
            </span>
          </div>
          {/* Top 3 fee type bars */}
          <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1.5">
            {metrics.revenueByFee.slice(0, 3).map((fee, idx) => {
              const pct = (fee.total / metrics.expectedRevenue) * 100;
              const colors = ["#8B5CF6", "#0D9488", "#F59E0B"];
              return (
                <div key={fee.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--muted)] w-14 truncate">{fee.name}</span>
                  <div className="flex-1 h-1 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: colors[idx] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--muted)] tabular-nums w-8 text-right">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Card 4: Discounts & Savings. with beneficiary count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.18 }}
          className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]"
            style={{ background: "radial-gradient(circle at top right, #F59E0B, transparent 70%)" }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "rgba(245,158,11,0.1)" }}>
                <Percent className="w-4.5 h-4.5" style={{ color: "#F59E0B" }} />
              </div>
              <p className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">Discounts</p>
              <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-0.5">
                {metrics.discountCount}
              </p>
            </div>
            {/* Stacked avatars representing beneficiaries */}
            <div className="flex items-center -space-x-1.5 mt-2">
              {[...Array(Math.min(4, metrics.discountCount))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-[var(--card)] flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: ["#F59E0B", "#8B5CF6", "#0D9488", "#EF4444"][i], zIndex: 4 - i }}
                >
                  {feeDiscounts[i]?.name.charAt(0)}
                </div>
              ))}
              {metrics.discountCount > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-[var(--card)] bg-[var(--background-secondary)] flex items-center justify-center text-[8px] font-semibold text-[var(--muted)]">
                  +{metrics.discountCount - 4}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <Users size={11} className="text-[var(--muted)]" />
              <span className="text-[10px] text-[var(--muted)]">
                <span className="font-semibold text-[var(--foreground)]">{metrics.totalBeneficiaries}</span> beneficiaries
              </span>
            </div>
            <div className="w-px h-3 bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--muted)]">
              ~{fmtCompact.format(metrics.estimatedSavings)} saved
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Fee Categories Section ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.25 }}
        className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center gap-3">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] flex-shrink-0">
            Fee Categories
          </h3>

          <div className="flex items-center gap-3 flex-wrap flex-1 sm:justify-end">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Frequency Filter */}
            <div className="relative">
              <select
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className={cn(
                  "appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-transparent transition-all cursor-pointer",
                  "bg-[var(--background-secondary)] text-[var(--foreground)]",
                  "focus:outline-none focus:border-[var(--border)]",
                  !frequencyFilter && "text-[var(--muted)]"
                )}
              >
                <option value="">All Frequencies</option>
                <option value="per_term">Per Term</option>
                <option value="annual">Annual</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
            </div>

            {/* Add Fee Category */}
            <button
              onClick={() => alert("Add Fee Category modal placeholder")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Category</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="w-12 px-3 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider" />
                <th className="w-[18%] px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Grades
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden sm:table-cell">
                  Amount
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Frequency
                </th>
                <th className="w-[8%] px-4 py-3 text-center text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">
                  Required
                </th>
                <th className="w-[9%] px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="text-sm text-[var(--muted)]">
                      No fee categories found.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFrequencyFilter("");
                      }}
                      className="mt-2 text-sm text-[#0D9488] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => {
                  const grades = Object.keys(fee.amounts);
                  const isExpanded = expandedRows.has(fee.id);
                  const firstNum = grades[0]?.replace("Grade ", "");
                  const lastNum = grades[grades.length - 1]?.replace("Grade ", "");
                  const gradeRange = grades.length > 0 ? `${firstNum}–${lastNum}` : "-";
                  const amounts = Object.values(fee.amounts);
                  const minAmt = Math.min(...amounts);
                  const maxAmt = Math.max(...amounts);
                  const amountRange = minAmt === maxAmt
                    ? formatCurrency(minAmt)
                    : `${formatCurrency(minAmt)}–${formatCurrency(maxAmt)}`;

                  return (
                    <tr
                      key={fee.id}
                      className={cn(
                        "border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors cursor-pointer",
                        isExpanded && "bg-[var(--background-secondary)]/30"
                      )}
                      onClick={() => toggleRow(fee.id)}
                    >
                      {/* Expand Toggle */}
                      <td className="px-3 py-3.5">
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
                        </motion.div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] font-medium text-[var(--foreground)]">
                          {fee.category}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-[13px] text-[var(--muted)] truncate block">
                          {fee.description}
                        </span>
                      </td>

                      {/* Grade Range */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-[var(--foreground)] tabular-nums">
                          {gradeRange}
                        </span>
                      </td>

                      {/* Amount Range */}
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                          {amountRange}
                        </span>
                      </td>

                      {/* Frequency */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full",
                            fee.frequency === "per_term"
                              ? "bg-[#0D9488]/10 text-[#0D9488]"
                              : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                          )}
                        >
                          {fee.frequency === "per_term" ? "Per Term" : "Annual"}
                        </span>
                      </td>

                      {/* Mandatory */}
                      <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                        {fee.mandatory ? (
                          <Check className="w-4 h-4 text-[#10B981] mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-[var(--muted)]/40 mx-auto" />
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#10B981]/10 text-[#10B981]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Expanded Grade Details (rendered outside table for valid HTML) */}
          {filteredFees.map((fee) => {
            const isExpanded = expandedRows.has(fee.id);
            return (
              <AnimatePresence key={fee.id}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-[var(--border)]"
                  >
                    <div className="px-6 py-4 bg-[var(--background-secondary)]/50">
                      <p className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
                        {fee.category}. Amount by Grade
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        {Object.entries(fee.amounts).map(
                          ([grade, amount], gi) => (
                            <motion.div
                              key={grade}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.15,
                                delay: gi * 0.03,
                              }}
                              className="rounded-xl bg-[var(--card)] p-3 border border-[var(--border)]"
                            >
                              <p className="text-[11px] text-[var(--muted)] mb-1">
                                {grade}
                              </p>
                              <p className="text-[14px] font-bold tabular-nums text-[var(--foreground)]">
                                {formatCurrency(amount)}
                              </p>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </motion.div>

      {/* ── Discounts & Scholarships Section ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.35 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Discounts & Scholarships
          </h3>
          <button
            onClick={() => alert("Add Discount modal placeholder")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Discount
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeDiscounts.map((discount, i) => (
            <motion.div
              key={discount.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200,
                delay: 0.4 + i * 0.06,
              }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[var(--border)]"
            >
              {/* Top row: Name + Type badge */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-[14px] font-semibold text-[var(--foreground)]">
                  {discount.name}
                </h4>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 text-[12px] font-bold rounded-lg",
                    discount.type === "percentage"
                      ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                      : "bg-[#0D9488]/10 text-[#0D9488]"
                  )}
                >
                  {discount.type === "percentage"
                    ? `${discount.value}%`
                    : formatCurrency(discount.value)}
                </span>
              </div>

              {/* Applies to */}
              <p className="text-[12px] text-[var(--muted)] mb-1.5">
                Applies to:{" "}
                <span className="text-[var(--foreground)] font-medium">
                  {discount.appliesTo}
                </span>
              </p>

              {/* Eligibility */}
              <p className="text-[12px] text-[var(--muted)] mb-3">
                {discount.eligibility}
              </p>

              {/* Footer: Beneficiaries + Status */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    <span className="font-medium text-[var(--foreground)]">
                      {discount.beneficiaries}
                    </span>{" "}
                    beneficiaries
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
