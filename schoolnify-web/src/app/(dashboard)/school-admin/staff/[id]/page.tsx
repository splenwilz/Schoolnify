"use client";

/**
 * Staff Detail Page - Profile View
 * Features: Staff info, classes, schedule, performance
 * @see Stripe Dashboard - Team member detail page
 */

import { use } from "react";
import Link from "next/link";
import { staff } from "@/lib/demo-data";

// Schedule (mock data)
const weeklySchedule = [
  { day: "Monday", periods: ["7A Math (8:00-8:45)", "8B Math (9:00-9:45)", "7C Math (10:00-10:45)", "Planning (11:00-12:00)"] },
  { day: "Tuesday", periods: ["7B Math (8:00-8:45)", "8A Math (9:00-9:45)", "8C Math (10:00-10:45)", "Staff Meeting (2:00-3:00)"] },
  { day: "Wednesday", periods: ["7A Math (8:00-8:45)", "7C Math (9:00-9:45)", "8B Math (10:00-10:45)", "Parent Conferences (1:00-3:00)"] },
  { day: "Thursday", periods: ["8A Math (8:00-8:45)", "7B Math (9:00-9:45)", "8C Math (10:00-10:45)", "Planning (11:00-12:00)"] },
  { day: "Friday", periods: ["7A Math (8:00-8:45)", "8B Math (9:00-9:45)", "Quiz Review (10:00-10:45)", "Department Meeting (1:00-2:00)"] },
];

// Performance metrics (mock data)
const performanceMetrics = {
  classesThisWeek: 18,
  attendanceMarked: "100%",
  studentAvgGrade: "B+",
  parentSatisfaction: "4.8/5",
};

// Activity timeline (mock data)
const activityTimeline = [
  { date: "Jan 6, 2026", action: "Marked attendance for 7A Math", type: "attendance" },
  { date: "Jan 5, 2026", action: "Submitted grades for Q2 assessments", type: "academic" },
  { date: "Jan 4, 2026", action: "Updated lesson plan for Week 14", type: "planning" },
  { date: "Jan 3, 2026", action: "Attended department meeting", type: "meeting" },
  { date: "Jan 2, 2026", action: "Sent parent notification - 5 recipients", type: "communication" },
];

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const staffMember = staff.find(s => s.id === resolvedParams.id);

  if (!staffMember) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="py-12 text-center">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Staff Member Not Found</h1>
          <p className="text-[var(--muted)] mt-2">The staff member you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/school-admin/staff" className="mt-4 inline-flex items-center gap-2 text-[#0891B2] hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Staff
          </Link>
        </div>
      </div>
    );
  }

  const roleColor = staffMember.role === "Teacher" ? "#0891B2" :
    staffMember.role === "Administrator" ? "#A855F7" :
    staffMember.role === "Counselor" ? "#10B981" : "#F59E0B";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/school-admin/staff" className="hover:text-[var(--foreground)]">Staff</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-[var(--foreground)]">{staffMember.firstName} {staffMember.lastName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
            style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)` }}
          >
            {staffMember.firstName[0]}{staffMember.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                {staffMember.firstName} {staffMember.lastName}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                staffMember.status === "active"
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "bg-[#F59E0B]/10 text-[#F59E0B]"
              }`}>
                {staffMember.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />}
                {staffMember.status.charAt(0).toUpperCase() + staffMember.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">{staffMember.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <span 
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded"
                style={{ backgroundColor: `${roleColor}15`, color: roleColor }}
              >
                {staffMember.role}
              </span>
              <span className="text-xs text-[var(--muted)]">{staffMember.department}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
            Edit
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Message
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Classes This Week</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{performanceMetrics.classesThisWeek}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Attendance Marked</p>
          <p className="text-2xl font-semibold text-[#10B981] mt-1">{performanceMetrics.attendanceMarked}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Student Avg Grade</p>
          <p className="text-2xl font-semibold text-[#0891B2] mt-1">{performanceMetrics.studentAvgGrade}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Parent Rating</p>
          <p className="text-2xl font-semibold text-[#F59E0B] mt-1">{performanceMetrics.parentSatisfaction}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Phone</p>
                <p className="text-sm text-[var(--foreground)] mt-1">{staffMember.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Department</p>
                <p className="text-sm text-[var(--foreground)] mt-1">{staffMember.department}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Join Date</p>
                <p className="text-sm text-[var(--foreground)] mt-1">
                  {new Date(staffMember.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Classes Assigned</p>
                <p className="text-sm text-[var(--foreground)] mt-1">{staffMember.classesAssigned} classes</p>
              </div>
            </div>

            {staffMember.subjects && staffMember.subjects.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {staffMember.subjects.map((subject, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--background-secondary)] text-[var(--foreground-secondary)]"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Weekly Schedule */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Weekly Schedule</h2>
            <div className="space-y-4">
              {weeklySchedule.map((day, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-24 flex-shrink-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">{day.day}</p>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {day.periods.map((period, pIdx) => (
                      <span 
                        key={pIdx}
                        className={`px-2 py-1 text-xs rounded ${
                          period.includes("Planning") || period.includes("Meeting") || period.includes("Conference")
                            ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                            : "bg-[#0891B2]/10 text-[#0891B2]"
                        }`}
                      >
                        {period}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Actions */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activityTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === "attendance" ? "bg-[#10B981]/10" :
                    item.type === "academic" ? "bg-[#0891B2]/10" :
                    item.type === "planning" ? "bg-[#A855F7]/10" :
                    item.type === "meeting" ? "bg-[#F59E0B]/10" : "bg-[#EF4444]/10"
                  }`}>
                    {item.type === "attendance" && (
                      <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                    {item.type === "academic" && (
                      <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904" />
                      </svg>
                    )}
                    {item.type === "planning" && (
                      <svg className="w-4 h-4 text-[#A855F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    )}
                    {item.type === "meeting" && (
                      <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                      </svg>
                    )}
                    {item.type === "communication" && (
                      <svg className="w-4 h-4 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)]">{item.action}</p>
                    <p className="text-xs text-[var(--muted)]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">View Full Schedule</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Performance Report</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#A855F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Assign New Class</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Request Leave</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


