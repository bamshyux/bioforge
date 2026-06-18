import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

const { data: links } = await sb.from("links").select("profile_id,title,url,icon,color,background_color,animation,is_featured,sort_order");
for (const l of links ?? []) {
  if (JSON.stringify(l).includes("1781565433033") || JSON.stringify(l).includes("d97fe032")) {
    console.log("link hit", l);
  }
}

// profiles with video backgrounds - dump summary
const { data: settings } = await sb.from("profile_settings").select("*");
const { data: profiles } = await sb.from("profiles").select("id,username,uid,display_name,bio");
const byId = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

const videoUsers = (settings ?? []).filter((s) => s.background_type === "video" && s.background_video_url);
for (const s of videoUsers) {
  const p = byId[s.profile_id];
  console.log("\n---", p?.username, "uid", p?.uid, "---");
  console.log({
    display_name: p?.display_name,
    bio: p?.bio?.slice(0, 100),
    layout: s.layout,
    accent: s.accent_color,
    text: s.text_color,
    username_effect: s.username_effect,
    links_style: s.links_style,
    cursor_effect: s.cursor_effect,
    music_title: s.music_title,
    music_autoplay: s.music_autoplay,
    enter_gate_title: s.enter_gate_title,
    enter_gate_enabled: s.enter_gate_enabled,
    show_discord_status: s.show_discord_status,
    profile_status: s.profile_status,
    typing_bio: s.typing_bio,
    guestbook_enabled: s.guestbook_enabled,
  });
  const userLinks = (links ?? []).filter((l) => l.profile_id === s.profile_id);
  if (userLinks.length) console.log("links", userLinks);
}
