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

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * Return inline styles for the icon tint, defending against non-hex colors.
 * The 10% alpha background is built by appending `1A` to a 6-digit hex; if the
 * caller passes anything else we fall back to neutral CSS variables.
 */
function tintStyle(color: string): React.CSSProperties {
  if (HEX_RE.test(color)) {
    return { backgroundColor: `${color}1A`, color };
  }
  return { backgroundColor: "var(--background-secondary)", color: "var(--muted)" };
}

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--muted)]">{label}</span>
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md"
          style={tintStyle(color)}
        >
          <Icon className="w-4 h-4" />
        </span>
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
