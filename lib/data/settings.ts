import { createClient } from "@/lib/supabase/server";
import { applyDiscordCardConfig } from "@/lib/discord/card-config";
import { isDiscordLinked } from "@/lib/discord/connection";
import { getDiscordStatusWidget } from "@/lib/data/discord-widget";
import { mergeSettings } from "@/lib/settings";
import type { ProfileSettings } from "@/lib/types/settings";

export async function getSettingsByProfileId(
  profileId: string,
): Promise<ProfileSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profile_settings")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  const row = data as Partial<ProfileSettings> & { widgets_discord_user_id?: string } | null;
  if (row?.gradient_colors && typeof row.gradient_colors === "string") {
    try {
      row.gradient_colors = JSON.parse(row.gradient_colors as unknown as string);
    } catch {
      row.gradient_colors = undefined;
    }
  }

  let settings = mergeSettings(row, profileId);
  const widget = await getDiscordStatusWidget(profileId);
  const linked = isDiscordLinked(settings);

  if (!linked) {
    settings.discord_user_id = "";
    settings.discord_username = "";
    settings.discord_avatar = "";
    settings.show_discord_status = false;
  } else {
    // profile_settings is the source of truth; widget table only stores card config.
    settings.show_discord_status = row?.show_discord_status === true;
    if (widget) {
      settings = applyDiscordCardConfig(settings, widget.config);
    }
  }

  return settings;
}
