"use client";

import { motion } from "framer-motion";

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

interface VehiclesTabProps {
  vehicles: Vehicle[];
}

const typeColors: Record<string, string> = {
  bus: "#3B82F6",
  minibus: "#F59E0B",
  van: "#6B7280",
};

const statusColors: Record<string, string> = {
  active: "#10B981",
  maintenance: "#F59E0B",
  inactive: "#6B7280",
};

export function VehiclesTab({ vehicles }: VehiclesTabProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Plate Number
              </th>
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Type
              </th>
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Capacity
              </th>
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Driver
              </th>
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Status
              </th>
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Last Service
              </th>
              <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                Next Service
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, i) => {
              const loadPercent =
                vehicle.capacity > 0
                  ? Math.round(
                      (vehicle.currentLoad / vehicle.capacity) * 100
                    )
                  : 0;

              return (
                <motion.tr
                  key={vehicle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-mono font-medium text-[var(--foreground)]">
                      {vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
                      style={{
                        color: typeColors[vehicle.type],
                        backgroundColor: `${typeColors[vehicle.type]}15`,
                      }}
                    >
                      {vehicle.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-[var(--background-secondary)]">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${loadPercent}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
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
                      <span className="text-[11px] text-[var(--muted)] tabular-nums whitespace-nowrap">
                        {vehicle.currentLoad}/{vehicle.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--foreground)]">
                      {vehicle.driverName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
                      style={{
                        color: statusColors[vehicle.status],
                        backgroundColor: `${statusColors[vehicle.status]}15`,
                      }}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--muted)]">
                      {formatDate(vehicle.lastService)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[var(--muted)]">
                      {formatDate(vehicle.nextService)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
