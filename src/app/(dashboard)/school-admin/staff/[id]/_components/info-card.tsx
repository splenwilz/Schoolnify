"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, Calendar, BookOpen, DollarSign } from "lucide-react";

interface StaffMember {
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  classesAssigned: number;
  salary: number;
}

interface InfoCardProps {
  staff: StaffMember;
}

const iconMap: Record<string, typeof Mail> = {
  Email: Mail,
  Phone: Phone,
  Department: Building2,
  "Join Date": Calendar,
  Classes: BookOpen,
  Salary: DollarSign,
};

const colorMap: Record<string, string> = {
  Email: "#0891B2",
  Phone: "#0891B2",
  Department: "#0891B2",
  "Join Date": "#0891B2",
  Classes: "#0891B2",
  Salary: "#0891B2",
};

export function InfoCard({ staff: member }: InfoCardProps) {
  const fields = [
    { label: "Email", value: member.email },
    { label: "Phone", value: member.phone },
    { label: "Department", value: member.department },
    {
      label: "Join Date",
      value: new Date(member.joinDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    },
    { label: "Classes", value: `${member.classesAssigned} assigned` },
    { label: "Salary", value: `$${member.salary.toLocaleString()}/yr` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-[#0891B2]" />
        </div>
        <h3 className="text-[14px] font-semibold text-[var(--foreground)]">
          Personal Information
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const Icon = iconMap[field.label] || User;
          const color = colorMap[field.label] || "#6B7280";
          return (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.25 + idx * 0.04 }}
              className="flex items-start gap-2.5"
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}10` }}
              >
                <Icon className="w-3 h-3" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-medium mb-0.5">
                  {field.label}
                </p>
                <p className="text-[13px] text-[var(--foreground)]">{field.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
