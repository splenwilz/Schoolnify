"use client";

import { BookOpen, UserPlus, DollarSign, ShieldAlert } from "lucide-react";

interface Activity {
  id: string;
  subAdminId: string;
  subAdminName: string;
  action: string;
  details: string;
  timestamp: string;
  category: "academics" | "admissions" | "finance" | "discipline";
}

interface ActivityLogProps {
  activities: Activity[];
}

const categoryConfig = {
  academics: { icon: BookOpen, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  admissions: { icon: UserPlus, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  finance: { icon: DollarSign, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  discipline: {
    icon: ShieldAlert,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
  },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const displayedActivities = activities.slice(0, 8);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {displayedActivities.map((activity) => {
          const config = categoryConfig[activity.category];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                style={{ backgroundColor: config.bg }}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: config.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                  {activity.action}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {activity.subAdminName}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
