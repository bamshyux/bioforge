import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

// Same query as searchCommunityThemes
const withSnapshot = await sb
  .from("community_theme_listings")
  .select(
    `id, listing_type, title, visibility, published_at, published_preset_data,
     profiles:author_id (username)`,
    { count: "exact" },
  )
  .in("visibility", ["public", "open_source"])
  .not("published_at", "is", null)
  .eq("listing_type", "profile_preset");

console.log("WITH published_preset_data:", withSnapshot.error?.message ?? "ok", "count", withSnapshot.count, "rows", withSnapshot.data?.length);

const withoutSnapshot = await sb
  .from("community_theme_listings")
  .select(
    `id, listing_type, title, visibility, published_at,
     profiles:author_id (username)`,
    { count: "exact" },
  )
  .in("visibility", ["public", "open_source"])
  .not("published_at", "is", null)
  .eq("listing_type", "profile_preset");

console.log("WITHOUT published_preset_data:", withoutSnapshot.error?.message ?? "ok", "count", withoutSnapshot.count);
console.log(JSON.stringify(withoutSnapshot.data, null, 2));

// Raw listings visibility/published_at
const { data: raw } = await sb.from("community_theme_listings").select("id,title,listing_type,visibility,published_at,author_id");
console.log("\nALL listings raw:", JSON.stringify(raw, null, 2));
