import { fetchLanyardPresence } from "@/lib/discord/lanyard";
import type { DiscordPresence } from "@/lib/discord/types";
import type { ProfileSettings } from "@/lib/types/settings";

export async function getDiscordPresenceForSettings(
  settings: ProfileSettings,
): Promise<DiscordPresence | null> {
  if (!settings.show_discord_status || !settings.discord_user_id.trim()) {
    return null;
  }
  return fetchLanyardPresence(settings.discord_user_id);
}
