"use client";

/**
 * Attendance Reports Page
 * Features: Summary stats, period selector, bar chart, class rankings, export
 * Quick action page linked from the main attendance dashboard
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Trophy,
  Users,
} from "lucide-react";
import { classAttendanceRecords, attendanceData } from "@/lib/demo-data";

type Period = "This Week" | "This Month" | "This Term";

const periodData: Record<Period, { day: string; present: number; absent: number }[]> = {
  "This Week": attendanceData.filter((d) => d.present > 0),
  "This Month": [
    { day: "Week 1", present: 1155, absent: 78 },
    { day: "Week 2", present: 1170, absent: 65 },
    { day: "Week 3", present: 1182, absent: 55 },
    { day: "Week 4", present: 1195, absent: 46 },
  ],
  "This Term": [
    { day: "September", present: 1140, absent: 95 },
    { day: "October", present: 1160, absent: 78 },
    { day: "November", present: 1175, absent: 62 },
    { day: "December", present: 1185, absent: 55 },
    { day: "January", present: 1192, absent: 48 },
  ],
};

const periods: Period[] = ["This Week", "This Month", "This Term"];

export default function AttendanceReportsPage() {
  const [activePeriod, setActivePeriod] = useState<Period>("This Week");

  const currentData = periodData[activePeriod];

  // Summary stats
  const summaryStats = useMemo(() => {
    const data = periodData["This Week"];
    const rates = data.map((d) => {
      const total = d.present + d.absent;
      return total > 0 ? (d.present / total) * 100 : 0;
    });

    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    const bestIdx = rates.indexOf(Math.max(...rates));
    const worstIdx = rates.indexOf(Math.min(...rates));

    return {
      avgRate: avgRate.toFixed(1),
      bestDay: data[bestIdx]?.day ?? "N/A",
      bestRate: rates[bestIdx]?.toFixed(1) ?? "0",
      worstDay: data[worstIdx]?.day ?? "N/A",
      worstRate: rates[worstIdx]?.toFixed(1) ?? "0",
      totalDays: data.length,
    };
  }, []);

  // Class rankings: only completed records, sorted by rate descending
  const classRankings = useMemo(() => {
    return classAttendanceRecords
      .filter((r) => r.status === "completed")
      .sort((a, b) => b.rate - a.rate);
  }, []);

  // Bar chart rates
  const barData = useMemo(() => {
    return currentData.map((d) => {
      const total = d.present + d.absent;
      const rate = total > 0 ? (d.present / total) * 100 : 0;
      return { ...d, rate };
    });
  }, [currentData]);

  // Export handler
  const handleExport = () => {
    const lines: string[] = [
      "ATTENDANCE REPORT",
      `Period: ${activePeriod}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      "--- Summary ---",
      `Average Rate: ${summaryStats.avgRate}%`,
      `Best Day: ${summaryStats.bestDay} (${summaryStats.bestRate}%)`,
      `Worst Day: ${summaryStats.worstDay} (${summaryStats.worstRate}%)`,
      `Total Days Tracked: ${summaryStats.totalDays}`,
      "",
      "--- Attendance by Period ---",
    ];

    barData.forEach((d) => {
      lines.push(`${d.day}: ${d.rate.toFixed(1)}% (Present: ${d.present}, Absent: ${d.absent})`);
    });

    lines.push("", "--- Class Rankings ---");
    classRankings.forEach((r, i) => {
      lines.push(
        `${i + 1}. ${r.className} - ${r.rate}% (Teacher: ${r.teacher}, Students: ${r.totalStudents})`
      );
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${activePeriod.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRateColor = (rate: number) => {
    if (rate >= 95) return "#10B981";
    if (rate >= 85) return "#F59E0B";
    return "#EF4444";
  };

  const getRateBg = (rate: number) => {
    if (rate >= 95) return "bg-[#10B981]/10";
    if (rate >= 85) return "bg-[#F59E0B]/10";
    return "bg-[#EF4444]/10";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button + Header */}
      <div className="mb-6">
        <Link
          href="/school-admin/attendance"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Attendance
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Attendance Reports</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Analyze attendance trends and class performance
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#0891B2]" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Average Rate</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {summaryStats.avgRate}%
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Best Day</p>
          <p className="text-2xl font-bold text-[#10B981] mt-1">{summaryStats.bestDay}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">{summaryStats.bestRate}% attendance</p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Worst Day</p>
          <p className="text-2xl font-bold text-[#EF4444] mt-1">{summaryStats.worstDay}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">{summaryStats.worstRate}% attendance</p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#6366F1]" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Total Days Tracked</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {summaryStats.totalDays}
          </p>
        </div>
      </motion.div>

      {/* Period Selector */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] w-fit mb-6">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activePeriod === period
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Bar Chart Visualization */}
      <motion.div
        key={activePeriod}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] mb-6"
      >
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
          Attendance Rate by {activePeriod === "This Week" ? "Day" : activePeriod === "This Month" ? "Week" : "Month"}
        </h3>
        <div className="space-y-3">
          {barData.map((entry, i) => {
            const color = getRateColor(entry.rate);
            return (
              <motion.div
                key={entry.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-[var(--muted)] w-20 shrink-0 text-right">
                  {entry.day}
                </span>
                <div className="flex-1 h-8 rounded-lg bg-[var(--background-secondary)] overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.rate}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                    className="h-full rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                    style={{ color: entry.rate > 50 ? "var(--foreground)" : "var(--muted)" }}
                  >
                    {entry.rate.toFixed(1)}%
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs text-[var(--muted)] w-36 shrink-0">
                  <span>
                    <span className="text-[#10B981] font-medium">{entry.present}</span> present
                  </span>
                  <span>
                    <span className="text-[#EF4444] font-medium">{entry.absent}</span> absent
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border)]">
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="w-3 h-3 rounded-sm bg-[#10B981]" />
            Excellent (&ge; 95%)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
            Good (&ge; 85%)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
            Needs Attention (&lt; 85%)
          </span>
        </div>
      </motion.div>

      {/* Class Rankings Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Class Rankings</h3>
          </div>
          <span className="text-xs text-[var(--muted)]">
            {classRankings.length} classes ranked
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider w-12">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                Class
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                Attendance Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                Students
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {classRankings.map((record, index) => {
              const color = getRateColor(record.rate);
              const bgClass = getRateBg(record.rate);
              return (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        index === 0
                          ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                          : index === 1
                          ? "bg-[#94A3B8]/15 text-[#94A3B8]"
                          : index === 2
                          ? "bg-[#CD7F32]/15 text-[#CD7F32]"
                          : "bg-[var(--background-secondary)] text-[var(--muted)]"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {record.className}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--muted)]">{record.teacher}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${record.rate}%`, backgroundColor: color }}
                        />
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${bgClass}`}
                        style={{ color }}
                      >
                        {record.rate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
                      <span className="text-sm text-[var(--muted)]">{record.totalStudents}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {classRankings.length === 0 && (
          <div className="py-12 text-center">
            <BarChart3 className="w-10 h-10 mx-auto text-[var(--muted)]" />
            <h3 className="mt-3 text-sm font-medium text-[var(--foreground)]">
              No completed records
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Class rankings will appear once attendance is marked
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
