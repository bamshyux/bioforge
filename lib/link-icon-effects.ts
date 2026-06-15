import { getPlatformBrandColor } from "@/lib/platform-colors";
import { isCustomLinkIcon, normalizeLinkIconKey } from "@/lib/links";
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

export function getLinkIconEffectClassName(pulse: boolean) {
  return pulse ? "bf-link-icon-pulse" : "";
}

export function getLinkIconEffectFilterStyle({
  shadow,
  size = 20,
}: Pick<LinkIconEffectProps, "shadow"> & { size?: number }) {
  if (!shadow) return undefined;

  return {
    filter: `drop-shadow(0 2px ${Math.max(4, Math.round(size * 0.22))}px rgba(0,0,0,0.45))`,
  };
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
