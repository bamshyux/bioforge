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

function url(bucket, p) {
  return `${BASE}/storage/v1/object/public/${bucket}/${ORPHAN}/${p}`;
}

// Pull full snapshot-shaped data from any table still referencing orphan assets
const tables = ["profile_settings", "links", "profile_embeds", "featured_blocks", "profile_badges", "profile_widgets", "custom_themes"];
for (const t of tables) {
  const col = t === "profile_widgets" ? "profile_id" : "profile_id";
  const { data } = await sb.from(t).select("*").eq(col, ORPHAN);
  if (data?.length) console.log(t, JSON.stringify(data, null, 2));
}

// Admin audit for delete
const { data: audits } = await sb.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
for (const a of audits ?? []) {
  const s = JSON.stringify(a).toLowerCase();
  if (s.includes("444") || s.includes("merci") || s.includes(ORPHAN)) {
    console.log("audit", JSON.stringify(a, null, 2));
  }
}

// Guestbook mentioning profile
const { data: gb } = await sb.from("guestbook_entries").select("*").limit(500);
for (const g of gb ?? []) {
  if (g.owner_id === ORPHAN || JSON.stringify(g).toLowerCase().includes("merci")) {
    console.log("guestbook", g);
  }
}

// Users with similar asset patterns (video bg + music + enter gate image)
const { data: allSettings } = await sb.from("profile_settings").select("profile_id, layout, background_type, background_video_url, music_url, enter_gate_background_image_url, cursor_image_url, username_effect, accent_color, links_style").limit(500);
const { data: profiles } = await sb.from("profiles").select("id, username, uid, display_name");
const byId = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

const similar = (allSettings ?? []).filter((s) => {
  const hasVideo = !!s.background_video_url;
  const hasMusic = !!s.music_url;
  const hasEnterGateImg = !!s.enter_gate_background_image_url;
  const hasCustomCursor = !!s.cursor_image_url;
  return hasVideo && hasMusic && hasEnterGateImg && hasCustomCursor;
});
console.log("\nprofiles with video+music+enter gate image+cursor:");
for (const s of similar) {
  console.log(byId[s.profile_id]?.username, byId[s.profile_id]?.uid, s.layout, s.background_type, s.username_effect, s.links_style);
}

// Dump closest match full settings if any
if (similar[0]) {
  const id = similar[0].profile_id;
  const [{ data: settings }, { data: links }, { data: badges }, { data: widget }] = await Promise.all([
    sb.from("profile_settings").select("*").eq("profile_id", id).maybeSingle(),
    sb.from("links").select("*").eq("profile_id", id).order("sort_order"),
    sb.from("profile_badges").select("*").eq("profile_id", id),
    sb.from("profile_widgets").select("*").eq("profile_id", id),
  ]);
  console.log("\nclosest match profile", byId[id]);
  console.log("links", links);
  console.log("badges count", badges?.length);
  console.log("widget", widget);
  console.log("settings keys sample", {
    layout: settings?.layout,
    bio: byId[id]?.bio,
    display_name: byId[id]?.display_name,
    enter_gate_title: settings?.enter_gate_title,
    music_title: settings?.music_title,
    profile_status: settings?.profile_status,
    accent_color: settings?.accent_color,
    text_color: settings?.text_color,
    username_effect: settings?.username_effect,
    show_discord_status: settings?.show_discord_status,
  });
}

console.log("\nORPHAN ASSETS CONFIRMED:");
console.log({
  avatar: url("profiles", "avatar.jpg"),
  cursor: url("profiles", "cursor.png"),
  linkIcon: url("profiles", "link-icons/1781565433033.png"),
  backgroundVideo: url("backgrounds", "background.mp4"),
  enterGateImage: url("backgrounds", "enter-gate.png"),
  music: url("music", "track.mp3"),
});
