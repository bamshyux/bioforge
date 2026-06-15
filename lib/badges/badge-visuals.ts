/** Color + glow helpers for profile badge icons */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return { r: 59, g: 130, b: 246 };
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return { r: 59, g: 130, b: 246 };
  return { r, g, b };
}

export function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

function clamp(n: number) {
  return Math.min(255, Math.max(0, Math.round(n)));
}

export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `#${[r + amount, g + amount, b + amount].map((c) => clamp(c).toString(16).padStart(2, "0")).join("")}`;
}

export function darken(hex: string, amount: number): string {
  return lighten(hex, -amount);
}

export function buildBadgeGlowFilter(
  color: string,
  size: number,
  options?: { enabled?: boolean; hovered?: boolean; featured?: boolean; monochrome?: boolean },
): string {
  if (options?.enabled === false) return "none";

  const hovered = options?.hovered ?? false;
  const featured = options?.featured ?? false;
  const rgb = options?.monochrome ? "228, 228, 231" : rgbString(color);
  const base = featured ? 0.24 : hovered ? 0.19 : 0.13;
  const outer = featured ? 0.11 : hovered ? 0.08 : 0.05;

  return [
    `drop-shadow(0 0 ${Math.max(1, size * 0.08)}px rgba(${rgb}, ${base}))`,
    `drop-shadow(0 0 ${Math.max(3, size * 0.16)}px rgba(${rgb}, ${outer}))`,
  ].join(" ");
}

export const COMPACT_BADGE_ICON_SIZE = 22;
