import type { ReactNode } from "react";
import type { SocialPlatformId } from "@/lib/social-platforms";
import { SOCIAL_PLATFORMS } from "@/lib/social-platforms";
import { isCustomLinkIcon, normalizeLinkIconKey } from "@/lib/links";
import {
  buildLinkIconGlowVars,
  getLinkIconEffectClassName,
  getLinkIconEffectFilterStyle,
} from "@/lib/link-icon-effects";
import { getPlatformBrandColor } from "@/lib/platform-colors";
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiKick,
  SiReddit,
  SiRoblox,
  SiSpotify,
  SiSteam,
  SiTelegram,
  SiTiktok,
  SiTwitch,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { LuLink } from "react-icons/lu";
import type { IconType } from "react-icons";

export { getPlatformBrandColor, PLATFORM_BRAND_COLORS } from "@/lib/platform-colors";

const PLATFORM_ICONS: Record<string, IconType> = {
  youtube: SiYoutube,
  discord: SiDiscord,
  twitch: SiTwitch,
  tiktok: SiTiktok,
  instagram: SiInstagram,
  twitter: SiX,
  github: SiGithub,
  spotify: SiSpotify,
  steam: SiSteam,
  roblox: SiRoblox,
  kick: SiKick,
  telegram: SiTelegram,
  facebook: SiFacebook,
  reddit: SiReddit,
  link: LuLink,
  custom: LuLink,
};

type LinkIconProps = {
  platform: string;
  size?: number;
  monochrome?: boolean;
  monoColor?: string;
  glow?: boolean;
  shadow?: boolean;
  pulse?: boolean;
  glowColor?: string;
  glowAnimated?: boolean;
};

export function LinkIcon({
  platform,
  size = 20,
  monochrome = false,
  monoColor,
  glow = false,
  shadow = false,
  pulse = false,
  glowColor,
  glowAnimated = false,
}: LinkIconProps) {
  const platformKey = normalizeLinkIconKey(platform);
  const resolvedGlowColor = glowColor ?? getPlatformBrandColor(platformKey);
  const hasGlow = glow || glowAnimated;
  const effectClass = getLinkIconEffectClassName(pulse, glowAnimated);
  const filterStyle = getLinkIconEffectFilterStyle({
    glow: hasGlow,
    shadow,
    glowColor: resolvedGlowColor,
    size,
    glowAnimated,
  });
  const glowVarStyle = glowAnimated ? buildLinkIconGlowVars(resolvedGlowColor) : undefined;

  const wrapperStyle = {
    ...filterStyle,
    ...glowVarStyle,
    lineHeight: 0,
  };

  if (isCustomLinkIcon(platformKey)) {
    return (
      <span className={`inline-flex shrink-0 ${effectClass}`} style={wrapperStyle}>
        <img
          src={platformKey}
          alt=""
          width={size}
          height={size}
          className="block object-contain"
          style={
            monochrome
              ? { filter: "grayscale(1) brightness(1.15)", opacity: 0.95 }
              : undefined
          }
        />
      </span>
    );
  }

  const Icon = PLATFORM_ICONS[platformKey] ?? LuLink;
  const color = monochrome && monoColor ? monoColor : getPlatformBrandColor(platformKey);

  return (
    <span className={`inline-flex shrink-0 ${effectClass}`} style={{ ...wrapperStyle, color }}>
      <Icon size={size} aria-hidden />
    </span>
  );
}

export function PlatformIconGrid({
  onSelect,
}: {
  onSelect: (id: SocialPlatformId) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {SOCIAL_PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          type="button"
          onClick={() => onSelect(platform.id)}
          className="flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 transition-colors hover:border-[#fafafa]/30 hover:bg-[#141414]"
        >
          <LinkIcon platform={platform.id} size={18} />
          <span className="text-[10px] text-neutral-500">{platform.name}</span>
        </button>
      ))}
    </div>
  );
}
