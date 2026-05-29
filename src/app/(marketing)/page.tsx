import Link from "next/link";

/* ============================================
 * Demo Data
 * ============================================ */

const stats = [
  { value: "10K+", label: "Schools" },
  { value: "2M+", label: "Students" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Rating" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-28 pb-20 px-6">
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-pattern" />
        
        {/* Multiple glow effects */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#0891B2]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#0E7490]/15 blur-[120px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0891B2]/30 bg-[#0891B2]/10 text-sm text-[#22D3EE] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              v1.0 now available. See what&apos;s new
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              The school management software
              <br />
              <span className="text-[#0891B2]">educators trust</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Manage students, track attendance, handle payments, and communicate with parents. 
              Trusted by 10,000+ schools worldwide.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/download"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Free
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#0891B2]/30 text-[var(--foreground-secondary)] font-semibold hover:bg-[#0891B2]/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-[var(--muted)]">
              Free 14-day trial · No credit card required · Cancel anytime
            </p>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            {/* Floating elements */}
            <div className="absolute -left-4 top-1/4 p-4 rounded-xl bg-[var(--card)] border border-[#0891B2]/20 shadow-xl hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Attendance Recorded</div>
                  <div className="text-xs text-[var(--muted)]">Class 10A · 32 students</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 p-4 rounded-xl bg-[var(--card)] border border-[#0891B2]/20 shadow-xl hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0891B2]/20 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <div className="text-sm font-medium">$12,847</div>
                  <div className="text-xs text-[var(--muted)]">Fees collected today</div>
                </div>
              </div>
            </div>

            {/* Main preview */}
            <div className="aspect-video max-w-4xl mx-auto rounded-2xl border border-[#0891B2]/20 bg-[var(--card)] brand-glow overflow-hidden">
              <div className="h-full flex">
                {/* Sidebar */}
                <div className="w-56 border-r border-[#0891B2]/10 p-4 hidden md:flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <span className="font-semibold text-sm">Schoolnify</span>
                  </div>
                  <div className="space-y-1 flex-1">
                    {["Dashboard", "Students", "Classes", "Settings"].map((item, i) => (
                      <div
                        key={item}
                        className={`px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${i === 0 ? "bg-[#0891B2]/20 text-[#22D3EE]" : "text-[var(--muted)] hover:text-[var(--foreground-secondary)]"}`}
                      >
                        {["📊", "👨‍🎓", "📚", "⚙️"][i]} {item}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[#0891B2]/10">
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      System Online
                    </div>
                  </div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Student Overview</h3>
                      <p className="text-xs text-[var(--muted)]">Today&apos;s attendance · 847 students</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-medium">● Live</span>
                    </div>
                  </div>
                  {/* Dashboard view */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[#0891B2]/10 bg-[var(--background)]">
                      <div className="text-2xl font-bold text-[#0891B2]">847</div>
                      <div className="text-xs text-[var(--muted)]">Present Today</div>
                    </div>
                    <div className="p-4 rounded-xl border border-[#0891B2]/10 bg-[var(--background)]">
                      <div className="text-2xl font-bold text-[#10B981]">96.2%</div>
                      <div className="text-xs text-[var(--muted)]">Attendance Rate</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-xl border border-[#0891B2]/10 bg-[var(--background)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--muted)]">Fee Collection Progress</span>
                      <span className="text-sm text-[#0891B2]">78%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border)]">
                      <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#0891B2] to-[#22D3EE]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Features - Alternating Layout
       * ============================================ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-24">
            <p className="text-[#0891B2] font-medium tracking-widest text-sm mb-4">FEATURES</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Everything you need,<br />nothing you don&apos;t
            </h2>
            <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
              Professional tools built for real school administrators
            </p>
          </div>

          {/* Feature 1 - Student Management */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
                Student Management
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Complete student lifecycle
              </h3>
              <p className="text-[var(--muted)] text-lg mb-8 leading-relaxed">
                From enrollment to graduation, manage every aspect of student data. 
                Track academics, attendance, behavior, and parent communications in one place.
              </p>
              <ul className="space-y-4">
                {[
                  "Student enrollment & registration",
                  "Academic records & transcripts",
                  "Attendance tracking with notifications",
                  "Parent portal with real-time updates"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[#0891B2]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#0891B2]/20 blur-[100px] rounded-full" />
              <div className="relative aspect-square rounded-3xl bg-[var(--card)] border border-[#0891B2]/20 p-8 overflow-hidden">
                {/* Student UI mockup */}
                <div className="w-full h-full rounded-2xl bg-[var(--background)] border border-[var(--border)] flex flex-col">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                      <span className="text-xs text-[var(--muted)]">Student Profile</span>
                    </div>
                    <span className="text-xs text-[#0891B2]">Active</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center text-2xl font-bold text-white">
                        JD
                      </div>
                      <div>
                        <div className="font-semibold">John Doe</div>
                        <div className="text-xs text-[var(--muted)]">Grade 10 · Section A</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-[var(--background-secondary)]">
                        <div className="text-lg font-bold text-[#10B981]">A+</div>
                        <div className="text-xs text-[var(--muted)]">GPA</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--background-secondary)]">
                        <div className="text-lg font-bold text-[#0891B2]">98%</div>
                        <div className="text-xs text-[var(--muted)]">Attendance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Fee Management (reversed) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Visual - Left side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-[#F59E0B]/10 blur-[100px] rounded-full" />
              <div className="relative aspect-square rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8 overflow-hidden">
                {/* Fee preview mockup */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                  {/* Invoice preview */}
                  <div className="w-40 bg-white rounded-lg p-4 shadow-2xl transform -rotate-3">
                    <div className="text-center mb-3">
                      <div className="text-[10px] text-zinc-400 font-medium">INVOICE</div>
                      <div className="text-lg font-bold text-zinc-800">$1,250</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Tuition</span>
                        <span>$1,000</span>
                      </div>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Lab Fee</span>
                        <span>$150</span>
                      </div>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Books</span>
                        <span>$100</span>
                      </div>
                    </div>
                  </div>
                  {/* Payment animation */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                    <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-[#10B981] font-medium">Payment received!</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Content - Right side */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                Fee Management
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Seamless fee collection
              </h3>
              <p className="text-[var(--muted)] text-lg mb-8 leading-relaxed">
                Accept payments online via Stripe, PayPal, or bank transfer. 
                Send automated reminders and generate receipts instantly.
              </p>
              <ul className="space-y-4">
                {[
                  "Online payments (Stripe, PayPal)",
                  "Automated payment reminders",
                  "Instant receipt generation",
                  "Financial reports & analytics"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App - Dedicated Section */}
      <section className="pt-32 bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-[var(--background-secondary)]/50 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#A855F7]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="max-w-6xl mx-auto relative px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile App
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Your school in your pocket
            </h2>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Monitor attendance, get instant alerts, and manage your school remotely. 
              Available for iOS and Android.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative px-6 pb-32">
          {/* Feature List + Download */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "📊", title: "Real-time Dashboard", desc: "Attendance, grades, and insights at a glance" },
              { icon: "🔔", title: "Instant Alerts", desc: "Absences, fee dues, and announcements" },
              { icon: "💬", title: "Parent Messaging", desc: "Direct communication with parents" },
              { icon: "📍", title: "Multi-Campus", desc: "Manage multiple schools from one app" },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-[var(--card)]/50 border border-[var(--border)]/50">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-[var(--muted)]">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Download buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/download" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-colors">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60">Download on the</div>
                <div className="font-semibold -mt-0.5">App Store</div>
              </div>
            </Link>
            <Link href="/download" className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-colors">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60">Get it on</div>
                <div className="font-semibold -mt-0.5">Google Play</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
       * How It Works - Timeline
       * Inspired by PhotoBoothX timeline design
       * ============================================ */}
      <section className="py-32 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#0891B2] font-medium tracking-widest text-sm mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              From signup to first class<br />in under 10 minutes
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#0891B2] via-[#0891B2]/50 to-transparent" />

            {/* Steps */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:text-right md:pr-16 pl-20 md:pl-0">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-bold mb-4">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Create Your Account</h3>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Sign up in seconds with your email. No credit card required. 
                    Your school dashboard is ready instantly.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#0891B2] ring-4 ring-[#0891B2]/20" />
                <div className="md:pl-16 pl-20">
                  <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Welcome to Schoolnify!</div>
                        <div className="text-sm text-[var(--muted)]">Your dashboard is ready</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:order-2 md:pl-16 pl-20">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-bold mb-4">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Add Your Staff & Classes</h3>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Import teachers and staff via CSV or add them manually. 
                    Set up classes, sections, and subjects in minutes.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#0891B2] ring-4 ring-[#0891B2]/20" />
                <div className="md:order-1 md:pr-16 md:text-right pl-20 md:pl-0">
                  <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] md:inline-block">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-sm">12 Teachers. Added</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-sm">8 Classes. Configured</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid md:grid-cols-2 gap-8 md:gap-16">
                <div className="md:text-right md:pr-16 pl-20 md:pl-0">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0891B2] text-white text-sm font-bold mb-4">
                    Step 3
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Start Managing</h3>
                  <p className="text-[var(--muted)] leading-relaxed">
                    Enroll students, mark attendance, collect fees, and communicate with parents. 
                    Your school is now running on Schoolnify.
                  </p>
                </div>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-5 h-5 -translate-x-1/2 rounded-full bg-[#10B981] ring-4 ring-[#10B981]/20" />
                <div className="md:pl-16 pl-20">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-[#0891B2]/10 border border-[#10B981]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-[#10B981]">You&apos;re Live!</div>
                        <div className="text-sm text-[var(--muted)]">Ready to manage your school</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Social Proof / Stats
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-4xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[#0891B2]/10">
                <div className="text-3xl font-bold text-[#0891B2] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured testimonial */}
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-[#0891B2]/20 mb-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl sm:text-3xl font-medium leading-relaxed mb-8 max-w-3xl mx-auto">
              &ldquo;Schoolnify transformed our administration. We went from managing chaos to 
              running 5 campuses effortlessly. The mobile app is a game-changer.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center text-white font-bold text-lg">
                SM
              </div>
              <div className="text-left">
                <div className="font-semibold">Sarah Mitchell</div>
                <div className="text-sm text-[var(--muted)]">Principal, Greenwood Academy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Final CTA
       * ============================================ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0891B2]/20 blur-[150px] rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Ready to transform your
            <br />
            <span className="text-[#0891B2]">school management?</span>
          </h2>
          <p className="text-xl text-[var(--muted)] mb-10 max-w-2xl mx-auto">
            Join 10,000+ schools who trust Schoolnify. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/download"
              className="w-full sm:w-auto px-10 py-5 rounded-xl bg-[#0891B2] text-white font-semibold text-lg hover:bg-[#0E7490] transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download for Free
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-10 py-5 rounded-xl border-2 border-[#0891B2]/40 font-semibold text-lg hover:bg-[#0891B2]/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
