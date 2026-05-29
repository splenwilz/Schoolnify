"use client";

import { MessagingConversationItem } from "./messaging-conversation-item";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Participant {
  id: string;
  name: string;
  role: string;
}

interface Conversation {
  id: string;
  participants: Participant[];
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
  pinned?: boolean;
}

interface MessagingConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentUserId: string;
}

export function MessagingConversationList({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
  currentUserId,
}: MessagingConversationListProps) {
  const pinned = conversations.filter((c) => c.pinned);
  const unpinned = conversations.filter((c) => !c.pinned);

  function getOtherParticipant(conv: Conversation) {
    return conv.participants.find((p) => p.id !== currentUserId) || conv.participants[0];
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2] transition-colors"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
              <svg
                className="w-3 h-3 text-[var(--muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Pinned
              </span>
            </div>
            {pinned.map((conv) => {
              const other = getOtherParticipant(conv);
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <MessagingConversationItem
                  key={conv.id}
                  name={other.name}
                  role={other.role}
                  lastMessage={lastMsg?.content || ""}
                  lastMessageAt={conv.lastMessageAt}
                  unreadCount={conv.unreadCount}
                  pinned
                  isActive={activeId === conv.id}
                  onClick={() => onSelect(conv.id)}
                />
              );
            })}
          </>
        )}

        {unpinned.length > 0 && (
          <>
            {pinned.length > 0 && (
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
                <span className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Recent
                </span>
              </div>
            )}
            {unpinned.map((conv) => {
              const other = getOtherParticipant(conv);
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <MessagingConversationItem
                  key={conv.id}
                  name={other.name}
                  role={other.role}
                  lastMessage={lastMsg?.content || ""}
                  lastMessageAt={conv.lastMessageAt}
                  unreadCount={conv.unreadCount}
                  isActive={activeId === conv.id}
                  onClick={() => onSelect(conv.id)}
                />
              );
            })}
          </>
        )}

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-[13px] text-[var(--muted)]">
              No conversations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
