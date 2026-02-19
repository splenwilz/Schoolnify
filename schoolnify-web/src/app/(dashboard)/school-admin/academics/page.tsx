"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  academicTerms,
  subjects,
  timetableSlots,
  promotionRules,
  classes,
} from "@/lib/demo-data";
import { TermsTab } from "./_components/terms-tab";
import { SubjectsTab } from "./_components/subjects-tab";
import { TimetableTab } from "./_components/timetable-tab";
import { PromotionsTab } from "./_components/promotions-tab";

const tabs = [
  { id: "terms", label: "Terms & Sessions" },
  { id: "subjects", label: "Subjects" },
  { id: "timetable", label: "Timetable" },
  { id: "promotions", label: "Promotions" },
];

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState("terms");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const classNames = useMemo(
    () => [...new Set(timetableSlots.map((s) => s.className))],
    []
  );

  const totalSubjects = subjects.length;
  const activeTerms = academicTerms.filter((t) => t.isCurrent).length;
  const totalClasses = classes.length;
  const timetablesConfigured = classNames.length;
  const currentTerm = academicTerms.find((t) => t.isCurrent);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Today-style header */}
      <section>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">
          Academic Configuration
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 space-y-4">
            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Total subjects
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {totalSubjects}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Across {new Set(subjects.map((s) => s.department)).size}{" "}
                  departments
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[var(--muted)]">
                    Total classes
                  </span>
                </div>
                <div className="text-2xl font-semibold text-[var(--foreground)]">
                  {totalClasses}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  {timetablesConfigured} with timetables
                </div>
              </div>
            </div>

            {/* Current term card */}
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">
                  Current term
                </span>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("terms");
                  }}
                  className="text-sm text-[#0891B2] hover:underline"
                >
                  View
                </Link>
              </div>
              <div className="text-xl font-semibold text-[var(--foreground)] mt-1">
                {currentTerm?.name || "No active term"}
              </div>
              {currentTerm && (
                <div className="text-xs text-[var(--muted)] mt-1">
                  {new Date(currentTerm.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  —{" "}
                  {new Date(currentTerm.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>

            {/* Promotion rules summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Promotion rules
                  </span>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("promotions");
                    }}
                    className="text-sm text-[#0891B2] hover:underline"
                  >
                    View
                  </Link>
                </div>
                <div className="text-xl font-semibold text-[var(--foreground)] mt-1">
                  {promotionRules.length}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Auto-promote
                  </span>
                </div>
                <div className="text-xl font-semibold text-[var(--foreground)] mt-1">
                  {promotionRules.filter((r) => r.autoPromote).length}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  of {promotionRules.length} rules
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar — Quick Stats */}
          <div className="w-full lg:w-72 space-y-4">
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                Quick stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Active terms
                  </span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                    {activeTerms}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Subjects</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                    {totalSubjects}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Classes</span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                    {totalClasses}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    Timetables
                  </span>
                  <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                    {timetablesConfigured}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Year */}
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">
                Academic Year
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Year</span>
                  <span className="text-[var(--foreground)]">2025-2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Terms</span>
                  <span className="text-[var(--foreground)]">
                    {academicTerms.length} configured
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Departments</span>
                  <span className="text-[var(--foreground)]">
                    {new Set(subjects.map((s) => s.department)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Configuration Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Configuration
          </h2>
          {activeTab === "subjects" && (
            <button className="flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Subject
            </button>
          )}
        </div>

        {/* Tab Navigation — Stripe-style buttons */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "terms" && <TermsTab terms={academicTerms} />}
          {activeTab === "subjects" && (
            <SubjectsTab
              subjects={subjects}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
            />
          )}
          {activeTab === "timetable" && (
            <TimetableTab slots={timetableSlots} classes={classNames} />
          )}
          {activeTab === "promotions" && (
            <PromotionsTab rules={promotionRules} />
          )}
        </div>
      </section>
    </div>
  );
}
