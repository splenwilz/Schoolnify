"use client";

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

interface MessagingConversationItemProps {
  name: string;
  role: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  pinned?: boolean;
  isActive: boolean;
  onClick: () => void;
}

function formatRelativeTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MessagingConversationItem({
  name,
  role,
  lastMessage,
  lastMessageAt,
  unreadCount,
  pinned,
  isActive,
  onClick,
}: MessagingConversationItemProps) {
  const gradient = AVATAR_GRADIENTS[role] || "from-[#6366F1] to-[#818CF8]";
  const hasUnread = unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
        isActive
          ? "bg-[#0891B2]/5"
          : "hover:bg-[var(--background-secondary)]/50"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
      >
        {name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-[13px] truncate ${
                hasUnread
                  ? "font-semibold text-[var(--foreground)]"
                  : "font-medium text-[var(--foreground)]"
              }`}
            >
              {name}
            </span>
            <span
              className={`inline-flex items-center px-1 py-0.5 text-[9px] font-medium rounded ${
                ROLE_COLORS[role] || "bg-[var(--background-secondary)] text-[var(--muted)]"
              }`}
            >
              {role}
            </span>
          </div>
          <span className="text-[10px] text-[var(--muted)] flex-shrink-0 tabular-nums">
            {formatRelativeTime(lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <p
            className={`text-[12px] truncate flex-1 ${
              hasUnread
                ? "text-[var(--foreground)] font-medium"
                : "text-[var(--muted)]"
            }`}
          >
            {lastMessage}
          </p>
          {hasUnread && (
            <span className="w-5 h-5 rounded-full bg-[#0891B2] text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
