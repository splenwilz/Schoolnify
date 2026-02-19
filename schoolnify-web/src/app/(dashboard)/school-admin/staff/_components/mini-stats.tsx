"use client";

import { motion } from "framer-motion";
import { UserCheck, UserX, Building2, type LucideIcon } from "lucide-react";
import { staff } from "@/lib/demo-data";

const activeCount = staff.filter((s) => s.status === "active").length;
const onLeaveCount = staff.filter((s) => s.status === "on_leave").length;
const departmentCount = new Set(staff.map((s) => s.department)).size;

interface MiniStat {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}

const stats: MiniStat[] = [
  { icon: UserCheck, label: "Present", value: activeCount, color: "#0891B2" },
  { icon: UserX, label: "On Leave", value: onLeaveCount, color: "#0891B2" },
  { icon: Building2, label: "Departments", value: departmentCount, color: "#0891B2" },
];

export function MiniStats() {
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
            <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
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
