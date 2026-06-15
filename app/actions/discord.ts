"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  removeDiscordStatusWidget,
  setDiscordStatusWidgetEnabled,
} from "@/lib/data/discord-widget";
import { formatSchemaError } from "@/lib/db/schema";
import { omitUnsupportedSettingsColumns } from "@/lib/db/validate-schema";

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub as string;
}

async function getDiscordUserId(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profile_settings")
    .select("widgets_discord_user_id")
    .eq("profile_id", userId)
    .maybeSingle();
  return String((data as { widgets_discord_user_id?: string } | null)?.widgets_discord_user_id ?? "").trim();
}

async function revalidateProfile(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();

  revalidatePath("/dashboard/widgets");
  revalidatePath("/dashboard", "layout");
  if (profile?.username) revalidatePath(`/${profile.username}`);
}

export async function toggleDiscordStatusAction(show: boolean): Promise<{ error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { error: "Not signed in." };

  const discordUserId = await getDiscordUserId(userId);
  if (!discordUserId && show) {
    return { error: "Connect your Discord account before enabling status on your profile." };
  }

  await setDiscordStatusWidgetEnabled(userId, show && Boolean(discordUserId));

  const patch = await omitUnsupportedSettingsColumns({ show_discord_status: show && Boolean(discordUserId) });
  const supabase = await createClient();
  const { error } = await supabase
    .from("profile_settings")
    .update(patch)
    .eq("profile_id", userId);

  if (error && !/does not exist/i.test(error.message)) {
    return { error: formatSchemaError(error.message) };
  }

  await revalidateProfile(userId);
  return {};
}

export async function disconnectDiscordAction(): Promise<{ error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { error: "Not signed in." };

  await removeDiscordStatusWidget(userId);

  const patch = await omitUnsupportedSettingsColumns({
    widgets_discord_user_id: "",
    discord_username: "",
    discord_avatar: "",
    show_discord_status: false,
  });
  const supabase = await createClient();
  const { error } = await supabase
    .from("profile_settings")
    .update(patch)
    .eq("profile_id", userId);

  if (error) return { error: formatSchemaError(error.message) };
  await revalidateProfile(userId);
  return {};
}

export async function saveDiscordUserIdAction(discordUserId: string): Promise<{ error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { error: "Not signed in." };

  const trimmed = discordUserId.trim();
  if (!/^\d{17,20}$/.test(trimmed)) {
    return { error: "Enter a valid Discord user ID (17–20 digits)." };
  }

  const patch = await omitUnsupportedSettingsColumns({
    widgets_discord_user_id: trimmed,
    show_discord_status: false,
  });
  const supabase = await createClient();
  const { error } = await supabase
    .from("profile_settings")
    .update(patch)
    .eq("profile_id", userId);

  if (error) return { error: formatSchemaError(error.message) };
  await setDiscordStatusWidgetEnabled(userId, false);
  await revalidateProfile(userId);
  return {};
}
