"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { staff } from "@/lib/demo-data";
import { ProfileHeader } from "./_components/profile-header";
import { BentoDetail } from "./_components/bento-detail";

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const staffMember = staff.find((s) => s.id === resolvedParams.id);

  if (!staffMember) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
            <ArrowLeft className="w-5 h-5 text-[var(--muted)]" />
          </div>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Member Not Found</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            The team member you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/school-admin/staff"
            className="mt-4 text-sm text-[#0891B2] hover:underline"
          >
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      <ProfileHeader staff={staffMember} />
      <BentoDetail staff={staffMember} />
    </motion.div>
  );
}
