"use client";

import { motion } from "framer-motion";
import { feeSummary } from "@/lib/demo-data";

const formatCompact = (n: number) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
};

export function FinancialHealthBanner() {
  const rate = feeSummary.collectionRate;
  // Semicircle arc math
  const R = 44;
  const strokeW = 7;
  const cx = 60;
  const cy = 56;
  const circumference = Math.PI * R; // half-circle
  const dashOffset = circumference * (1 - rate / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(8,145,178,0.10) 0%, rgba(8,145,178,0.04) 40%, var(--card) 100%)",
      }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <div className="mb-2">
          <p className="text-[15px] font-semibold text-[var(--foreground)]">
            Financial Overview
          </p>
          <p className="text-[12px] text-[var(--muted)] mt-0.5">
            Spring Term 2026
          </p>
        </div>

        {/* Arc + Decorative illustration */}
        <div className="flex-1 flex items-center justify-between gap-4 min-h-[120px]">
          {/* Semicircle Arc */}
          <div className="flex flex-col items-center">
            <svg width="120" height="72" viewBox="0 0 120 72">
              {/* Background arc */}
              <path
                d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                fill="none"
                stroke="var(--border)"
                strokeWidth={strokeW}
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Animated foreground arc */}
              <motion.path
                d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                fill="none"
                stroke="#0891B2"
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums -mt-6">
              {rate}%
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Collection Rate
            </p>
          </div>

          {/* Decorative abstract shapes */}
          <svg
            width="100"
            height="90"
            viewBox="0 0 100 90"
            className="flex-shrink-0 opacity-60"
          >
            {/* Layered abstract financial shapes */}
            <rect
              x="20"
              y="10"
              width="60"
              height="45"
              rx="8"
              fill="#0891B2"
              opacity="0.08"
            />
            <rect
              x="28"
              y="18"
              width="60"
              height="45"
              rx="8"
              fill="#0891B2"
              opacity="0.12"
            />
            <circle cx="48" cy="40" r="12" fill="#0891B2" opacity="0.15" />
            <circle cx="68" cy="36" r="8" fill="#0891B2" opacity="0.10" />
            {/* Dollar sign */}
            <text
              x="48"
              y="45"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#0891B2"
              opacity="0.25"
            >
              $
            </text>
            {/* Coins */}
            <circle cx="30" cy="65" r="10" fill="#0891B2" opacity="0.10" />
            <circle cx="50" cy="68" r="8" fill="#0891B2" opacity="0.08" />
            <circle cx="66" cy="70" r="6" fill="#0891B2" opacity="0.06" />
          </svg>
        </div>

        {/* Bottom metrics */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[var(--border)]">
          <div>
            <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
              {formatCompact(feeSummary.totalCollected)}
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Collected
            </p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div>
            <p className="text-[20px] font-bold text-[#F59E0B] tabular-nums leading-tight">
              {formatCompact(feeSummary.totalOutstanding)}
            </p>
            <p className="text-[10px] text-[var(--muted)] font-medium mt-0.5">
              Outstanding
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
