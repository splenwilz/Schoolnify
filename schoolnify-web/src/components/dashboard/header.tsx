"use client";

/**
 * Dashboard Header
 * Top navigation bar with search, notifications, and user menu
 */

import { useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { notifications, currentUser, schoolInfo } from "@/lib/demo-data";

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side - Breadcrumb / Page Title area */}
        <div className="flex items-center gap-4">
          {/* Spacer for mobile menu button */}
          <div className="w-10 lg:hidden" />
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] w-80">
            <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search students, staff, classes..."
              className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[var(--muted)] bg-[var(--background-secondary)] rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Academic Year Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0891B2]/10 text-[#0891B2] text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {schoolInfo.academicYear}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-[var(--card)] border border-transparent hover:border-[var(--border)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--foreground-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-[#EF4444] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl overflow-hidden">
                <div className="p-4 border-b border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                    <button className="text-xs text-[#0891B2] hover:underline">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors ${
                        !notification.read ? "bg-[#0891B2]/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
                          ${notification.type === "warning" ? "bg-[#F59E0B]" : "bg-[#0891B2]"}
                        `}>
                          {notification.type === "warning" ? "⚠" : "ℹ"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[var(--muted)] mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[var(--muted)] mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[#0891B2]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[var(--border)]">
                  <button className="w-full py-2 text-sm text-[#0891B2] font-medium hover:bg-[#0891B2]/10 rounded-lg transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[var(--card)] border border-transparent hover:border-[var(--border)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white font-semibold text-sm">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {currentUser.firstName}
                </p>
              </div>
              <svg className="hidden md:block w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl overflow-hidden">
                <div className="p-4 border-b border-[var(--border)]">
                  <p className="font-semibold text-[var(--foreground)]">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{currentUser.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    Help Center
                  </button>
                </div>
                <div className="p-2 border-t border-[var(--border)]">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


