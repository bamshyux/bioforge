"use client";

import type { CSSProperties } from "react";
import { BadgeIcon } from "@/components/icons/badge-icons";
import { VerifiedBadgeIcon } from "@/components/badges/verified-badge-icon";
import { getRarityVisual } from "@/lib/badges/rarity-visuals";
import type { BadgeRarity } from "@/lib/types/badge";

export type MedallionBadge = {
  slug: string;
  color: string;
  rarity: BadgeRarity;
  icon_url?: string | null;
  is_featured?: boolean;
};

export function BadgeMedallion({
  badge,
  size = 22,
  hovered = false,
  monochrome = false,
  featured = false,
}: {
  badge: MedallionBadge;
  size?: number;
  hovered?: boolean;
  monochrome?: boolean;
  featured?: boolean;
}) {
  const rarity = getRarityVisual(badge.rarity);
  const isFeatured = featured || badge.is_featured;
  const active = hovered || isFeatured;
  const glowStrength = active ? (isFeatured ? 0.72 : 0.58) : 0.4;
  const scale = active ? 1.14 : 1;

  const glowRgb = monochrome ? "255, 255, 255" : rarity.glowRgb;
  const filter = [
    `drop-shadow(0 0 ${size * 0.15}px rgba(${glowRgb}, ${glowStrength * 0.9}))`,
    `drop-shadow(0 0 ${size * 0.35}px rgba(${glowRgb}, ${glowStrength * 0.45}))`,
    isFeatured && !monochrome
      ? `drop-shadow(0 0 ${size * 0.5}px rgba(${rarity.highlightRgb}, 0.35))`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const showShimmer = !monochrome && rarity.shimmer && (active || isFeatured);

  return (
    <span
      className={[
        "bf-badge-medallion",
        `bf-badge-medallion--${badge.rarity}`,
        monochrome ? "bf-badge-medallion--mono" : "",
        isFeatured ? "bf-badge-medallion--featured" : "",
        active ? "bf-badge-medallion--active" : "",
        showShimmer ? "bf-badge-medallion--shimmer" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          width: size,
          height: size,
          transform: `scale(${scale})`,
          filter,
          "--bf-badge-aura": monochrome ? "rgba(255,255,255,0.15)" : rarity.aura,
          "--bf-badge-rim": monochrome
            ? "linear-gradient(145deg, #e4e4e7 0%, #71717a 50%, #52525b 100%)"
            : rarity.rimGradient,
          "--bf-badge-accent": monochrome ? "#e4e4e7" : badge.color,
        } as CSSProperties
      }
    >
      <span className="bf-badge-medallion__aura" aria-hidden />
      <span className="bf-badge-medallion__shine" aria-hidden />
      <span className="bf-badge-medallion__glyph">
        {badge.slug === "verified" && !badge.icon_url && !monochrome ? (
          <VerifiedBadgeIcon size={size} />
        ) : (
          <BadgeIcon
            slug={badge.slug}
            iconUrl={badge.icon_url}
            size={size}
            color={monochrome ? "#e4e4e7" : badge.color}
            monochrome={monochrome}
            sharp
            premium
          />
        )}
      </span>
    </span>
  );
}
