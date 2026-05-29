"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { classes } from "@/lib/demo-data";
import { ClassHeader } from "./_components/class-header";
import { DetailTabs } from "./_components/detail-tabs";
import { ClassCommandPalette } from "../_components/class-command-palette";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classData = classes.find((c) => c.id === resolvedParams.id);

  if (!classData) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="py-12 text-center">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Class Not Found</h1>
          <p className="text-[var(--muted)] mt-2">
            The class you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/school-admin/classes"
            className="mt-4 inline-flex items-center gap-2 text-[#0891B2] hover:underline"
          >
            Back to Classes
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
      <ClassHeader classData={classData} />

      {/* Detail Tabs */}
      <DetailTabs classData={classData} />

      <ClassCommandPalette />
    </motion.div>
  );
}
