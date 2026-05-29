"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Calendar, GraduationCap } from "lucide-react";
import { getSchoolBySlug } from "@/lib/school-lookup";

export default function SchoolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const school = getSchoolBySlug(slug);

  if (!school) return null; // Layout handles notFound()

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          {/* School initials badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0891B2] to-[#0E7490] shadow-lg shadow-[#0891B2]/20 mb-6">
            <span className="text-white font-bold text-2xl">
              {school.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-3">
            {school.name}
          </h1>

          <div className="flex items-center justify-center gap-3 text-[var(--muted)]">
            <span className="text-sm">{school.type}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--muted)]" />
            <span className="text-sm">Est. {school.established}</span>
          </div>

          <p className="text-[var(--muted)] mt-4 max-w-lg mx-auto">
            Welcome to {school.name}. We are currently accepting applications for the {school.academicYear} academic year.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href={`/schools/${slug}/apply`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white font-semibold text-sm hover:from-[#0E7490] hover:to-[#0891B2] transition-all shadow-lg shadow-[#0891B2]/20 hover:shadow-[#0891B2]/40 hover:scale-[1.02]"
            >
              <GraduationCap className="w-4.5 h-4.5" />
              Apply for Admission
            </Link>
            <Link
              href={`/schools/${slug}/apply/track`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-medium text-sm hover:bg-[var(--background-secondary)] transition-colors"
            >
              Track Application
            </Link>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <h2 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#0891B2]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Address</p>
                  <p className="text-sm text-[var(--foreground)]">{school.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#0891B2]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Phone</p>
                  <a href={`tel:${school.phone}`} className="text-sm text-[var(--foreground)] hover:text-[#0891B2] transition-colors">
                    {school.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#0891B2]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Email</p>
                  <a href={`mailto:${school.email}`} className="text-sm text-[#0891B2] hover:underline">
                    {school.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-[#0891B2]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Website</p>
                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0891B2] hover:underline">
                    {school.website}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Academic Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <h2 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Academic Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A855F7]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#A855F7]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Academic Year</p>
                  <p className="text-sm text-[var(--foreground)]">{school.academicYear}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Current Term</p>
                  <p className="text-sm text-[var(--foreground)]">{school.currentTerm}</p>
                </div>
              </div>
            </div>

            {/* Admissions open banner */}
            <div className="mt-6 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-sm font-semibold text-[#10B981]">Admissions Open</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                We are accepting applications for Grade 7 through Grade 12 for the {school.academicYear} academic year.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact Section (anchor for navbar link) */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 text-center"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Have Questions?
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">
            Our admissions team is here to help. Reach out to us for any inquiries about the application process, curriculum, or campus life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${school.email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0891B2]/10 text-[#0891B2] text-sm font-medium hover:bg-[#0891B2]/20 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {school.email}
            </a>
            <a
              href={`tel:${school.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--background-secondary)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--border)] transition-colors"
            >
              <Phone className="w-4 h-4" />
              {school.phone}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
