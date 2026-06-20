import type { ComponentType } from "react";
import {
  IconAnalytics,
  IconBackground,
  IconBadges,
  IconCode,
  IconCustomize,
  IconEffects,
  IconEmbed,
  IconExplore,
  IconGuestbook,
  IconLayout,
  IconLinks,
  IconMusic,
  IconOverview,
  IconPresets,
  IconProfile,
  IconSettings,
  IconVideo,
  IconWidget,
} from "@/components/icons/dashboard-icons";
import type { DashboardSearchEntry } from "@/lib/dashboard/navigation";

type IconProps = { className?: string; size?: number };

export type SearchIconId =
  | "overview"
  | "profile"
  | "appearance"
  | "presets"
  | "content"
  | "explore"
  | "community"
  | "analytics"
  | "settings"
  | "music"
  | "embed"
  | "background"
  | "video"
  | "customize"
  | "code"
  | "layout"
  | "effects"
  | "badges"
  | "guestbook"
  | "widget"
  | "links";

const SEARCH_ICON_MAP: Record<SearchIconId, ComponentType<IconProps>> = {
  overview: IconOverview,
  profile: IconProfile,
  appearance: IconCustomize,
  presets: IconPresets,
  content: IconLinks,
  explore: IconExplore,
  community: IconBadges,
  analytics: IconAnalytics,
  settings: IconSettings,
  music: IconMusic,
  embed: IconEmbed,
  background: IconBackground,
  video: IconVideo,
  customize: IconCustomize,
  code: IconCode,
  layout: IconLayout,
  effects: IconEffects,
  badges: IconBadges,
  guestbook: IconGuestbook,
  widget: IconWidget,
  links: IconLinks,
};

const SECTION_ICON: Record<string, ComponentType<IconProps>> = {
  overview: IconOverview,
  profile: IconProfile,
  appearance: IconCustomize,
  presets: IconPresets,
  content: IconLinks,
  explore: IconExplore,
  community: IconBadges,
  analytics: IconAnalytics,
  settings: IconSettings,
};

const HREF_ICON: Array<{ prefix: string; icon: ComponentType<IconProps> }> = [
  { prefix: "/dashboard/music", icon: IconMusic },
  { prefix: "/dashboard/embeds", icon: IconEmbed },
  { prefix: "/dashboard/background", icon: IconBackground },
  { prefix: "/dashboard/custom-theme", icon: IconCode },
  { prefix: "/dashboard/customize", icon: IconCustomize },
  { prefix: "/dashboard/themes", icon: IconLayout },
  { prefix: "/dashboard/effects", icon: IconEffects },
  { prefix: "/dashboard/badges", icon: IconBadges },
  { prefix: "/dashboard/guestbook", icon: IconGuestbook },
  { prefix: "/dashboard/widgets", icon: IconWidget },
  { prefix: "/dashboard/links", icon: IconLinks },
  { prefix: "/dashboard/profile", icon: IconProfile },
  { prefix: "/dashboard/profile-presets", icon: IconPresets },
  { prefix: "/dashboard/analytics", icon: IconAnalytics },
  { prefix: "/dashboard/settings", icon: IconSettings },
];

export function resolveSearchIcon(
  entry: Pick<DashboardSearchEntry, "Icon" | "sectionId" | "href" | "iconId">,
): ComponentType<IconProps> {
  if (entry.Icon) return entry.Icon;
  if (entry.iconId && entry.iconId in SEARCH_ICON_MAP) {
    return SEARCH_ICON_MAP[entry.iconId as SearchIconId];
  }

  for (const { prefix, icon } of HREF_ICON) {
    if (entry.href === prefix || entry.href.startsWith(`${prefix}?`)) return icon;
  }

  return SECTION_ICON[entry.sectionId] ?? IconOverview;
}
