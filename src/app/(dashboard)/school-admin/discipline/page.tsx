"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, AlertTriangle, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { disciplineIncidents } from "@/lib/demo-data";
import { DisciplineTable } from "./_components/discipline-table";
import { IncidentModal } from "./_components/incident-modal";
import { IncidentDetail } from "./_components/incident-detail";
import { SeverityChart } from "./_components/severity-chart";
import { MonthlyTrend } from "./_components/monthly-trend";

interface Incident {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  type: "behavioral" | "academic" | "attendance" | "bullying" | "property";
  severity: "minor" | "moderate" | "major" | "critical";
  status: "open" | "in_progress" | "resolved" | "escalated";
  description: string;
  location: string;
  reportedBy: string;
  actionTaken: string;
  parentNotified: boolean;
}

export default function DisciplinePage() {
  const [incidents] = useState<Incident[]>(
    disciplineIncidents as Incident[]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );

  const stats = useMemo(() => {
    const total = incidents.length;
    const openCases = incidents.filter(
      (i) => i.status === "open" || i.status === "in_progress"
    ).length;

    // Resolved this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const resolvedThisMonth = incidents.filter((i) => {
      if (i.status !== "resolved") return false;
      const d = new Date(i.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const escalated = incidents.filter(
      (i) => i.status === "escalated"
    ).length;

    return { total, openCases, resolvedThisMonth, escalated };
  }, [incidents]);

  const metricCards = [
    {
      label: "Total Incidents",
      value: stats.total,
      subtitle: "All recorded incidents",
      icon: AlertTriangle,
      color: "#6B7280",
    },
    {
      label: "Open Cases",
      value: stats.openCases,
      subtitle: "Requires attention",
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Resolved This Month",
      value: stats.resolvedThisMonth,
      subtitle: "Successfully closed",
      icon: CheckCircle,
      color: "#10B981",
    },
    {
      label: "Escalated",
      value: stats.escalated,
      subtitle: "Needs follow-up",
      icon: ArrowUpRight,
      color: "#EF4444",
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
            Discipline & Behavior
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Track and manage student discipline incidents
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Report Incident
        </button>
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
        <div className="lg:w-72 space-y-4">
          <SeverityChart incidents={incidents} />
          <MonthlyTrend incidents={incidents} />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)] mb-6" />

      {/* Incidents Table */}
      <div>
        <DisciplineTable
          incidents={incidents}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          onViewIncident={setSelectedIncident}
        />
      </div>

      {/* Create Incident Modal */}
      <IncidentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Incident Detail Panel */}
      <IncidentDetail
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </motion.div>
  );
}
