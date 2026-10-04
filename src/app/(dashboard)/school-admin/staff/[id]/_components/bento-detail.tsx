"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { Staff } from "@/types/staff";
import { staffAssignments } from "@/lib/demo-data";
import { StatRing } from "./stat-ring";
import { ScheduleCard } from "./schedule-tab";
import { InfoCard } from "./info-card";
import { SubjectsCard } from "./subjects-card";
import { ActivityCard } from "./activity-tab";

interface BentoDetailProps {
  staff: Staff;
}

export function BentoDetail({ staff: member }: BentoDetailProps) {
  const classCount = new Set(staffAssignments(member.id).map((a) => a.classId)).size;
  return (
    <div className="space-y-6">
      {/* Row 1: Performance Rings + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stat Rings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-[#0891B2]" />
            </div>
            <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Performance</h3>
          </div>
          <div className="flex items-center justify-around">
            <StatRing
              label="Classes"
              value={classCount}
              maxValue={8}
              displayValue={String(classCount)}
              color="#0891B2"
            />
            <StatRing
              label="Attendance"
              value={96}
              maxValue={100}
              displayValue="96%"
              color="#10B981"
            />
            <StatRing
              label="Rating"
              value={4.8}
              maxValue={5}
              displayValue="4.8"
              color="#F59E0B"
            />
          </div>
        </motion.div>

        {/* Schedule */}
        <ScheduleCard />
      </div>

      {/* Row 2: Personal Info + Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard staff={member} />
        <SubjectsCard subjects={member.qualifiedSubjectIds} role={member.designation} />
      </div>

      {/* Row 3: Activity (full width) */}
      <ActivityCard />
    </div>
  );
}
