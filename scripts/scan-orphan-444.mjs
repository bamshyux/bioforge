import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);
const ORPHAN = "d97fe032-481b-47f2-b8ff-ddce6650f6ac";
const BASE = env.NEXT_PUBLIC_SUPABASE_URL;

function publicUrl(bucket, path) {
  return `${BASE}/storage/v1/object/public/${bucket}/${path}`;
}

// Search all presets for orphan uuid in JSON
const { data: presets } = await sb.from("profile_presets").select("id,user_id,name,preset_data");
for (const p of presets ?? []) {
  const s = JSON.stringify(p.preset_data ?? {});
  if (s.includes(ORPHAN)) {
    console.log("PRESET WITH ORPHAN URLS", p.id, p.name);
    console.log(JSON.stringify(p.preset_data, null, 2));
  }
}

// Search community listings
const { data: listings } = await sb.from("community_theme_listings").select("id,title,author_id,published_preset_data,preview_image_url");
for (const l of listings ?? []) {
  const s = JSON.stringify(l);
  if (s.includes(ORPHAN) || l.title?.toLowerCase().includes("merci") || l.title?.includes("444")) {
    console.log("LISTING", JSON.stringify(l, null, 2));
  }
}

// activity events
const { data: activity } = await sb.from("activity_events").select("*").limit(1000);
const matches = (activity ?? []).filter((a) => JSON.stringify(a).includes(ORPHAN) || JSON.stringify(a).includes("444"));
console.log("activity matches", matches.length, matches.slice(0, 5));

// Compare uid neighbors - get full settings for sid(3) and f4ed(5) as reference
const { data: neighbors } = await sb
  .from("profiles")
  .select("id,username,uid,display_name,bio,avatar_url,banner_url,created_at")
  .in("uid", [3, 5]);
console.log("neighbors", neighbors);

for (const n of neighbors ?? []) {
  const { data: settings } = await sb.from("profile_settings").select("*").eq("profile_id", n.id).maybeSingle();
  const { data: links } = await sb.from("links").select("*").eq("profile_id", n.id).order("sort_order");
  console.log(`\n=== ${n.username} uid ${n.uid} ===`);
  console.log("profile", n);
  console.log("links count", links?.length);
  console.log("layout", settings?.layout, "bg", settings?.background_type);
}

// Signed URLs for orphan assets
const assets = [
  ["profiles", `${ORPHAN}/avatar.jpg`],
  ["profiles", `${ORPHAN}/cursor.png`],
  ["profiles", `${ORPHAN}/link-icons/1781565433033.png`],
  ["backgrounds", `${ORPHAN}/background.mp4`],
  ["backgrounds", `${ORPHAN}/enter-gate.png`],
  ["music", `${ORPHAN}/track.mp3`],
];
console.log("\n=== ORPHAN ASSET URLS ===");
for (const [bucket, path] of assets) {
  console.log(publicUrl(bucket, path));
}

// Try to get file metadata via download head
for (const [bucket, path] of assets) {
  const { data, error } = await sb.storage.from(bucket).download(path);
  console.log("download", bucket, path, error?.message ?? `size=${data?.size}`);
}
