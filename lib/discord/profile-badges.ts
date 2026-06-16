import type { DiscordGuildTag, DiscordProfileBadges, HypeSquadHouse } from "@/lib/discord/types";

const HYPESQUAD_BRAVERY = 1 << 6;
const HYPESQUAD_BRILLIANCE = 1 << 7;
const HYPESQUAD_BALANCE = 1 << 8;

export const EMPTY_DISCORD_PROFILE_BADGES: DiscordProfileBadges = {
  guildTag: null,
  nitro: false,
  hypesquad: null,
};

type LanyardGuildIdentity = {
  tag?: string | null;
  badge?: string | null;
  identity_guild_id?: string | null;
  identity_enabled?: boolean | null;
};

type LanyardDiscordUser = {
  avatar?: string | null;
  banner?: string | null;
  public_flags?: number | null;
  flags?: number | null;
  premium_type?: number | null;
  primary_guild?: LanyardGuildIdentity | null;
  clan?: LanyardGuildIdentity | null;
};

export function getGuildTagBadgeUrl(guildId: string, badgeHash: string, size = 32): string {
  return `https://cdn.discordapp.com/guild-tag-badges/${guildId}/${badgeHash}.png?size=${size}`;
}

function readPublicFlags(user: LanyardDiscordUser): number {
  const raw = user.public_flags ?? user.flags ?? 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseHypeSquadHouse(publicFlags: number): HypeSquadHouse | null {
  if (publicFlags & HYPESQUAD_BRAVERY) return "bravery";
  if (publicFlags & HYPESQUAD_BRILLIANCE) return "brilliance";
  if (publicFlags & HYPESQUAD_BALANCE) return "balance";
  return null;
}

function parseGuildTag(identity: LanyardGuildIdentity | null | undefined): DiscordGuildTag | null {
  if (!identity) return null;
  if (identity.identity_enabled === false) return null;

  const tag = identity.tag?.trim();
  const guildId = identity.identity_guild_id?.trim();
  const badgeHash = identity.badge?.trim();

  if (!tag || !guildId || !badgeHash) return null;

  return {
    tag,
    guildId,
    badgeUrl: getGuildTagBadgeUrl(guildId, badgeHash, 32),
  };
}

function parseNitro(user: LanyardDiscordUser): boolean {
  const premiumType = Number(user.premium_type ?? 0);
  if (Number.isFinite(premiumType) && premiumType > 0) return true;
  if (user.avatar?.startsWith("a_")) return true;
  if (user.banner?.trim()) return true;
  return false;
}

export function parseDiscordProfileBadges(user: LanyardDiscordUser | null | undefined): DiscordProfileBadges {
  if (!user) return EMPTY_DISCORD_PROFILE_BADGES;

  const publicFlags = readPublicFlags(user);
  const guildIdentity = user.primary_guild ?? user.clan ?? null;

  return {
    guildTag: parseGuildTag(guildIdentity),
    nitro: parseNitro(user),
    hypesquad: parseHypeSquadHouse(publicFlags),
  };
}

export function hasDiscordProfileBadges(badges: DiscordProfileBadges): boolean {
  return Boolean(badges.guildTag?.tag || badges.nitro || badges.hypesquad);
}
