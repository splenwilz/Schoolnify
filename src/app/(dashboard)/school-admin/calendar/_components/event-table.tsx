"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Pencil,
  Trash2,
  MapPin,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  category: "academic" | "sports" | "cultural" | "meeting" | "holiday";
  description: string;
  location?: string;
}

interface EventTableProps {
  events: CalendarEvent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "academic", label: "Academic" },
  { id: "sports", label: "Sports" },
  { id: "cultural", label: "Cultural" },
  { id: "meeting", label: "Meeting" },
  { id: "holiday", label: "Holiday" },
];

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  academic: "bg-[#0891B2]/10 text-[#0891B2]",
  sports: "bg-[#10B981]/10 text-[#10B981]",
  cultural: "bg-[#A855F7]/10 text-[#A855F7]",
  meeting: "bg-[#F59E0B]/10 text-[#F59E0B]",
  holiday: "bg-[#EF4444]/10 text-[#EF4444]",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventTable({
  events,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onEdit,
  onDelete,
}: EventTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  // Filter events
  const filteredEvents = events
    .filter((event) => {
      if (categoryFilter !== "all" && event.category !== categoryFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !event.title.toLowerCase().includes(query) &&
          !event.description.toLowerCase().includes(query) &&
          !(event.location || "").toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    })
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              All Events
            </h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                  categoryFilter === tab.id
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8.5 pr-8 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-[var(--border)]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Location
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-[13px] text-[var(--muted)]">
                    No events found matching your criteria.
                  </p>
                </td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="group border-b border-[var(--border)]/50 last:border-b-0 hover:bg-[var(--background-secondary)]/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {event.title}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5 line-clamp-1">
                        {event.description}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--foreground)]">
                      {formatDate(event.date)}
                    </span>
                    {event.endDate && (
                      <span className="text-[11px] text-[var(--muted)] block">
                        to {formatDate(event.endDate)}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full capitalize",
                        CATEGORY_BADGE_STYLES[event.category]
                      )}
                    >
                      {event.category}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">
                      {event.time}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {event.location ? (
                      <span className="flex items-center gap-1 text-[13px] text-[var(--muted)]">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[var(--muted)]/50">
                        --
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div
                      className="relative"
                      ref={openMenuId === event.id ? menuRef : undefined}
                    >
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === event.id ? null : event.id
                          )
                        }
                        className="p-1.5 rounded-lg text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--background-secondary)] transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenuId === event.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-1 w-36 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-hidden"
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onEdit?.(event);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-[var(--muted)]" />
                              Edit
                            </button>
                            <div className="border-t border-[var(--border)]" />
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete?.(event.id);
                              }}
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
