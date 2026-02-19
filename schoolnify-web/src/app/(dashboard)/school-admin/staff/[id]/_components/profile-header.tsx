"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, Mail, ChevronRight, Phone, Calendar, DollarSign, BookOpen } from "lucide-react";
import { Avatar } from "../../../students/_components/avatar";
import { cn } from "@/lib/utils";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "on_leave";
  classesAssigned: number;
  joinDate: string;
  salary: number;
}

interface ProfileHeaderProps {
  staff: StaffMember;
}

const deptColors: Record<string, string> = {
  Mathematics: "#0891B2",
  English: "#0891B2",
  Science: "#0891B2",
  "Student Services": "#0891B2",
  Administration: "#0891B2",
  History: "#0891B2",
  "Physical Education": "#0891B2",
  Art: "#0891B2",
  Technology: "#0891B2",
  Library: "#0891B2",
  Music: "#0891B2",
  "Health Services": "#0891B2",
};

export function ProfileHeader({ staff: member }: ProfileHeaderProps) {
  const joinYear = new Date(member.joinDate).getFullYear();
  const joinMonth = new Date(member.joinDate).toLocaleDateString("en-US", { month: "short" });
  const deptColor = deptColors[member.department] || "#6B7280";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/school-admin/staff" className="hover:text-[var(--foreground)] transition-colors">
          Team
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--foreground)]">
          {member.firstName} {member.lastName}
        </span>
      </div>

      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden mb-8"
      >
        {/* Gradient stripe - uses department color */}
        <div
          className="absolute inset-x-0 top-0 h-28"
          style={{
            background: `linear-gradient(135deg, ${deptColor}15 0%, ${deptColor}08 50%, transparent 100%)`,
          }}
        />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-x-0 top-0 h-28 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative p-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            {/* Avatar with status ring */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <Avatar
                firstName={member.firstName}
                lastName={member.lastName}
                size="lg"
                className="rounded-2xl w-20 h-20 text-2xl shadow-lg"
              />
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-[var(--card)]",
                  member.status === "active" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                )}
              />
              {member.status === "active" && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] animate-ping opacity-40" />
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-[var(--foreground)]">
                  {member.firstName} {member.lastName}
                </h1>
                {member.status === "active" ? (
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#10B981]/10 text-[#10B981]">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#F59E0B]/10 text-[#F59E0B]">
                    On Leave
                  </span>
                )}
              </div>

              {/* Role & department */}
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="px-2 py-0.5 text-[11px] font-semibold rounded-md"
                  style={{ backgroundColor: `${deptColor}15`, color: deptColor }}
                >
                  {member.role}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: deptColor }}
                  />
                  {member.department}
                </span>
              </div>

              {/* Contact row */}
              <div className="flex items-center gap-4 mt-3 text-[12px] text-[var(--muted)]">
                <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  {member.email}
                </a>
                <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  {member.phone}
                </a>
              </div>

              {/* Stat pills */}
              <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                  <BookOpen className="w-3.5 h-3.5 text-[#0891B2]" />
                  {member.classesAssigned} classes
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-[#0891B2]" />
                  Joined {joinMonth} {joinYear}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-lg">
                  <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                  ${member.salary.toLocaleString()}/yr
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/20 transition-all">
                <Mail className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
