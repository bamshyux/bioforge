"use client";

import {
  DISCORD_BADGE_ICON_SIZE,
  DISCORD_BADGE_ICON_URLS,
  getHypeSquadBadgeIconUrl,
} from "@/lib/discord/badge-assets";
import type { DiscordProfileBadges, HypeSquadHouse } from "@/lib/discord/types";

function DiscordBadgeImage({
  src,
  alt,
  title,
  className = "",
}: {
  src: string;
  alt: string;
  title: string;
  className?: string;
}) {
  return (
    <span
      className={`profile-discord-status__badge inline-flex shrink-0 items-center justify-center ${className}`}
      title={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={DISCORD_BADGE_ICON_SIZE}
        height={DISCORD_BADGE_ICON_SIZE}
        className="h-[18px] w-[18px] object-contain"
        loading="lazy"
        draggable={false}
      />
    </span>
  );
}

const HYPESQUAD_LABELS: Record<HypeSquadHouse, string> = {
  bravery: "HypeSquad Bravery",
  brilliance: "HypeSquad Brilliance",
  balance: "HypeSquad Balance",
};

export function DiscordProfileBadges({ badges }: { badges: DiscordProfileBadges }) {
  const { guildTag, nitro, hypesquad } = badges;
  const hasGuildTag = Boolean(guildTag?.tag);
  const hasNitro = nitro;
  const hasHypeSquad = Boolean(hypesquad);

  if (!hasGuildTag && !hasNitro && !hasHypeSquad) return null;

  return (
    <span className="profile-discord-status__badges inline-flex shrink-0 items-center gap-1">
      {hasGuildTag && guildTag ? (
        <span
          className="profile-discord-status__guild-tag inline-flex max-w-[5.5rem] items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5"
          title={`Server tag · ${guildTag.tag}`}
        >
          {guildTag.badgeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={guildTag.badgeUrl}
              alt=""
              className="h-3.5 w-3.5 shrink-0 object-contain"
              loading="lazy"
              draggable={false}
            />
          ) : null}
          <span className="truncate text-[11px] font-semibold leading-none text-white/90">
            {guildTag.tag}
          </span>
        </span>
      ) : null}

      {hasNitro ? (
        <DiscordBadgeImage
          src={DISCORD_BADGE_ICON_URLS.nitro}
          alt=""
          title="Discord Nitro"
          className="profile-discord-status__badge--nitro"
        />
      ) : null}

      {hasHypeSquad && hypesquad ? (
        <DiscordBadgeImage
          src={getHypeSquadBadgeIconUrl(hypesquad)}
          alt=""
          title={HYPESQUAD_LABELS[hypesquad]}
          className={`profile-discord-status__badge--hypesquad profile-discord-status__badge--${hypesquad}`}
        />
      ) : null}
    </span>
  );
}
