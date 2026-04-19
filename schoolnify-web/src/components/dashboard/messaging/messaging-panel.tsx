"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staffConversations as initialConversations } from "@/lib/demo-data";
import { MessagingConversationList } from "./messaging-conversation-list";
import { MessagingChatView } from "./messaging-chat-view";

const CURRENT_USER_ID = "usr_001";

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessagingPanel({ isOpen, onClose }: MessagingPanelProps) {
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localConversations, setLocalConversations] = useState(
    initialConversations
  );

  const sortedConversations = useMemo(() => {
    let filtered = localConversations;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = localConversations.filter((conv) => {
        const matchesName = conv.participants.some((p) =>
          p.name.toLowerCase().includes(q)
        );
        const matchesContent = conv.messages.some((m) =>
          m.content.toLowerCase().includes(q)
        );
        return matchesName || matchesContent;
      });
    }

    return [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime()
      );
    });
  }, [localConversations, searchQuery]);

  const activeConversation = localConversations.find(
    (c) => c.id === activeConversationId
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeConversationId) return;

      const now = new Date().toISOString();
      const newMessage = {
        id: `sm_${Date.now()}`,
        senderId: CURRENT_USER_ID,
        content,
        timestamp: now,
        read: true,
      };

      setLocalConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessageAt: now,
              }
            : conv
        )
      );
    },
    [activeConversationId]
  );

  const handleBack = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const handleClose = () => {
    onClose();
    // Reset state when closing
    setTimeout(() => {
      setActiveConversationId(null);
      setSearchQuery("");
      setIsFullscreen(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: isFullscreen ? "100%" : 420 }}
            animate={{ x: 0 }}
            exit={{ x: isFullscreen ? "100%" : 420 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed inset-y-0 right-0 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-50 flex flex-col transition-[width] duration-300 ${
              isFullscreen ? "w-full" : "w-full sm:w-[420px]"
            }`}
          >
            {/* Panel header */}
            <div className="h-14 px-4 border-b border-[var(--border)] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#0891B2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
                <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
                  Messages
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {/* Fullscreen toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="hidden sm:flex w-7 h-7 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  )}
                </button>
                {/* Close */}
                <button
                  onClick={handleClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 flex">
              {isFullscreen ? (
                /* Fullscreen: split-pane. list on left, chat on right */
                <>
                  <div className="w-80 flex-shrink-0 border-r border-[var(--border)]">
                    <MessagingConversationList
                      conversations={sortedConversations}
                      activeId={activeConversationId}
                      onSelect={setActiveConversationId}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      currentUserId={CURRENT_USER_ID}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {activeConversation ? (
                      <MessagingChatView
                        conversation={activeConversation}
                        currentUserId={CURRENT_USER_ID}
                        onSendMessage={handleSendMessage}
                        onBack={handleBack}
                        hideBackButton
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 h-full">
                        <div className="w-14 h-14 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center mb-3">
                          <svg className="w-7 h-7 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                          </svg>
                        </div>
                        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">
                          Select a conversation
                        </h3>
                        <p className="text-[13px] text-[var(--muted)] max-w-[240px]">
                          Choose a conversation from the list to start messaging
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Compact: show list OR chat */
                activeConversation ? (
                  <MessagingChatView
                    conversation={activeConversation}
                    currentUserId={CURRENT_USER_ID}
                    onSendMessage={handleSendMessage}
                    onBack={handleBack}
                  />
                ) : (
                  <MessagingConversationList
                    conversations={sortedConversations}
                    activeId={activeConversationId}
                    onSelect={setActiveConversationId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    currentUserId={CURRENT_USER_ID}
                  />
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
