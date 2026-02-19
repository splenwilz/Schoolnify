"use client";

import { useRef, useEffect } from "react";
import { MessagingBubble } from "./messaging-bubble";
import { MessagingInput } from "./messaging-input";

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

const ROLE_COLORS: Record<string, string> = {
  Teacher: "bg-[#10B981]/10 text-[#10B981]",
  Staff: "bg-[#A855F7]/10 text-[#A855F7]",
  Admin: "bg-[#6366F1]/10 text-[#6366F1]",
};

const AVATAR_GRADIENTS: Record<string, string> = {
  Teacher: "from-[#10B981] to-[#34D399]",
  Staff: "from-[#A855F7] to-[#C084FC]",
  Admin: "from-[#6366F1] to-[#818CF8]",
};

interface MessagingChatViewProps {
  conversation: Conversation;
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  hideBackButton?: boolean;
}

function getDateLabel(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function MessagingChatView({
  conversation,
  currentUserId,
  onSendMessage,
  onBack,
  hideBackButton,
}: MessagingChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const other = conversation.participants.find((p) => p.id !== currentUserId);
  const otherName = other?.name || "Unknown";
  const otherRole = other?.role || "Staff";
  const gradient = AVATAR_GRADIENTS[otherRole] || "from-[#6366F1] to-[#818CF8]";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  // Group messages by date
  const messagesByDate: { label: string; messages: Message[] }[] = [];
  let currentLabel = "";

  for (const msg of conversation.messages) {
    const label = getDateLabel(msg.timestamp);
    if (label !== currentLabel) {
      currentLabel = label;
      messagesByDate.push({ label, messages: [msg] });
    } else {
      messagesByDate[messagesByDate.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="h-14 px-4 border-b border-[var(--border)] flex items-center gap-3 flex-shrink-0">
        {!hideBackButton && (
          <button
            onClick={onBack}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        )}
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-semibold`}
        >
          {otherName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-[var(--foreground)] truncate">
              {otherName}
            </span>
            <span
              className={`inline-flex items-center px-1 py-0.5 text-[9px] font-medium rounded ${
                ROLE_COLORS[otherRole] || "bg-[var(--background-secondary)] text-[var(--muted)]"
              }`}
            >
              {otherRole}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-2.5">
          {messagesByDate.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[9px] font-medium text-[var(--muted)] uppercase tracking-wider">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <div className="flex flex-col gap-2.5">
                {group.messages.map((msg, i) => {
                  const isSent = msg.senderId === currentUserId;
                  const sender = conversation.participants.find(
                    (p) => p.id === msg.senderId
                  );
                  return (
                    <MessagingBubble
                      key={msg.id}
                      content={msg.content}
                      timestamp={msg.timestamp}
                      isSent={isSent}
                      senderName={sender?.name}
                      index={i}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessagingInput onSend={onSendMessage} />
    </div>
  );
}
