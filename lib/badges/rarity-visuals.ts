import type { BadgeRarity } from "@/lib/types/badge";

export type RarityVisual = {
  label: string;
  /** Primary glow RGB */
  glowRgb: string;
  /** Secondary highlight for gradients */
  highlightRgb: string;
  /** CSS gradient for medallion rim */
  rimGradient: string;
  /** Ambient aura color (rgba base) */
  aura: string;
  /** Tooltip accent */
  accent: string;
  shimmer: boolean;
};

export const RARITY_VISUALS: Record<BadgeRarity, RarityVisual> = {
  common: {
    label: "Common",
    glowRgb: "148, 163, 184",
    highlightRgb: "203, 213, 225",
    rimGradient: "linear-gradient(145deg, #94a3b8 0%, #64748b 45%, #475569 100%)",
    aura: "rgba(148, 163, 184, 0.22)",
    accent: "#94a3b8",
    shimmer: false,
  },
  rare: {
    label: "Rare",
    glowRgb: "56, 189, 248",
    highlightRgb: "125, 211, 252",
    rimGradient: "linear-gradient(145deg, #7dd3fc 0%, #0ea5e9 42%, #0369a1 100%)",
    aura: "rgba(56, 189, 248, 0.32)",
    accent: "#38bdf8",
    shimmer: false,
  },
  epic: {
    label: "Epic",
    glowRgb: "192, 132, 252",
    highlightRgb: "216, 180, 254",
    rimGradient: "linear-gradient(145deg, #d8b4fe 0%, #a855f7 40%, #6b21a8 100%)",
    aura: "rgba(168, 85, 247, 0.38)",
    accent: "#c084fc",
    shimmer: true,
  },
  legendary: {
    label: "Legendary",
    glowRgb: "251, 191, 36",
    highlightRgb: "253, 224, 71",
    rimGradient: "linear-gradient(145deg, #fde047 0%, #f59e0b 38%, #b45309 100%)",
    aura: "rgba(245, 158, 11, 0.42)",
    accent: "#fbbf24",
    shimmer: true,
  },
  mythic: {
    label: "Mythic",
    glowRgb: "244, 244, 245",
    highlightRgb: "250, 250, 250",
    rimGradient: "linear-gradient(145deg, #ffffff 0%, #e4e4e7 25%, #a855f7 55%, #06b6d4 100%)",
    aura: "rgba(255, 255, 255, 0.35)",
    accent: "#fafafa",
    shimmer: true,
  },
};

export function getRarityVisual(rarity: BadgeRarity): RarityVisual {
  return RARITY_VISUALS[rarity] ?? RARITY_VISUALS.common;
}
