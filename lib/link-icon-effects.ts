import { getPlatformBrandColor } from "@/lib/platform-colors";
import { isCustomLinkIcon, normalizeLinkIconKey } from "@/lib/links";
import { rgbString } from "@/lib/badges/badge-visuals";
import type { LinkAnimation, ProfileSettings } from "@/lib/types/settings";

export type LinkIconEffectProps = {
  glow: boolean;
  shadow: boolean;
  pulse: boolean;
  glowColor: string;
};

export function getLinkIconEffectsFromSettings(
  settings: ProfileSettings,
  platform: string,
): LinkIconEffectProps {
  const key = normalizeLinkIconKey(platform);
  const glowColor =
    settings.links_monochrome || isCustomLinkIcon(key)
      ? settings.text_color
      : getPlatformBrandColor(key);

  return {
    glow: settings.links_icon_glow,
    shadow: settings.links_icon_shadow,
    pulse: settings.links_icon_pulse,
    glowColor,
  };
}

export function getLinkIconEffectClassName(pulse: boolean, glowAnimated = false) {
  return [pulse ? "bf-link-icon-pulse" : "", glowAnimated ? "bf-link-icon-glow--animated" : ""]
    .filter(Boolean)
    .join(" ");
}

function buildLinkIconGlowFilter(glowColor: string, size: number): string[] {
  const rgb = rgbString(glowColor);
  const tight = Math.max(1, Math.round(size * 0.1));
  const soft = Math.max(3, Math.round(size * 0.2));

  return [
    "brightness(1.1)",
    "saturate(1.16)",
    `drop-shadow(0 0 ${tight}px rgba(${rgb}, 0.88))`,
    `drop-shadow(0 0 ${soft}px rgba(${rgb}, 0.52))`,
  ];
}

export function buildLinkIconGlowVars(glowColor: string): Record<string, string> {
  return { "--bf-link-glow-rgb": rgbString(glowColor) };
}

export function getLinkIconEffectFilterStyle({
  glow,
  shadow,
  glowColor,
  size = 20,
  glowAnimated = false,
}: Pick<LinkIconEffectProps, "glow" | "shadow" | "glowColor"> & {
  size?: number;
  glowAnimated?: boolean;
}) {
  if (glowAnimated) {
    return shadow
      ? { filter: `drop-shadow(0 2px ${Math.max(4, Math.round(size * 0.22))}px rgba(0,0,0,0.45))` }
      : undefined;
  }

  const filters: string[] = [];

  if (glow && glowColor) {
    filters.push(...buildLinkIconGlowFilter(glowColor, size));
  }

  if (shadow) {
    filters.push(`drop-shadow(0 2px ${Math.max(4, Math.round(size * 0.22))}px rgba(0,0,0,0.45))`);
  }

  return filters.length > 0 ? { filter: filters.join(" ") } : undefined;
}

export function buildLinkIconProps(
  platform: string,
  settings: ProfileSettings,
  size?: number,
  linkAnimation?: LinkAnimation,
) {
  const iconSize = size ?? settings.links_icon_size;
  const effects = getLinkIconEffectsFromSettings(settings, platform);
  const glowFromAnimation = linkAnimation === "glow";

  return {
    platform,
    size: iconSize,
    monochrome: settings.links_monochrome,
    monoColor: settings.text_color,
    glow: effects.glow || glowFromAnimation,
    shadow: effects.shadow,
    pulse: effects.pulse,
    glowColor: effects.glowColor,
    glowAnimated: glowFromAnimation,
  };
}
