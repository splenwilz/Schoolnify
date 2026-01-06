"use client";

/**
 * Class Detail Page - Class Overview
 * Features: Class info, enrolled students, schedule, performance
 * @see Stripe Dashboard - Product detail page
 */

import { use, useState } from "react";
import Link from "next/link";
import { classes, students } from "@/lib/demo-data";

// Get students enrolled in a specific class (mock - just return first 8 students for demo)
const getEnrolledStudents = () => {
  return students.slice(0, 8);
};

// Recent assignments (mock data)
const recentAssignments = [
  { id: 1, title: "Chapter 5 Quiz", dueDate: "Jan 10, 2026", status: "upcoming", submissions: 0, total: 28 },
  { id: 2, title: "Homework #12", dueDate: "Jan 8, 2026", status: "active", submissions: 18, total: 28 },
  { id: 3, title: "Midterm Exam", dueDate: "Jan 3, 2026", status: "graded", submissions: 28, total: 28 },
  { id: 4, title: "Project Proposal", dueDate: "Dec 20, 2025", status: "graded", submissions: 27, total: 28 },
];

// Attendance for last 5 classes
const classAttendance = [
  { date: "Jan 6", present: 26, absent: 2, late: 0 },
  { date: "Jan 4", present: 25, absent: 1, late: 2 },
  { date: "Jan 3", present: 27, absent: 1, late: 0 },
  { date: "Jan 2", present: 24, absent: 3, late: 1 },
  { date: "Dec 20", present: 28, absent: 0, late: 0 },
];

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classData = classes.find(c => c.id === resolvedParams.id);
  const [activeTab, setActiveTab] = useState<"students" | "assignments" | "attendance">("students");

  if (!classData) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="py-12 text-center">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Class Not Found</h1>
          <p className="text-[var(--muted)] mt-2">The class you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/school-admin/classes" className="mt-4 inline-flex items-center gap-2 text-[#0891B2] hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  const enrolledStudents = getEnrolledStudents();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/school-admin/classes" className="hover:text-[var(--foreground)]">Classes</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-[var(--foreground)]">{classData.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-lg font-bold">
            {classData.name.replace("Grade ", "")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">{classData.name}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                classData.status === "active"
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "bg-[var(--background-secondary)] text-[var(--muted)]"
              }`}>
                {classData.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />}
                {classData.status.charAt(0).toUpperCase() + classData.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">
              {classData.teacher} • Room {classData.room}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
            Edit Class
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Students</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">{classData.students}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Attendance</p>
          <p className="text-2xl font-semibold text-[#10B981] mt-1">{classData.attendanceRate}%</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Avg GPA</p>
          <p className="text-2xl font-semibold text-[#0891B2] mt-1">{classData.avgGrade.toFixed(1)}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Assignments</p>
          <p className="text-2xl font-semibold text-[var(--foreground)] mt-1">12</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Schedule</p>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1">{classData.schedule}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] mb-6">
        <div className="flex gap-6">
          {[
            { id: "students", label: "Students", count: classData.students },
            { id: "assignments", label: "Assignments", count: 12 },
            { id: "attendance", label: "Attendance" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#0891B2] text-[#0891B2]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-[var(--background-secondary)]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">GPA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Attendance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {enrolledStudents.map(student => (
                <tr key={student.id} className="hover:bg-[var(--background-secondary)]">
                  <td className="px-4 py-3">
                    <Link href={`/school-admin/students/${student.id}`} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-xs font-medium">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#0891B2]">
                        {student.firstName} {student.lastName}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-[var(--foreground)]">{student.gpa.toFixed(1)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#10B981]"
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--muted)]">{student.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      student.status === "active"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "bg-[var(--background-secondary)] text-[var(--muted)]"
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Assignment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase">Submissions</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentAssignments.map(assignment => (
                <tr key={assignment.id} className="hover:bg-[var(--background-secondary)]">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[var(--foreground)]">{assignment.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--muted)]">{assignment.dueDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      assignment.status === "graded" ? "bg-[#10B981]/10 text-[#10B981]" :
                      assignment.status === "active" ? "bg-[#0891B2]/10 text-[#0891B2]" :
                      "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#0891B2]"
                          style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--muted)]">{assignment.submissions}/{assignment.total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm text-[#0891B2] hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Recent Class Sessions</h3>
            <div className="space-y-3">
              {classAttendance.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-secondary)]">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[var(--foreground)] w-16">{session.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        {session.present} present
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                        {session.absent} absent
                      </span>
                      {session.late > 0 && (
                        <span className="flex items-center gap-1.5 text-xs">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          {session.late} late
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[#10B981]">
                    {Math.round((session.present / (session.present + session.absent)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Mark Today&apos;s Attendance</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Attendance Report</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">View Absentees</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

