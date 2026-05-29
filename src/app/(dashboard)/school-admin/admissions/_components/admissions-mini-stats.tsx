"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, UserCheck, type LucideIcon } from "lucide-react";

interface AdmissionsMiniStatsProps {
  pendingReview: number;
  accepted: number;
  enrolled: number;
}

interface MiniStat {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}

export function AdmissionsMiniStats({
  pendingReview,
  accepted,
  enrolled,
}: AdmissionsMiniStatsProps) {
  const stats: MiniStat[] = [
    { icon: Clock, label: "Pending", value: pendingReview, color: "#F59E0B" },
    { icon: CheckCircle2, label: "Accepted", value: accepted, color: "#10B981" },
    { icon: UserCheck, label: "Enrolled", value: enrolled, color: "#0891B2" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
          className="flex-1 rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px] px-4 py-3.5 flex items-center gap-3"
          style={{ borderLeftColor: stat.color }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${stat.color}12` }}
          >
            <stat.icon
              className="w-4.5 h-4.5"
              style={{ color: stat.color }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {stat.value}
            </p>
            <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
