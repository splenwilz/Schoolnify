"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileDown, CreditCard } from "lucide-react";
import { FinesTab } from "../_components/fines-tab";

export default function FinesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/librarian"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Fines & Penalties</h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">Track and manage overdue fines and payments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all">
            <CreditCard className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>
      <FinesTab />
    </motion.div>
  );
}
