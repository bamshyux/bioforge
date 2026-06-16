import type { HypeSquadHouse } from "@/lib/discord/types";

/** Official Discord client badge SVGs (merlinfuchs/discord-badges, MIT). */
export const DISCORD_BADGE_ICON_URLS = {
  nitro: "/discord-badges/nitro.svg",
  hypesquad_bravery: "/discord-badges/hypesquad_bravery.svg",
  hypesquad_brilliance: "/discord-badges/hypesquad_brilliance.svg",
  hypesquad_balance: "/discord-badges/hypesquad_balance.svg",
} as const;

export function getHypeSquadBadgeIconUrl(house: HypeSquadHouse): string {
  return DISCORD_BADGE_ICON_URLS[`hypesquad_${house}`];
}

export const DISCORD_BADGE_ICON_SIZE = 18;
