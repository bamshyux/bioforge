import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

// List auth users looking for 444 / Merci
const { data: authData, error: authErr } = await sb.auth.admin.listUsers({ perPage: 200 });
console.log("auth error", authErr);
const authMatches = (authData?.users ?? []).filter(u => {
  const meta = JSON.stringify(u.user_metadata ?? {}) + JSON.stringify(u.app_metadata ?? "");
  return u.email?.includes("444") || meta.toLowerCase().includes("merci") || meta.includes("444");
});
console.log("auth matches", authMatches.map(u => ({ id: u.id, email: u.email, created: u.created_at, meta: u.user_metadata })));

// All auth users count
console.log("total auth users", authData?.users?.length);

// Search analytics for profile views mentioning 444 path
const { data: analytics } = await sb.from("analytics_events").select("profile_id, event_type, metadata, created_at").limit(5000);
const profileIds = new Set(analytics?.map(a => a.profile_id));
console.log("analytics profile ids count", profileIds.size);

// Search activity events
const { data: activity } = await sb.from("activity_events").select("*").limit(500);
const activity444 = activity?.filter(a => JSON.stringify(a).toLowerCase().includes("444") || JSON.stringify(a).toLowerCase().includes("merci"));
console.log("activity matches", activity444);

// Search all profile_presets full dump
const { data: allPresets } = await sb.from("profile_presets").select("id,user_id,name,preset_data");
console.log("all presets count", allPresets?.length);
for (const p of allPresets ?? []) {
  const s = JSON.stringify(p.preset_data).toLowerCase();
  if (s.includes("merci") || s.includes('"444"') || p.name?.includes("444")) {
    console.log("PRESET MATCH", p.id, p.name, p.preset_data?.profile?.display_name);
  }
}

// Guestbook mentions
const { data: guestbook } = await sb.from("guestbook_entries").select("*").or("message.ilike.%merci%,message.ilike.%444%").limit(20);
console.log("guestbook", guestbook);

// Links with 444 in url
const { data: links } = await sb.from("links").select("profile_id,title,url").or("url.ilike.%444%,title.ilike.%merci%").limit(20);
console.log("links", links);

// Try storage list for deleted user folders - list profiles bucket
const { data: storageList } = await sb.storage.from("profiles").list("", { limit: 100 });
console.log("storage root folders", storageList?.map(f => f.name));

// Check if any storage folder corresponds to deleted uid 4 - search by listing all and matching username in path
for (const folder of storageList ?? []) {
  if (folder.name.length === 36) {
    const { data: prof } = await sb.from("profiles").select("username,display_name,uid").eq("id", folder.name).maybeSingle();
    if (!prof) {
      // orphaned storage - could be deleted user
      const { data: files } = await sb.storage.from("profiles").list(folder.name, { limit: 20 });
      console.log("ORPHAN STORAGE", folder.name, files?.map(f => f.name));
    }
  }
}
