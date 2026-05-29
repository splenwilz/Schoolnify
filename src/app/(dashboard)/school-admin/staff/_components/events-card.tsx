"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { upcomingEvents } from "@/lib/demo-data";

export function EventsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Events & Meetings
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {upcomingEvents.slice(0, 4).map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.4 + i * 0.06 }}
            className="flex gap-3 rounded-xl p-3 bg-[var(--background-secondary)]/50 border-l-[3px] border-l-[#0891B2]/30"
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
