import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);
const NEEDLE = "d97fe032";

const tables = [
  ["profiles", "*"],
  ["profile_settings", "*"],
  ["links", "*"],
  ["profile_embeds", "*"],
  ["featured_blocks", "*"],
  ["profile_badges", "*"],
  ["profile_widgets", "*"],
  ["custom_themes", "*"],
  ["profile_presets", "*"],
  ["community_theme_listings", "*"],
  ["community_theme_installs", "*"],
  ["guestbook_entries", "*"],
];

for (const [table, cols] of tables) {
  const { data, error } = await sb.from(table).select(cols).limit(500);
  if (error) {
    console.log(table, "ERR", error.message);
    continue;
  }
  for (const row of data ?? []) {
    if (JSON.stringify(row).includes(NEEDLE)) {
      console.log(`\n=== HIT ${table} ===`);
      console.log(JSON.stringify(row, null, 2));
    }
  }
}

// Search display_name Merci in any remaining table via profiles - already deleted
// Check community installs for bam
const { data: bam } = await sb.from("profiles").select("id").eq("username", "bam").maybeSingle();
const { data: installs } = await sb
  .from("community_theme_installs")
  .select("*, listing:community_theme_listings(title, published_preset_data, author_id)")
  .eq("user_id", bam?.id);
console.log("\nbam installs", JSON.stringify(installs, null, 2));
