"use client";

/**
 * Student Detail Page - Profile View
 * Features: Student info, attendance, grades, activity
 * @see Stripe Dashboard - Customer detail page
 */

import { use } from "react";
import Link from "next/link";
import { students } from "@/lib/demo-data";

// Attendance history (mock data)
const attendanceHistory = [
  { date: "Jan 6, 2026", status: "present", time: "8:05 AM" },
  { date: "Jan 5, 2026", status: "present", time: "7:58 AM" },
  { date: "Jan 4, 2026", status: "late", time: "8:22 AM" },
  { date: "Jan 3, 2026", status: "present", time: "8:01 AM" },
  { date: "Jan 2, 2026", status: "absent", time: "—" },
];

// Grade history (mock data)
const gradeHistory = [
  { subject: "Mathematics", grade: "A", score: 92, teacher: "Mr. Smith" },
  { subject: "English", grade: "A-", score: 88, teacher: "Ms. Davis" },
  { subject: "Science", grade: "B+", score: 85, teacher: "Mr. Lee" },
  { subject: "History", grade: "A", score: 94, teacher: "Ms. Wilson" },
  { subject: "Physical Education", grade: "A", score: 95, teacher: "Mr. Brown" },
];

// Activity timeline (mock data)
const activityTimeline = [
  { date: "Jan 6, 2026", action: "Marked present", type: "attendance" },
  { date: "Jan 5, 2026", action: "Math quiz completed - Score: 88%", type: "academic" },
  { date: "Jan 4, 2026", action: "Late arrival - 22 minutes", type: "attendance" },
  { date: "Jan 3, 2026", action: "Fee payment received - $250", type: "financial" },
  { date: "Jan 2, 2026", action: "Absent - Parent notified", type: "attendance" },
];

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const student = students.find(s => s.id === resolvedParams.id);

  if (!student) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="py-12 text-center">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Student Not Found</h1>
          <p className="text-[var(--muted)] mt-2">The student you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/school-admin/students" className="mt-4 inline-flex items-center gap-2 text-[#0891B2] hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/school-admin/students" className="hover:text-[var(--foreground)]">Students</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-[var(--foreground)]">{student.firstName} {student.lastName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-xl font-semibold">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                {student.firstName} {student.lastName}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                student.status === "active"
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "bg-[var(--background-secondary)] text-[var(--muted)]"
              }`}>
                {student.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />}
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">{student.email}</p>
            <p className="text-sm text-[var(--muted)]">Student ID: {student.id}</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Grade</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{student.grade}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">GPA</p>
          <p className="text-2xl font-semibold text-[#0891B2] mt-1">{student.gpa.toFixed(1)}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Attendance</p>
          <p className="text-2xl font-semibold text-[#10B981] mt-1">{student.attendanceRate}%</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Fee Status</p>
          <p className={`text-2xl font-semibold mt-1 ${
            student.feeStatus === "paid" ? "text-[#10B981]" :
            student.feeStatus === "pending" ? "text-[#F59E0B]" : "text-[#EF4444]"
          }`}>
            {student.feeStatus.charAt(0).toUpperCase() + student.feeStatus.slice(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info & Grades */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Date of Birth</p>
                <p className="text-sm text-[var(--foreground)] mt-1">
                  {new Date(student.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Gender</p>
                <p className="text-sm text-[var(--foreground)] mt-1">{student.gender}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Enrollment Date</p>
                <p className="text-sm text-[var(--foreground)] mt-1">
                  {new Date(student.enrollmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Email</p>
                <p className="text-sm text-[var(--foreground)] mt-1">{student.email}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">Parent/Guardian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Name</p>
                  <p className="text-sm text-[var(--foreground)] mt-1">{student.parentName}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-[var(--foreground)] mt-1">{student.parentPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Academic Performance</h2>
              <Link href={`/school-admin/students/${student.id}/grades`} className="text-sm text-[#0891B2] hover:underline">
                View all
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-2 text-left text-xs font-medium text-[var(--muted)] uppercase">Subject</th>
                  <th className="pb-2 text-left text-xs font-medium text-[var(--muted)] uppercase">Teacher</th>
                  <th className="pb-2 text-center text-xs font-medium text-[var(--muted)] uppercase">Score</th>
                  <th className="pb-2 text-center text-xs font-medium text-[var(--muted)] uppercase">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {gradeHistory.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-sm text-[var(--foreground)]">{item.subject}</td>
                    <td className="py-3 text-sm text-[var(--muted)]">{item.teacher}</td>
                    <td className="py-3 text-center text-sm font-mono text-[var(--foreground)]">{item.score}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${
                        item.grade.startsWith('A') ? "bg-[#10B981]/10 text-[#10B981]" :
                        item.grade.startsWith('B') ? "bg-[#0891B2]/10 text-[#0891B2]" :
                        "bg-[#F59E0B]/10 text-[#F59E0B]"
                      }`}>
                        {item.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Activity & Attendance */}
        <div className="space-y-6">
          {/* Recent Attendance */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Recent Attendance</h2>
              <Link href={`/school-admin/students/${student.id}/attendance`} className="text-xs text-[#0891B2] hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {attendanceHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === "present" ? "bg-[#10B981]" :
                      item.status === "late" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                    }`} />
                    <span className="text-sm text-[var(--foreground)]">{item.date}</span>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activityTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === "attendance" ? "bg-[#10B981]/10" :
                    item.type === "academic" ? "bg-[#0891B2]/10" : "bg-[#F59E0B]/10"
                  }`}>
                    {item.type === "attendance" && (
                      <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                    {item.type === "academic" && (
                      <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347" />
                      </svg>
                    )}
                    {item.type === "financial" && (
                      <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Generate Report Card</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Record Fee Payment</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Add Disciplinary Note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


