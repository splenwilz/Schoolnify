"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FileDown } from "lucide-react";
import { classes } from "@/lib/demo-data";
import { ClassStatCards } from "./_components/class-stat-cards";
import { ClassSummaryCard } from "./_components/class-summary-card";
import { ClassGrowthChart } from "./_components/class-growth-chart";
import { AttendanceByGrade } from "./_components/attendance-by-grade";
import { ClassTable } from "./_components/class-table";
import { TopPerformersCard } from "./_components/top-performers-card";
import { ClassEventsCard } from "./_components/class-events-card";
import { BulkActionsBar } from "./_components/bulk-actions-bar";
import { EmptyState } from "./_components/empty-state";

const ITEMS_PER_PAGE = 10;

function getGradeNumber(name: string): number {
  return parseInt(name.match(/\d+/)?.[0] || "0");
}

const tabs = [
  { id: "all", label: "All", count: classes.length },
  {
    id: "lower",
    label: "Lower Grades",
    count: classes.filter((c) => {
      const g = getGradeNumber(c.name);
      return g >= 5 && g <= 8;
    }).length,
  },
  {
    id: "upper",
    label: "Upper Grades",
    count: classes.filter((c) => {
      const g = getGradeNumber(c.name);
      return g >= 9 && g <= 12;
    }).length,
  },
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const grades = useMemo(
    () =>
      [...new Set(classes.map((c) => c.name.match(/\d+/)?.[0] || ""))]
        .filter(Boolean)
        .sort((a, b) => parseInt(a) - parseInt(b)),
    []
  );
  const teachers = useMemo(
    () => [...new Set(classes.map((c) => c.teacher))].sort(),
    []
  );

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const gradeNum = getGradeNumber(cls.name);

      if (activeTab === "lower" && (gradeNum < 5 || gradeNum > 8)) return false;
      if (activeTab === "upper" && (gradeNum < 9 || gradeNum > 12)) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !cls.name.toLowerCase().includes(query) &&
          !cls.teacher.toLowerCase().includes(query)
        )
          return false;
      }

      if (selectedGrade && !cls.name.includes(`Grade ${selectedGrade}`))
        return false;
      if (selectedTeacher && cls.teacher !== selectedTeacher) return false;

      return true;
    });
  }, [activeTab, searchQuery, selectedGrade, selectedTeacher]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedGrade, selectedTeacher]);

  const handleSelectAll = () => {
    if (selectedClasses.length === filteredClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(filteredClasses.map((c) => c.id));
    }
  };

  const handleSelectClass = (id: string) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGrade("");
    setSelectedTeacher("");
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Classes</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage class schedules and academic performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/school-admin/classes/new"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add class
          </Link>
        </div>
      </div>

      {/* Row 1: CRM-style Stat Cards (2×2) + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <div className="lg:col-span-7">
          <ClassStatCards />
        </div>
        <div className="lg:col-span-5">
          <ClassSummaryCard />
        </div>
      </div>

      {/* Row 2: Growth Chart + Attendance by Grade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <ClassGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <AttendanceByGrade />
        </div>
      </div>

      {/* Row 3: Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          {filteredClasses.length === 0 ? (
            <EmptyState onClearFilters={clearAllFilters} />
          ) : (
            <ClassTable
              classes={filteredClasses}
              selectedClasses={selectedClasses}
              onSelectAll={handleSelectAll}
              onSelectClass={handleSelectClass}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              grades={grades}
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
              teachers={teachers}
              selectedTeacher={selectedTeacher}
              onTeacherChange={setSelectedTeacher}
            />
          )}
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <TopPerformersCard />
          <ClassEventsCard />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar
        count={selectedClasses.length}
        onClear={() => setSelectedClasses([])}
      />
    </motion.div>
  );
}
