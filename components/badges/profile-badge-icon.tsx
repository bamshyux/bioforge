"use client";

import { BadgeGlyph } from "@/components/badges/badge-glyphs";
import { VerifiedBadgeIcon } from "@/components/badges/verified-badge-icon";
import { buildBadgeGlowFilter } from "@/lib/badges/badge-visuals";

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

  const filter = buildBadgeGlowFilter(glowColor, size, {
    enabled: glowEnabled,
    hovered,
    featured,
    monochrome,
  });

  const filterStyle = filter === "none" ? undefined : filter;

  if (isVerified) {
    return (
      <span
        className={`bf-profile-badge-icon inline-flex ${className}`.trim()}
        style={{ filter: filterStyle, lineHeight: 0 }}
      >
        <VerifiedBadgeIcon size={size} />
      </span>
    );
  }

  if (iconUrl && !monochrome) {
    return (
      <img
        src={iconUrl}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className={`bf-profile-badge-icon block object-contain ${className}`.trim()}
        style={{ filter: filterStyle }}
        aria-hidden
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`bf-profile-badge-icon block ${className}`.trim()}
      style={{ filter: filterStyle }}
      aria-hidden
    >
      <BadgeGlyph slug={slug} color={fillColor} />
    </svg>
  );
}
