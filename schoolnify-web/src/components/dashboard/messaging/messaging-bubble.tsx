"use client";

import { motion } from "framer-motion";

interface MessagingBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  senderName?: string;
  index: number;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const AVATAR_GRADIENTS: Record<string, string> = {
  Teacher: "from-[#10B981] to-[#34D399]",
  Staff: "from-[#A855F7] to-[#C084FC]",
  Admin: "from-[#6366F1] to-[#818CF8]",
};

export function MessagingBubble({
  content,
  timestamp,
  isSent,
  senderName,
  index,
}: MessagingBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className={`flex gap-2 ${isSent ? "justify-end" : "justify-start"}`}
    >
      {!isSent && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A855F7] to-[#C084FC] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-1">
          {senderName?.[0] || "?"}
        </div>
      )}
      <div className={`max-w-[75%] ${isSent ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
            isSent
              ? "bg-[#0891B2] text-white rounded-2xl rounded-br-sm"
              : "bg-[var(--background-secondary)] text-[var(--foreground)] rounded-2xl rounded-bl-sm"
          }`}
        >
          {content}
        </div>
        <p
          className={`text-[10px] text-[var(--muted)] mt-1 px-1 ${
            isSent ? "text-right" : "text-left"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </motion.div>
  );
}
