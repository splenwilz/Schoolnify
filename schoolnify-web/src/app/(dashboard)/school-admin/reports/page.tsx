"use client";

/**
 * Reports Page - Analytics Dashboard
 * Features: Various report types, charts, export options
 * @see Stripe Dashboard - Reports/Analytics
 */

import { useState } from "react";
import Link from "next/link";

// Report categories
const reportCategories = [
  {
    id: "academic",
    title: "Academic Reports",
    description: "Student performance, grades, and progress tracking",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    color: "#0891B2",
    reports: [
      { name: "Grade Distribution", description: "Overall grade distribution by class" },
      { name: "Progress Reports", description: "Individual student progress over time" },
      { name: "Subject Performance", description: "Performance breakdown by subject" },
      { name: "Top Performers", description: "Highest achieving students" },
    ],
  },
  {
    id: "attendance",
    title: "Attendance Reports",
    description: "Daily, weekly, and monthly attendance analytics",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "#10B981",
    reports: [
      { name: "Daily Attendance", description: "Day-by-day attendance records" },
      { name: "Monthly Summary", description: "Monthly attendance trends" },
      { name: "Chronic Absenteeism", description: "Students with low attendance" },
      { name: "Class Comparison", description: "Attendance rates by class" },
    ],
  },
  {
    id: "financial",
    title: "Financial Reports",
    description: "Fee collection, payments, and financial summaries",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "#F59E0B",
    reports: [
      { name: "Collection Summary", description: "Total fees collected vs outstanding" },
      { name: "Payment History", description: "All payment transactions" },
      { name: "Overdue Accounts", description: "Students with pending payments" },
      { name: "Revenue by Term", description: "Revenue breakdown by academic term" },
    ],
  },
  {
    id: "staff",
    title: "Staff Reports",
    description: "Teacher performance and staff analytics",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    color: "#A855F7",
    reports: [
      { name: "Staff Overview", description: "All staff members summary" },
      { name: "Department Analysis", description: "Staff distribution by department" },
      { name: "Class Assignments", description: "Teacher workload analysis" },
      { name: "Attendance Marking", description: "Staff attendance marking compliance" },
    ],
  },
];

// Recent reports
const recentReports = [
  { id: 1, name: "Monthly Attendance Report - December 2025", type: "Attendance", date: "Jan 2, 2026", format: "PDF" },
  { id: 2, name: "Q4 Financial Summary", type: "Financial", date: "Jan 1, 2026", format: "Excel" },
  { id: 3, name: "Grade 10A Progress Report", type: "Academic", date: "Dec 28, 2025", format: "PDF" },
  { id: 4, name: "Staff Performance Review", type: "Staff", date: "Dec 20, 2025", format: "PDF" },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Reports</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Generate and view analytical reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Scheduled Reports
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--foreground)]">24</p>
              <p className="text-xs text-[var(--muted)]">Reports Generated</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--foreground)]">156</p>
              <p className="text-xs text-[var(--muted)]">Downloads</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--foreground)]">3</p>
              <p className="text-xs text-[var(--muted)]">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#A855F7]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#A855F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--foreground)]">4</p>
              <p className="text-xs text-[var(--muted)]">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Report Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportCategories.map(category => (
            <div
              key={category.id}
              className={`p-5 rounded-lg border bg-[var(--card)] transition-all cursor-pointer ${
                selectedCategory === category.id 
                  ? "border-[#0891B2] ring-1 ring-[#0891B2]" 
                  : "border-[var(--border)] hover:border-[#0891B2]/50"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--foreground)]">{category.title}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">{category.description}</p>
                </div>
                <svg 
                  className={`w-5 h-5 text-[var(--muted)] transition-transform ${selectedCategory === category.id ? "rotate-180" : ""}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              {/* Expanded reports list */}
              {selectedCategory === category.id && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.reports.map((report, idx) => (
                      <Link
                        key={idx}
                        href={`/school-admin/reports/${category.id}/${report.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors group"
                      >
                        <div 
                          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium"
                          style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">{report.name}</p>
                          <p className="text-xs text-[var(--muted)] truncate">{report.description}</p>
                        </div>
                        <svg className="w-4 h-4 text-[var(--muted)] opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Reports</h2>
          <Link href="/school-admin/reports/history" className="text-sm text-[#0891B2] hover:underline">
            View all
          </Link>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Report Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Generated</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Format</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentReports.map(report => (
                <tr key={report.id} className="hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[var(--foreground)]">{report.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      report.type === "Academic" ? "bg-[#0891B2]/10 text-[#0891B2]" :
                      report.type === "Attendance" ? "bg-[#10B981]/10 text-[#10B981]" :
                      report.type === "Financial" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                      "bg-[#A855F7]/10 text-[#A855F7]"
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--muted)]">{report.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--foreground-secondary)]">{report.format}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[#0891B2]" title="Download">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]" title="View">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


