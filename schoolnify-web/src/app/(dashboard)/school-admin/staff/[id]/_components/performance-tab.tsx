"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, AlertCircle } from "lucide-react";
import { staffPerformanceReviews } from "@/lib/demo-data";

interface PerformanceTabProps {
  staffId: string;
}

const categoryLabels: Record<string, string> = {
  teaching: "Teaching",
  communication: "Communication",
  punctuality: "Punctuality",
  teamwork: "Teamwork",
  initiative: "Initiative",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= Math.round(rating) ? "#F59E0B" : "none"}
          stroke={star <= Math.round(rating) ? "#F59E0B" : "var(--muted)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function PerformanceTab({ staffId }: PerformanceTabProps) {
  const reviews = staffPerformanceReviews.filter((r) => r.staffId === staffId);
  const latestReview = reviews.length > 0
    ? reviews.sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())[0]
    : null;

  if (!latestReview) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-12 text-center">
        <AlertCircle className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
        <p className="text-sm text-[var(--muted)]">No performance reviews found</p>
      </div>
    );
  }

  const categories = Object.entries(latestReview.categories) as [string, number][];

  return (
    <div className="space-y-6">
      {/* Top Row: Overall Rating + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-5">Overall Rating</h3>

          <div className="flex items-center gap-5">
            <div className="flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center"
              >
                <span className="text-3xl font-bold text-[#0891B2]">
                  {latestReview.overallRating.toFixed(1)}
                </span>
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <StarRating rating={latestReview.overallRating} />
              <p className="text-sm text-[var(--muted)] mt-2">
                Reviewed by <span className="text-[var(--foreground)] font-medium">{latestReview.reviewer}</span>
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">
                {latestReview.period}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {new Date(latestReview.reviewDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-5">Category Breakdown</h3>

          <div className="space-y-4">
            {categories.map(([key, value], index) => {
              const percentage = (value / 5) * 100;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[var(--foreground)]">
                      {categoryLabels[key] || key}
                    </span>
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {value.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--background-secondary)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
                      className="h-full rounded-full bg-[#0891B2]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Strengths + Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Strengths</h3>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {latestReview.strengths}
          </p>
        </motion.div>

        {/* Areas for Improvement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Areas for Improvement</h3>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {latestReview.improvements}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
