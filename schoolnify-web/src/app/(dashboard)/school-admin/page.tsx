"use client";

/**
 * School Admin Dashboard - Stripe-Inspired Design
 * Clean, data-focused layout with area charts and inline metrics
 * Design inspiration: Stripe Dashboard
 */

import Link from "next/link";
import { useState } from "react";
import {
  schoolInfo,
} from "@/lib/demo-data";

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

// Weekly overview data
const weeklyData = {
  attendance: [
    { date: "Dec 31", value: 94.2, count: 1175 },
    { date: "Jan 1", value: 0, count: 0 },
    { date: "Jan 2", value: 95.1, count: 1186 },
    { date: "Jan 3", value: 93.8, count: 1170 },
    { date: "Jan 4", value: 96.2, count: 1200 },
    { date: "Jan 5", value: 94.5, count: 1178 },
    { date: "Jan 6", value: 94.0, count: 1172 },
  ],
  fees: [
    { date: "Dec 31", value: 12500 },
    { date: "Jan 1", value: 0 },
    { date: "Jan 2", value: 18200 },
    { date: "Jan 3", value: 8500 },
    { date: "Jan 4", value: 22100 },
    { date: "Jan 5", value: 15800 },
    { date: "Jan 6", value: 9200 },
  ],
};

// Mini sparkline chart component
function Sparkline({ data, color = "#635bff", height = 40 }: { data: number[], color?: string, height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data.filter(d => d > 0));
  const range = max - min || 1;
  const width = 100;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <polygon points={areaPoints} fill={`${color}15`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export default function SchoolAdminDashboard() {
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [compareEnabled, setCompareEnabled] = useState(false);

  const currentAttendance = 1172;
  const yesterdayAttendance = 1186;
  const totalStudents = 1247;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
            <div className="flex items-center gap-2">
              <span className="text-[var(--muted)]">Date range</span>
              <button className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                {dateRange}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
            <button className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
              Daily
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={compareEnabled}
                onChange={(e) => setCompareEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] text-[#0891B2] focus:ring-[#0891B2]"
              />
              <span className="text-[var(--muted)]">Compare</span>
            </label>
            <span className="text-[#0891B2]">Previous period</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Edit
            </button>
          </div>
        </div>

        {/* Overview Cards Grid - Like Stripe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Attendance Card */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-[var(--foreground)]">Attendance</span>
              <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <Sparkline data={weeklyData.attendance.map(d => d.count)} color="#10B981" height={50} />
          </div>

          {/* Fee Collection Card */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Fee collection</span>
                <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              </div>
              <button className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
                </svg>
                Explore
              </button>
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)]">$86,300</div>
            <div className="text-xs text-[var(--muted)] mt-1">$72,100 previous period</div>
            <div className="mt-3">
              <Sparkline data={weeklyData.fees.map(d => d.value)} color="#0891B2" height={40} />
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
              <span>Dec 31, 2025</span>
              <span>$1K</span>
            </div>
            <div className="text-xs text-[var(--muted)] mt-1">Updated 2 minutes ago</div>
          </div>

          {/* Net Collection Card */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--foreground)]">Attendance rate</span>
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className="text-2xl font-semibold text-[var(--foreground)]">94.2%</div>
            <div className="text-xs text-[var(--muted)] mt-1">93.8% previous period</div>
            <div className="mt-3">
              <Sparkline data={weeklyData.attendance.map(d => d.value)} color="#10B981" height={40} />
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
              <span>Dec 31, 2025</span>
              <span>Jan 6, 2026</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-2">
              <span>Updated 5 minutes ago</span>
              <Link href="/school-admin/attendance" className="text-[#0891B2] hover:underline">More details</Link>
            </div>
          </div>
        </div>

        {/* Second Row - Like Stripe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Absent Students */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-[var(--foreground)]">Absent students</span>
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-[var(--border)] rounded-lg">
              <Sparkline data={[52, 48, 67, 45, 71, 58, 52]} color="#EF4444" height={60} />
            </div>
          </div>

          {/* New Enrollments */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--foreground)]">New enrollments</span>
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div className="text-3xl font-semibold text-[var(--foreground)]">12</div>
            <div className="text-xs text-[var(--muted)] mt-1">8 previous period</div>
            <div className="mt-3 h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
              <div className="h-full bg-[#0891B2] rounded-full" style={{ width: '60%' }} />
            </div>
          </div>

          {/* Top Classes */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Top classes by attendance</span>
                <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
              </div>
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
          </div>
        </div>
      </section>
    </div>
  );
}
