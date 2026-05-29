"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Truck,
  Users,
  DollarSign,
  Route,
  Bus,
  ClipboardList,
  Receipt,
} from "lucide-react";
import {
  transportRoutes,
  transportVehicles,
  transportAssignments,
  transportFees,
} from "@/lib/demo-data";
import { VehicleStatus } from "./_components/vehicle-status";
import { RoutesTab } from "./_components/routes-tab";
import { VehiclesTab } from "./_components/vehicles-tab";
import { AssignmentsTab } from "./_components/assignments-tab";
import { FeesTab } from "./_components/fees-tab";

type TabKey = "routes" | "vehicles" | "assignments" | "fees";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "routes", label: "Routes", icon: Route },
  { key: "vehicles", label: "Vehicles", icon: Bus },
  { key: "assignments", label: "Assignments", icon: ClipboardList },
  { key: "fees", label: "Fees", icon: Receipt },
];

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("routes");
  const [searchQuery, setSearchQuery] = useState("");
  const [routeFilter, setRouteFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const stats = useMemo(() => {
    const totalRoutes = transportRoutes.length;
    const activeRoutes = transportRoutes.filter(
      (r) => r.status === "active"
    ).length;
    const activeVehicles = transportVehicles.filter(
      (v) => v.status === "active"
    ).length;
    const totalVehicles = transportVehicles.length;
    const totalStudents = transportAssignments.length;
    const paidFees = transportFees.filter((f) => f.status === "paid").length;
    const feeCollectionRate =
      transportFees.length > 0
        ? Math.round((paidFees / transportFees.length) * 100)
        : 0;

    return {
      totalRoutes,
      activeRoutes,
      activeVehicles,
      totalVehicles,
      totalStudents,
      feeCollectionRate,
    };
  }, []);

  const metricCards = [
    {
      label: "Total Routes",
      value: stats.totalRoutes,
      subtitle: `${stats.activeRoutes} active routes`,
      icon: MapPin,
      color: "#0891B2",
    },
    {
      label: "Active Vehicles",
      value: stats.activeVehicles,
      subtitle: `${stats.totalVehicles} total vehicles`,
      icon: Truck,
      color: "#10B981",
    },
    {
      label: "Students Assigned",
      value: stats.totalStudents,
      subtitle: "Across all routes",
      icon: Users,
      color: "#8B5CF6",
    },
    {
      label: "Fee Collection",
      value: `${stats.feeCollectionRate}%`,
      subtitle: "Paid this period",
      icon: DollarSign,
      color: "#F59E0B",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Transport Management
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-0.5">
          Manage school routes, vehicles, student assignments, and transport
          fees
        </p>
      </div>

      {/* Top Section: Metrics + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main: 2x2 Metric Cards */}
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
          <VehicleStatus vehicles={transportVehicles} />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)]" />

      {/* Fleet & Routes Section */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Fleet & Routes
        </h2>

        {/* Tab Buttons */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-[var(--background-secondary)] w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                  isActive
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "routes" && <RoutesTab routes={transportRoutes} />}
        {activeTab === "vehicles" && (
          <VehiclesTab vehicles={transportVehicles} />
        )}
        {activeTab === "assignments" && (
          <AssignmentsTab
            assignments={transportAssignments}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            routeFilter={routeFilter}
            onRouteChange={setRouteFilter}
            routes={transportRoutes}
          />
        )}
        {activeTab === "fees" && <FeesTab fees={transportFees} />}
      </div>
    </motion.div>
  );
}
