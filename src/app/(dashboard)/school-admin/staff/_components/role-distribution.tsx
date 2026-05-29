"use client";

import { motion } from "framer-motion";
import { staff } from "@/lib/demo-data";

const ROLE_COLORS: Record<string, string> = {
  Teacher: "#0891B2",
  "Department Head": "#0891B2CC",
  Administrator: "#0891B2AA",
  Counselor: "#0891B2AA",
  "IT Support": "#0891B288",
  Librarian: "#0891B288",
  Nurse: "#0891B266",
};

// Count roles and sort by count
const roleCounts = staff.reduce<Record<string, number>>((acc, s) => {
  acc[s.role] = (acc[s.role] || 0) + 1;
  return acc;
}, {});

const roles = Object.entries(roleCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / staff.length) * 100),
    color: ROLE_COLORS[name] || "#0891B2",
  }));

export function RoleDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full"
    >
      <p className="text-[15px] font-semibold text-[var(--foreground)] mb-5">
        Role Distribution
      </p>

      <div className="flex flex-col gap-3.5">
        {roles.map((role, i) => (
          <div key={role.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-[var(--muted)] font-medium">
                {role.name}
              </span>
              <span className="text-[12px] font-semibold text-[var(--foreground)] tabular-nums">
                {role.count}{" "}
                <span className="text-[var(--muted)] font-normal">
                  ({role.percentage}%)
                </span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: role.color }}
                initial={{ width: 0 }}
                animate={{ width: `${role.percentage}%` }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.08,
                  ease: "easeOut" as const,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
