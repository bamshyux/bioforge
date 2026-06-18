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

async function recoverListing(listing) {
  if (isValidSnapshot(listing.published_preset_data)) {
    console.log(`[ok] ${listing.title} already has published snapshot`);
    return;
  }

  const { data: livePreset } = await sb
    .from("profile_presets")
    .select("preset_data, thumbnail_url")
    .eq("id", listing.profile_preset_id)
    .maybeSingle();

  if (isValidSnapshot(livePreset?.preset_data)) {
    const { error } = await sb
      .from("community_theme_listings")
      .update({
        published_preset_data: livePreset.preset_data,
        preview_image_url: listing.preview_image_url || livePreset.thumbnail_url,
      })
      .eq("id", listing.id);
    console.log(error ? `[fail] ${listing.title} live copy: ${error.message}` : `[fixed] ${listing.title} from live preset`);
    return;
  }

  const { data: installs } = await sb
    .from("community_theme_installs")
    .select("installed_preset_id, created_at")
    .eq("listing_id", listing.id)
    .order("created_at", { ascending: true });

  for (const install of installs ?? []) {
    const { data: installedPreset } = await sb
      .from("profile_presets")
      .select("preset_data, thumbnail_url")
      .eq("id", install.installed_preset_id)
      .maybeSingle();

    if (!isValidSnapshot(installedPreset?.preset_data)) continue;

    const { error } = await sb
      .from("community_theme_listings")
      .update({
        published_preset_data: installedPreset.preset_data,
        preview_image_url: listing.preview_image_url || installedPreset.thumbnail_url,
      })
      .eq("id", listing.id);

    console.log(
      error
        ? `[fail] ${listing.title} install copy: ${error.message}`
        : `[fixed] ${listing.title} from install copy ${install.installed_preset_id}`,
    );
    return;
  }

  console.log(`[missing] ${listing.title} — no recoverable snapshot found`);
}

const { data: listings, error } = await sb
  .from("community_theme_listings")
  .select("id, title, profile_preset_id, published_preset_data, preview_image_url")
  .eq("listing_type", "profile_preset");

if (error) {
  console.error(error);
  process.exit(1);
}

for (const listing of listings ?? []) {
  await recoverListing(listing);
}
