"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, FileDown } from "lucide-react";
import { staff } from "@/lib/demo-data";
import { StaffToday } from "./_components/staff-today";
import { StaffOverview } from "./_components/staff-overview";
import { StaffTable } from "./_components/staff-table";
import { BulkActionsBar } from "./_components/bulk-actions-bar";
import { EmptyState } from "./_components/empty-state";

const ITEMS_PER_PAGE = 10;

const tabs = [
  { id: "all", label: "All", count: staff.length },
  {
    id: "active",
    label: "Active",
    count: staff.filter((s) => s.status === "active").length,
  },
  {
    id: "on_leave",
    label: "On Leave",
    count: staff.filter((s) => s.status === "on_leave").length,
  },
];

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const departments = useMemo(
    () => [...new Set(staff.map((s) => s.department))].sort(),
    []
  );

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      if (activeTab === "active" && member.status !== "active") return false;
      if (activeTab === "on_leave" && member.status !== "on_leave") return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        if (!fullName.includes(query) && !member.email.toLowerCase().includes(query))
          return false;
      }
      if (selectedDepartment && member.department !== selectedDepartment) return false;
      return true;
    });
  }, [activeTab, searchQuery, selectedDepartment]);

  // Reset to page 1 when filters change (render-time pattern, no effect).
  const filterSignature = `${activeTab}|${searchQuery}|${selectedDepartment}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (prevFilterSignature !== filterSignature) {
    setPrevFilterSignature(filterSignature);
    setCurrentPage(1);
  }

  const handleSelectAll = () => {
    if (selectedStaff.length === filteredStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff.map((s) => s.id));
    }
  };

  const handleSelectStaff = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Staff</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage and track staff members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/school-admin/staff/new"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)] shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add staff
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Today — mirrors the main dashboard hero */}
        <StaffToday />

        <hr className="border-[var(--border)]" />

        {/* Your overview — customizable sparkline widgets */}
        <StaffOverview />

        <hr className="border-[var(--border)]" />

        {/* Staff directory */}
        <section>
          {filteredStaff.length === 0 ? (
            <EmptyState onClearFilters={clearAllFilters} />
          ) : (
            <StaffTable
              staff={filteredStaff}
              selectedStaff={selectedStaff}
              onSelectAll={handleSelectAll}
              onSelectStaff={handleSelectStaff}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              departments={departments}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
            />
          )}
        </section>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar count={selectedStaff.length} onClear={() => setSelectedStaff([])} />
    </motion.div>
  );
}
