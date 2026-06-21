"use client";

import type { ProfileEmbed } from "@/lib/types/embed";
import type { ProfileSettings } from "@/lib/types/settings";
import {
  aspectRatioClass,
  aspectRatioStyle,
  embedAlignmentClass,
  embedCardStyle,
  resolveEmbedTitle,
} from "@/lib/embeds/config";
import { getEmbedIframeSrc } from "@/lib/embeds/parse";
import { isRobloxLinkEmbed, robloxEmbedLinkLabel } from "@/lib/embeds/roblox-profile";
import { CardBorderEffect } from "@/components/profile/card-border-effect";
import { cardBorderEffectStripsDefaultBorder } from "@/lib/card-border-effects/resolve";
import type { CardBorderTarget } from "@/lib/card-border-effects/types";

function isSpotifyEmbed(embedType: ProfileEmbed["embed_type"]) {
  return embedType === "spotify_track" || embedType === "spotify_playlist";
}

function embedStyleWithBorderEffect(
  settings: ProfileSettings,
  config: ProfileEmbed["config"],
  target: CardBorderTarget,
) {
  const style = embedCardStyle(config, settings.accent_color);
  if (!cardBorderEffectStripsDefaultBorder(settings, target)) return style;
  return { ...style, border: "none", boxShadow: "none" };
}

function GenericLinkCard({
  embed,
  settings,
  minimal = false,
}: {
  embed: ProfileEmbed;
  settings: ProfileSettings;
  minimal?: boolean;
}) {
  const config = embed.config;
  const title = resolveEmbedTitle(embed);
  const style = embedCardStyle(config, settings.accent_color);

  if (minimal) {
    return (
      <a
        href={embed.url}
        target="_blank"
        rel="noopener noreferrer"
        className="profile-embed block text-sm text-neutral-300 transition-colors hover:text-white"
      >
        {title} →
      </a>
    );
  }

  return (
    <a
      href={embed.url}
      target="_blank"
      rel="noopener noreferrer"
      className="profile-embed block overflow-hidden transition-colors hover:opacity-95"
      style={style}
      data-embed-type={embed.embed_type}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          {config.show_title ? (
            <p className="truncate text-sm font-semibold text-white">{title}</p>
          ) : null}
          <p className={`truncate text-xs text-neutral-400 ${config.show_title ? "mt-1" : ""}`}>
            {config.description || embed.url}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-[var(--bf-accent)]">Open →</span>
      </div>
    </a>
  );
}

function RobloxCard({
  embed,
  settings,
}: {
  embed: ProfileEmbed;
  settings: ProfileSettings;
}) {
  const config = embed.config;
  const title = resolveEmbedTitle(embed);
  const style = embedStyleWithBorderEffect(settings, config, "roblox");
  const isProfile = embed.embed_type === "roblox_profile";
  const imageUrl = isProfile ? config.avatar_url : config.thumbnail_url;
  const showImage = isProfile ? config.show_avatar : config.show_thumbnail;
  const subtitle = isProfile
    ? config.show_username && config.username
      ? `@${config.username}`
      : robloxEmbedLinkLabel(embed.embed_type)
    : config.description || robloxEmbedLinkLabel(embed.embed_type);

  if (config.display_mode === "minimal") {
    return <GenericLinkCard embed={embed} settings={settings} minimal />;
  }

  return (
    <CardBorderEffect settings={settings} target="roblox" borderRadius={settings.border_radius}>
      <a
        href={embed.url}
        target="_blank"
        rel="noopener noreferrer"
        className="profile-embed block overflow-hidden transition-colors hover:opacity-95"
        style={style}
        data-embed-type={embed.embed_type}
      >
        <div className={`flex items-center gap-4 p-4 ${config.card_style === "minimal" ? "px-0 py-2" : ""}`}>
        {showImage && imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className={`shrink-0 rounded-xl object-cover ${isProfile ? "h-16 w-16" : "h-14 w-14"}`}
            draggable={false}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          {config.show_title ? (
            <p className="truncate text-sm font-semibold text-white">{title}</p>
          ) : null}
          <p className={`truncate text-xs text-neutral-400 ${config.show_title ? "mt-1" : ""}`}>{subtitle}</p>
          {config.description && !isProfile ? (
            <p className="mt-2 line-clamp-2 text-xs text-neutral-500">{config.description}</p>
          ) : null}
        </div>
        <span className="shrink-0 text-xs font-medium text-[var(--bf-accent)]">Open →</span>
        </div>
      </a>
    </CardBorderEffect>
  );
}

function IframeEmbed({
  embed,
  settings,
  hostname,
}: {
  embed: ProfileEmbed;
  settings: ProfileSettings;
  hostname: string;
}) {
  const config = embed.config;
  const src = getEmbedIframeSrc(embed.embed_type, embed.embed_id, config, hostname);
  if (!src) return null;

  const title = resolveEmbedTitle(embed);
  const style = isSpotifyEmbed(embed.embed_type)
    ? embedStyleWithBorderEffect(settings, config, "spotify")
    : embedCardStyle(config, settings.accent_color);
  const ratioClass = aspectRatioClass(config.aspect_ratio);
  const ratioStyle = aspectRatioStyle(config.aspect_ratio, config.compact_player);

  const body = (
    <div className="profile-embed overflow-hidden" style={style} data-embed-type={embed.embed_type}>
      {config.show_title ? (
        <div className="border-b border-white/[0.06] px-4 py-2.5">
          <p className="truncate text-sm font-medium text-white">{title}</p>
          {config.description ? (
            <p className="mt-0.5 truncate text-xs text-neutral-500">{config.description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={`relative w-full ${ratioClass}`} style={ratioStyle}>
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );

  if (!isSpotifyEmbed(embed.embed_type)) return body;

  return (
    <CardBorderEffect settings={settings} target="spotify" borderRadius={settings.border_radius}>
      {body}
    </CardBorderEffect>
  );
}

export function ProfileEmbedItem({
  embed,
  settings,
  hostname,
}: {
  embed: ProfileEmbed;
  settings: ProfileSettings;
  hostname: string;
}) {
  const config = embed.config;
  const alignmentClass = embedAlignmentClass(config.alignment);

  if (config.display_mode === "minimal") {
    return (
      <div className={alignmentClass}>
        {isRobloxLinkEmbed(embed.embed_type) ? (
          <RobloxCard embed={embed} settings={settings} />
        ) : (
          <GenericLinkCard embed={embed} settings={settings} minimal />
        )}
      </div>
    );
  }

  if (config.display_mode === "card") {
    return (
      <div className={alignmentClass}>
        {isRobloxLinkEmbed(embed.embed_type) ? (
          <RobloxCard embed={embed} settings={settings} />
        ) : (
          <GenericLinkCard embed={embed} settings={settings} />
        )}
      </div>
    );
  }

  return (
    <div className={alignmentClass}>
      <IframeEmbed embed={embed} settings={settings} hostname={hostname} />
    </div>
  );
}
