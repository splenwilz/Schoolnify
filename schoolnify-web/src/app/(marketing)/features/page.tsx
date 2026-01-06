import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore Schoolnify features: student management, attendance tracking, payments, communication, offline mode, and analytics.",
};

/* ============================================
 * Feature Data
 * ============================================ */

const categories = [
  {
    name: "Academic",
    icon: "📚",
    description: "Complete tools for managing curriculum and learning",
    features: [
      { title: "Class Management", desc: "Organize classes, sections, and subjects" },
      { title: "Assignment System", desc: "Create, distribute, and grade assignments" },
      { title: "Grading & Reports", desc: "Flexible grading scales and report cards" },
      { title: "Exam Scheduling", desc: "Plan and manage examination periods" },
      { title: "Curriculum Planning", desc: "Map courses to learning objectives" },
      { title: "Library System", desc: "Track books and manage borrowing" },
    ],
  },
  {
    name: "Attendance",
    icon: "✅",
    description: "Effortless attendance tracking for all stakeholders",
    features: [
      { title: "Daily Check-in", desc: "Quick attendance marking interface" },
      { title: "Parent Notifications", desc: "Auto-alert parents of absences" },
      { title: "Leave Management", desc: "Handle leave requests digitally" },
      { title: "Attendance Reports", desc: "Detailed analytics and trends" },
      { title: "Biometric Support", desc: "Integration with hardware readers" },
      { title: "Late Tracking", desc: "Monitor tardiness patterns" },
    ],
  },
  {
    name: "Finance",
    icon: "💰",
    description: "Streamlined fee collection and financial management",
    features: [
      { title: "Fee Management", desc: "Create flexible fee structures" },
      { title: "Online Payments", desc: "Accept cards, bank transfers, mobile" },
      { title: "Invoice Generation", desc: "Auto-generate and send invoices" },
      { title: "Payment Reminders", desc: "Automated follow-ups for dues" },
      { title: "Scholarship Tracking", desc: "Manage discounts and waivers" },
      { title: "Financial Reports", desc: "Revenue tracking and forecasting" },
    ],
  },
  {
    name: "Communication",
    icon: "💬",
    description: "Keep everyone connected and informed",
    features: [
      { title: "Announcements", desc: "Broadcast to school or specific groups" },
      { title: "Direct Messaging", desc: "Teacher-parent private chats" },
      { title: "Push Notifications", desc: "Instant mobile alerts" },
      { title: "Email Integration", desc: "Automated email campaigns" },
      { title: "SMS Alerts", desc: "Critical updates via SMS" },
      { title: "Event Calendar", desc: "School events and reminders" },
    ],
  },
  {
    name: "Mobile App",
    icon: "📱",
    description: "Full access from any device, anywhere",
    features: [
      { title: "iOS & Android", desc: "Native apps for both platforms" },
      { title: "Parent Portal", desc: "Track child's progress" },
      { title: "Teacher Dashboard", desc: "Grade on the go" },
      { title: "Offline Mode", desc: "Works without internet" },
      { title: "Multi-Child Support", desc: "Parents manage all children" },
      { title: "Photo Gallery", desc: "Share school moments" },
    ],
  },
  {
    name: "Analytics",
    icon: "📊",
    description: "Data-driven insights for better decisions",
    features: [
      { title: "Performance Tracking", desc: "Student progress over time" },
      { title: "Attendance Analytics", desc: "Patterns and trends" },
      { title: "Financial Dashboard", desc: "Revenue and collection rates" },
      { title: "Custom Reports", desc: "Build reports your way" },
      { title: "Export Options", desc: "CSV, PDF, Excel formats" },
      { title: "Comparative Analysis", desc: "Class-to-class benchmarks" },
    ],
  },
];

const integrations = [
  { name: "Google Workspace", type: "Productivity" },
  { name: "Microsoft 365", type: "Productivity" },
  { name: "Zoom", type: "Video" },
  { name: "Stripe", type: "Payments" },
  { name: "PayPal", type: "Payments" },
  { name: "Twilio", type: "SMS" },
  { name: "SendGrid", type: "Email" },
  { name: "WhatsApp", type: "Messaging" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0891B2]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#A855F7]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Powerful Features
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Everything you need to run
              <br />
              <span className="text-[#0891B2]">modern schools</span>
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              From enrollment to graduation, academics to finance. One platform, endless possibilities.
            </p>
          </div>

          {/* Hero Feature Cards - Enhanced with Visuals */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Student Management */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient - uses theme-aware background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/20 via-[var(--card)] to-[var(--card)]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#0891B2]/20 blur-3xl rounded-full" />
              
              <div className="relative p-8 border border-[#0891B2]/20 rounded-3xl h-full group-hover:border-[#0891B2]/50 transition-colors">
                {/* Mini visual */}
                <div className="mb-6 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-xs text-[var(--muted)]">Grade 10-A</span>
                    <span className="ml-auto text-xs text-[#0891B2]">32 students</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Sarah Johnson", status: "Present", color: "#10B981" },
                      { name: "Michael Chen", status: "Present", color: "#10B981" },
                      { name: "Emily Brown", status: "Late", color: "#F59E0B" },
                    ].map((student) => (
                      <div key={student.name} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--background-secondary)]">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0891B2] to-[#A855F7] flex items-center justify-center text-[8px] font-bold">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-[10px] flex-1 truncate">{student.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${student.color}20`, color: student.color }}>
                          {student.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0891B2]/20 flex items-center justify-center text-2xl">
                    👨‍🎓
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#22D3EE] transition-colors">Student Management</h3>
                    <p className="text-xs text-[var(--muted)]">Complete student profiles</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
                  Enroll students, track progress, manage records. Everything in one place.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["Enrollment", "Profiles", "Transcripts"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#0891B2]/10 text-[#0891B2] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 - Attendance System */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient - uses theme-aware background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 via-[var(--card)] to-[var(--card)]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F59E0B]/20 blur-3xl rounded-full" />
              
              <div className="relative p-8 border border-[#F59E0B]/20 rounded-3xl h-full group-hover:border-[#F59E0B]/50 transition-colors">
                {/* Mini visual - Attendance chart */}
                <div className="mb-6 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                  <div className="flex items-end justify-between gap-1 h-20 mb-2">
                    {[95, 92, 88, 94, 97, 91, 96].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full rounded-t-sm bg-gradient-to-t from-[#F59E0B] to-[#FBBF24]"
                          style={{ height: `${value * 0.8}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-[var(--muted)]">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Status bar */}
                <div className="mb-4 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                    <span className="text-lg">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">Today&apos;s Attendance</div>
                    <div className="text-[10px] text-[#10B981]">94.2% Present</div>
                  </div>
                  <div className="text-xs text-[var(--muted)]">8:15 AM</div>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#F59E0B] transition-colors">Attendance Tracking</h3>
                    <p className="text-xs text-[var(--muted)]">Real-time monitoring</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["Auto-Alerts", "Reports", "Analytics"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 - Parent Portal */}
            <div className="group relative rounded-3xl overflow-hidden">
              {/* Background gradient - uses theme-aware background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/20 via-[var(--card)] to-[var(--card)]" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#A855F7]/20 blur-3xl rounded-full" />
              
              <div className="relative p-8 border border-[#A855F7]/20 rounded-3xl h-full group-hover:border-[#A855F7]/50 transition-colors">
                {/* Mini phone mockup */}
                <div className="mb-6 flex justify-center">
                  <div className="w-32 rounded-2xl bg-[var(--background)] border-4 border-[var(--border)] p-1.5 shadow-xl shadow-black/30">
                    <div className="rounded-xl bg-[var(--card)] p-2">
                      {/* Child info */}
                      <div className="text-center mb-2 p-2 rounded-lg bg-[#A855F7]/10">
                        <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center text-[10px] font-bold mb-1">
                          EJ
                        </div>
                        <div className="text-[8px] font-medium">Emma Johnson</div>
                        <div className="text-[7px] text-[var(--muted)]">Grade 8-B</div>
                      </div>
                      {/* Quick stats */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 p-1.5 rounded bg-[var(--background-secondary)]">
                          <span className="text-[8px]">📊</span>
                          <span className="text-[8px] flex-1">GPA</span>
                          <span className="text-[8px] text-[#10B981] font-bold">3.8</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1.5 rounded bg-[var(--background-secondary)]">
                          <span className="text-[8px]">✅</span>
                          <span className="text-[8px] flex-1">Attendance</span>
                          <span className="text-[8px] text-[#0891B2]">96%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification preview */}
                <div className="mb-4 p-3 rounded-xl bg-[var(--background)] border border-[#A855F7]/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
                    <span className="text-sm">📝</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">New Report Card</div>
                    <div className="text-[10px] text-[var(--muted)]">Term 2 results available</div>
                  </div>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#A855F7]/20 flex items-center justify-center text-2xl">
                    👨‍👩‍👧
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[#A855F7] transition-colors">Parent Portal</h3>
                    <p className="text-xs text-[var(--muted)]">iOS & Android</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {["Progress", "Messaging", "Payments"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#A855F7]/10 text-[#A855F7] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * All Features - Stacked Categories
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#0891B2]/5 blur-[200px] rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#A855F7]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              36+ Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Explore all features
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
              Every tool you need to run a successful school
            </p>
          </div>

          {/* Feature Categories - Stacked Cards */}
          <div className="space-y-8">
            {categories.map((category, categoryIndex) => {
              const colors = ["#0891B2", "#F59E0B", "#A855F7", "#10B981", "#EC4899", "#3B82F6"];
              const color = colors[categoryIndex % colors.length];
              
              return (
                <div
                  key={category.name}
                  className="group relative rounded-3xl overflow-hidden"
                >
                  {/* Card background with gradient */}
                  <div 
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                  />
                  <div className="absolute inset-0 bg-[var(--card)]" style={{ opacity: 0.95 }} />
                  
                  <div className="relative p-8 md:p-10 border border-[var(--border)] group-hover:border-[var(--border)] rounded-3xl transition-colors">
                    {/* Category Header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110"
                          style={{ 
                            backgroundColor: `${color}20`,
                            boxShadow: `0 8px 32px ${color}20`
                          }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 
                            className="text-2xl font-bold transition-colors"
                            style={{ color: color }}
                          >
                            {category.name}
                          </h3>
                          <p className="text-[var(--muted)]">{category.description}</p>
                        </div>
                      </div>
                      
                      {/* Feature count badge */}
                      <div 
                        className="md:ml-auto px-4 py-2 rounded-full text-sm font-medium w-fit"
                        style={{ 
                          backgroundColor: `${color}15`,
                          color: color
                        }}
                      >
                        {category.features.length} features
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.features.map((feature, featureIndex) => (
                        <div 
                          key={feature.title}
                          className="group/item p-5 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)]/50 hover:border-[var(--border)] hover:bg-[var(--background)] transition-all"
                        >
                          <div className="flex items-start gap-4">
                            {/* Number */}
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors group-hover/item:scale-110"
                              style={{ 
                                backgroundColor: `${color}15`,
                                color: color
                              }}
                            >
                              {String(featureIndex + 1).padStart(2, "0")}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[var(--foreground)] mb-1 group-hover/item:text-[#22D3EE] transition-colors">
                                {feature.title}
                              </h4>
                              <p className="text-sm text-[var(--muted)] leading-relaxed">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "36+", label: "Total Features", icon: "⚡" },
              { value: "6", label: "Categories", icon: "📦" },
              { value: "100%", label: "Customizable", icon: "🎨" },
              { value: "24/7", label: "Available", icon: "🌐" },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center"
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <div className="text-2xl font-bold text-[#0891B2] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * Integrations Section
       * ============================================ */}
      <section className="py-24 px-6 bg-[var(--card)]/50 border-y border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Seamless Integrations
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Works with tools you love
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Schoolnify integrates with popular platforms to enhance your workflow
            </p>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-center hover:border-[#0891B2]/30 transition-colors"
              >
                <div className="text-lg font-bold text-[var(--foreground)] mb-1">{item.name}</div>
                <div className="text-xs text-[var(--muted)]">{item.type}</div>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              And many more. <Link href="/docs" className="text-[#22D3EE] hover:underline">See all integrations →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
       * Before/After Comparison
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background - theme-aware gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)]" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              The Difference
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Before & After
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
              See how Schoolnify transforms your school management
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="relative">
            {/* Center Arrow/Divider - Desktop */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-20 h-20 rounded-full bg-[var(--background)] border-4 border-[var(--border)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Without Schoolnify */}
              <div className="relative group">
                {/* Red glow on hover */}
                <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-[var(--card)] border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                      <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-400">Without Schoolnify</h3>
                      <p className="text-[var(--muted)]">The old, manual way</p>
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="space-y-4">
                    {[
                      { icon: "📋", title: "Paper Registers", desc: "Hours spent on manual attendance" },
                      { icon: "📞", title: "Phone Tag with Parents", desc: "Endless calls for fee reminders" },
                      { icon: "📊", title: "Excel Spreadsheets", desc: "Error-prone report card creation" },
                      { icon: "💸", title: "Cash Handling", desc: "Lost payments and no receipts" },
                      { icon: "📁", title: "Filing Cabinets", desc: "Student records scattered everywhere" },
                      { icon: "⏰", title: "Long Queues", desc: "Parents waiting for updates" },
                    ].map((item) => (
                      <div 
                        key={item.title}
                        className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10"
                      >
                        <span className="text-xl opacity-50">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--foreground-secondary)] mb-0.5">{item.title}</h4>
                          <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom stat */}
                  <div className="mt-8 pt-6 border-t border-red-500/10 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-red-400">20+ hrs</div>
                      <div className="text-sm text-[var(--muted)]">Wasted weekly on admin</div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-medium">
                      😩 Stressful
                    </div>
                  </div>
                </div>
              </div>

              {/* With Schoolnify */}
              <div className="relative group">
                {/* Green glow on hover */}
                <div className="absolute inset-0 bg-[#10B981]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#10B981]/10 via-[var(--card)] to-[#0891B2]/5 border border-[#10B981]/30 group-hover:border-[#10B981]/50 transition-colors">
                  {/* Recommended badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-[#10B981] text-white text-sm font-semibold shadow-lg shadow-[#10B981]/30">
                      ✨ Recommended
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8 mt-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#10B981]">With Schoolnify</h3>
                      <p className="text-[var(--muted)]">The smart, automated way</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    {[
                      { icon: "📱", title: "One-Tap Attendance", desc: "Mark attendance in seconds" },
                      { icon: "🔔", title: "Auto Notifications", desc: "Parents updated instantly" },
                      { icon: "📊", title: "Auto Report Cards", desc: "Generated with one click" },
                      { icon: "💳", title: "Online Payments", desc: "Collect fees digitally" },
                      { icon: "☁️", title: "Cloud Records", desc: "Everything searchable, secure" },
                      { icon: "🌐", title: "Parent Portal", desc: "Self-service 24/7 access" },
                    ].map((item) => (
                      <div 
                        key={item.title}
                        className="flex items-start gap-4 p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/10"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--foreground)] mb-0.5">{item.title}</h4>
                          <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom stat */}
                  <div className="mt-8 pt-6 border-t border-[#10B981]/20 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-[#10B981]">15+ hrs</div>
                      <div className="text-sm text-[var(--muted)]">Saved weekly</div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-medium">
                      🎉 Effortless
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-[var(--muted)] mb-6">Ready to make the switch?</p>
            <Link
              href="/download"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-105 shadow-lg shadow-[#0891B2]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
       * Final CTA
       * ============================================ */}
      <section className="py-24 px-6 border-t border-[var(--border)]/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to experience all features?
          </h2>
          <p className="text-[var(--muted)] text-lg mb-10 max-w-xl mx-auto">
            Download Schoolnify and start your 14-day free trial. 
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/download"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Free Trial
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-[var(--background-secondary)] transition-all flex items-center justify-center gap-2"
            >
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
