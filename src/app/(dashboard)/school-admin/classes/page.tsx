"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FileDown } from "lucide-react";
import { classes } from "@/lib/demo-data";
import { classBand, compareClasses } from "@/types/class";
import { ClassStatCards } from "./_components/class-stat-cards";
import { ClassSummaryCard } from "./_components/class-summary-card";
import { ClassGrowthChart } from "./_components/class-growth-chart";
import { AttendanceByGrade } from "./_components/attendance-by-grade";
import { ClassTable } from "./_components/class-table";
import { TopPerformersCard } from "./_components/top-performers-card";
import { ClassEventsCard } from "./_components/class-events-card";
import { BulkActionsBar } from "./_components/bulk-actions-bar";
import { EmptyState } from "./_components/empty-state";
import { ClassCommandPalette } from "./_components/class-command-palette";

const ITEMS_PER_PAGE = 10;

// Filter bands derived from the school's own grade levels (country-agnostic):
// Nursery/Primary/JSS/SSS, or Grade / Year / Form, etc.
const bandsInOrder: string[] = (() => {
  const ordered = [...classes].sort(compareClasses);
  const seen: string[] = [];
  for (const c of ordered) {
    const b = classBand(c.gradeLevel);
    if (!seen.includes(b)) seen.push(b);
  }
  return seen;
})();

const tabs = [
  { id: "all", label: "All", count: classes.length },
  ...bandsInOrder.map((band) => ({
    id: band,
    label: band,
    count: classes.filter((c) => classBand(c.gradeLevel) === band).length,
  })),
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Distinct grade levels ("Primary 4", "JSS 1", ...) in conventional order.
  const grades = useMemo(
    () => [...new Set([...classes].sort(compareClasses).map((c) => c.gradeLevel))],
    []
  );
  const teachers = useMemo(
    () => [...new Set(classes.map((c) => c.teacher))].sort(),
    []
  );

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      if (activeTab !== "all" && classBand(cls.gradeLevel) !== activeTab) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !cls.name.toLowerCase().includes(query) &&
          !cls.teacher.toLowerCase().includes(query)
        )
          return false;
      }

      if (selectedGrade && cls.gradeLevel !== selectedGrade) return false;
      if (selectedTeacher && cls.teacher !== selectedTeacher) return false;

      return true;
    });
  }, [activeTab, searchQuery, selectedGrade, selectedTeacher]);

  // Reset to page 1 when filters change (render-time pattern, no effect).
  const filterSignature = `${activeTab}|${searchQuery}|${selectedGrade}|${selectedTeacher}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (prevFilterSignature !== filterSignature) {
    setPrevFilterSignature(filterSignature);
    setCurrentPage(1);
  }

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
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/school-admin/classes/new"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)] shadow-sm transition-all"
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

      <ClassCommandPalette />
    </motion.div>
  );
}
