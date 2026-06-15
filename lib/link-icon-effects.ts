import { getPlatformBrandColor } from "@/lib/platform-colors";
import { isCustomLinkIcon, normalizeLinkIconKey } from "@/lib/links";
import type { ProfileSettings } from "@/lib/types/settings";

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

export function getLinkIconEffectClassName(pulse: boolean) {
  return pulse ? "bf-link-icon-pulse" : "";
}

export function getLinkIconEffectFilterStyle({
  glow,
  shadow,
  glowColor,
  size = 20,
}: LinkIconEffectProps & { size?: number }) {
  const filters: string[] = [];

  if (shadow) {
    filters.push("drop-shadow(0 2px 6px rgba(0,0,0,0.45))");
  }

  if (glow) {
    const spread = Math.max(4, Math.round(size * 0.35));
    filters.push(`drop-shadow(0 0 ${spread}px ${glowColor}aa)`);
    filters.push(`drop-shadow(0 0 ${spread * 2}px ${glowColor}55)`);
  }

  return filters.length > 0 ? { filter: filters.join(" ") } : undefined;
}

export function buildLinkIconProps(
  platform: string,
  settings: ProfileSettings,
  size?: number,
) {
  const iconSize = size ?? settings.links_icon_size;
  const effects = getLinkIconEffectsFromSettings(settings, platform);

  return {
    platform,
    size: iconSize,
    monochrome: settings.links_monochrome,
    monoColor: settings.text_color,
    glow: effects.glow,
    shadow: effects.shadow,
    pulse: effects.pulse,
    glowColor: effects.glowColor,
  };
}
