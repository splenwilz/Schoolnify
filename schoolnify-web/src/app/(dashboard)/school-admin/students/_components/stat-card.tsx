"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeUp?: boolean;
  subtitle?: string;
  color: string;
  index: number;
}

export function StatCard({
  label,
  value,
  change,
  changeUp,
  subtitle,
  index,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm text-[var(--muted)]">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">
        {value}
      </div>
      <div className="flex items-center gap-2 mt-1">
        {change && (
          <span className={cn("text-xs font-medium", changeUp ? "text-[#10B981]" : "text-[#EF4444]")}>
            {change}
          </span>
        )}
        {subtitle && <span className="text-xs text-[var(--muted)]">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
