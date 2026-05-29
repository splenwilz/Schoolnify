"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Incident {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  type: "behavioral" | "academic" | "attendance" | "bullying" | "property";
  severity: "minor" | "moderate" | "major" | "critical";
  status: "open" | "in_progress" | "resolved" | "escalated";
  description: string;
  location: string;
  reportedBy: string;
  actionTaken: string;
  parentNotified: boolean;
}

interface SeverityChartProps {
  incidents: Incident[];
}

const severityConfig: {
  key: Incident["severity"];
  label: string;
  color: string;
}[] = [
  { key: "minor", label: "Minor", color: "#3B82F6" },
  { key: "moderate", label: "Moderate", color: "#F59E0B" },
  { key: "major", label: "Major", color: "#EF4444" },
  { key: "critical", label: "Critical", color: "#7C2D12" },
];

export function SeverityChart({ incidents }: SeverityChartProps) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      minor: 0,
      moderate: 0,
      major: 0,
      critical: 0,
    };
    incidents.forEach((inc) => {
      map[inc.severity] = (map[inc.severity] || 0) + 1;
    });
    return map;
  }, [incidents]);

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
    >
      <h3 className="text-[13px] font-semibold text-[var(--foreground)] mb-4">
        Severity Breakdown
      </h3>
      <div className="space-y-3">
        {severityConfig.map((sev) => {
          const count = counts[sev.key] || 0;
          const widthPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={sev.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sev.color }}
                  />
                  <span className="text-[12px] text-[var(--muted)]">
                    {sev.label}
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[var(--foreground)] tabular-nums">
                  {count}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    delay: 0.2,
                  }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: sev.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
