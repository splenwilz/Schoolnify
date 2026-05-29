"use client";

/**
 * Help & Support Page
 * Features: FAQ, Documentation, Contact Support, Video tutorials
 * @see Stripe Dashboard - Support/Help page
 */

import { useState } from "react";
import Link from "next/link";

// FAQ categories
const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
    questions: [
      { q: "How do I add a new student?", a: "Navigate to Students > Add Student. Fill in the required information including name, grade, parent details, and enrollment date." },
      { q: "How do I mark attendance?", a: "Go to Attendance > Mark Attendance. Select the class and date, then mark each student as present, absent, or late." },
      { q: "How do I generate reports?", a: "Visit Reports and select the report type you need. Choose the date range and click Generate." },
    ],
  },
  {
    id: "students",
    title: "Student Management",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
    questions: [
      { q: "How do I transfer a student between classes?", a: "Open the student's profile, click Edit, and change their assigned class from the dropdown menu." },
      { q: "How do I record a student's absence?", a: "Go to Attendance, find the student, and mark them as absent. You can also add a reason for the absence." },
      { q: "Can I bulk import students?", a: "Yes! Go to Students > Import and upload a CSV file with student data following our template." },
    ],
  },
  {
    id: "finances",
    title: "Finances & Billing",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    questions: [
      { q: "How do I record a fee payment?", a: "Go to Finances > Record Payment. Select the student, enter the amount, and choose the payment method." },
      { q: "How do I send fee reminders?", a: "Navigate to Finances > Send Reminders. Select students with pending fees and click Send." },
      { q: "Can I generate invoices?", a: "Yes, go to Finances > Generate Invoices. Select the fee type and students, then generate and download." },
    ],
  },
  {
    id: "technical",
    title: "Technical Issues",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    questions: [
      { q: "The app is loading slowly. What can I do?", a: "Clear your browser cache, check your internet connection, or try using a different browser." },
      { q: "I forgot my password. How do I reset it?", a: "Click 'Forgot Password' on the login page and enter your email to receive a reset link." },
      { q: "Data is not syncing. What should I do?", a: "Check your internet connection. If the issue persists, log out and log back in to force a sync." },
    ],
  },
];

// Video tutorials
const videoTutorials = [
  { id: 1, title: "Getting Started with Schoolnify", duration: "5:32", thumbnail: "🎬" },
  { id: 2, title: "Managing Students & Classes", duration: "8:15", thumbnail: "👨‍🎓" },
  { id: 3, title: "Attendance Tracking Guide", duration: "4:48", thumbnail: "✅" },
  { id: 4, title: "Financial Reports & Invoicing", duration: "6:22", thumbnail: "💰" },
];

export default function HelpSupportPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("getting-started");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Help & Support</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search for help articles..."
            className="w-full pl-12 pr-4 py-3 text-sm bg-[var(--card)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <a href="mailto:support@schoolnify.com" className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[#0891B2] transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-[#0891B2]/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)] group-hover:text-[#0891B2]">Email Support</h3>
          <p className="text-sm text-[var(--muted)] mt-1">Get help via email within 24 hours</p>
        </a>
        <Link href="/docs" className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[#10B981] transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)] group-hover:text-[#10B981]">Documentation</h3>
          <p className="text-sm text-[var(--muted)] mt-1">Browse our comprehensive guides</p>
        </Link>
        <button className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[#F59E0B] transition-colors group text-left">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)] group-hover:text-[#F59E0B]">Live Chat</h3>
          <p className="text-sm text-[var(--muted)] mt-1">Chat with us in real-time</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqCategories.map(category => (
              <div key={category.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0891B2]/10 text-[#0891B2] flex items-center justify-center">
                    {category.icon}
                  </div>
                  <span className="flex-1 font-medium text-[var(--foreground)]">{category.title}</span>
                  <svg 
                    className={`w-5 h-5 text-[var(--muted)] transition-transform ${expandedCategory === category.id ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {expandedCategory === category.id && (
                  <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
                    {category.questions.map((item, idx) => (
                      <div key={idx}>
                        <button
                          onClick={() => setExpandedQuestion(expandedQuestion === `${category.id}-${idx}` ? null : `${category.id}-${idx}`)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--background-secondary)] transition-colors"
                        >
                          <span className="flex-1 text-sm text-[var(--foreground-secondary)]">{item.q}</span>
                          <svg 
                            className={`w-4 h-4 text-[var(--muted)] transition-transform ${expandedQuestion === `${category.id}-${idx}` ? "rotate-180" : ""}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        {expandedQuestion === `${category.id}-${idx}` && (
                          <div className="px-4 pb-4">
                            <p className="text-sm text-[var(--muted)] bg-[var(--background-secondary)] rounded-lg p-3">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorials & Resources */}
        <div className="space-y-6">
          {/* Video Tutorials */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Video Tutorials</h3>
            <div className="space-y-3">
              {videoTutorials.map(video => (
                <button key={video.id} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors text-left">
                  <div className="w-12 h-10 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center text-lg">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{video.title}</p>
                    <p className="text-xs text-[var(--muted)]">{video.duration}</p>
                  </div>
                  <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">System Status</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#10B981]/10">
              <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-sm font-medium text-[#10B981]">All Systems Operational</span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-3">Last updated: Jan 6, 2026 at 10:30 AM</p>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">support@schoolnify.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-sm text-[var(--foreground)]">Mon-Fri, 9AM-6PM EST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


