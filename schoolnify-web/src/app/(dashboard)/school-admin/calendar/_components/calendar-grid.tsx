"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface CalendarGridProps {
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  academic: "#0891B2",
  sports: "#10B981",
  cultural: "#A855F7",
  meeting: "#F59E0B",
  holiday: "#EF4444",
};

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  // Convert from Sunday=0 to Monday=0
  return day === 0 ? 6 : day - 1;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return events.filter((event) => {
    if (event.date === dateStr) return true;
    if (event.endDate) {
      const start = new Date(event.date + "T00:00:00");
      const end = new Date(event.endDate + "T00:00:00");
      const current = new Date(dateStr + "T00:00:00");
      if (current >= start && current <= end) return true;
    }
    return false;
  });
}

export function CalendarGrid({
  events,
  selectedDate,
  onSelectDate,
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Previous month days to fill the first row
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const prevDays = Array.from(
    { length: firstDay },
    (_, i) => prevMonthDays - firstDay + i + 1
  );

  // Current month days
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month days to fill the last row
  const totalCells = prevDays.length + currentDays.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextDays = Array.from({ length: remainingCells }, (_, i) => i + 1);

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
          {monthName}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="px-1 py-2.5 text-center text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7">
        {/* Previous month days */}
        {prevDays.map((day) => (
          <div
            key={`prev-${day}`}
            className="min-h-[72px] p-1.5 border-b border-r border-[var(--border)]/50"
          >
            <span className="text-[12px] text-[var(--muted)]/40">{day}</span>
          </div>
        ))}

        {/* Current month days */}
        {currentDays.map((day) => {
          const date = new Date(year, month, day);
          const dayEvents = getEventsForDate(events, date);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <div
              key={`current-${day}`}
              onClick={() => onSelectDate(date)}
              className={cn(
                "min-h-[72px] p-1.5 border-b border-r border-[var(--border)]/50 cursor-pointer transition-colors hover:bg-[var(--background-secondary)]/50",
                isSelected && "bg-[#0891B2]/5"
              )}
            >
              <div className="flex items-center justify-center">
                <span
                  className={cn(
                    "flex items-center justify-center w-7 h-7 text-[12px] font-medium rounded-full transition-all",
                    isSelected && "bg-[#0891B2] text-white",
                    isToday &&
                      !isSelected &&
                      "ring-2 ring-[#0891B2] text-[#0891B2] font-semibold",
                    !isSelected && !isToday && "text-[var(--foreground)]"
                  )}
                >
                  {day}
                </span>
              </div>

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex items-center justify-center gap-0.5 mt-1 flex-wrap">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: CATEGORY_COLORS[event.category],
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] text-[var(--muted)]">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Next month days */}
        {nextDays.map((day) => (
          <div
            key={`next-${day}`}
            className="min-h-[72px] p-1.5 border-b border-r border-[var(--border)]/50"
          >
            <span className="text-[12px] text-[var(--muted)]/40">{day}</span>
          </div>
        ))}
      </div>

      {/* Category legend */}
      <div className="flex items-center gap-4 px-6 py-3 border-t border-[var(--border)]">
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] text-[var(--muted)] capitalize">
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
