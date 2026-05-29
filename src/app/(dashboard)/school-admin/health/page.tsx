"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  AlertTriangle,
  Clock,
  Stethoscope,
  Plus,
} from "lucide-react";
import { healthProfiles, clinicVisits } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { ProfilesTab } from "./_components/profiles-tab";
import { ProfileDetail } from "./_components/profile-detail";
import { ClinicVisitsTab } from "./_components/clinic-visits-tab";
import { ClinicModal } from "./_components/clinic-modal";
import { AllergyAlerts } from "./_components/allergy-alerts";
import { SpecialNeedsTab } from "./_components/special-needs-tab";

interface HealthProfile {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: { name: string; phone: string; relation: string };
  immunizations: { name: string; date: string; status: "completed" | "pending" }[];
  lastCheckup: string;
  notes: string;
}

interface ClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  attendedBy: string;
  status: "treated" | "referred" | "ongoing";
  parentNotified: boolean;
}

const tabs = [
  { id: "profiles", label: "Health Profiles" },
  { id: "clinic", label: "Clinic Visits" },
  { id: "special_needs", label: "Special Needs" },
];

export default function HealthPage() {
  const [profiles] = useState<HealthProfile[]>(
    healthProfiles as HealthProfile[]
  );
  const [visits] = useState<ClinicVisit[]>(clinicVisits as ClinicVisit[]);
  const [activeTab, setActiveTab] = useState("profiles");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<HealthProfile | null>(
    null
  );
  const [showClinicModal, setShowClinicModal] = useState(false);

  const stats = useMemo(() => {
    const totalProfiles = profiles.length;

    const allergyAlerts = profiles.filter(
      (p) => p.allergies.length > 0
    ).length;

    const pendingImmunizations = profiles.reduce((count, p) => {
      return (
        count + p.immunizations.filter((i) => i.status === "pending").length
      );
    }, 0);

    // Clinic visits this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const visitsThisMonth = visits.filter((v) => {
      const d = new Date(v.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    return { totalProfiles, allergyAlerts, pendingImmunizations, visitsThisMonth };
  }, [profiles, visits]);

  const metricCards = [
    {
      label: "Total Profiles",
      value: stats.totalProfiles,
      subtitle: "Student health records",
      icon: Users,
      color: "#6B7280",
    },
    {
      label: "Allergy Alerts",
      value: stats.allergyAlerts,
      subtitle: "Students with allergies",
      icon: AlertTriangle,
      color: "#EF4444",
    },
    {
      label: "Pending Immunizations",
      value: stats.pendingImmunizations,
      subtitle: "Awaiting vaccination",
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Clinic Visits This Month",
      value: stats.visitsThisMonth,
      subtitle: "Visits recorded",
      icon: Stethoscope,
      color: "#0891B2",
    },
  ];

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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Health Records
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Manage student health profiles and clinic visits
          </p>
        </div>
      </div>

      {/* Top Section: Metrics + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Main: Metric Cards */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            {metricCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    delay: i * 0.05,
                  }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: card.color }}
                      />
                    </div>
                    <span className="text-[12px] text-[var(--muted)]">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
                    {card.value}
                  </p>
                  <p className="text-[12px] text-[var(--muted)] mt-1">
                    {card.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-72">
          <AllergyAlerts profiles={profiles} />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)] mb-6" />

      {/* Records Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
          Records
        </h2>
        {activeTab === "clinic" && (
          <button
            onClick={() => setShowClinicModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Visit
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] w-fit mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                isActive
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "profiles" && (
        <ProfilesTab
          profiles={profiles}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          gradeFilter={gradeFilter}
          onGradeChange={setGradeFilter}
          onViewProfile={setSelectedProfile}
        />
      )}

      {activeTab === "clinic" && (
        <ClinicVisitsTab
          visits={visits}
          onLogVisit={() => setShowClinicModal(true)}
        />
      )}

      {activeTab === "special_needs" && <SpecialNeedsTab />}

      {/* Profile Detail Slide-out */}
      <ProfileDetail
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />

      {/* Clinic Visit Modal */}
      <ClinicModal
        isOpen={showClinicModal}
        onClose={() => setShowClinicModal(false)}
      />
    </motion.div>
  );
}
