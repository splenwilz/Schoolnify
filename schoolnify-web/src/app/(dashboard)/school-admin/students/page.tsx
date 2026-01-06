"use client";

/**
 * Students List Page - Stripe-Inspired Clean Design
 * Features: Minimal stats, subtle sparkline, clean table
 * @see Stripe Dashboard - Professional, muted colors
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { students } from "@/lib/demo-data";

// Calculate stats
const stats = {
  total: students.length,
  active: students.filter(s => s.status === "active").length,
  avgGpa: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
  feesPaid: students.filter(s => s.feeStatus === "paid").length,
};

// Enrollment growth data (mock)
const enrollmentGrowth = [
  { month: "Feb", students: 892 },
  { month: "Mar", students: 915 },
  { month: "Apr", students: 928 },
  { month: "May", students: 945 },
  { month: "Jun", students: 920 },
  { month: "Jul", students: 918 },
  { month: "Aug", students: 1050 },
  { month: "Sep", students: 1120 },
  { month: "Oct", students: 1180 },
  { month: "Nov", students: 1210 },
  { month: "Dec", students: 1235 },
  { month: "Jan", students: 1247 },
];

const maxStudents = Math.max(...enrollmentGrowth.map(d => d.students));

// Tab options
const tabs = [
  { id: "all", label: "All", count: students.length },
  { id: "active", label: "Active", count: students.filter(s => s.status === "active").length },
  { id: "inactive", label: "Inactive", count: students.filter(s => s.status === "inactive").length },
];

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const grades = useMemo(() => [...new Set(students.map(s => s.grade))].sort(), []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (activeTab === "active" && student.status !== "active") return false;
      if (activeTab === "inactive" && student.status !== "inactive") return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        if (!fullName.includes(query) && !student.email.toLowerCase().includes(query)) return false;
      }
      if (selectedGrade && student.grade !== selectedGrade) return false;
      if (selectedFeeStatus && student.feeStatus !== selectedFeeStatus) return false;
      return true;
    });
  }, [activeTab, searchQuery, selectedGrade, selectedFeeStatus]);

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Students</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Manage enrolled students</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-[var(--foreground)] border border-[var(--border)] rounded-md hover:bg-[var(--background-secondary)]">
            Export
          </button>
          <Link
            href="/school-admin/students/new"
            className="px-3 py-1.5 text-sm font-medium text-white bg-[#0891B2] rounded-md hover:bg-[#0E7490]"
          >
            Add student
          </Link>
        </div>
      </div>

      {/* Stats Row - Stripe style: simple text, no boxes */}
      <div className="flex items-baseline gap-8 mb-8 pb-6 border-b border-[var(--border)]">
        <div>
          <p className="text-sm text-[var(--muted)]">Total students</p>
          <p className="text-3xl font-semibold text-[var(--foreground)] tabular-nums">{stats.total}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">Active</p>
          <p className="text-3xl font-semibold text-[var(--foreground)] tabular-nums">{stats.active}</p>
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">Avg GPA</p>
          <p className="text-3xl font-semibold text-[var(--foreground)] tabular-nums">{stats.avgGpa}</p>
        </div>
        <div className="ml-auto">
          {/* Mini sparkline chart */}
          <p className="text-sm text-[var(--muted)] mb-1">Enrollment</p>
          <div className="flex items-end gap-0.5 h-8">
            <svg width="120" height="32" viewBox="0 0 120 32" className="text-[var(--muted)]">
              <path
                d={`M 0 ${32 - (enrollmentGrowth[0].students / maxStudents) * 28} ${enrollmentGrowth.map((d, i) => {
                  const x = (i / (enrollmentGrowth.length - 1)) * 120;
                  const y = 32 - (d.students / maxStudents) * 28;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--foreground)] ml-2">{enrollmentGrowth[enrollmentGrowth.length - 1].students.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--background-secondary)] text-[var(--foreground)] font-medium"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs text-[var(--muted)]">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
          />
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)]"
        >
          <option value="">Grade</option>
          {grades.map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
        </select>
        <select
          value={selectedFeeStatus}
          onChange={(e) => setSelectedFeeStatus(e.target.value)}
          className="px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)]"
        >
          <option value="">Fee status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 rounded border-[var(--border)]"
                />
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Name</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Grade</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Status</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">GPA</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Attendance</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--muted)]">Fees</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-[var(--background-secondary)]">
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                    className="w-3.5 h-3.5 rounded border-[var(--border)]"
                  />
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/school-admin/students/${student.id}`} className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-xs font-medium text-[var(--foreground)]">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm text-[var(--foreground)] group-hover:text-[#0891B2]">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{student.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-sm text-[var(--foreground)]">{student.grade}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center text-xs ${
                    student.status === "active" ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      student.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`} />
                    {student.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-sm tabular-nums text-[var(--foreground)]">{student.gpa.toFixed(2)}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-sm tabular-nums text-[var(--muted)]">{student.attendanceRate}%</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs ${
                    student.feeStatus === "paid" ? "text-green-600" :
                    student.feeStatus === "pending" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {student.feeStatus.charAt(0).toUpperCase() + student.feeStatus.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <button className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--muted)]">
            No students found
          </div>
        )}

        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2.5 border-t border-[var(--border)] text-xs text-[var(--muted)]">
            <span>{filteredStudents.length} results</span>
            <div className="flex gap-1">
              <button disabled className="px-2 py-1 border border-[var(--border)] rounded text-[var(--muted)] opacity-50">Previous</button>
              <button disabled className="px-2 py-1 border border-[var(--border)] rounded text-[var(--muted)] opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
