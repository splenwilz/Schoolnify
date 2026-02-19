"use client";

/**
 * Messages Page - Inbox-style UI
 * Features: Message list, filters, compose
 * @see Stripe Dashboard - Notifications/Inbox
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { messages } from "@/lib/demo-data";

// Sidebar categories
const categories = [
  { id: "inbox", label: "Inbox", icon: "inbox", count: messages.filter(m => m.category === "inbox").length },
  { id: "sent", label: "Sent", icon: "sent", count: messages.filter(m => m.category === "sent").length },
  { id: "starred", label: "Starred", icon: "star", count: messages.filter(m => m.starred).length },
];

export default function MessagesPage() {
  const [activeCategory, setActiveCategory] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Filter messages
  const filteredMessages = useMemo(() => {
    let filtered = messages;
    
    if (activeCategory === "starred") {
      filtered = messages.filter(m => m.starred);
    } else if (activeCategory !== "all") {
      filtered = messages.filter(m => m.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.subject.toLowerCase().includes(query) || 
        m.from.toLowerCase().includes(query) ||
        m.preview.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery]);

  // Unread count
  const unreadCount = messages.filter(m => !m.read && m.category === "inbox").length;

  // Get selected message details
  const selectedMessageDetails = selectedMessage 
    ? messages.find(m => m.id === selectedMessage) 
    : null;

  // Role badge colors
  const roleColors: Record<string, string> = {
    "Parent": "bg-[#0891B2]/10 text-[#0891B2]",
    "Teacher": "bg-[#10B981]/10 text-[#10B981]",
    "Staff": "bg-[#A855F7]/10 text-[#A855F7]",
    "System": "bg-[#F59E0B]/10 text-[#F59E0B]",
    "Admin": "bg-[#6366F1]/10 text-[#6366F1]",
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Announcements</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Send announcements to parents, staff, and students
          </p>
        </div>
        <Link
          href="/school-admin/messages/compose"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          New Announcement
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <nav className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedMessage(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[#0891B2]/10 text-[#0891B2]"
                      : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {cat.icon === "inbox" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                      </svg>
                    )}
                    {cat.icon === "sent" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                    )}
                    {cat.icon === "star" && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    )}
                    {cat.label}
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeCategory === cat.id
                      ? "bg-[#0891B2] text-white"
                      : "bg-[var(--background-secondary)] text-[var(--muted)]"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-3">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">Unread</span>
                  <span className="font-medium text-[var(--foreground)]">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">This week</span>
                  <span className="font-medium text-[var(--foreground)]">{messages.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message List / Detail */}
        <div className="lg:col-span-3">
          {!selectedMessage ? (
            <>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                  />
                </div>
              </div>

              {/* Message List */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden divide-y divide-[var(--border)]">
                {filteredMessages.map(message => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message.id)}
                    className={`w-full p-4 text-left hover:bg-[var(--background-secondary)] transition-colors ${
                      !message.read ? "bg-[#0891B2]/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {message.from[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${!message.read ? "text-[var(--foreground)]" : "text-[var(--foreground-secondary)]"}`}>
                              {message.from}
                            </span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded ${roleColors[message.fromRole] || "bg-[var(--background-secondary)] text-[var(--muted)]"}`}>
                              {message.fromRole}
                            </span>
                            {message.starred && (
                              <svg className="w-3.5 h-3.5 text-[#F59E0B] fill-current" viewBox="0 0 24 24">
                                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs text-[var(--muted)] flex-shrink-0">{message.time}</span>
                        </div>
                        <p className={`text-sm mb-1 ${!message.read ? "font-medium text-[var(--foreground)]" : "text-[var(--foreground-secondary)]"}`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate">{message.preview}</p>
                      </div>
                      {!message.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0891B2] flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </button>
                ))}

                {filteredMessages.length === 0 && (
                  <div className="py-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">No messages found</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {searchQuery ? "Try adjusting your search" : "Your inbox is empty"}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Message Detail View */
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Back to messages
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Message Content */}
              {selectedMessageDetails && (
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center text-white text-lg font-medium">
                      {selectedMessageDetails.from[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-medium text-[var(--foreground)]">{selectedMessageDetails.from}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${roleColors[selectedMessageDetails.fromRole] || "bg-[var(--background-secondary)] text-[var(--muted)]"}`}>
                          {selectedMessageDetails.fromRole}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{selectedMessageDetails.date} at {selectedMessageDetails.time}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">{selectedMessageDetails.subject}</h2>
                  
                  <div className="prose prose-sm max-w-none text-[var(--foreground-secondary)]">
                    <p>{selectedMessageDetails.preview}</p>
                    <p className="mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="mt-4">
                      Best regards,<br />
                      {selectedMessageDetails.from}
                    </p>
                  </div>

                  {/* Reply Box */}
                  <div className="mt-8 pt-6 border-t border-[var(--border)]">
                    <textarea
                      placeholder="Write your reply..."
                      className="w-full p-4 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2] resize-none"
                      rows={4}
                    />
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <button className="px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
                        Save Draft
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490]">
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


