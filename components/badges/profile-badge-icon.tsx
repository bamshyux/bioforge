"use client";

import type { ReactNode } from "react";
import { BadgeGlyph } from "@/components/badges/badge-glyphs";
import { VerifiedBadgeIcon } from "@/components/badges/verified-badge-icon";
import { SelfGlow } from "@/components/ui/self-glow";
import { getBadgeSelfGlowStrength } from "@/lib/self-glow";

const VERIFIED_COLOR = "#3b82f6";

export function ProfileBadgeIcon({
  slug,
  color,
  size = 22,
  iconUrl,
  monochrome = false,
  glowEnabled = true,
  hovered = false,
  featured = false,
  className = "",
}: {
  slug: string;
  color: string;
  size?: number;
  iconUrl?: string | null;
  monochrome?: boolean;
  glowEnabled?: boolean;
  hovered?: boolean;
  featured?: boolean;
  className?: string;
}) {
  const isVerified = slug === "verified" && !iconUrl && !monochrome;
  const fillColor = monochrome ? "#e4e4e7" : color;
  const glowColor = isVerified ? VERIFIED_COLOR : fillColor;
  const glowStrength = getBadgeSelfGlowStrength({ hovered, featured });

  let icon: ReactNode;

  if (isVerified) {
    icon = <VerifiedBadgeIcon size={size} />;
  } else if (iconUrl && !monochrome) {
    icon = (
      <img
        src={iconUrl}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className={`bf-profile-badge-icon block object-contain ${className}`.trim()}
        aria-hidden
      />
    );
  } else {
    icon = (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`bf-profile-badge-icon block ${className}`.trim()}
        aria-hidden
      >
        <BadgeGlyph slug={slug} color={fillColor} />
      </svg>
    );
  }

  return (
    <SelfGlow
      enabled={glowEnabled}
      color={glowColor}
      size={size}
      strength={glowStrength}
      rounded="full"
      className={className}
    >
      {icon}
    </SelfGlow>
  );
}
