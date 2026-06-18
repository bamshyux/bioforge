import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

const SETTINGS_EXCLUDE = new Set([
  "profile_id",
  "created_at",
  "updated_at",
  "discord_user_id",
  "discord_username",
  "discord_avatar",
  "discord_banner",
  "discord_premium_type",
  "custom_theme_id",
  "active_preset_id",
  "discord_card_config",
  "discord_card_style",
  "discord_show_lanyard_hint",
]);

function extractSettings(settings) {
  const result = {};
  for (const [k, v] of Object.entries(settings ?? {})) {
    if (!SETTINGS_EXCLUDE.has(k)) result[k] = v;
  }
  return result;
}

async function dumpUser(username) {
  const { data: profile } = await sb.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!profile) return;
  const [{ data: settings }, { data: links }, { data: embeds }, { data: featured }, { data: badges }, { data: widget }] =
    await Promise.all([
      sb.from("profile_settings").select("*").eq("profile_id", profile.id).maybeSingle(),
      sb.from("links").select("*").eq("profile_id", profile.id).order("sort_order"),
      sb.from("profile_embeds").select("*").eq("profile_id", profile.id).order("sort_order"),
      sb.from("featured_blocks").select("*").eq("profile_id", profile.id).order("sort_order"),
      sb.from("profile_badges").select("*, badges:badge_id(id, slug, name)").eq("profile_id", profile.id).order("sort_order"),
      sb.from("profile_widgets").select("*").eq("profile_id", profile.id).eq("widget_type", "discord_status").maybeSingle(),
    ]);

  console.log(JSON.stringify({ profile, settings, links, embeds, featured, badges, widget }, null, 2));
}

await dumpUser("f4ed");
await dumpUser("finesse");
