"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Building2, PlayCircle } from "lucide-react";
import { TOUR_STORAGE_KEYS } from "@/lib/tour-steps";

interface WelcomeBannerProps {
  onStartTour: () => void;
}

export function WelcomeBanner({ onStartTour }: WelcomeBannerProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissed = localStorage.getItem(TOUR_STORAGE_KEYS.bannerDismissed);
      const tourDone = localStorage.getItem(TOUR_STORAGE_KEYS.completed);
      if (!dismissed && !tourDone) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEYS.bannerDismissed, "true");
    } catch {
      // Silently continue
    }
  };

  const handleStartTour = () => {
    setVisible(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEYS.bannerDismissed, "true");
    } catch {
      // Silently continue
    }
    onStartTour();
  };

  if (!mounted || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-6 p-5 rounded-xl border border-[#0891B2]/20 bg-gradient-to-r from-[#0891B2]/5 via-[var(--card)] to-[#10B981]/5"
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                Welcome to Schoolnify!
              </h2>
              <p className="text-sm text-[var(--muted)] mb-4 max-w-lg">
                Your school management platform is ready. Take a quick tour to learn your way around, or head to School Setup to configure your school.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleStartTour}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0E7490] transition-colors shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Take a Tour
                </button>
                <Link
                  href="/school-admin/setup"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Configure School
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
