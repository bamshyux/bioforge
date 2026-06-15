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
  const monochrome = options?.monochrome ?? false;

  if (monochrome) {
    const strength = featured ? 0.55 : hovered ? 0.48 : 0.38;
    const outer = strength * 0.55;
    const innerBlur = Math.max(3, size * 0.2);
    const outerBlur = Math.max(8, size * 0.42);
    const farBlur = Math.max(14, size * 0.62);
    return [
      `drop-shadow(0 0 ${innerBlur}px rgba(255,255,255,${strength}))`,
      `drop-shadow(0 0 ${outerBlur}px rgba(255,255,255,${outer}))`,
      `drop-shadow(0 0 ${farBlur}px rgba(255,255,255,${outer * 0.65}))`,
    ].join(" ");
  }

  const rgb = rgbString(color);
  const base = featured ? 0.72 : hovered ? 0.62 : 0.52;
  const outer = featured ? 0.42 : hovered ? 0.34 : 0.28;
  const innerBlur = Math.max(3, size * 0.22);
  const outerBlur = Math.max(8, size * 0.48);
  const farBlur = Math.max(16, size * 0.72);

  return [
    `drop-shadow(0 0 ${innerBlur}px rgba(${rgb}, ${base}))`,
    `drop-shadow(0 0 ${outerBlur}px rgba(${rgb}, ${outer}))`,
    `drop-shadow(0 0 ${farBlur}px rgba(${rgb}, ${outer * 0.6}))`,
  ].join(" ");
}

export const COMPACT_BADGE_ICON_SIZE = 22;
