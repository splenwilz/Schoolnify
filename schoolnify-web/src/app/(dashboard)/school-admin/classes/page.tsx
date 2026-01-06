"use client";

/**
 * Classes Page - Stripe-Inspired Grid/List View
 * Features: Grid view of classes with key metrics
 * @see Stripe Dashboard - Products page
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { classes } from "@/lib/demo-data";

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate totals
  const totals = useMemo(() => {
    return {
      classes: classes.length,
      students: classes.reduce((sum, c) => sum + c.students, 0),
      avgAttendance: (classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length).toFixed(1),
      avgGrade: (classes.reduce((sum, c) => sum + c.avgGrade, 0) / classes.length).toFixed(2),
    };
  }, []);

  // Filter classes
  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;
    const query = searchQuery.toLowerCase();
    return classes.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.teacher.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Classes</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Manage class schedules, assignments, and student groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[var(--background-secondary)] text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-[var(--background-secondary)] text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
          </div>
          <Link
            href="/school-admin/classes/new"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add class
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Total Classes</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{totals.classes}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Total Students</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{totals.students}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Avg Attendance</p>
          <p className="text-2xl font-semibold text-[#10B981] mt-1">{totals.avgAttendance}%</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Avg GPA</p>
          <p className="text-2xl font-semibold text-[#0891B2] mt-1">{totals.avgGrade}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search classes or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
          />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map(classItem => (
            <Link
              key={classItem.id}
              href={`/school-admin/classes/${classItem.id}`}
              className="p-5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[#0891B2]/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[#0891B2] transition-colors">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">{classItem.teacher}</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#10B981]/10 text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
                  Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-[var(--muted)]">Students</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{classItem.students}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Attendance</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{classItem.attendanceRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Avg GPA</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{classItem.avgGrade}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  Room {classItem.room}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {classItem.schedule}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Teacher</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Students</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Room</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Attendance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Avg GPA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Schedule</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredClasses.map(classItem => (
                <tr key={classItem.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/school-admin/classes/${classItem.id}`} className="text-sm font-medium text-[var(--foreground)] hover:text-[#0891B2]">
                      {classItem.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{classItem.teacher}</td>
                  <td className="px-4 py-3 text-sm font-mono text-[var(--foreground)]">{classItem.students}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)]">{classItem.room}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            classItem.attendanceRate >= 95 ? "bg-[#10B981]" :
                            classItem.attendanceRate >= 90 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                          }`}
                          style={{ width: `${classItem.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[var(--muted)]">{classItem.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-[var(--foreground)]">{classItem.avgGrade}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)]">{classItem.schedule}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="py-12 text-center rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <svg className="w-12 h-12 mx-auto text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">No classes found</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}


