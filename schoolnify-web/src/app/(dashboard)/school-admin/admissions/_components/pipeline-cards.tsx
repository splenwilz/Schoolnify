"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  FileText,
  Search,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

interface Application {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  appliedDate: string;
  status:
    | "inquiry"
    | "applied"
    | "under_review"
    | "accepted"
    | "enrolled"
    | "rejected"
    | "waitlisted";
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  documents: string[];
  notes?: string;
}

interface PipelineCardsProps {
  applications: Application[];
}

const stages = [
  {
    key: "inquiry" as const,
    label: "Inquiry",
    icon: MessageCircle,
    color: "#6B7280",
  },
  {
    key: "applied" as const,
    label: "Applied",
    icon: FileText,
    color: "#3B82F6",
  },
  {
    key: "under_review" as const,
    label: "Review",
    icon: Search,
    color: "#F59E0B",
  },
  {
    key: "accepted" as const,
    label: "Accepted",
    icon: CheckCircle2,
    color: "#10B981",
  },
  {
    key: "enrolled" as const,
    label: "Enrolled",
    icon: UserCheck,
    color: "#0891B2",
  },
];

export function PipelineCards({ applications }: PipelineCardsProps) {
  const counts = stages.map((stage) => ({
    ...stage,
    count: applications.filter((app) => app.status === stage.key).length,
  }));

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 h-full"
    >
      <p className="text-[13px] font-medium text-[var(--muted)] mb-4">
        Pipeline
      </p>

      <div className="space-y-3">
        {counts.map((stage, index) => {
          const Icon = stage.icon;
          const barWidth = Math.max((stage.count / maxCount) * 100, 8);

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.06 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${stage.color}12` }}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: stage.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[var(--muted)]">
                    {stage.label}
                  </span>
                  <span className="text-[13px] font-bold text-[var(--foreground)] tabular-nums">
                    {stage.count}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
                    className="h-full rounded-full"
                    style={{ background: stage.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
