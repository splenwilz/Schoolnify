"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  Users,
  Phone,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

interface Stop {
  name: string;
  time: string;
  studentCount: number;
}

interface Route {
  id: string;
  name: string;
  description: string;
  startPoint: string;
  endPoint: string;
  stops: Stop[];
  driverName: string;
  driverPhone: string;
  vehicleId: string;
  status: "active" | "inactive";
  totalStudents: number;
}

interface RoutesTabProps {
  routes: Route[];
}

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "#10B981", label: "Active" },
  inactive: { color: "#6B7280", label: "Inactive" },
};

export function RoutesTab({ routes }: RoutesTabProps) {
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  const toggleRoute = (id: string) => {
    setExpandedRoute(expandedRoute === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {routes.map((route, i) => {
        const isExpanded = expandedRoute === route.id;
        const status = statusConfig[route.status];

        return (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 200,
              delay: i * 0.05,
            }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[14px] font-medium text-[var(--foreground)]">
                {route.name}
              </h3>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: status.color,
                  backgroundColor: `${status.color}15`,
                }}
              >
                {status.label}
              </span>
            </div>

            {/* Start -> End */}
            <div className="flex items-center gap-2 text-[13px] text-[var(--muted)] mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{route.startPoint}</span>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{route.endPoint}</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-[12px] text-[var(--muted)] mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {route.stops.length} stops
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {route.totalStudents} students
              </span>
            </div>

            {/* Driver info */}
            <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] mb-3">
              <Phone className="w-3 h-3" />
              <span>{route.driverName}</span>
            </div>

            {/* View Stops toggle */}
            <button
              onClick={() => toggleRoute(route.id)}
              className="flex items-center gap-1 text-[12px] font-medium text-[#0891B2] hover:text-[#0E7490] transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Hide Stops
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  View Stops
                </>
              )}
            </button>

            {/* Stops list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
                    {route.stops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[12px]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
                          <span className="text-[var(--foreground)]">
                            {stop.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[var(--muted)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {stop.time}
                          </span>
                          {stop.studentCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {stop.studentCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
