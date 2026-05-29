"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

interface Vehicle {
  id: string;
  plateNumber: string;
  type: "bus" | "minibus" | "van";
  capacity: number;
  currentLoad: number;
  driverName: string;
  status: "active" | "maintenance" | "inactive";
  lastService: string;
  nextService: string;
}

interface VehicleStatusProps {
  vehicles: Vehicle[];
}

const statusColors: Record<string, string> = {
  active: "#10B981",
  maintenance: "#F59E0B",
  inactive: "#6B7280",
};

export function VehicleStatus({ vehicles }: VehicleStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.2 }}
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-4 h-4 text-[var(--muted)]" />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Vehicle Fleet
        </h3>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => {
          const loadPercent =
            vehicle.capacity > 0
              ? Math.round((vehicle.currentLoad / vehicle.capacity) * 100)
              : 0;

          return (
            <div key={vehicle.id} className="flex items-center gap-3">
              {/* Status dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: statusColors[vehicle.status] }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-mono font-medium text-[var(--foreground)]">
                    {vehicle.plateNumber}
                  </span>
                  <span className="text-[11px] text-[var(--muted)] capitalize">
                    {vehicle.type}
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--background-secondary)]">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{
                        backgroundColor:
                          loadPercent > 85
                            ? "#EF4444"
                            : loadPercent > 60
                            ? "#F59E0B"
                            : "#10B981",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--muted)] tabular-nums whitespace-nowrap">
                    {vehicle.currentLoad}/{vehicle.capacity}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
