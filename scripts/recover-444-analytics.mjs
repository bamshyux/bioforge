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

// analytics for orphan profile id
const { data: views, count } = await sb
  .from("analytics_events")
  .select("*", { count: "exact" })
  .eq("profile_id", ORPHAN)
  .limit(5);
console.log("analytics for orphan", count, views);

// all orphan profile_ids in analytics not in profiles
const { data: analytics } = await sb.from("analytics_events").select("profile_id").limit(10000);
const { data: profiles } = await sb.from("profiles").select("id");
const profileIds = new Set((profiles ?? []).map((p) => p.id));
const orphanAnalytics = [...new Set((analytics ?? []).map((a) => a.profile_id))].filter((id) => !profileIds.has(id));
console.log("orphan analytics profile ids", orphanAnalytics);

for (const id of orphanAnalytics) {
  const { count: c } = await sb
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", id);
  console.log("orphan id view count", id, c);
}

// storage in other buckets
for (const bucket of ["backgrounds", "music", "profiles"]) {
  const { data, error } = await sb.storage.from(bucket).list(ORPHAN, { limit: 50 });
  console.log(`bucket ${bucket}`, error?.message ?? data?.map((f) => f.name));
}

// guestbook on orphan profile
const { data: guestbook } = await sb.from("guestbook_entries").select("*").eq("owner_id", ORPHAN).limit(20);
console.log("guestbook owner", guestbook);

// follows involving orphan
const { data: followers } = await sb.from("profile_follows").select("*").or(`follower_id.eq.${ORPHAN},following_id.eq.${ORPHAN}`).limit(20);
console.log("follows", followers);

// community listings by author
const { data: listings } = await sb.from("community_theme_listings").select("*").eq("author_id", ORPHAN);
console.log("listings", listings);
