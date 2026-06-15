/** Self-contained glow that stays on the icon/image pixels, not the page background. */

export type SelfGlowStrength = "soft" | "normal" | "strong" | "featured";

const STRENGTH_MAP: Record<SelfGlowStrength, number> = {
  soft: 0.35,
  normal: 0.52,
  strong: 0.68,
  featured: 0.82,
};

export function resolveSelfGlowStrength(
  strength: SelfGlowStrength | number | undefined,
): number {
  if (typeof strength === "number") {
    return Math.min(1, Math.max(0, strength));
  }
  return STRENGTH_MAP[strength ?? "normal"];
}

export function getBadgeSelfGlowStrength(options?: {
  hovered?: boolean;
  featured?: boolean;
}): SelfGlowStrength {
  if (options?.featured) return "featured";
  if (options?.hovered) return "strong";
  return "normal";
}

export function buildSelfGlowStyle(
  color: string,
  strength: SelfGlowStrength | number = "normal",
): Record<string, string | number> {
  const amount = resolveSelfGlowStrength(strength);
  return {
    "--bf-self-glow-color": color,
    "--bf-self-glow-strength": amount,
  };
}
