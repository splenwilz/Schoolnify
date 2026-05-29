"use client";

import { Calendar } from "lucide-react";
import { upcomingEvents } from "@/lib/demo-data";

export function ClassEventsCard() {
  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Upcoming Events
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {upcomingEvents.slice(0, 4).map((event) => (
          <div
            key={event.id}
            className="flex gap-3 rounded-lg p-3 bg-[var(--background-secondary)] border-l-2 border-l-[var(--brand)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                {event.title}
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-1">
                {event.date}
              </p>
              <p className="text-[11px] text-[var(--muted)]">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
