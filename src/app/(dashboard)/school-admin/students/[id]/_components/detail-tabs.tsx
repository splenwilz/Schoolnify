"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BookOpen, CalendarDays, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./overview-tab";
import { AcademicsTab } from "./academics-tab";
import { AttendanceTab } from "./attendance-tab";
import { ActivityTab } from "./activity-tab";
import type { Student } from "@/types/student";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "academics", label: "Academics", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: CalendarDays },
  { id: "activity", label: "Activity", icon: Activity },
];

interface DetailTabsProps {
  student: Student;
}

export function DetailTabs({ student }: DetailTabsProps) {
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
                  layoutId="detail-tab-indicator"
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
          {activeTab === "overview" && <OverviewTab student={student} />}
          {activeTab === "academics" && <AcademicsTab />}
          {activeTab === "attendance" && <AttendanceTab />}
          {activeTab === "activity" && <ActivityTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
