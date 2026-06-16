"use client";

import { useId } from "react";
import type { DiscordProfileBadges } from "@/lib/discord/types";

function NitroBadgeIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20">
          <stop stopColor="#ff73b8" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M12 3 4 8v8l8 5 8-5V8l-8-5Z" fill={`url(#${gradientId})`} fillOpacity="0.9" />
      <path
        d="M12 3 4 8v8l8 5 8-5V8l-8-5Z"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}

function HypeSquadBadgeIcon({
  house,
  className = "h-[18px] w-[18px]",
}: {
  house: "bravery" | "brilliance" | "balance";
  className?: string;
}) {
  const colors = {
    bravery: { fill: "#9C84EF", stroke: "#7c5fe6" },
    brilliance: { fill: "#F47B67", stroke: "#e85d45" },
    balance: { fill: "#45DD76", stroke: "#2bc55f" },
  }[house];

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2 4 7v10l8 5 8-5V7l-8-5Z"
        fill={colors.fill}
        fillOpacity="0.95"
      />
      <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z" stroke={colors.stroke} strokeWidth="1" />
      <path
        d="M12 6.5 8.5 9v3L12 14.5 15.5 12V9L12 6.5Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}

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
            <img
              src={guildTag.badgeUrl}
              alt=""
              className="h-3.5 w-3.5 shrink-0 object-contain"
              loading="lazy"
            />
          ) : null}
          <span className="truncate text-[11px] font-semibold leading-none text-white/90">
            {guildTag.tag}
          </span>
        </span>
      ) : null}

      {hasNitro ? (
        <span
          className="profile-discord-status__badge profile-discord-status__badge--nitro inline-flex items-center justify-center rounded-md p-0.5"
          title="Discord Nitro"
        >
          <NitroBadgeIcon />
        </span>
      ) : null}

      {hasHypeSquad && hypesquad ? (
        <span
          className={`profile-discord-status__badge profile-discord-status__badge--hypesquad profile-discord-status__badge--${hypesquad} inline-flex items-center justify-center rounded-md p-0.5`}
          title={`HypeSquad ${hypesquad.charAt(0).toUpperCase()}${hypesquad.slice(1)}`}
        >
          <HypeSquadBadgeIcon house={hypesquad} />
        </span>
      ) : null}
    </span>
  );
}
