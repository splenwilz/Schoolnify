"use client";

/**
 * School Admin Dashboard - Stripe-Inspired Design
 * Clean, data-focused layout with area charts and inline metrics
 * Design inspiration: Stripe Dashboard
 */

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  schoolInfo,
} from "@/lib/demo-data";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { GuidedTour } from "@/components/dashboard/guided-tour";
import { SCHOOL_ADMIN_TOUR_STEPS, TOUR_STORAGE_KEYS } from "@/lib/tour-steps";

// Hourly data for today's chart (like Stripe's gross volume)
const hourlyAttendance = [
  { time: "8:00 AM", value: 450 },
  { time: "9:00 AM", value: 820 },
  { time: "10:00 AM", value: 1050 },
  { time: "11:00 AM", value: 1150 },
  { time: "12:00 PM", value: 1180 },
  { time: "1:00 PM", value: 1175 },
  { time: "2:00 PM", value: 1172 },
  { time: "3:00 PM", value: 1172 },
];

// Overview data by date range
type DateRangeKey = "Last 7 days" | "Last 30 days" | "Last 90 days" | "This term";
type GranularityKey = "Daily" | "Weekly" | "Monthly";

interface OverviewPeriod {
  attendance: { label: string; value: number; count: number }[];
  fees: { label: string; value: number }[];
  absent: { label: string; value: number }[];
  enrollments: { current: number; previous: number };
  feeTotal: { current: number; previous: number };
  attendanceRate: { current: number; previous: number };
  absentTotal: { current: number; previous: number };
}

const overviewData: Record<DateRangeKey, Record<GranularityKey, OverviewPeriod>> = {
  "Last 7 days": {
    Daily: {
      attendance: [
        { label: "Mon", value: 94.2, count: 1175 },
        { label: "Tue", value: 0, count: 0 },
        { label: "Wed", value: 95.1, count: 1186 },
        { label: "Thu", value: 93.8, count: 1170 },
        { label: "Fri", value: 96.2, count: 1200 },
        { label: "Sat", value: 94.5, count: 1178 },
        { label: "Sun", value: 94.0, count: 1172 },
      ],
      fees: [
        { label: "Mon", value: 12500 },
        { label: "Tue", value: 0 },
        { label: "Wed", value: 18200 },
        { label: "Thu", value: 8500 },
        { label: "Fri", value: 22100 },
        { label: "Sat", value: 15800 },
        { label: "Sun", value: 9200 },
      ],
      absent: [
        { label: "Mon", value: 72 },
        { label: "Tue", value: 0 },
        { label: "Wed", value: 61 },
        { label: "Thu", value: 77 },
        { label: "Fri", value: 47 },
        { label: "Sat", value: 69 },
        { label: "Sun", value: 75 },
      ],
      enrollments: { current: 12, previous: 8 },
      feeTotal: { current: 86300, previous: 72100 },
      attendanceRate: { current: 94.2, previous: 93.8 },
      absentTotal: { current: 52, previous: 61 },
    },
    Weekly: {
      attendance: [{ label: "This week", value: 94.5, count: 1180 }],
      fees: [{ label: "This week", value: 86300 }],
      absent: [{ label: "This week", value: 52 }],
      enrollments: { current: 12, previous: 8 },
      feeTotal: { current: 86300, previous: 72100 },
      attendanceRate: { current: 94.5, previous: 93.8 },
      absentTotal: { current: 52, previous: 61 },
    },
    Monthly: {
      attendance: [{ label: "This month", value: 94.5, count: 1180 }],
      fees: [{ label: "This month", value: 86300 }],
      absent: [{ label: "This month", value: 52 }],
      enrollments: { current: 12, previous: 8 },
      feeTotal: { current: 86300, previous: 72100 },
      attendanceRate: { current: 94.5, previous: 93.8 },
      absentTotal: { current: 52, previous: 61 },
    },
  },
  "Last 30 days": {
    Daily: {
      attendance: Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 92 + Math.random() * 5,
        count: 1140 + Math.floor(Math.random() * 80),
      })),
      fees: Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 5000 + Math.floor(Math.random() * 20000),
      })),
      absent: Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 35 + Math.floor(Math.random() * 50),
      })),
      enrollments: { current: 45, previous: 38 },
      feeTotal: { current: 342800, previous: 298500 },
      attendanceRate: { current: 93.8, previous: 92.5 },
      absentTotal: { current: 187, previous: 221 },
    },
    Weekly: {
      attendance: [
        { label: "Wk 1", value: 93.2, count: 1162 },
        { label: "Wk 2", value: 94.1, count: 1174 },
        { label: "Wk 3", value: 93.5, count: 1167 },
        { label: "Wk 4", value: 94.5, count: 1180 },
      ],
      fees: [
        { label: "Wk 1", value: 78500 },
        { label: "Wk 2", value: 92300 },
        { label: "Wk 3", value: 85700 },
        { label: "Wk 4", value: 86300 },
      ],
      absent: [
        { label: "Wk 1", value: 68 },
        { label: "Wk 2", value: 55 },
        { label: "Wk 3", value: 62 },
        { label: "Wk 4", value: 52 },
      ],
      enrollments: { current: 45, previous: 38 },
      feeTotal: { current: 342800, previous: 298500 },
      attendanceRate: { current: 93.8, previous: 92.5 },
      absentTotal: { current: 187, previous: 221 },
    },
    Monthly: {
      attendance: [{ label: "This month", value: 93.8, count: 1170 }],
      fees: [{ label: "This month", value: 342800 }],
      absent: [{ label: "This month", value: 187 }],
      enrollments: { current: 45, previous: 38 },
      feeTotal: { current: 342800, previous: 298500 },
      attendanceRate: { current: 93.8, previous: 92.5 },
      absentTotal: { current: 187, previous: 221 },
    },
  },
  "Last 90 days": {
    Daily: {
      attendance: Array.from({ length: 90 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 91 + Math.random() * 6,
        count: 1130 + Math.floor(Math.random() * 90),
      })),
      fees: Array.from({ length: 90 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 4000 + Math.floor(Math.random() * 22000),
      })),
      absent: Array.from({ length: 90 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 30 + Math.floor(Math.random() * 60),
      })),
      enrollments: { current: 128, previous: 105 },
      feeTotal: { current: 985200, previous: 842600 },
      attendanceRate: { current: 93.2, previous: 91.8 },
      absentTotal: { current: 542, previous: 618 },
    },
    Weekly: {
      attendance: Array.from({ length: 13 }, (_, i) => ({
        label: `Wk ${i + 1}`,
        value: 91 + Math.random() * 6,
        count: 1130 + Math.floor(Math.random() * 90),
      })),
      fees: Array.from({ length: 13 }, (_, i) => ({
        label: `Wk ${i + 1}`,
        value: 60000 + Math.floor(Math.random() * 40000),
      })),
      absent: Array.from({ length: 13 }, (_, i) => ({
        label: `Wk ${i + 1}`,
        value: 40 + Math.floor(Math.random() * 40),
      })),
      enrollments: { current: 128, previous: 105 },
      feeTotal: { current: 985200, previous: 842600 },
      attendanceRate: { current: 93.2, previous: 91.8 },
      absentTotal: { current: 542, previous: 618 },
    },
    Monthly: {
      attendance: [
        { label: "Month 1", value: 92.5, count: 1154 },
        { label: "Month 2", value: 93.6, count: 1168 },
        { label: "Month 3", value: 93.8, count: 1170 },
      ],
      fees: [
        { label: "Month 1", value: 312500 },
        { label: "Month 2", value: 330400 },
        { label: "Month 3", value: 342300 },
      ],
      absent: [
        { label: "Month 1", value: 210 },
        { label: "Month 2", value: 178 },
        { label: "Month 3", value: 154 },
      ],
      enrollments: { current: 128, previous: 105 },
      feeTotal: { current: 985200, previous: 842600 },
      attendanceRate: { current: 93.2, previous: 91.8 },
      absentTotal: { current: 542, previous: 618 },
    },
  },
  "This term": {
    Daily: {
      attendance: Array.from({ length: 60 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 91.5 + Math.random() * 5.5,
        count: 1135 + Math.floor(Math.random() * 85),
      })),
      fees: Array.from({ length: 60 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 3500 + Math.floor(Math.random() * 25000),
      })),
      absent: Array.from({ length: 60 }, (_, i) => ({
        label: `Day ${i + 1}`,
        value: 28 + Math.floor(Math.random() * 55),
      })),
      enrollments: { current: 85, previous: 72 },
      feeTotal: { current: 658400, previous: 545200 },
      attendanceRate: { current: 93.5, previous: 92.1 },
      absentTotal: { current: 378, previous: 445 },
    },
    Weekly: {
      attendance: Array.from({ length: 9 }, (_, i) => ({
        label: `Wk ${i + 1}`,
        value: 91.5 + Math.random() * 5.5,
        count: 1135 + Math.floor(Math.random() * 85),
      })),
      fees: Array.from({ length: 9 }, (_, i) => ({
        label: `Wk ${i + 1}`,
        value: 55000 + Math.floor(Math.random() * 35000),
      })),
      absent: Array.from({ length: 9 }, (_, i) => ({
        label: `Wk ${i + 1}`,
        value: 35 + Math.floor(Math.random() * 45),
      })),
      enrollments: { current: 85, previous: 72 },
      feeTotal: { current: 658400, previous: 545200 },
      attendanceRate: { current: 93.5, previous: 92.1 },
      absentTotal: { current: 378, previous: 445 },
    },
    Monthly: {
      attendance: [
        { label: "Jan", value: 93.2, count: 1162 },
        { label: "Feb", value: 93.8, count: 1170 },
      ],
      fees: [
        { label: "Jan", value: 325800 },
        { label: "Feb", value: 332600 },
      ],
      absent: [
        { label: "Jan", value: 198 },
        { label: "Feb", value: 180 },
      ],
      enrollments: { current: 85, previous: 72 },
      feeTotal: { current: 658400, previous: 545200 },
      attendanceRate: { current: 93.5, previous: 92.1 },
      absentTotal: { current: 378, previous: 445 },
    },
  },
};

const dateRangeOptions: DateRangeKey[] = ["Last 7 days", "Last 30 days", "Last 90 days", "This term"];
const granularityOptions: GranularityKey[] = ["Daily", "Weekly", "Monthly"];

// Mini sparkline chart component with optional comparison line
function Sparkline({ data, compareData, color = "#635bff", height = 40 }: { data: number[], compareData?: number[], color?: string, height?: number }) {
  const allValues = [...data, ...(compareData || [])].filter(d => d > 0);
  const max = allValues.length > 0 ? Math.max(...allValues) : 1;
  const min = allValues.length > 0 ? Math.min(...allValues) : 0;
  const range = max - min || 1;
  const width = 100;

  const buildPoints = (values: number[]) =>
    values.map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * (height - 4);
      return `${x},${y}`;
    }).join(" ");

  const points = buildPoints(data);
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <polygon points={areaPoints} fill={`${color}15`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {compareData && compareData.length > 1 && (
        <polyline
          points={buildPoints(compareData)}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 3"
          opacity={0.4}
        />
      )}
    </svg>
  );
}

// Area chart component (like Stripe's main chart)
function AreaChart({ data, height = 120 }: { data: { time: string, value: number }[], height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const width = 100;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (item.value / maxValue) * (height - 20);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0891B2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#areaGradient)" />
        <polyline points={points} fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Time labels */}
      <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
        <span>{data[0]?.time}</span>
        <span>{data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
}

// All available overview widgets
type WidgetId = "attendance_spark" | "fee_collection" | "attendance_rate" | "absent_students" | "new_enrollments" | "top_classes" | "discipline" | "transport" | "health_alerts" | "upcoming_events";

interface WidgetConfig {
  id: WidgetId;
  label: string;
  description: string;
}

const allWidgets: WidgetConfig[] = [
  { id: "attendance_spark", label: "Attendance", description: "Weekly attendance sparkline" },
  { id: "fee_collection", label: "Fee Collection", description: "Fee revenue this period" },
  { id: "attendance_rate", label: "Attendance Rate", description: "Percentage with trend" },
  { id: "absent_students", label: "Absent Students", description: "Daily absent count trend" },
  { id: "new_enrollments", label: "New Enrollments", description: "Enrollment progress" },
  { id: "top_classes", label: "Top Classes", description: "Best attendance classes" },
  { id: "discipline", label: "Discipline", description: "Recent incidents count" },
  { id: "transport", label: "Transport", description: "Active routes & vehicles" },
  { id: "health_alerts", label: "Health Alerts", description: "Students with allergies" },
  { id: "upcoming_events", label: "Upcoming Events", description: "Next scheduled events" },
];

const defaultWidgets: WidgetId[] = [
  "attendance_spark", "fee_collection", "attendance_rate",
  "absent_students", "new_enrollments", "top_classes",
];

export default function SchoolAdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeKey>("Last 7 days");
  const [granularity, setGranularity] = useState<GranularityKey>("Daily");
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetId[]>(defaultWidgets);
  const [editMode, setEditMode] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showDateRangeMenu, setShowDateRangeMenu] = useState(false);
  const [showGranularityMenu, setShowGranularityMenu] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const granularityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) setShowAddMenu(false);
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target as Node)) setShowDateRangeMenu(false);
      if (granularityRef.current && !granularityRef.current.contains(e.target as Node)) setShowGranularityMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Current period data
  const periodData = overviewData[dateRange][granularity];

  // Generate "previous period" comparison data (shift values down ~5-10%)
  const compareAttendance = periodData.attendance.map((d) => ({
    ...d,
    count: Math.round(d.count * (0.9 + Math.random() * 0.05)),
    value: d.value * (0.95 + Math.random() * 0.03),
  }));
  const compareFees = periodData.fees.map((d) => ({
    ...d,
    value: Math.round(d.value * (0.85 + Math.random() * 0.08)),
  }));
  const compareAbsent = periodData.absent.map((d) => ({
    ...d,
    value: Math.round(d.value * (1.05 + Math.random() * 0.15)),
  }));

  const addWidget = (id: WidgetId) => {
    if (!visibleWidgets.includes(id)) {
      setVisibleWidgets((prev) => [...prev, id]);
    }
    setShowAddMenu(false);
  };

  const removeWidget = (id: WidgetId) => {
    setVisibleWidgets((prev) => prev.filter((w) => w !== id));
  };

  const availableToAdd = allWidgets.filter((w) => !visibleWidgets.includes(w.id));

  const formatMoney = (val: number) =>
    val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : `$${(val / 1000).toFixed(1)}K`;

  const pctChange = (current: number, previous: number) => {
    if (previous === 0) return "+100%";
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  const currentAttendance = 1172;
  const yesterdayAttendance = 1186;
  const totalStudents = 1247;

  const handleStartTour = () => setTourActive(true);
  const handleTourComplete = () => {
    setTourActive(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEYS.completed, "true");
      localStorage.removeItem(TOUR_STORAGE_KEYS.currentStep);
    } catch { /* silently continue */ }
  };
  const handleTourSkip = () => {
    setTourActive(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEYS.completed, "true");
      localStorage.removeItem(TOUR_STORAGE_KEYS.currentStep);
    } catch { /* silently continue */ }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner & Guided Tour */}
      <WelcomeBanner onStartTour={handleStartTour} />
      <GuidedTour
        steps={SCHOOL_ADMIN_TOUR_STEPS}
        isOpen={tourActive}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
      {/* Today Section - Like Stripe's main view */}
      <section>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Today</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Chart Area */}
          <div className="flex-1 space-y-4">
            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Present Students */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">Present students</span>
                  <button className="text-[var(--muted)]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">{currentAttendance.toLocaleString()}</div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
              </div>

              {/* Yesterday */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">Yesterday</span>
                  <button className="text-[var(--muted)]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">{yesterdayAttendance.toLocaleString()}</div>
              </div>
            </div>

            {/* Main Area Chart */}
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <AreaChart data={hourlyAttendance} height={140} />
            </div>

            {/* Balance Summary - Like Stripe */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Fee balance</span>
                  <Link href="/school-admin/finances" className="text-sm text-[#0891B2] hover:underline">View</Link>
                </div>
                <div className="text-xl font-semibold text-[var(--foreground)] mt-1">$152,500</div>
              </div>
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Pending enrollments</span>
                  <Link href="/school-admin/students" className="text-sm text-[#0891B2] hover:underline">View</Link>
                </div>
                <div className="text-xl font-semibold text-[var(--foreground)] mt-1">5</div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Quick Stats */}
          <div className="w-full lg:w-72 space-y-4">
            {/* Quick Stats Card */}
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[var(--foreground)]">Quick stats</h3>
                <button className="text-[var(--muted)] hover:text-[var(--foreground)]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Total students</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">{totalStudents.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Attendance rate</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">94.0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Staff on duty</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">82</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Active classes</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">42</span>
                </div>
              </div>
            </div>

            {/* School Info */}
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">{schoolInfo.name}</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Term</span>
                  <span className="text-[var(--foreground)]">{schoolInfo.currentTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Academic year</span>
                  <span className="text-[var(--foreground)]">{schoolInfo.academicYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Your Overview Section - Like Stripe */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Your overview</h2>
          
          {/* Filters Row - Like Stripe */}
          <div className="flex items-center gap-3 text-sm">
            {/* Date Range Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[var(--muted)]">Date range</span>
              <div className="relative" ref={dateRangeRef}>
                <button
                  onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
                  className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                >
                  {dateRange}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <AnimatePresence>
                  {showDateRangeMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1"
                    >
                      {dateRangeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setDateRange(option); setShowDateRangeMenu(false); }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-secondary)] transition-colors ${
                            dateRange === option ? "text-[#0891B2] font-medium" : "text-[var(--foreground)]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Granularity Dropdown */}
            <div className="relative" ref={granularityRef}>
              <button
                onClick={() => setShowGranularityMenu(!showGranularityMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              >
                {granularity}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <AnimatePresence>
                {showGranularityMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 top-full mt-1 w-32 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1"
                  >
                    {granularityOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => { setGranularity(option); setShowGranularityMenu(false); }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-secondary)] transition-colors ${
                          granularity === option ? "text-[#0891B2] font-medium" : "text-[var(--foreground)]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Compare Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={compareEnabled}
                onChange={(e) => setCompareEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] text-[#0891B2] focus:ring-[#0891B2]"
              />
              <span className="text-[var(--muted)]">Compare</span>
            </label>
            {compareEnabled && <span className="text-[#0891B2]">Previous period</span>}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={addMenuRef}>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add
              </button>
              <AnimatePresence>
                {showAddMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1 max-h-72 overflow-y-auto"
                  >
                    {availableToAdd.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-[var(--muted)]">
                        All widgets are visible
                      </div>
                    ) : (
                      availableToAdd.map((widget) => (
                        <button
                          key={widget.id}
                          onClick={() => addWidget(widget.id)}
                          className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[var(--background-secondary)] transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#0891B2] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{widget.label}</p>
                            <p className="text-xs text-[var(--muted)]">{widget.description}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-colors ${
                editMode
                  ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {editMode ? "Done" : "Edit"}
            </button>
          </div>
        </div>

        {/* Overview Cards Grid - Dynamic */}
        {visibleWidgets.length === 0 ? (
          <div className="p-12 rounded-lg border-2 border-dashed border-[var(--border)] text-center">
            <p className="text-sm text-[var(--muted)] mb-2">No widgets visible</p>
            <button
              onClick={() => setVisibleWidgets(defaultWidgets)}
              className="text-sm text-[#0891B2] hover:underline"
            >
              Reset to defaults
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleWidgets.map((widgetId) => (
              <div key={widgetId} className="relative group">
                {/* Remove button in edit mode */}
                {editMode && (
                  <button
                    onClick={() => removeWidget(widgetId)}
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-md hover:bg-[#DC2626] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Widget content */}
                <div className={`p-4 rounded-lg border bg-[var(--card)] transition-all ${
                  editMode ? "border-dashed border-[#0891B2]/40 ring-1 ring-[#0891B2]/10" : "border-[var(--border)]"
                }`}>
                  {widgetId === "attendance_spark" && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">Attendance</span>
                        <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <Sparkline
                        data={periodData.attendance.map(d => d.count)}
                        compareData={compareEnabled ? compareAttendance.map(d => d.count) : undefined}
                        color="#10B981"
                        height={50}
                      />
                    </>
                  )}

                  {widgetId === "fee_collection" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Fee collection</span>
                        <Link href="/school-admin/finances" className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                          Explore
                        </Link>
                      </div>
                      <div className="text-2xl font-semibold text-[var(--foreground)]">{formatMoney(periodData.feeTotal.current)}</div>
                      <div className="flex items-center gap-1.5 text-xs mt-1">
                        <span className={periodData.feeTotal.current >= periodData.feeTotal.previous ? "text-[#10B981]" : "text-[#EF4444]"}>
                          {pctChange(periodData.feeTotal.current, periodData.feeTotal.previous)}
                        </span>
                        <span className="text-[var(--muted)]">vs {formatMoney(periodData.feeTotal.previous)} prev</span>
                      </div>
                      <div className="mt-3">
                        <Sparkline
                          data={periodData.fees.map(d => d.value)}
                          compareData={compareEnabled ? compareFees.map(d => d.value) : undefined}
                          color="#0891B2"
                          height={40}
                        />
                      </div>
                    </>
                  )}

                  {widgetId === "attendance_rate" && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Attendance rate</span>
                      </div>
                      <div className="text-2xl font-semibold text-[var(--foreground)]">{periodData.attendanceRate.current.toFixed(1)}%</div>
                      <div className="flex items-center gap-1.5 text-xs mt-1">
                        <span className={periodData.attendanceRate.current >= periodData.attendanceRate.previous ? "text-[#10B981]" : "text-[#EF4444]"}>
                          {pctChange(periodData.attendanceRate.current, periodData.attendanceRate.previous)}
                        </span>
                        <span className="text-[var(--muted)]">vs {periodData.attendanceRate.previous.toFixed(1)}% prev</span>
                      </div>
                      <div className="mt-3">
                        <Sparkline
                          data={periodData.attendance.map(d => d.value)}
                          compareData={compareEnabled ? compareAttendance.map(d => d.value) : undefined}
                          color="#10B981"
                          height={40}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-2">
                        <Link href="/school-admin/attendance" className="text-[#0891B2] hover:underline">More details</Link>
                      </div>
                    </>
                  )}

                  {widgetId === "absent_students" && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Absent students</span>
                      </div>
                      <div className="text-2xl font-semibold text-[#EF4444]">{periodData.absentTotal.current}</div>
                      <div className="flex items-center gap-1.5 text-xs mt-1 mb-2">
                        <span className={periodData.absentTotal.current <= periodData.absentTotal.previous ? "text-[#10B981]" : "text-[#EF4444]"}>
                          {pctChange(periodData.absentTotal.current, periodData.absentTotal.previous)}
                        </span>
                        <span className="text-[var(--muted)]">vs {periodData.absentTotal.previous} prev</span>
                      </div>
                      <Sparkline
                        data={periodData.absent.map(d => d.value)}
                        compareData={compareEnabled ? compareAbsent.map(d => d.value) : undefined}
                        color="#EF4444"
                        height={50}
                      />
                    </>
                  )}

                  {widgetId === "new_enrollments" && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">New enrollments</span>
                      </div>
                      <div className="text-3xl font-semibold text-[var(--foreground)]">{periodData.enrollments.current}</div>
                      <div className="flex items-center gap-1.5 text-xs mt-1">
                        <span className={periodData.enrollments.current >= periodData.enrollments.previous ? "text-[#10B981]" : "text-[#EF4444]"}>
                          {pctChange(periodData.enrollments.current, periodData.enrollments.previous)}
                        </span>
                        <span className="text-[var(--muted)]">vs {periodData.enrollments.previous} prev</span>
                      </div>
                      <div className="mt-3 h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0891B2] rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((periodData.enrollments.current / (periodData.enrollments.current + periodData.enrollments.previous)) * 100))}%` }}
                        />
                      </div>
                    </>
                  )}

                  {widgetId === "top_classes" && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">Top classes by attendance</span>
                        <span className="text-xs text-[var(--muted)]">All time</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Grade 5A", rate: "98.2%", color: "#10B981" },
                          { name: "Grade 7B", rate: "97.5%", color: "#0891B2" },
                          { name: "Grade 6A", rate: "96.8%", color: "#A855F7" },
                        ].map((cls, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium" style={{ backgroundColor: cls.color }}>
                              {i + 1}
                            </div>
                            <span className="flex-1 text-sm text-[var(--foreground)]">{cls.name}</span>
                            <span className="text-sm font-mono text-[var(--muted)]">{cls.rate}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {widgetId === "discipline" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Discipline</span>
                        <Link href="/school-admin/discipline" className="text-xs text-[#0891B2] hover:underline">View</Link>
                      </div>
                      <div className="text-2xl font-semibold text-[var(--foreground)]">3</div>
                      <div className="text-xs text-[var(--muted)] mt-1">Open incidents this week</div>
                      <div className="mt-3 space-y-1.5">
                        {[
                          { severity: "Minor", count: 1, color: "#F59E0B" },
                          { severity: "Moderate", count: 1, color: "#EF4444" },
                          { severity: "Major", count: 1, color: "#DC2626" },
                        ].map((item) => (
                          <div key={item.severity} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-[var(--muted)]">{item.severity}</span>
                            </div>
                            <span className="font-mono text-[var(--foreground)]">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {widgetId === "transport" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Transport</span>
                        <Link href="/school-admin/transport" className="text-xs text-[#0891B2] hover:underline">View</Link>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <div className="text-xl font-semibold text-[var(--foreground)]">6</div>
                          <div className="text-xs text-[var(--muted)]">Active routes</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold text-[var(--foreground)]">5</div>
                          <div className="text-xs text-[var(--muted)]">Vehicles</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span className="text-xs text-[var(--muted)]">All routes operational</span>
                      </div>
                    </>
                  )}

                  {widgetId === "health_alerts" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Health Alerts</span>
                        <Link href="/school-admin/health" className="text-xs text-[#0891B2] hover:underline">View</Link>
                      </div>
                      <div className="text-2xl font-semibold text-[#EF4444]">7</div>
                      <div className="text-xs text-[var(--muted)] mt-1">Students with allergies</div>
                      <div className="mt-3 space-y-1.5">
                        {[
                          { type: "Peanut allergy", count: 3 },
                          { type: "Asthma", count: 2 },
                          { type: "Eczema", count: 2 },
                        ].map((item) => (
                          <div key={item.type} className="flex items-center justify-between text-xs">
                            <span className="text-[var(--muted)]">{item.type}</span>
                            <span className="font-mono text-[var(--foreground)]">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {widgetId === "upcoming_events" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">Upcoming Events</span>
                        <Link href="/school-admin/calendar" className="text-xs text-[#0891B2] hover:underline">View</Link>
                      </div>
                      <div className="space-y-2.5 mt-3">
                        {[
                          { name: "PTC Day", date: "Feb 28", color: "#3B82F6" },
                          { name: "Mid-term Exams", date: "Mar 10", color: "#F59E0B" },
                          { name: "Sports Day", date: "Mar 22", color: "#10B981" },
                        ].map((event) => (
                          <div key={event.name} className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: event.color }} />
                            <div>
                              <p className="text-sm text-[var(--foreground)]">{event.name}</p>
                              <p className="text-xs text-[var(--muted)]">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
