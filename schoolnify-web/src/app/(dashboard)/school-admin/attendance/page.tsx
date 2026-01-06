"use client";

/**
 * Attendance Page - Stripe-Inspired Design
 * Features: Date picker, class attendance overview, quick stats
 * @see Stripe Dashboard - Analytics/Reports pages
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { classAttendanceRecords, todayAttendance, attendanceData } from "@/lib/demo-data";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2026-01-06");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    const completed = classAttendanceRecords.filter(r => r.status === "completed").length;
    const pending = classAttendanceRecords.filter(r => r.status === "pending").length;
    const totalPresent = classAttendanceRecords.reduce((sum, r) => sum + r.present, 0);
    const totalAbsent = classAttendanceRecords.reduce((sum, r) => sum + r.absent, 0);
    const totalLate = classAttendanceRecords.reduce((sum, r) => sum + r.late, 0);
    
    return { completed, pending, totalPresent, totalAbsent, totalLate };
  }, []);

  // Filter records
  const filteredRecords = useMemo(() => {
    return classAttendanceRecords.filter(record => {
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
  }, [statusFilter, searchQuery]);

  // Simple bar chart component
  const BarChart = ({ data }: { data: typeof attendanceData }) => {
    const maxValue = Math.max(...data.map(d => d.present + d.absent));
    
    return (
      <div className="flex items-end justify-between gap-2 h-32">
        {data.slice(0, 5).map((day, i) => {
          const total = day.present + day.absent;
          const height = total > 0 ? (total / maxValue) * 100 : 0;
          const presentHeight = total > 0 ? (day.present / total) * 100 : 0;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-24">
                {total > 0 ? (
                  <div 
                    className="w-full rounded-t-md overflow-hidden"
                    style={{ height: `${height}%` }}
                  >
                    <div 
                      className="w-full bg-[#10B981]"
                      style={{ height: `${presentHeight}%` }}
                    />
                    <div 
                      className="w-full bg-[#EF4444]"
                      style={{ height: `${100 - presentHeight}%` }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-4 rounded-t-md bg-[var(--background-secondary)]" />
                )}
              </div>
              <span className="text-xs text-[var(--muted)]">{day.day}</span>
            </div>
          );
        })}
      </div>
    );
  };

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
        <div className="lg:col-span-2 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground)]">Weekly Attendance</h3>
              <p className="text-xs text-[var(--muted)]">This week&apos;s daily breakdown</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" />
                Absent
              </span>
            </div>
          </div>
          <BarChart data={attendanceData} />
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
                    {record.status === "completed" ? record.present : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-[#EF4444]">
                    {record.status === "completed" ? record.absent : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-[#F59E0B]">
                    {record.status === "completed" ? record.late : "—"}
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
                    <span className="text-sm text-[var(--muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[var(--muted)]">
                    {record.markedAt || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {record.status === "pending" ? (
                    <Link 
                      href={`/school-admin/attendance/mark?class=${record.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-[#0891B2] rounded-md hover:bg-[#0E7490] transition-colors"
                    >
                      Mark Now
                    </Link>
                  ) : (
                    <button className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </button>
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
    </div>
  );
}


