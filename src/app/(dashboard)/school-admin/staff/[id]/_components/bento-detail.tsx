"use client";

import type { Staff } from "@/types/staff";
import { ScheduleCard } from "./schedule-tab";
import { InfoCard } from "./info-card";
import { SubjectsCard } from "./subjects-card";
import { ActivityCard } from "./activity-tab";
import { EmergencyContactsCard } from "./emergency-contacts-card";

interface BentoDetailProps {
  staff: Staff;
}

/**
 * Overview tab. The attendance and rating rings were removed: those numbers
 * belong to the attendance and performance modules and were placeholders here.
 */
export function BentoDetail({ staff: member }: BentoDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard staff={member} />
        <ScheduleCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectsCard subjects={member.qualifiedSubjectIds} role={member.designation} />
        <EmergencyContactsCard contacts={member.emergencyContacts} />
      </div>
      <ActivityCard />
    </div>
  );
}
