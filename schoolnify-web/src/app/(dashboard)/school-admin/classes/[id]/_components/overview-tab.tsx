"use client";

import { motion } from "framer-motion";
import { User, MapPin, Clock, BookOpen, Trophy, BarChart3 } from "lucide-react";

interface ClassData {
  id: string;
  name: string;
  students: number;
  teacher: string;
  room: string;
  schedule: string;
  avgGrade: number;
  attendanceRate: number;
  status: string;
}

interface OverviewTabProps {
  classData: ClassData;
}

export function OverviewTab({ classData }: OverviewTabProps) {
  const infoItems = [
    { icon: User, label: "Teacher", value: classData.teacher },
    { icon: MapPin, label: "Room", value: classData.room },
    { icon: Clock, label: "Schedule", value: classData.schedule },
    { icon: BookOpen, label: "Subjects", value: "Mathematics, Science" },
    {
      icon: BarChart3,
      label: "Status",
      value: classData.status.charAt(0).toUpperCase() + classData.status.slice(1),
      badge: true,
    },
  ];

  const performanceMetrics = [
    { label: "Average GPA", value: classData.avgGrade.toFixed(2), color: "#0891B2" },
    { label: "Attendance Rate", value: `${classData.attendanceRate}%`, color: "#10B981" },
    { label: "Class Rank", value: "#3", color: "#F59E0B" },
    { label: "Assignments", value: "12", color: "#0891B2" },
    { label: "Pass Rate", value: "96%", color: "#10B981" },
    { label: "Avg Score", value: "87.3", color: "#F59E0B" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Class Information */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
          Class Information
        </h3>
        <div className="space-y-4">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--muted)]" />
                  </div>
                  <span className="text-[13px] text-[var(--muted)]">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#10B981]/10 text-[#10B981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
                    {item.value}
                  </span>
                ) : (
                  <span className="text-[13px] font-medium text-[var(--foreground)]">
                    {item.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
          Performance
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {performanceMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 + i * 0.05 }}
              className="p-3 rounded-xl bg-[var(--background-secondary)]"
            >
              <p className="text-[11px] text-[var(--muted)] uppercase tracking-wider">
                {metric.label}
              </p>
              <p
                className="text-lg font-bold tabular-nums mt-1"
                style={{ color: metric.color }}
              >
                {metric.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
