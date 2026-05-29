"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface AdmissionsOverviewCardProps {
  total: number;
  newThisMonth: number;
  acceptanceRate: number;
}

export function AdmissionsOverviewCard({
  total,
  newThisMonth,
  acceptanceRate,
}: AdmissionsOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden h-full min-h-[200px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      style={{
        background:
          "linear-gradient(135deg, rgba(8,145,178,0.08) 0%, rgba(8,145,178,0.03) 50%, var(--card) 100%)",
      }}
    >
      <div className="relative p-6 flex flex-col justify-between h-full">
        {/* Top */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#0891B212" }}
            >
              <Users className="w-4 h-4 text-[#0891B2]" />
            </div>
            <p className="text-[13px] font-medium text-[var(--muted)]">
              Admissions Overview
            </p>
          </div>
          <h2 className="text-[22px] font-bold text-[var(--foreground)] mt-2">
            {total} Applications
          </h2>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Greenwood Academy Admissions
          </p>
        </div>

        {/* Bottom metrics */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[var(--border)]">
          <div>
            <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums">
              {newThisMonth}
            </p>
            <p className="text-[11px] text-[var(--muted)] font-medium">
              New This Month
            </p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div>
            <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums">
              {acceptanceRate}%
            </p>
            <p className="text-[11px] text-[var(--muted)] font-medium">
              Acceptance Rate
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
