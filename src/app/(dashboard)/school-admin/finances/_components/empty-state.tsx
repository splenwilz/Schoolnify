"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-16 text-center"
    >
      <Wallet className="w-12 h-12 mx-auto text-[var(--muted)] opacity-40" />
      <h3 className="mt-4 text-[15px] font-semibold text-[var(--foreground)]">
        No transactions found
      </h3>
      <p className="mt-1 text-[13px] text-[var(--muted)]">
        Try adjusting your search or filter criteria
      </p>
      <button
        onClick={onClearFilters}
        className="mt-4 px-4 py-2 text-[13px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}
