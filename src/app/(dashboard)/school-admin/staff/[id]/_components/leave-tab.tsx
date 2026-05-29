"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { staffLeaveRequests, staffLeaveBalances } from "@/lib/demo-data";

interface LeaveTabProps {
  staffId: string;
}

const leaveTypeColors: Record<string, string> = {
  annual: "#3B82F6",
  sick: "#EF4444",
  personal: "#F59E0B",
};

const leaveTypeLabels: Record<string, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  personal: "Personal Leave",
};

const statusColors: Record<string, string> = {
  pending: "#F59E0B",
  approved: "#10B981",
  rejected: "#EF4444",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

export function LeaveTab({ staffId }: LeaveTabProps) {
  const balances = staffLeaveBalances[staffId] || {
    annual: { total: 0, used: 0, remaining: 0 },
    sick: { total: 0, used: 0, remaining: 0 },
    personal: { total: 0, used: 0, remaining: 0 },
  };

  const requests = staffLeaveRequests.filter((r) => r.staffId === staffId);

  const leaveTypes = ["annual", "sick", "personal"] as const;

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveTypes.map((type, index) => {
          const balance = balances[type];
          const color = leaveTypeColors[type];
          const percentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <CalendarDays className="w-4 h-4" style={{ color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {leaveTypeLabels[type]}
                  </h3>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color }}
                >
                  {balance.remaining}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[var(--background-secondary)] mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{balance.used} of {balance.total} days used</span>
                <span>{balance.remaining} remaining</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leave Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Leave Requests</h3>
        </div>

        {requests.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CalendarDays className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--muted)]">No leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  const typeColor = leaveTypeColors[request.type];
                  const sColor = statusColors[request.status];
                  const StatusIcon = statusIcons[request.status];

                  return (
                    <tr
                      key={request.id}
                      className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background-secondary)] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md"
                          style={{
                            backgroundColor: `${typeColor}15`,
                            color: typeColor,
                          }}
                        >
                          {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--foreground)]">
                        {new Date(request.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--foreground)]">
                        {new Date(request.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--foreground)] font-medium">
                        {request.days}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
                          )}
                          style={{
                            backgroundColor: `${sColor}15`,
                            color: sColor,
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--muted)] max-w-[200px] truncate">
                        {request.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
