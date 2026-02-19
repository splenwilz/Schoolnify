"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const gradients = [
  "from-[#0891B2] to-[#10B981]",
  "from-[#8B5CF6] to-[#EC4899]",
  "from-[#F59E0B] to-[#EF4444]",
  "from-[#10B981] to-[#3B82F6]",
  "from-[#EC4899] to-[#8B5CF6]",
  "from-[#3B82F6] to-[#0891B2]",
  "from-[#EF4444] to-[#F59E0B]",
  "from-[#06B6D4] to-[#A855F7]",
];

function getGradientIndex(firstName: string, lastName: string): number {
  const str = `${firstName}${lastName}`;
  return str.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % gradients.length;
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
  const gradient = gradients[getGradientIndex(firstName, lastName)];
  const initials = `${firstName[0]}${lastName[0]}`;
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
        "bg-gradient-to-br flex items-center justify-center text-white font-semibold flex-shrink-0",
        !hasRoundedOverride && "rounded-full",
        gradient,
        sizeMap[size],
        ring && "ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--brand)]",
        className
      )}
    >
      {initials}
    </div>
  );
}
