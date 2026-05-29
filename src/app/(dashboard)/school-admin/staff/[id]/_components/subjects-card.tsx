"use client";

import { motion } from "framer-motion";
import { Sparkles, Briefcase } from "lucide-react";

interface SubjectsCardProps {
  subjects: string[];
  role: string;
}

const subjectColors = [
  "#0891B2", "#0891B2", "#0891B2", "#0891B2", "#0891B2",
  "#0891B2", "#0891B2", "#0891B2", "#0891B2", "#0891B2",
];

export function SubjectsCard({ subjects, role }: SubjectsCardProps) {
  if (subjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-[#0891B2]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
            Expertise
          </h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <p className="text-[13px] text-[var(--muted)]">
            {role} &mdash; No teaching subjects assigned
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[#0891B2]" />
        </div>
        <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
          Subjects & Skills
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject, idx) => {
          const color = subjectColors[idx % subjectColors.length];
          return (
            <motion.span
              key={subject}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.3 + idx * 0.05 }}
              className="px-3 py-1.5 text-[12px] font-medium rounded-lg"
              style={{ backgroundColor: `${color}12`, color }}
            >
              {subject}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}
