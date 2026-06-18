import fs from "fs";
import path from "path";
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

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Missing Supabase admin credentials");
  process.exit(1);
}

const sb = createClient(url, key);

const SETTINGS_EXCLUDE = new Set([
  "profile_id",
  "created_at",
  "updated_at",
  "discord_user_id",
  "discord_username",
  "discord_avatar",
  "discord_banner",
  "discord_premium_type",
  "custom_theme_id",
  "active_preset_id",
  "discord_card_config",
  "discord_card_style",
  "discord_show_lanyard_hint",
]);

function extractSettings(settings) {
  const result = {};
  for (const [k, v] of Object.entries(settings ?? {})) {
    if (!SETTINGS_EXCLUDE.has(k)) result[k] = v;
  }
  return result;
}

async function loadFullSnapshot(userId) {
  const [
    profileRes,
    settingsRes,
    linksRes,
    embedsRes,
    featuredRes,
    badgesRes,
    widgetRes,
    themesRes,
    presetsRes,
  ] = await Promise.all([
    sb.from("profiles").select("*").eq("id", userId).maybeSingle(),
    sb.from("profile_settings").select("*").eq("profile_id", userId).maybeSingle(),
    sb.from("links").select("*").eq("profile_id", userId).order("sort_order"),
    sb.from("profile_embeds").select("*").eq("profile_id", userId).order("sort_order"),
    sb.from("featured_blocks").select("*").eq("profile_id", userId).order("sort_order"),
    sb.from("profile_badges").select("*, badges:badge_id(id, slug, name)").eq("profile_id", userId).order("sort_order"),
    sb.from("profile_widgets").select("*").eq("profile_id", userId).eq("widget_type", "discord_status").maybeSingle(),
    sb.from("custom_themes").select("*").eq("profile_id", userId).order("sort_order"),
    sb.from("profile_presets").select("*").eq("user_id", userId).order("updated_at", { ascending: false }),
  ]);

  return {
    profile: profileRes.data,
    settings: settingsRes.data,
    links: linksRes.data ?? [],
    embeds: embedsRes.data ?? [],
    featured: featuredRes.data ?? [],
    badges: badgesRes.data ?? [],
    widget: widgetRes.data,
    themes: themesRes.data ?? [],
    presets: presetsRes.data ?? [],
    errors: [
      profileRes.error,
      settingsRes.error,
      linksRes.error,
      embedsRes.error,
      featuredRes.error,
      badgesRes.error,
      widgetRes.error,
      themesRes.error,
      presetsRes.error,
    ].filter(Boolean),
  };
}

function buildPresetData(snapshot) {
  const { profile, settings, links, embeds, featured, badges, widget, themes } = snapshot;
  if (!profile || !settings) return null;

  let customTheme = null;
  if (settings.layout === "custom" && settings.custom_theme_id) {
    const theme = themes.find((t) => t.id === settings.custom_theme_id);
    if (theme) customTheme = { name: theme.name, css: theme.css };
  }

  const featuredLinkId = settings.featured_link_id;
  const sortedLinks = [...links].sort((a, b) => a.sort_order - b.sort_order);
  const featuredIndex = featuredLinkId
    ? sortedLinks.findIndex((l) => l.id === featuredLinkId)
    : sortedLinks.findIndex((l) => l.is_featured);

  const discordWidget = widget
    ? { is_enabled: widget.is_enabled, config: widget.config }
    : settings.show_discord_status
      ? { is_enabled: true, config: settings.discord_card_config }
      : null;

  return {
    version: 1,
    profile: {
      display_name: profile.display_name ?? "",
      bio: profile.bio ?? "",
      avatar_url: profile.avatar_url ?? null,
      banner_url: profile.banner_url ?? null,
    },
    settings: extractSettings(settings),
    links: sortedLinks.map((link, index) => ({
      title: link.title,
      url: link.url,
      icon: link.icon,
      color: link.color,
      background_color: link.background_color,
      animation: link.animation,
      is_featured: link.is_featured,
      sort_order: index,
    })),
    embeds: embeds.map((embed) => ({
      embed_type: embed.embed_type,
      url: embed.url,
      title: embed.title,
      embed_id: embed.embed_id,
      is_visible: embed.is_visible,
      sort_order: embed.sort_order,
      config: embed.config,
    })),
    featuredBlocks: featured.map((block) => ({
      block_type: block.block_type,
      title: block.title,
      description: block.description,
      thumbnail_url: block.thumbnail_url,
      url: block.url,
      accent_color: block.accent_color,
      is_enabled: block.is_enabled,
      sort_order: block.sort_order,
    })),
    profileBadges: badges.map((badge) => ({
      badge_id: badge.badge_id,
      is_visible: badge.is_visible,
      is_featured: badge.is_featured,
      sort_order: badge.sort_order,
    })),
    discordWidget,
    customTheme,
    featuredLinkIndex: featuredIndex >= 0 ? featuredIndex : null,
  };
}

async function findTargetProfile() {
  const byUsername = await sb.from("profiles").select("*").eq("username", "444").maybeSingle();
  if (byUsername.data) return { match: "username", profile: byUsername.data };

  const byUid = await sb.from("profiles").select("*").eq("uid", 4).maybeSingle();
  if (byUid.data) return { match: "uid", profile: byUid.data };

  const byName = await sb
    .from("profiles")
    .select("*")
    .ilike("display_name", "Merci")
    .limit(5);
  if (byName.data?.length) return { match: "display_name", profile: byName.data[0], candidates: byName.data };

  return null;
}

async function findBam() {
  const { data } = await sb.from("profiles").select("id, username, display_name").eq("username", "bam").maybeSingle();
  return data;
}

const target = await findTargetProfile();
const bam = await findBam();

console.log("=== Target profile search ===");
if (!target) {
  console.log("No profile found for username=444, uid=4, or display_name=Merci");
} else {
  console.log(JSON.stringify({ match: target.match, profile: target.profile, candidates: target.candidates ?? null }, null, 2));
}

console.log("\n=== Bam ===");
console.log(JSON.stringify(bam, null, 2));

if (target?.profile) {
  const snapshot = await loadFullSnapshot(target.profile.id);
  console.log("\n=== Snapshot errors ===");
  console.log(snapshot.errors);

  const presetData = buildPresetData(snapshot);
  const outDir = path.join("scripts", "recovered-presets");
  fs.mkdirSync(outDir, { recursive: true });

  const bundle = {
    recovered_from: {
      username: target.profile.username,
      uid: target.profile.uid,
      display_name: target.profile.display_name,
      user_id: target.profile.id,
    },
    intended_for: {
      username: "bam",
      user_id: bam?.id ?? null,
      preset_name: "Merci (444)",
    },
    preset_data: presetData,
    raw_presets_on_account: snapshot.presets,
    community_listings: [],
  };

  const { data: listings } = await sb
    .from("community_theme_listings")
    .select("*")
    .eq("author_id", target.profile.id);
  bundle.community_listings = listings ?? [];

  const outPath = path.join(outDir, "merci-444-for-bam.json");
  fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2));
  console.log(`\nWrote ${outPath}`);
}
