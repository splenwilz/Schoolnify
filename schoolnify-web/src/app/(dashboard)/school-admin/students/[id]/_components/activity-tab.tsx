"use client";

import { motion } from "framer-motion";
import { Check, BookOpen, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activityTimeline = [
  { date: "Jan 6, 2026", action: "Marked present", type: "attendance" },
  { date: "Jan 5, 2026", action: "Math quiz completed - Score: 88%", type: "academic" },
  { date: "Jan 4, 2026", action: "Late arrival - 22 minutes", type: "attendance" },
  { date: "Jan 3, 2026", action: "Fee payment received - $250", type: "financial" },
  { date: "Jan 2, 2026", action: "Absent - Parent notified", type: "attendance" },
  { date: "Dec 20, 2025", action: "Term report card generated", type: "academic" },
  { date: "Dec 19, 2025", action: "Science project submitted - A grade", type: "academic" },
  { date: "Dec 18, 2025", action: "Late arrival - 18 minutes", type: "attendance" },
];

const typeConfig = {
  attendance: { icon: Check, color: "#10B981", bg: "bg-[#10B981]/10" },
  academic: { icon: BookOpen, color: "#0891B2", bg: "bg-[#0891B2]/10" },
  financial: { icon: DollarSign, color: "#F59E0B", bg: "bg-[#F59E0B]/10" },
};

export function ActivityTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-6">Activity Timeline</h2>
        <div className="relative">
          {/* Connecting vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />

          <div className="space-y-0">
            {activityTimeline.map((item, idx) => {
              const config = typeConfig[item.type as keyof typeof typeConfig];
              const Icon = config.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.06 }}
                  className="relative flex gap-4 py-4"
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      "relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      config.bg
                    )}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-[var(--foreground)]">{item.action}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
