"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Users, CalendarDays, BookOpen, BarChart3, CalendarClock, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Class } from "@/types/class";
import { OverviewTab } from "./overview-tab";
import { RosterTab } from "./roster-tab";
import { AttendanceTab } from "./attendance-tab";
import { AssignmentsTab } from "./assignments-tab";
import { GradebookTab } from "./gradebook-tab";
import { ScheduleTab } from "./schedule-tab";
import { SettingsTab } from "./settings-tab";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "roster", label: "Roster", icon: Users },
  { id: "attendance", label: "Attendance", icon: CalendarDays },
  { id: "assignments", label: "Assignments", icon: BookOpen },
  { id: "gradebook", label: "Gradebook", icon: BarChart3 },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
  { id: "settings", label: "Settings", icon: Settings2 },
] as const;

interface DetailTabsProps {
  classData: Class;
}

export function DetailTabs({ classData }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("overview");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap",
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
          {activeTab === "roster" && <RosterTab classData={classData} />}
          {activeTab === "attendance" && <AttendanceTab classData={classData} />}
          {activeTab === "assignments" && <AssignmentsTab />}
          {activeTab === "gradebook" && <GradebookTab classData={classData} />}
          {activeTab === "schedule" && <ScheduleTab classData={classData} />}
          {activeTab === "settings" && <SettingsTab classData={classData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
