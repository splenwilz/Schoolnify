"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  UserPlus,
  FileDown,
} from "lucide-react";
import { students } from "@/lib/demo-data";
import { StatCard } from "./_components/stat-card";
import { EnrollmentChart } from "./_components/enrollment-chart";
import { MetricsGrid } from "./_components/metrics-grid";
import { FilterBar } from "./_components/filter-bar";
import { StudentTable } from "./_components/student-table";
import { BulkActionsBar } from "./_components/bulk-actions-bar";
import { EmptyState } from "./_components/empty-state";

const ITEMS_PER_PAGE = 10;

const stats = {
  total: students.length,
  active: students.filter((s) => s.status === "active").length,
  avgGpa: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
  avgAttendance: (
    students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length
  ).toFixed(1),
};

const tabs = [
  { id: "all", label: "All", count: students.length },
  {
    id: "active",
    label: "Active",
    count: students.filter((s) => s.status === "active").length,
  },
  {
    id: "inactive",
    label: "Inactive",
    count: students.filter((s) => s.status === "inactive").length,
  },
];

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const grades = useMemo(() => [...new Set(students.map((s) => s.grade))].sort(), []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (activeTab === "active" && student.status !== "active") return false;
      if (activeTab === "inactive" && student.status !== "inactive") return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        if (!fullName.includes(query) && !student.email.toLowerCase().includes(query))
          return false;
      }
      if (selectedGrade && student.grade !== selectedGrade) return false;
      if (selectedFeeStatus && student.feeStatus !== selectedFeeStatus) return false;
      return true;
    });
  }, [activeTab, searchQuery, selectedGrade, selectedFeeStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedGrade, selectedFeeStatus]);

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGrade("");
    setSelectedFeeStatus("");
    setActiveTab("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Students</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage and track enrolled students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/school-admin/students/new"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add student
          </Link>
        </div>
      </div>

      {/* Stats + Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Stats Cards (2x2 grid) */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats.total}
            change="+5.7%"
            changeUp
            subtitle="vs last term"
            color="#0891B2"
            index={0}
          />
          <StatCard
            icon={UserCheck}
            label="Active"
            value={stats.active}
            change={`${((stats.active / stats.total) * 100).toFixed(0)}%`}
            changeUp
            subtitle="of total enrolled"
            color="#10B981"
            index={1}
          />
          <StatCard
            icon={GraduationCap}
            label="Avg GPA"
            value={stats.avgGpa}
            change="+0.2"
            changeUp
            subtitle="vs last term"
            color="#3B82F6"
            index={2}
          />
          <StatCard
            icon={CalendarCheck}
            label="Attendance"
            value={`${stats.avgAttendance}%`}
            change="-1.2%"
            changeUp={false}
            subtitle="last 30 days"
            color="#F59E0B"
            index={3}
          />
        </div>

        {/* Enrollment Chart */}
        <div className="lg:col-span-2">
          <EnrollmentChart />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mb-8">
        <MetricsGrid />
      </div>

      {/* Filter Bar */}
      <FilterBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        grades={grades}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedFeeStatus={selectedFeeStatus}
        onFeeStatusChange={setSelectedFeeStatus}
        onClearAll={clearAllFilters}
      />

      {/* Content */}
      {filteredStudents.length === 0 ? (
        <EmptyState onClearFilters={clearAllFilters} />
      ) : (
        <StudentTable
          students={filteredStudents}
          selectedStudents={selectedStudents}
          onSelectAll={handleSelectAll}
          onSelectStudent={handleSelectStudent}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* Bulk Actions */}
      <BulkActionsBar count={selectedStudents.length} onClear={() => setSelectedStudents([])} />
    </motion.div>
  );
}
