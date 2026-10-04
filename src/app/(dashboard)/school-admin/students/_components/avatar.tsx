"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

// Calm, professional monogram tints (no candy gradients). Each is a translucent
// wash over a single hue with solid text — flat and muted, the same theme-safe
// pattern the dashboard's status pills use. A deterministic hash keeps people
// visually distinct without looking playful.
const tints = [
  "var(--brand)",
  "var(--success)",
  "var(--warning)",
  "var(--purple)",
  "var(--error)",
  "var(--foreground-secondary)",
];

function tintStyle(hue: string) {
  return {
    backgroundColor: `color-mix(in srgb, ${hue} 12%, transparent)`,
    color: hue,
  };
}

function getTintIndex(firstName: string, lastName: string): number {
  // Normalize whitespace before hashing so " John " and "John" land on the
  // same tint as their initials would.
  const f = (firstName ?? "").trim().replace(/\s+/g, " ");
  const l = (lastName ?? "").trim().replace(/\s+/g, " ");
  const str = `${f}${l}` || "?";
  return str.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % tints.length;
}

/** Build avatar initials safely. Falls back to "?" so we never render the literal string "undefined". */
function getInitials(firstName: string, lastName: string): string {
  const f = firstName?.trim()?.[0];
  const l = lastName?.trim()?.[0];
  return ((f ?? "") + (l ?? "") || "?").toUpperCase();
}

const sizeMap = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
};

const imgSizeMap = {
  sm: 28,
  md: 40,
  lg: 64,
};

interface AvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  ring?: boolean;
}

export function Avatar({ firstName, lastName, avatar, size = "sm", className, ring }: AvatarProps) {
  const tintHue = tints[getTintIndex(firstName, lastName)];
  const initials = getInitials(firstName, lastName);
  const hasRoundedOverride = className?.includes("rounded-");

  if (avatar) {
    return (
      <div
        className={cn(
          "relative overflow-hidden flex-shrink-0",
          !hasRoundedOverride && "rounded-full",
          sizeMap[size],
          ring && "ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--brand)]",
          className
        )}
      >
        <Image
          src={avatar}
          alt={`${firstName} ${lastName}`}
          width={imgSizeMap[size]}
          height={imgSizeMap[size]}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center font-semibold flex-shrink-0",
        !hasRoundedOverride && "rounded-full",
        sizeMap[size],
        ring && "ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--brand)]",
        className
      )}
      style={tintStyle(tintHue)}
    >
      {initials}
    </div>
  );
}
