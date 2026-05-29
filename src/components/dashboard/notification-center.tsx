"use client";

/**
 * Notification Center
 * Dropdown panel with category filters, priority indicators, and relative timestamps
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  UserPlus,
  ShieldAlert,
  Truck,
  Heart,
  Settings,
} from "lucide-react";

// ---- Types ----

type NotificationType = "warning" | "info";
type NotificationCategory =
  | "academic"
  | "finance"
  | "admissions"
  | "discipline"
  | "transport"
  | "health"
  | "system";
type NotificationPriority = "low" | "normal" | "high" | "urgent";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

// ---- Constants ----

const categories: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "academic", label: "Academic" },
  { key: "finance", label: "Finance" },
  { key: "admissions", label: "Admissions" },
  { key: "discipline", label: "Discipline" },
  { key: "transport", label: "Transport" },
  { key: "health", label: "Health" },
  { key: "system", label: "System" },
];

const categoryIcons: Record<NotificationCategory, React.ComponentType<{ className?: string; color?: string }>> = {
  academic: BookOpen,
  finance: DollarSign,
  admissions: UserPlus,
  discipline: ShieldAlert,
  transport: Truck,
  health: Heart,
  system: Settings,
};

const categoryColors: Record<NotificationCategory, string> = {
  academic: "#6366F1",
  finance: "#10B981",
  admissions: "#0891B2",
  discipline: "#EF4444",
  transport: "#F59E0B",
  health: "#EC4899",
  system: "#6B7280",
};

const priorityColors: Record<NotificationPriority, string | null> = {
  urgent: "#EF4444",
  high: "#F59E0B",
  normal: null,
  low: null,
};

// ---- Helpers ----

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ---- Component ----

export function NotificationCenter({ isOpen, onClose, notifications }: NotificationCenterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeCategory === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute right-0 mt-2 w-96 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-white bg-[#EF4444] rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button className="text-xs text-[#0891B2] hover:underline">Mark all read</button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border)] overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  activeCategory === cat.key
                    ? "bg-[#0891B2]/10 text-[#0891B2]"
                    : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--muted)]">
                No notifications in this category
              </div>
            ) : (
              filtered.map((notification) => {
                const Icon = categoryIcons[notification.category];
                const catColor = categoryColors[notification.category];
                const priColor = priorityColors[notification.priority];

                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors cursor-pointer ${
                      !notification.read ? "bg-[#0891B2]/5" : ""
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      {/* Left: Priority dot + Category icon */}
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        {priColor ? (
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: priColor }}
                          />
                        ) : (
                          <div className="w-2 h-2 shrink-0" />
                        )}
                        <Icon className="w-4 h-4 shrink-0" color={catColor} />
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {notification.title}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          {getRelativeTime(notification.timestamp)}
                        </p>
                      </div>

                      {/* Right: Unread dot */}
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-[#0891B2] shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)]">
            <button className="w-full py-2 text-sm text-[#0891B2] font-medium hover:bg-[#0891B2]/10 rounded-lg transition-colors">
              View all notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
