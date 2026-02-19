"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CalendarDays, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoDetail } from "./bento-detail";
import { LeaveTab } from "./leave-tab";
import { PerformanceTab } from "./performance-tab";
import { DocumentsTab } from "./documents-tab";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "on_leave";
  classesAssigned: number;
  joinDate: string;
  salary: number;
  subjects: string[];
}

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "leave", label: "Leave", icon: CalendarDays },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "documents", label: "Documents", icon: FileText },
];

interface StaffDetailTabsProps {
  staff: StaffMember;
}

export function StaffDetailTabs({ staff }: StaffDetailTabsProps) {
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
                  layoutId="staff-detail-tab-indicator"
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
          {activeTab === "overview" && <BentoDetail staff={staff} />}
          {activeTab === "leave" && <LeaveTab staffId={staff.id} />}
          {activeTab === "performance" && <PerformanceTab staffId={staff.id} />}
          {activeTab === "documents" && <DocumentsTab staffId={staff.id} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
