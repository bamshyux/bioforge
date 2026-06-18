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

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

async function search() {
  const checks = [];

  const uid4 = await sb.from("profiles").select("*").eq("uid", 4);
  checks.push({ label: "uid=4", data: uid4.data, error: uid4.error });

  const username444 = await sb.from("profiles").select("*").eq("username", "444");
  checks.push({ label: "username=444", data: username444.data, error: username444.error });

  const merci = await sb.from("profiles").select("*").ilike("display_name", "%merci%");
  checks.push({ label: "display_name ilike merci", data: merci.data, error: merci.error });

  const merciBio = await sb.from("profiles").select("*").ilike("bio", "%merci%");
  checks.push({ label: "bio ilike merci", data: merciBio.data, error: merciBio.error });

  const presetsMerci = await sb.from("profile_presets").select("id,user_id,name,thumbnail_url,preset_data,updated_at").or("name.ilike.%merci%,name.ilike.%444%");
  checks.push({ label: "presets name merci/444", data: presetsMerci.data, error: presetsMerci.error });

  const listings = await sb.from("community_theme_listings").select("id,title,author_id,published_preset_data,profile_preset_id,preview_image_url").or("title.ilike.%merci%,title.ilike.%444%");
  checks.push({ label: "community listings", data: listings.data, error: listings.error });

  const bamPresets = await sb.from("profile_presets").select("id,name,preset_data,updated_at").eq("user_id", (await sb.from("profiles").select("id").eq("username","bam").single()).data?.id);
  checks.push({ label: "bam presets", data: bamPresets.data?.map(p => ({ id: p.id, name: p.name, display_name: p.preset_data?.profile?.display_name, bio: p.preset_data?.profile?.bio, layout: p.preset_data?.settings?.layout })), error: bamPresets.error });

  // Scan all presets for display_name Merci
  const allPresets = await sb.from("profile_presets").select("id,user_id,name,preset_data,updated_at");
  const merciPresets = (allPresets.data ?? []).filter(p => {
    const dn = p.preset_data?.profile?.display_name?.toLowerCase?.() ?? "";
    const bio = p.preset_data?.profile?.bio?.toLowerCase?.() ?? "";
    return dn.includes("merci") || bio.includes("merci") || p.name?.toLowerCase?.().includes("merci");
  });
  checks.push({ label: "all presets with Merci in data", data: merciPresets.map(p => ({ id: p.id, user_id: p.user_id, name: p.name, display_name: p.preset_data?.profile?.display_name, bio: p.preset_data?.profile?.bio?.slice?.(0,80) })) });

  const audit = await sb.from("admin_audit_logs").select("*").or("action.ilike.%444%,details.ilike.%444%,details.ilike.%merci%").limit(20);
  checks.push({ label: "admin audit", data: audit.data, error: audit.error });

  const moderation = await sb.from("moderation_audit").select("*").or("content.ilike.%444%,content.ilike.%merci%").limit(20);
  checks.push({ label: "moderation audit", error: moderation.error, count: moderation.data?.length });

  // List all profiles with low uid
  const lowUid = await sb.from("profiles").select("id,username,uid,display_name,bio,avatar_url,banner_url,created_at").order("uid", { ascending: true }).limit(20);
  checks.push({ label: "lowest uids", data: lowUid.data, error: lowUid.error });

  for (const c of checks) {
    console.log("\n---", c.label, "---");
    console.log(JSON.stringify(c, null, 2));
  }

  if (merciPresets.length) {
    fs.mkdirSync("scripts/recovered-presets", { recursive: true });
    fs.writeFileSync("scripts/recovered-presets/merci-preset-candidates.json", JSON.stringify(merciPresets, null, 2));
  }
}

await search();
