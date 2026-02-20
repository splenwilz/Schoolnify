"use client";

/**
 * Attendance Page - Stripe-Inspired Design
 * Features: Date picker, class attendance overview, quick stats
 * @see Stripe Dashboard - Analytics/Reports pages
 */

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { classAttendanceRecords, todayAttendance, attendanceData, periodAttendance, chronicAbsentees, studentLeaveRequests } from "@/lib/demo-data";
import PeriodAttendanceTab from "./_components/period-attendance-tab";
import AbsenteeismTab from "./_components/absenteeism-tab";
import LeaveRequestsTab from "./_components/leave-requests-tab";

type AttendanceRecord = (typeof classAttendanceRecords)[number];
type ModifiedRecord = AttendanceRecord & { status: "completed" | "pending" };

const weeklyData = {
  "This Week": attendanceData.slice(0, 5),
  "Last Week": [
    { day: "Mon", present: 1160, absent: 72 },
    { day: "Tue", present: 1178, absent: 58 },
    { day: "Wed", present: 1150, absent: 82 },
    { day: "Thu", present: 1190, absent: 50 },
    { day: "Fri", present: 1140, absent: 95 },
  ],
  "This Month": [
    { day: "Wk 1", present: 1155, absent: 78 },
    { day: "Wk 2", present: 1170, absent: 65 },
    { day: "Wk 3", present: 1182, absent: 55 },
    { day: "Wk 4", present: 1195, absent: 46 },
  ],
};

const chartPeriods = Object.keys(weeklyData) as (keyof typeof weeklyData)[];

type ViewTab = "daily" | "period" | "absenteeism" | "leave";

const viewTabs: { id: ViewTab; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "period", label: "Period-wise" },
  { id: "absenteeism", label: "Absenteeism" },
  { id: "leave", label: "Leave Requests" },
];

function buildCurvePath(
  data: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
) {
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.02;
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (width - padX * 2),
    y: padY + (1 - (v - min) / range) * (height - padY * 2),
  }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cx1 = p.x + (c.x - p.x) * 0.4;
    const cx2 = c.x - (c.x - p.x) * 0.4;
    line += ` C ${cx1} ${p.y}, ${cx2} ${c.y}, ${c.x} ${c.y}`;
  }

  const area =
    line +
    ` L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  return { line, area, pts };
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2026-01-06");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chartPeriod, setChartPeriod] = useState<keyof typeof weeklyData>("This Week");
  const [markedRecords, setMarkedRecords] = useState<Record<string, ModifiedRecord>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewTab>("daily");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  // Get record with local overrides applied
  const getRecord = (original: AttendanceRecord): ModifiedRecord => {
    return markedRecords[original.id] || original;
  };

  // Calculate stats (reactive to marked records)
  const stats = useMemo(() => {
    const records = classAttendanceRecords.map((r) => getRecord(r));
    const completed = records.filter(r => r.status === "completed").length;
    const pending = records.filter(r => r.status === "pending").length;
    const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
    const totalAbsent = records.reduce((sum, r) => sum + r.absent, 0);
    const totalLate = records.reduce((sum, r) => sum + r.late, 0);

    return { completed, pending, totalPresent, totalAbsent, totalLate };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markedRecords]);

  // Filter records (with local overrides)
  const filteredRecords = useMemo(() => {
    return classAttendanceRecords.map((r) => getRecord(r)).filter(record => {
      if (statusFilter && record.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.className.toLowerCase().includes(query) &&
            !record.teacher.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery, markedRecords]);

  // Chart data
  const chartData = weeklyData[chartPeriod];
  const W = 500;
  const H = 160;
  const padX = 10;
  const padY = 8;

  const presentValues = chartData.map((d) => d.present);
  const absentValues = chartData.map((d) => d.absent);

  const present = buildCurvePath(presentValues, W, H, padX, padY);
  const absent = buildCurvePath(absentValues, W, H, padX, padY);

  const avgRate = chartData.reduce((sum, d) => sum + d.present, 0) /
    chartData.reduce((sum, d) => sum + d.present + d.absent, 0) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Attendance</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Track and manage daily attendance records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
          />
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Export
          </button>
          <Link
            href="/school-admin/attendance/mark"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Present Today</p>
          <p className="text-2xl font-semibold text-[#10B981] mt-1">{todayAttendance.present}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{todayAttendance.rate}% of total</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Absent</p>
          <p className="text-2xl font-semibold text-[#EF4444] mt-1">{todayAttendance.absent}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{stats.totalAbsent} this week</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Late</p>
          <p className="text-2xl font-semibold text-[#F59E0B] mt-1">{todayAttendance.late}</p>
          <p className="text-xs text-[var(--muted)] mt-1">{stats.totalLate} this week</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Classes Marked</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">
            {stats.completed}<span className="text-[var(--muted)] text-lg">/{classAttendanceRecords.length}</span>
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">{stats.pending} pending</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Excused</p>
          <p className="text-2xl font-semibold text-[#6366F1] mt-1">{todayAttendance.excused}</p>
          <p className="text-xs text-[var(--muted)] mt-1">with documentation</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                Attendance Trend
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-[24px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {avgRate.toFixed(1)}%
                </p>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-[#10B981]/10 text-[#10B981]">
                  +0.8%
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                Average attendance rate
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--background-secondary)]">
                {chartPeriods.map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={cn(
                      "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all whitespace-nowrap",
                      chartPeriod === p
                        ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0891B2]" />
                  Present
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  Absent
                </span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="mt-4 -mx-2">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891B2" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0891B2" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Present area + line */}
              <motion.path
                key={`pa-${chartPeriod}`}
                d={present.area}
                fill="url(#presentGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.path
                key={`pl-${chartPeriod}`}
                d={present.line}
                fill="none"
                stroke="#0891B2"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Absent area + line */}
              <motion.path
                key={`aa-${chartPeriod}`}
                d={absent.area}
                fill="url(#absentGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <motion.path
                key={`al-${chartPeriod}`}
                d={absent.line}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              />

              {/* Present dots */}
              {present.pts.map((pt, i) => (
                <motion.circle
                  key={`pd-${chartPeriod}-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#0891B2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, type: "spring" }}
                />
              ))}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between px-2 mt-1">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] text-[var(--muted)]">{d.day}</span>
                <span className="text-[10px] font-semibold text-[var(--foreground)] tabular-nums mt-0.5">
                  {d.present.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/school-admin/attendance/mark"
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">Mark Attendance</p>
                <p className="text-xs text-[var(--muted)]">{stats.pending} classes pending</p>
              </div>
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <Link 
              href="/school-admin/attendance/reports"
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">View Reports</p>
                <p className="text-xs text-[var(--muted)]">Monthly & weekly stats</p>
              </div>
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <Link 
              href="/school-admin/attendance/absent"
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">Absent Students</p>
                <p className="text-xs text-[var(--muted)]">{todayAttendance.absent} absent today</p>
              </div>
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] w-fit mb-6">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={cn(
              "px-4 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
              activeView === tab.id
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily View */}
      {activeView === "daily" && (
        <>
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
            >
              <option value="">All status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Class Attendance Table */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Present
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Absent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Late
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Marked At
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">

                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredRecords.map(record => (
                  <tr
                    key={record.id}
                    className="hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/school-admin/attendance/${record.id}`} className="text-sm font-medium text-[var(--foreground)] hover:text-[#0891B2] transition-colors">
                        {record.className}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--foreground-secondary)]">{record.teacher}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        record.status === "completed"
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}>
                        {record.status === "completed" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
                        )}
                        {record.status === "completed" ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[#10B981]">
                        {record.status === "completed" ? record.present : "\u2014"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[#EF4444]">
                        {record.status === "completed" ? record.absent : "\u2014"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[#F59E0B]">
                        {record.status === "completed" ? record.late : "\u2014"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.status === "completed" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                record.rate >= 95 ? "bg-[#10B981]" :
                                record.rate >= 85 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                              }`}
                              style={{ width: `${record.rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-[var(--muted)]">{record.rate}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[var(--muted)]">{"\u2014"}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)]">
                        {record.markedAt || "\u2014"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {record.status === "pending" ? (
                        <Link
                          href={`/school-admin/attendance/mark?class=${record.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-[#0891B2] rounded-md hover:bg-[#0E7490] transition-colors inline-block"
                        >
                          Mark Now
                        </Link>
                      ) : (
                        <div className="relative" ref={openMenuId === record.id ? menuRef : undefined}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === record.id ? null : record.id)}
                            className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {openMenuId === record.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 w-44 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden"
                              >
                                <Link
                                  href={`/school-admin/attendance/${record.id}`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                  </svg>
                                  View Details
                                </Link>
                                <Link
                                  href={`/school-admin/attendance/mark?class=${record.id}`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                  </svg>
                                  Edit Attendance
                                </Link>
                                <div className="border-t border-[var(--border)]" />
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    // Simulate download
                                    const blob = new Blob(
                                      [`${record.className} Attendance Report\nDate: ${record.date}\nPresent: ${record.present}\nAbsent: ${record.absent}\nLate: ${record.late}\nRate: ${record.rate}%\nTeacher: ${record.teacher}\nMarked At: ${record.markedAt}`],
                                      { type: "text/plain" }
                                    );
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `${record.className.replace(/\s+/g, "-").toLowerCase()}-attendance.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                  </svg>
                                  Download Report
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredRecords.length === 0 && (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 mx-auto text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">No records found</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredRecords.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">
                  Showing <span className="font-medium text-[var(--foreground)]">1</span> to{" "}
                  <span className="font-medium text-[var(--foreground)]">{filteredRecords.length}</span> of{" "}
                  <span className="font-medium text-[var(--foreground)]">{filteredRecords.length}</span> classes
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled
                    className="px-3 py-1.5 text-sm text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled
                    className="px-3 py-1.5 text-sm text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Period-wise View */}
      {activeView === "period" && <PeriodAttendanceTab />}

      {/* Absenteeism View */}
      {activeView === "absenteeism" && <AbsenteeismTab />}

      {/* Leave Requests View */}
      {activeView === "leave" && <LeaveRequestsTab />}
    </div>
  );
}


