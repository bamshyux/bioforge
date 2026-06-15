export function isValidDiscordUserId(userId: string): boolean {
  return /^\d{17,20}$/.test(userId.trim());
}

/** Account was linked via OAuth or manual save (stores a username). */
export function isDiscordLinked(settings: {
  discord_user_id: string;
  discord_username?: string;
}): boolean {
  return isValidDiscordUserId(settings.discord_user_id) && Boolean(settings.discord_username?.trim());
}

export function isDiscordConnected(settings: {
  discord_user_id: string;
  discord_username?: string;
}): boolean {
  return isDiscordLinked(settings);
}
