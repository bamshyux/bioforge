export type DiscordPresenceStatus = "online" | "idle" | "dnd" | "offline";

export type DiscordActivity = {
  name: string;
  details?: string;
  state?: string;
  type?: number;
  applicationId?: string;
  largeImageUrl?: string | null;
  smallImageUrl?: string | null;
};

export type DiscordSpotify = {
  song: string;
  artist: string;
  albumArtUrl?: string;
};

export type DiscordPresence = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  status: DiscordPresenceStatus;
  activity: DiscordActivity | null;
  spotify: DiscordSpotify | null;
};

export type DiscordOAuthUser = {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
};
