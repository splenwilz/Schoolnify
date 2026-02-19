"use client";

import { motion } from "framer-motion";
import { Search, Filter, Users } from "lucide-react";

interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  routeId: string;
  routeName: string;
  stopName: string;
  feeStatus: "paid" | "pending" | "overdue";
  monthlyFee: number;
}

interface Route {
  id: string;
  name: string;
}

interface AssignmentsTabProps {
  assignments: Assignment[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  routeFilter: string;
  onRouteChange: (route: string) => void;
  routes: Route[];
}

const feeStatusColors: Record<string, string> = {
  paid: "#10B981",
  pending: "#F59E0B",
  overdue: "#EF4444",
};

export function AssignmentsTab({
  assignments,
  searchQuery,
  onSearchChange,
  routeFilter,
  onRouteChange,
  routes,
}: AssignmentsTabProps) {
  const filtered = assignments.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = !routeFilter || a.routeId === routeFilter;
    return matchesSearch && matchesRoute;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG").format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <select
            value={routeFilter}
            onChange={(e) => onRouteChange(e.target.value)}
            className="pl-9 pr-8 py-2 text-[13px] rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all appearance-none cursor-pointer"
          >
            <option value="">All Routes</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--muted)]">
            <Users className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-[14px] font-medium">No assignments found</p>
            <p className="text-[12px] mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                    Student
                  </th>
                  <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                    Route
                  </th>
                  <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                    Stop
                  </th>
                  <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                    Monthly Fee
                  </th>
                  <th className="text-left text-[12px] font-medium text-[var(--muted)] px-4 py-3">
                    Fee Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((assignment, i) => (
                  <motion.tr
                    key={assignment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-[var(--foreground)]">
                          {assignment.studentName}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {assignment.grade}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {assignment.routeName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-[var(--muted)]">
                        {assignment.stopName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-medium text-[var(--foreground)] tabular-nums">
                        {"\u20A6"}{formatCurrency(assignment.monthlyFee)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{
                          color: feeStatusColors[assignment.feeStatus],
                          backgroundColor: `${feeStatusColors[assignment.feeStatus]}15`,
                        }}
                      >
                        {assignment.feeStatus}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
