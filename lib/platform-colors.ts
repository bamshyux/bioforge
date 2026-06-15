import { isCustomLinkIcon, normalizeLinkIconKey } from "@/lib/links";

export const PLATFORM_BRAND_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  discord: "#5865F2",
  twitch: "#9146FF",
  tiktok: "#EE1D52",
  instagram: "#E4405F",
  twitter: "#FFFFFF",
  github: "#F0F6FC",
  spotify: "#1DB954",
  steam: "#66C0F4",
  roblox: "#E2231A",
  kick: "#53FC18",
  telegram: "#26A5E4",
  facebook: "#1877F2",
  reddit: "#FF4500",
  link: "#A3A3A3",
  custom: "#A3A3A3",
};

export function getPlatformBrandColor(platform: string): string {
  const key = normalizeLinkIconKey(platform);
  if (isCustomLinkIcon(key)) return PLATFORM_BRAND_COLORS.link;
  return PLATFORM_BRAND_COLORS[key] ?? PLATFORM_BRAND_COLORS.link;
}
