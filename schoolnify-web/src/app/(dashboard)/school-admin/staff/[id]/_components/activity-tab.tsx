"use client";

import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, BookOpen, Users, Mail, Clock } from "lucide-react";

const activityTimeline = [
  {
    date: "Feb 14, 2026",
    action: "Marked attendance for 7A Math",
    type: "attendance",
    icon: CheckCircle2,
    color: "#0891B2",
  },
  {
    date: "Feb 13, 2026",
    action: "Submitted grades for Q2 assessments",
    type: "academic",
    icon: GraduationCap,
    color: "#0891B2",
  },
  {
    date: "Feb 12, 2026",
    action: "Updated lesson plan for Week 14",
    type: "planning",
    icon: BookOpen,
    color: "#0891B2",
  },
  {
    date: "Feb 11, 2026",
    action: "Attended department meeting",
    type: "meeting",
    icon: Users,
    color: "#0891B2",
  },
  {
    date: "Feb 10, 2026",
    action: "Sent parent notification - 5 recipients",
    type: "communication",
    icon: Mail,
    color: "#0891B2",
  },
];

export function ActivityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-[#0891B2]" />
        </div>
        <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
          Recent Activity
        </h3>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-[var(--border)] via-[var(--border)] to-transparent" />

        <div className="space-y-0.5">
          {activityTimeline.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.35 + idx * 0.06 }}
                className="flex gap-3.5 py-2.5 group"
              >
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-[13px] text-[var(--foreground)] group-hover:text-[var(--foreground)] transition-colors">{item.action}</p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">{item.date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
