"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { staff } from "@/lib/demo-data";
import { Avatar } from "../../students/_components/avatar";

const totalStaff = staff.length;
const teacherCount = staff.filter((s) => s.role === "Teacher").length;
const avgSalary = `$${(Math.round(staff.reduce((sum, s) => sum + s.salary, 0) / staff.length) / 1000).toFixed(0)}k`;
const displayStaff = staff.slice(0, 5);

export function TeamOverviewCard() {
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
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#0891B212" }}
              >
                <Users className="w-4 h-4 text-[#0891B2]" />
              </div>
              <p className="text-[13px] font-medium text-[var(--muted)]">
                Team Overview
              </p>
            </div>
            <h2 className="text-[22px] font-bold text-[var(--foreground)] mt-2">
              {totalStaff} Members
            </h2>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              Greenwood Academy Staff
            </p>
          </div>

          {/* Avatar stack */}
          <div className="flex items-center">
            {displayStaff.map((member, i) => (
              <div
                key={member.id}
                className="relative rounded-full border-2 border-[var(--card)]"
                style={{ marginLeft: i > 0 ? "-10px" : "0", zIndex: 5 - i }}
              >
                <Avatar
                  firstName={member.firstName}
                  lastName={member.lastName}
                  size="sm"
                  className="rounded-full"
                />
              </div>
            ))}
            {totalStaff > 5 && (
              <div
                className="relative w-8 h-8 rounded-full bg-[var(--background-secondary)] border-2 border-[var(--card)] flex items-center justify-center"
                style={{ marginLeft: "-10px", zIndex: 0 }}
              >
                <span className="text-[10px] font-bold text-[var(--muted)]">
                  +{totalStaff - 5}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[var(--border)]">
          <div>
            <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums">
              {teacherCount}
            </p>
            <p className="text-[11px] text-[var(--muted)] font-medium">Teachers</p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div>
            <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums">
              {avgSalary}
            </p>
            <p className="text-[11px] text-[var(--muted)] font-medium">Avg Salary</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
