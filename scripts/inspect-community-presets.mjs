import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  const key = line.slice(0, i).trim();
  let value = line.slice(i + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Missing Supabase admin credentials");
  process.exit(1);
}

const sb = createClient(url, key);

function isValidSnapshot(data) {
  return Boolean(data && typeof data === "object" && data.version === 1 && data.settings && data.profile);
}

async function inspect() {
  const { data: listings, error } = await sb
    .from("community_theme_listings")
    .select("id, title, profile_preset_id, preview_image_url, author_id")
    .eq("listing_type", "profile_preset");

  if (error) {
    console.error(error);
    process.exit(1);
  }

  for (const listing of listings ?? []) {
    const { data: livePreset } = await sb
      .from("profile_presets")
      .select("name, preset_data, thumbnail_url, updated_at")
      .eq("id", listing.profile_preset_id)
      .maybeSingle();

    const { data: profile } = await sb
      .from("profiles")
      .select("username")
      .eq("id", listing.author_id)
      .maybeSingle();

    console.log(
      JSON.stringify(
        {
          listing: listing.title,
          author: profile?.username,
          listingId: listing.id,
          preview_image_url: listing.preview_image_url,
          livePresetName: livePreset?.name,
          liveBio: livePreset?.preset_data?.profile?.bio,
          liveDisplayName: livePreset?.preset_data?.profile?.display_name,
          liveLayout: livePreset?.preset_data?.settings?.layout,
          liveBackgroundType: livePreset?.preset_data?.settings?.background_type,
          liveBackgroundImage: livePreset?.preset_data?.settings?.background_image_url,
          liveAvatar: livePreset?.preset_data?.profile?.avatar_url,
          liveBanner: livePreset?.preset_data?.profile?.banner_url,
          validLiveSnapshot: isValidSnapshot(livePreset?.preset_data),
          updated_at: livePreset?.updated_at,
        },
        null,
        2,
      ),
    );

    const { data: installs } = await sb
      .from("community_theme_installs")
      .select("installed_preset_id, created_at")
      .eq("listing_id", listing.id);

    for (const install of installs ?? []) {
      const { data: copy } = await sb
        .from("profile_presets")
        .select("name, preset_data, thumbnail_url")
        .eq("id", install.installed_preset_id)
        .maybeSingle();
      console.log(
        "  install copy:",
        JSON.stringify({
          installed_preset_id: install.installed_preset_id,
          name: copy?.name,
          bio: copy?.preset_data?.profile?.bio,
          valid: isValidSnapshot(copy?.preset_data),
        }),
      );
    }
  }
}

await inspect();
