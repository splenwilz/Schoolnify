"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface FilterBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  grades: string[];
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  selectedFeeStatus: string;
  onFeeStatusChange: (status: string) => void;
  onClearAll: () => void;
}

export function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  grades,
  selectedGrade,
  onGradeChange,
  selectedFeeStatus,
  onFeeStatusChange,
  onClearAll,
}: FilterBarProps) {
  const hasActiveFilters = !!selectedGrade || !!selectedFeeStatus;

  return (
    <div className="space-y-6 mb-8">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
            <span className={cn(
              "ml-1.5 text-xs tabular-nums",
              activeTab === tab.id ? "text-[var(--foreground)]" : "text-[var(--muted)]"
            )}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--foreground)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Search + Dropdowns */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--foreground)]/20 transition-all"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--background-secondary)] text-[var(--muted)]"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Grade dropdown */}
        <div className="relative">
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className={cn(
              "appearance-none pl-3.5 pr-9 py-2.5 text-sm rounded-xl border transition-all cursor-pointer",
              "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--foreground)]/20",
              !selectedGrade && "text-[var(--muted)]"
            )}
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
        </div>

        {/* Fee status dropdown */}
        <div className="relative">
          <select
            value={selectedFeeStatus}
            onChange={(e) => onFeeStatusChange(e.target.value)}
            className={cn(
              "appearance-none pl-3.5 pr-9 py-2.5 text-sm rounded-xl border transition-all cursor-pointer",
              "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/10 focus:border-[var(--foreground)]/20",
              !selectedFeeStatus && "text-[var(--muted)]"
            )}
          >
            <option value="">All Fees</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
        </div>

        {/* Clear filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onClearAll}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap"
            >
              Clear filters
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
