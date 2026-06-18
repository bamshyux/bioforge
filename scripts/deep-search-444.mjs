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
const ORPHAN = "d97fe032-481b-47f2-b8ff-ddce6650f6ac";

const tables = [
  "profile_settings",
  "links",
  "profile_embeds",
  "featured_blocks",
  "profile_badges",
  "profile_widgets",
  "custom_themes",
  "profile_presets",
  "community_theme_listings",
  "analytics_events",
  "guestbook_entries",
  "follows",
  "profile_views",
  "moderation_audit",
  "admin_audit_logs",
  "username_history",
];

for (const table of tables) {
  const col = table === "profile_presets" ? "user_id" : "profile_id";
  const q = sb.from(table).select("*").eq(col, ORPHAN).limit(20);
  const { data, error } = await q;
  if (error) {
    console.log(table, "error", error.message);
  } else if (data?.length) {
    console.log(table, JSON.stringify(data, null, 2));
  }
}

// Search any json column for orphan uuid
const { data: allPresets } = await sb.from("profile_presets").select("id,user_id,name,preset_data");
for (const p of allPresets ?? []) {
  const s = JSON.stringify(p.preset_data ?? {});
  if (s.includes(ORPHAN) || s.includes("444") || s.toLowerCase().includes("merci")) {
    console.log("preset match", p.id, p.user_id, p.name);
  }
}

// bam presets
const { data: bam } = await sb.from("profiles").select("id").eq("username", "bam").maybeSingle();
const { data: bamPresets } = await sb.from("profile_presets").select("*").eq("user_id", bam?.id);
console.log("\nbam presets", JSON.stringify(bamPresets, null, 2));

// auth user for orphan id
const { data: authUser, error: authErr } = await sb.auth.admin.getUserById(ORPHAN);
console.log("\nauth user", authErr?.message ?? null, authUser?.user?.email, authUser?.user?.user_metadata);

// list all auth users
const { data: authList } = await sb.auth.admin.listUsers({ perPage: 100 });
for (const u of authList?.users ?? []) {
  if (u.id === ORPHAN || u.email?.includes("444") || JSON.stringify(u.user_metadata).toLowerCase().includes("merci")) {
    console.log("auth match", u.id, u.email, u.user_metadata);
  }
}
