"use client";

import { motion } from "framer-motion";
import type { StaffAssignment, StaffDetail } from "@/types/staff";
import { ProfileHeader } from "./profile-header";
import { StaffDetailTabs } from "./staff-detail-tabs";

export interface StaffDetailViewProps {
  member: StaffDetail;
  today: string;
  assignments: StaffAssignment[];
  /** id + display name for everyone, used to label verifiers, managers and recorders. */
  staffDirectory: { id: string; name: string }[];
  managerName: string | null;
  awayToday: boolean;
}

export function StaffDetailView(props: StaffDetailViewProps) {
  const classCount = new Set(props.assignments.map((a) => a.classId)).size;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1200px] mx-auto">
      <ProfileHeader staff={props.member} classCount={classCount} awayToday={props.awayToday} />
      <StaffDetailTabs {...props} />
    </motion.div>
  );
}
