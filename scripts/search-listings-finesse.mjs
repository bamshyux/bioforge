import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

const { data, error } = await sb
  .from("community_theme_listings")
  .select("id,title,author_id,profile_preset_id,preview_image_url,description,tags");
if (error) {
  console.log(error);
  process.exit(1);
}

for (const l of data ?? []) {
  const s = JSON.stringify(l).toLowerCase();
  if (s.includes("444") || s.includes("merci") || s.includes("d97fe032")) {
    console.log(l);
  }
}
console.log("total listings", data?.length);

// finesse full dump
const { data: finesse } = await sb.from("profiles").select("*").eq("username", "finesse").maybeSingle();
const { data: finesseSettings } = await sb
  .from("profile_settings")
  .select("*")
  .eq("profile_id", finesse?.id)
  .maybeSingle();
const { data: finesseLinks } = await sb.from("links").select("*").eq("profile_id", finesse?.id);
console.log("\nfinesse", finesse);
console.log("finesse settings summary", {
  layout: finesseSettings?.layout,
  bg: finesseSettings?.background_type,
  music: finesseSettings?.music_title,
  cursor: finesseSettings?.cursor_image_url,
  enter_gate: finesseSettings?.enter_gate_background_image_url,
});
console.log("finesse links", finesseLinks);
