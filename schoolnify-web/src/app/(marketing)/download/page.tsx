"use client";

import Link from "next/link";
import { useState } from "react";

/* ============================================
 * Download Data
 * ============================================ */

const currentVersion = {
  version: "1.2.0",
  releaseDate: "January 3, 2026",
  highlights: [
    {
      title: "Enhanced Offline Mode",
      description: "Complete offline functionality with improved sync conflict resolution",
      icon: "📱",
      tag: "New",
      color: "#10B981",
    },
    {
      title: "Parent Portal Redesign",
      description: "Modernized interface with better mobile experience",
      icon: "👨‍👩‍👧",
      tag: "New",
      color: "#A855F7",
    },
    {
      title: "Faster Sync",
      description: "Data synchronization is now 40% faster with background processing",
      icon: "⚡",
      tag: "Improved",
      color: "#0891B2",
    },
  ],
  changelog: [
    { 
      type: "new", 
      title: "Enhanced Offline Mode",
      description: "Complete offline functionality including attendance, grades, and messaging. Smart conflict resolution automatically handles data conflicts when reconnecting."
    },
    { 
      type: "new", 
      title: "Parent Portal Redesign",
      description: "Completely redesigned parent interface with improved mobile experience. Parents can now view grades, attendance, and communicate with teachers seamlessly."
    },
    { 
      type: "new", 
      title: "Bulk Student Import",
      description: "Import hundreds of students at once via CSV/Excel. Smart field mapping and validation ensure accurate data import with error reporting."
    },
    { 
      type: "improved", 
      title: "40% Faster Sync",
      description: "Optimized data synchronization with background processing. Changes sync faster with reduced data usage and battery consumption."
    },
    { 
      type: "improved", 
      title: "Dashboard Performance",
      description: "School dashboard now loads 3x faster with lazy loading of charts and analytics. Smoother scrolling on mobile devices."
    },
    { 
      type: "fixed", 
      title: "Attendance Calculation",
      description: "Fixed edge case where attendance percentages showed incorrect values for students who transferred mid-term."
    },
  ],
};

const platforms = [
  {
    name: "iOS App",
    icon: "apple",
    description: "For iPhone and iPad",
    requirements: "iOS 14.0 or later",
    downloadUrl: "#",
    buttonText: "App Store",
    downloads: "45k+",
    size: "68 MB",
    available: true,
    color: "#A855F7",
  },
  {
    name: "Android App",
    icon: "android",
    description: "For phones and tablets",
    requirements: "Android 8.0 or later",
    downloadUrl: "#",
    buttonText: "Play Store",
    downloads: "82k+",
    size: "52 MB",
    available: true,
    color: "#10B981",
  },
  {
    name: "Web App",
    icon: "web",
    description: "Use in any browser",
    requirements: "Chrome, Firefox, Safari, Edge",
    downloadUrl: "https://app.schoolnify.com",
    buttonText: "Open App",
    downloads: "120k+",
    size: "PWA",
    available: true,
    color: "#0891B2",
  },
  {
    name: "Desktop",
    icon: "desktop",
    description: "Windows & macOS",
    requirements: "Windows 10+ / macOS 11+",
    downloadUrl: "#",
    buttonText: "Coming Soon",
    downloads: "-",
    size: "-",
    available: false,
    color: "#6B7280",
  },
];

const previousVersions = [
  { version: "1.1.2", date: "Dec 20, 2025", notes: "Bug fixes and performance improvements", size: "65 MB" },
  { version: "1.1.1", date: "Dec 5, 2025", notes: "Fixed attendance report exports", size: "64 MB" },
  { version: "1.1.0", date: "Nov 18, 2025", notes: "Multi-language support added", size: "62 MB" },
  { version: "1.0.5", date: "Oct 30, 2025", notes: "Payment gateway integration", size: "60 MB" },
  { version: "1.0.0", date: "Sep 15, 2025", notes: "Initial public release", size: "58 MB" },
];

const installSteps = [
  {
    step: 1,
    title: "Download",
    description: "Get the app from your device's app store",
    icon: "download",
  },
  {
    step: 2,
    title: "Sign Up",
    description: "Create your school account in minutes",
    icon: "signup",
  },
  {
    step: 3,
    title: "Configure",
    description: "Set up classes, add staff, and invite parents",
    icon: "configure",
  },
  {
    step: 4,
    title: "Go Live",
    description: "Start managing your school efficiently",
    icon: "rocket",
  },
];

const appFeatures = [
  {
    icon: "📴",
    title: "Works Offline",
    description: "Full functionality without internet. Changes sync automatically when connected.",
    color: "#10B981",
  },
  {
    icon: "⚡",
    title: "Fast & Lightweight",
    description: "Optimized for low-bandwidth areas. Uses minimal data and battery.",
    color: "#F59E0B",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "End-to-end encryption, biometric login, and GDPR compliance.",
    color: "#EF4444",
  },
  {
    icon: "🔄",
    title: "Real-time Sync",
    description: "Changes appear instantly across all devices. Never lose your work.",
    color: "#0891B2",
  },
];

export default function DownloadPage() {
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [openChange, setOpenChange] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ============================================
       * Hero Section
       * ============================================ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0891B2]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#10B981]/10 blur-[150px] rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Version {currentVersion.version}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Take Schoolnify <span className="text-[#0891B2]">everywhere</span>
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
              Download our apps for iOS, Android, or use the web app. Works offline, syncs when connected.
            </p>

            {/* Platform Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {platforms.filter(p => p.available).map((platform) => (
                <a
                  key={platform.name}
                  href={platform.downloadUrl}
                  className="group flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#0891B2]/50 transition-all hover:scale-105"
                  style={{ borderColor: platform.available ? undefined : `${platform.color}30` }}
                >
                  {platform.icon === "apple" && (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )}
                  {platform.icon === "android" && (
                    <svg className="w-7 h-7 text-[#10B981]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.538 0-.974-.436-.974-.974V9.35c0-.537.436-.973.974-.973s.973.436.973.973v5.017c0 .538-.435.974-.973.974zM6.477 15.341c-.538 0-.974-.436-.974-.974V9.35c0-.537.436-.973.974-.973s.973.436.973.973v5.017c0 .538-.435.974-.973.974zM16.4 5.182l.9-1.63c.05-.089.019-.201-.069-.25-.089-.05-.201-.019-.251.069l-.912 1.654A6.077 6.077 0 0012 4.125c-1.438 0-2.779.388-3.938.977L7.15 3.37c-.05-.088-.162-.119-.251-.069-.088.05-.119.161-.069.25l.9 1.63c-2.078 1.14-3.48 3.323-3.48 5.835h15.5c0-2.512-1.402-4.695-3.48-5.835zM9.25 8.392c-.387 0-.7-.313-.7-.7s.313-.7.7-.7.7.313.7.7-.313.7-.7.7zm5.5 0c-.387 0-.7-.313-.7-.7s.313-.7.7-.7.7.313.7.7-.313.7-.7.7zM4.25 16.5v-5.25c0-.69.56-1.25 1.25-1.25H18.5c.69 0 1.25.56 1.25 1.25v5.25c0 .69-.56 1.25-1.25 1.25H5.5c-.69 0-1.25-.56-1.25-1.25zm4.5 4.75h6.5v-1.5h-6.5z"/>
                    </svg>
                  )}
                  {platform.icon === "web" && (
                    <svg className="w-7 h-7 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-sm">{platform.name}</div>
                    <div className="text-xs text-[var(--muted)]">{platform.downloads} downloads</div>
                  </div>
                </a>
              ))}
            </div>

            <p className="text-sm text-[var(--muted)]">
              Free 14-day trial · No credit card required
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "⬇️", value: "250k+", label: "Downloads" },
              { icon: "⭐", value: "4.8", label: "App Rating" },
              { icon: "🌍", value: "80+", label: "Countries" },
              { icon: "🏫", value: "10k+", label: "Schools" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-[var(--card)]/50 border border-[var(--border)]/50">
                <span className="text-2xl block mb-1">{stat.icon}</span>
                <div className="text-xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * Platform Downloads
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-secondary)]/30 to-[var(--background)]" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              All Platforms
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Platform</h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Schoolnify runs on all major platforms. Download the app that works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className={`group relative rounded-3xl overflow-hidden transition-all ${
                  platform.available ? "hover:scale-105" : "opacity-60"
                }`}
              >
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${platform.color}30, transparent 60%)` }}
                />

                <div 
                  className="relative h-full p-6 border rounded-3xl"
                  style={{ borderColor: `${platform.color}30` }}
                >
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    {platform.icon === "apple" && (
                      <svg className="w-8 h-8" style={{ color: platform.color }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    )}
                    {platform.icon === "android" && (
                      <svg className="w-8 h-8" style={{ color: platform.color }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                      </svg>
                    )}
                    {platform.icon === "web" && (
                      <svg className="w-8 h-8" style={{ color: platform.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    )}
                    {platform.icon === "desktop" && (
                      <svg className="w-8 h-8" style={{ color: platform.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                      </svg>
                    )}
                  </div>

                  {/* Platform info */}
                  <h3 className="text-xl font-bold mb-1" style={{ color: platform.available ? 'inherit' : platform.color }}>{platform.name}</h3>
                  <p className="text-sm text-[var(--muted)] mb-1">{platform.description}</p>
                  <p className="text-xs text-[var(--muted)] mb-4">{platform.requirements}</p>

                  {/* Stats */}
                  {platform.available && (
                    <div className="flex items-center gap-4 mb-6 text-xs text-[var(--muted)]">
                      <span>{platform.downloads}</span>
                      <span>·</span>
                      <span>{platform.size}</span>
                    </div>
                  )}

                  {/* Download button */}
                  <a
                    href={platform.available ? platform.downloadUrl : "#"}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors ${
                      platform.available 
                        ? "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90" 
                        : "bg-[var(--background-secondary)] text-[var(--muted)] cursor-not-allowed"
                    }`}
                  >
                    {platform.available && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    {platform.buttonText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * App Features
       * ============================================ */}
      <section className="py-24 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why use our apps?</h2>
            <p className="text-[var(--muted)]">Built from the ground up for educators</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: feature.color }}>{feature.title}</h3>
                <p className="text-sm text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
       * What's New Section
       * ============================================ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#10B981]/5 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#0891B2]/5 blur-[150px] rounded-full -translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981]/20 via-[#0891B2]/10 to-transparent border border-[#10B981]/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
              </span>
              <span className="text-[#10B981] font-semibold">New Release</span>
              <span className="h-4 w-px bg-zinc-700" />
              <span className="text-[var(--foreground)] font-mono font-bold">v{currentVersion.version}</span>
              <span className="h-4 w-px bg-zinc-700" />
              <span className="text-[var(--muted)] text-sm">{currentVersion.releaseDate}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What&apos;s New
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Explore all the new features, improvements, and fixes
            </p>
          </div>

          {/* Changelog Accordion */}
          <div className="grid md:grid-cols-2 gap-4">
            {currentVersion.changelog.map((item, index) => (
              <div 
                key={item.title}
                className={`group rounded-2xl border overflow-hidden transition-all ${
                  openChange === index 
                    ? item.type === "new" 
                      ? "bg-[#10B981]/5 border-[#10B981]/30" 
                      : item.type === "improved"
                        ? "bg-[#0891B2]/5 border-[#0891B2]/30"
                        : "bg-[#F59E0B]/5 border-[#F59E0B]/30"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenChange(openChange === index ? null : index)}
                  className="w-full flex items-start gap-4 p-6 text-left"
                >
                  {/* Type badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors ${
                    openChange === index 
                      ? item.type === "new"
                        ? "bg-[#10B981] text-white" 
                        : item.type === "improved"
                          ? "bg-[#0891B2] text-white"
                          : "bg-[#F59E0B] text-white"
                      : item.type === "new"
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : item.type === "improved"
                          ? "bg-[#0891B2]/20 text-[#0891B2]"
                          : "bg-[#F59E0B]/20 text-[#F59E0B]"
                  }`}>
                    {item.type === "new" ? "✨" : item.type === "improved" ? "⚡" : "✓"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs uppercase tracking-wider font-bold ${
                        item.type === "new" 
                          ? "text-[#10B981]" 
                          : item.type === "improved" 
                            ? "text-[#0891B2]"
                            : "text-[#F59E0B]"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <span className="font-semibold block">
                      {item.title}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    openChange === index 
                      ? item.type === "new"
                        ? "bg-[#10B981]/20 rotate-180"
                        : item.type === "improved"
                          ? "bg-[#0891B2]/20 rotate-180"
                          : "bg-[#F59E0B]/20 rotate-180"
                      : "bg-[var(--background-secondary)] group-hover:bg-[var(--border)]"
                  }`}>
                    <svg 
                      className="w-4 h-4 text-[var(--muted)]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openChange === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6 pl-20 text-[var(--muted)] leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View Full Changelog */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-sm font-bold text-[#10B981]">
                  {currentVersion.changelog.filter(c => c.type === "new").length}
                </span>
                <span className="w-8 h-8 rounded-lg bg-[#0891B2]/20 flex items-center justify-center text-sm font-bold text-[#0891B2]">
                  {currentVersion.changelog.filter(c => c.type === "improved").length}
                </span>
                <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-sm font-bold text-[#F59E0B]">
                  {currentVersion.changelog.filter(c => c.type === "fixed").length}
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-700" />
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Want to see all versions?</p>
                <p className="text-sm text-[var(--muted)]">Browse the complete changelog</p>
              </div>
              <Link 
                href="/docs/changelog" 
                className="ml-4 px-5 py-2.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Installation Steps
       * ============================================ */}
      <section className="py-24 px-6 bg-[var(--card)]/30 border-y border-[var(--border)]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Up and running in minutes</h2>
            <p className="text-[var(--muted)]">Simple installation process</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

            <div className="grid md:grid-cols-4 gap-8">
              {installSteps.map((step) => (
                <div key={step.step} className="relative text-center">
                  {/* Step circle */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-24 h-24 rounded-full bg-[#0891B2]/10 border-2 border-[#0891B2]/30 flex items-center justify-center">
                      {step.icon === "download" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      {step.icon === "signup" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                      )}
                      {step.icon === "configure" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {step.icon === "rocket" && (
                        <svg className="w-10 h-10 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0891B2] text-white text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Previous Versions
       * ============================================ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Version History
            </div>
            <h2 className="text-3xl font-bold mb-4">Previous Versions</h2>
            <p className="text-[var(--muted)]">
              Need an older version? Download previous releases below.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-end mb-6">
              <button
                type="button"
                onClick={() => setShowAllVersions(!showAllVersions)}
                className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors"
              >
                {showAllVersions ? "Show less" : "View all versions"}
              </button>
            </div>
            <div className="space-y-3">
              {previousVersions.slice(0, showAllVersions ? undefined : 3).map((version) => (
                <div
                  key={version.version}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#0891B2]/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-lg">v{version.version}</span>
                        <span className="px-2 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--muted)] text-xs">{version.date}</span>
                        <span className="text-xs text-[var(--muted)]">{version.size}</span>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{version.notes}</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#F59E0B] font-semibold mb-1">Security Recommendation</p>
                  <p className="text-sm text-[var(--muted)]">
                    We strongly recommend always using the latest version for security updates, bug fixes, and new features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
       * Help CTA
       * ============================================ */}
      <section className="py-16 px-6 bg-[var(--card)]/30 border-t border-[var(--border)]/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need help getting started?</h2>
          <p className="text-[var(--muted)] mb-8">
            Check out our comprehensive setup guide or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs/getting-started"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read Setup Guide
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] font-medium hover:bg-white/5 hover:text-[var(--foreground)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
