"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";

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

interface EventListProps {
  events: CalendarEvent[];
}

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  academic: "#0891B2",
  sports: "#10B981",
  cultural: "#A855F7",
  meeting: "#F59E0B",
  holiday: "#EF4444",
};

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function EventList({ events }: EventListProps) {
  const displayEvents = events.slice(0, 5);

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
          Upcoming Events
        </h3>
        <p className="text-[12px] text-[var(--muted)] mt-0.5">
          {events.length === 0
            ? "No events scheduled"
            : `${events.length} event${events.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {displayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
            <CalendarDays className="w-5 h-5 text-[var(--muted)]" />
          </div>
          <p className="text-[13px] font-medium text-[var(--foreground)] mb-1">
            No upcoming events
          </p>
          <p className="text-[12px] text-[var(--muted)] text-center">
            There are no events scheduled for this period.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]/50">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className="flex gap-3 px-5 py-3.5 hover:bg-[var(--background-secondary)]/30 transition-colors"
            >
              {/* Colored left border indicator */}
              <div
                className="w-1 rounded-full shrink-0 self-stretch"
                style={{
                  backgroundColor: CATEGORY_BORDER_COLORS[event.category],
                }}
              />

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                  {event.title}
                </p>

                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
                    <CalendarDays className="w-3 h-3" />
                    {formatEventDate(event.date)}
                    {event.endDate && ` - ${formatEventDate(event.endDate)}`}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                </div>

                {event.location && (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--muted)] mt-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
