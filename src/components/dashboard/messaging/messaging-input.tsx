"use client";

import { useState, useRef, useCallback } from "react";

interface MessagingInputProps {
  onSend: (content: string) => void;
}

export function MessagingInput({ onSend }: MessagingInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
    }
  };

  return (
    <div className="border-t border-[var(--border)] px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-[13px] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2] transition-colors"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0891B2] text-white flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0E7490]"
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
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
