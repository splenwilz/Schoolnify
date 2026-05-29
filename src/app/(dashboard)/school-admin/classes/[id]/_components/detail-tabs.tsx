"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Users, BookOpen, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./overview-tab";
import { StudentsTab } from "./students-tab";
import { AssignmentsTab } from "./assignments-tab";
import { AttendanceTab } from "./attendance-tab";

interface ClassData {
  id: string;
  name: string;
  students: number;
  teacher: string;
  room: string;
  schedule: string;
  avgGrade: number;
  attendanceRate: number;
  status: string;
}

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "students", label: "Students", icon: Users },
  { id: "assignments", label: "Assignments", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: CalendarDays },
];

interface DetailTabsProps {
  classData: ClassData;
}

export function DetailTabs({ classData }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors",
                activeTab === tab.id
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="class-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0891B2]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab classData={classData} />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "assignments" && <AssignmentsTab />}
          {activeTab === "attendance" && <AttendanceTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
