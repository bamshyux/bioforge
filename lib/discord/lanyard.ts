import { getDiscordAvatarUrl } from "@/lib/discord/config";
import type { DiscordActivity, DiscordPresence, DiscordPresenceStatus } from "@/lib/discord/types";

type LanyardActivity = {
  name?: string;
  details?: string | null;
  state?: string | null;
  type?: number;
};

type LanyardResponse = {
  success: boolean;
  data?: {
    discord_user?: {
      id: string;
      username: string;
      avatar?: string | null;
    };
    discord_status?: string;
    activities?: LanyardActivity[];
    spotify?: {
      song?: string;
      artist?: string;
      album_art_url?: string;
    } | null;
  };
};

function normalizeStatus(raw?: string): DiscordPresenceStatus {
  if (raw === "online" || raw === "idle" || raw === "dnd" || raw === "offline") {
    return raw;
  }
  return "offline";
}

function pickActivity(activities?: LanyardActivity[]): DiscordActivity | null {
  if (!activities?.length) return null;
  const custom = activities.find((a) => a.type === 4 && a.name);
  const playing = activities.find((a) => a.name && a.type !== 4);
  const activity = playing ?? custom;
  if (!activity?.name) return null;
  return {
    name: activity.name,
    details: activity.details ?? undefined,
    state: activity.state ?? undefined,
    type: activity.type,
  };
}

export async function fetchLanyardPresence(discordUserId: string): Promise<DiscordPresence | null> {
  if (!discordUserId.trim()) return null;

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(discordUserId)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as LanyardResponse;
    if (!json.success || !json.data?.discord_user) return null;

    const user = json.data.discord_user;
    const spotify = json.data.spotify;

    return {
      userId: user.id,
      username: user.username,
      avatarUrl: getDiscordAvatarUrl(user.id, user.avatar),
      status: normalizeStatus(json.data.discord_status),
      activity: pickActivity(json.data.activities),
      spotify: spotify?.song
        ? {
            song: spotify.song,
            artist: spotify.artist ?? "",
            albumArtUrl: spotify.album_art_url,
          }
        : null,
    };
  } catch {
    return null;
  }
}
