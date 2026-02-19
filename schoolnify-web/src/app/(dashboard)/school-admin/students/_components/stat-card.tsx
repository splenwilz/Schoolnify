"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
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

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeUp,
  subtitle,
  color,
  index,
}: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md",
              changeUp
                ? "bg-[#10B981]/10 text-[#10B981]"
                : "bg-[#EF4444]/10 text-[#EF4444]"
            )}
          >
            {changeUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-[13px] text-[var(--muted)] font-medium">{label}</p>
      <p className="text-[28px] font-bold text-[var(--foreground)] tabular-nums leading-tight mt-1">
        {value}
      </p>
      {subtitle && (
        <p className="text-[11px] text-[var(--muted)] mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
